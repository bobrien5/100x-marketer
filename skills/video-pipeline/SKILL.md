---
name: video-pipeline
description: >-
  End-to-end short-form video pipeline for 100x Marketer. Takes raw recorded
  clips (typically iPhone 4K HEVC vertical) plus a content brief and produces a
  rendered MP4 in our Sabrina-spine format-competitor style, ready to post.
  Orchestrates ffmpeg, local OpenAI Whisper, and HyperFrames (HTML-to-MP4
  framework). Use when Brendan says "edit and render this", "build the video",
  "run the pipeline", or hands you raw clips plus a brief.
---

# Video Pipeline, 100x Marketer

End-to-end pipeline: raw clip + brief → rendered MP4. This skill is the canonical playbook based on what actually works after a full shake-out session on 2026-04-27. Follow each phase. Skipping phases breaks the render.

## Required setup (one-time)

These must exist on the machine. If any are missing, install them first.

- **Node 22+** (Hyperframes requires it). Use nvm: `~/.nvm/versions/node/v22.22.2/bin`. In every Bash invocation that calls `npx hyperframes`, prefix with: `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"`.
- **ffmpeg** (with libx264 + h264_videotoolbox + aac on macOS). `which ffmpeg` should resolve.
- **Python 3 + openai-whisper**: `pip3 install --user openai-whisper`. The Hyperframes built-in `transcribe` command tries to download the Whisper model from huggingface.co at run time and **fails when the network blocks it**. Always use the local Python whisper instead.

## Before You Start

Read these files in order. Stop and explain if any are missing.

1. The brief. Default: most recent `content/strategy/content-strategy-{YYYY-MM-DD}.md`.
2. `skills/video-editor/references/style-references.md`, the format-competitor style notes (Sabrina-spine).
3. `brand/BRAND_VOICE.md`, voice rules.
4. `brand/COLORS.md`, the brand color tokens. Captions use `--brand-orange` (`#ff6b00`).
5. `curriculum/TEACHING_METHOD.md`, the teaching frame.

## Inputs

- **Brief path** (default: most recent `content/strategy/*.md`)
- **Raw clips folder** (default: `content/raw/{YYYY-MM-DD}/`)
- **Which brief in the report** (ask if >1 brief in the file)

## Phase 1, Shot Inventory

For each raw clip:
- `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,codec_name -show_entries stream_side_data=rotation -show_entries format=duration -of compact=p=1 <clip>`
- Note: iPhone clips are usually `3840x2160` HEVC with `rotation=-90` metadata = 9:16 vertical. ffmpeg/hyperframes auto-respects rotation; output will be portrait.
- Note: total duration. Brendan typically records 60-130s, target output is 25-30s.

## Phase 2, Pre-transcode to 1080×1920 H.264

**This is mandatory.** Do NOT use `npx hyperframes init --video` to import 4K HEVC; it has been observed to spawn parallel ffmpeg processes that race on the same output file, producing corrupt mp4s. Instead, transcode to a clean 1080×1920 H.264 manually:

```bash
ffmpeg -hide_banner -y -i <source.mov> \
  -map 0:v:0 -map 0:a:0 \
  -vf "scale=1080:-2" \
  -c:v libx264 -preset veryfast -crf 22 \
  -c:a aac -b:a 128k \
  <project>/clip.mp4
```

(`scale=1080:-2` keeps aspect ratio, divisor-of-2 height. For 9:16 input, output = 1080×1920.)

`libx264 -preset veryfast` is ~2x faster than `h264_videotoolbox` for our typical clip lengths and produces equivalent quality at CRF 22. Use it.

## Phase 3, Project Scaffold

Create the project directory:

```
content/edits/{brief-slug}-{YYYY-MM-DD}/my-video/
├── clip.mp4              # the 1080p source from Phase 2
├── trimmed.mp4           # zero-pause cut, produced in Phase 5
├── transcript.json       # word-level whisper output, Phase 4
├── trim-plan.json        # the cut plan, Phase 5
├── captions.json         # remapped to trimmed timeline, Phase 6
├── _captions.html        # generated HTML caption divs, Phase 6
├── index.html            # main composition, Phase 7
└── render.mp4            # final output, Phase 8
```

Do NOT call `npx hyperframes init`. We hand-write the project files because the init flow is unreliable for our use case.

## Phase 4, Transcribe with Local Whisper

```bash
python3 -c "
import whisper, json
m = whisper.load_model('tiny.en')
r = m.transcribe('clip.mp4', word_timestamps=True, language='en', verbose=False)
json.dump(r, open('transcript.json', 'w'), indent=2)
print(r['text'].strip())
"
```

`tiny.en` is fast and accurate enough for English short-form. The first run downloads the ~75MB model to `~/.cache/whisper/`; subsequent runs are offline. `word_timestamps=True` is required.

After transcription:
- Read the printed text. Verify it matches Brendan's actual recording.
- Note any whisper miss-transcriptions (it has called "vibe" → "Thibe" and "marketer" → "marker"). Fix these in the caption mapping step (Phase 6).

## Phase 5, Build Zero-Pause Trim Plan

Brendan wants **zero pauses**. The reliable algorithm:

1. Read all whisper words (flatten across segments).
2. For each word, **clamp duration** to `[0.40s, 0.80s]` to handle whisper's habit of stretching last-word-in-phrase to fill silence (e.g., "week." gets assigned 3.46s).
3. Walk through words. Whenever the gap from `last_word.end` to `next_word.start` exceeds **0.18s**, close the current run and start a new one. The 0.18s threshold cuts long pauses while keeping natural articulation.
4. Drop any run shorter than 0.15s.
5. Concatenate all runs back-to-back in the output timeline (zero gap between runs).

```python
import json
d = json.load(open('transcript.json'))
words = []
for seg in d['segments']:
    for w in seg.get('words', []):
        start = w['start']
        end = max(w['end'], start + 0.40)
        end = min(end, start + 0.80)
        words.append({'start': start, 'end': end, 'text': w['word'].strip()})

GAP_T = 0.18
runs = []
run_start = words[0]['start']
last_end = words[0]['end']
texts = [words[0]['text']]
for w in words[1:]:
    if w['start'] - last_end > GAP_T:
        runs.append((run_start, last_end, ' '.join(texts)))
        run_start = w['start']
        texts = []
    texts.append(w['text'])
    last_end = w['end']
runs.append((run_start, last_end, ' '.join(texts)))
runs = [r for r in runs if r[1] - r[0] >= 0.15]

plan = []
out_t = 0
for s, e, t in runs:
    dur = e - s
    plan.append({'src_in': s, 'src_out': e, 'out_start': out_t, 'out_end': out_t + dur, 'text': t})
    out_t += dur
json.dump({'runs': plan}, open('trim-plan.json', 'w'), indent=2)
```

**Build trimmed.mp4** with ffmpeg's `concat` filter. One trim+atrim per run, then concat:

```bash
FILTER="[0:v]trim={src_in}:{src_out},setpts=PTS-STARTPTS[v1];[0:a]atrim={src_in}:{src_out},asetpts=PTS-STARTPTS[a1];... [v1][a1][v2][a2]...concat=n={N}:v=1:a=1[outv][outa]"

ffmpeg -hide_banner -y -i clip.mp4 -filter_complex "$FILTER" \
  -map "[outv]" -map "[outa]" \
  -c:v libx264 -preset veryfast -crf 22 -c:a aac -b:a 128k trimmed.mp4
```

Verify duration matches `out_t` (within 0.1s).

**Target:** 25-32s output. If trimmed is significantly longer, raise the GAP_T threshold or tighten word duration cap.

## Phase 6, Generate Captions

Word-level captions in the output timeline. Map each whisper word's source-time to the output-time using the run offsets:

```python
import json
d = json.load(open('transcript.json'))
plan = json.load(open('trim-plan.json'))
all_words = [w for seg in d['segments'] for w in seg.get('words', [])]

captions = []
for w in all_words:
    for r in plan['runs']:
        if r['src_in'] <= w['start'] < r['src_out']:
            offset = r['out_start'] - r['src_in']
            out_start = max(r['out_start'], w['start'] + offset)
            out_end = min(w['end'] + offset, r['out_end'])
            text = w['word'].strip()
            # Fix known whisper misses for our brand
            if text.lower().rstrip('.,') == 'thibe': text = 'vibe'
            if text.lower().rstrip('.,') == 'marker': text = 'marketer.'
            if out_end > out_start:
                captions.append({'start': out_start, 'end': out_end, 'text': text})
            break

# Merge close-spaced captions (<0.18s apart) into compound captions to avoid lint overlaps
merged = []
i = 0
while i < len(captions):
    c = captions[i]
    j = i + 1
    text, end = c['text'], c['end']
    while j < len(captions) and (captions[j]['start'] - c['start']) < 0.18:
        text += ' ' + captions[j]['text']
        end = captions[j]['end']
        j += 1
    merged.append({'start': c['start'], 'end': end, 'text': text})
    i = j

json.dump(merged, open('captions.json', 'w'), indent=2)

# Emit HTML with 0.02s safety gap between adjacent captions to satisfy hyperframes lint
with open('_captions.html', 'w') as f:
    for i, c in enumerate(merged):
        next_start = merged[i+1]['start'] if i+1 < len(merged) else c['end'] + 1
        safe_end = min(c['end'], next_start - 0.02)
        dur = max(0.04, safe_end - c['start'])
        f.write(f'    <div class="clip caption" data-start="{c["start"]:.3f}" data-duration="{dur:.3f}" data-track-index="6" style="z-index: 6">{c["text"]}</div>\n')
```

## Phase 7, Build index.html

Hyperframes-compliant composition. Hard requirements (every one is enforced by lint):

- Root wrapper element with `id="root" data-composition-id="<slug>" data-width="1080" data-height="1920" data-start="0" data-duration="<total>"`
- GSAP loaded via CDN: `<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>` in `<head>`
- Every timed element has `class="clip" data-start data-duration data-track-index`
- `<video>` has `muted`. Audio is a separate `<audio>` element with its own `id`. Both can point to the same `trimmed.mp4`.
- No two clips on the same `data-track-index` may overlap. Captions on track 6 use the 0.02s safety gap from Phase 6.
- Timeline registered: `window.__timelines["<slug>"] = gsap.timeline({ paused: true });`
- Sub-compositions referenced via `data-composition-src` need `data-composition-id` on the host element.

### Visual layout (Sabrina-spine, 100x defaults)

- **A-roll**: full frame (`data-track-index=0`, behind everything else, `z-index: 1`).
- **Audio**: separate `<audio>` with `id="aroll-audio"` (`data-track-index=2`).
- **B-roll top strips** (`data-track-index=7`, `z-index=7`): top 760px of frame, semi-opaque black with orange dashed bottom border. Each placeholder has a label and shot description. When real B-roll is recorded, swap the placeholder div for a `<video class="clip" src="assets/broll/<file>.mp4">` with the same `data-start`/`data-duration`.
- **Captions** (`data-track-index=6`, `z-index=6`): word-by-word, mid-low position (`top: 1500px`), font-size **80px**, weight 900, brand-orange (`#ff6b00`), 6px black `-webkit-text-stroke`, `text-transform: uppercase`, `paint-order: stroke fill`.
- **Headlines (top-third green)**: REMOVED from the default. Sabrina doesn't use them. Add only if the brief explicitly demands.
- **CTA**: NONE in the rendered video by default. Brendan adds CTAs natively in IG/TikTok caption + first comment after posting. The full-screen CTA card and Sabrina-style chat bubble both got cut. If a brief explicitly demands an in-video CTA, use the small native-style chat bubble (top of frame, NOT full screen).

### B-roll placeholder pattern

```html
<div class="clip broll-strip" data-start="<t>" data-duration="<d>" data-track-index="7" style="z-index: 7">
  <div class="label">B-roll needed</div>
  <div>{shot description: what to record, ~Xs}</div>
</div>
```

CSS:
```css
.broll-strip {
  position: absolute; top: 0; left: 0;
  width: 1080px; height: 760px;
  background: rgba(10, 10, 10, 0.95);
  border-bottom: 6px dashed var(--brand-orange);
  color: var(--brand-orange);
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  text-align: center; padding: 40px; box-sizing: border-box;
  font-size: 44px; font-weight: 800; line-height: 1.2;
}
```

Also emit a `B-ROLL_NEEDED.md` in the project root listing each shot with timestamp, target duration, and a one-paragraph description of what Brendan should record.

## Phase 8, Lint + Render

```bash
export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"
cd <project>
npx --yes hyperframes lint
```

**Must pass with 0 errors.** Common errors and fixes:

| Error | Fix |
|---|---|
| `root_missing_composition_id` | Add `data-composition-id="<slug>"` to the wrapper. |
| `root_missing_dimensions` | Add `data-width="1080" data-height="1920"`. |
| `root_composition_missing_data_start` | Add `data-start="0"` to root. |
| `timeline_id_mismatch` | The `window.__timelines["X"]` key must equal the root `data-composition-id`. |
| `media_missing_id` | Every `<video>` and `<audio>` needs an `id`. |
| `missing_gsap_script` | Add the CDN `<script>` tag before the timeline registration script. |
| `overlapping_clips_same_track` | Two clips on the same `data-track-index` overlap. Either move one to a different track or shorten its duration. The 0.02s safety gap in caption emission usually fixes this. |
| `host_missing_composition_id` | Any element with `data-composition-src` also needs `data-composition-id`. |

Then render:

```bash
npx --yes hyperframes render -o render.mp4
```

**Render takes 1-3 minutes** for a 30-40s composition (frame-by-frame headless Chrome capture + ffmpeg encode). Run with `run_in_background: true` and monitor for the file to land + stabilize.

### Monitor pattern (handles process-vs-file race)

The hyperframes process can exit before the mp4 finishes flushing. Monitor for both:

```bash
RENDER="render.mp4"
LAST_SIZE=0
STABLE=0
while true; do
  if [ -f "$RENDER" ]; then
    SZ=$(stat -f%z "$RENDER" 2>/dev/null)
    if [ "$SZ" = "$LAST_SIZE" ] && [ "$SZ" -gt 1000000 ]; then
      STABLE=$((STABLE+1))
      [ $STABLE -ge 2 ] && break
    else
      STABLE=0
      LAST_SIZE=$SZ
    fi
  fi
  pgrep -f "hyperframes render" >/dev/null 2>&1 || ([ -f "$RENDER" ] && break)
  sleep 3
done
```

Or use the `Monitor` tool with the same logic.

After render: `ffprobe` the duration; should match the trim total + any CTA. Then `open <render>` to show Brendan.

## Output

Five-line summary:

- Brief used: `<path>`
- Trim: `<source>s -> <output>s` (`<n>` runs)
- Captions: `<count>` (lower-mid, brand-orange)
- Render: `<absolute path>`, `<duration>s`, `<size>`
- B-roll shot list: `<path to B-ROLL_NEEDED.md>`

## Important Notes

- **Pre-transcode is mandatory** (Phase 2). Don't let hyperframes init touch the source.
- **Local whisper is mandatory** (Phase 4). Don't trust hyperframes' transcribe in environments where huggingface.co is blocked.
- **Zero pauses by default** (Phase 5). Brendan's recordings have long internal pauses from re-takes; the 0.18s gap threshold cuts them. Adjust if a future recording has unusually fast pacing.
- **If a clip has no useful tail past the last whisper word, end the trim at last word + 0.20s.** Do not extend to source end "to capture the closing thought" unless you can verify content exists there. Whisper's last word_end is generally accurate.
- **Don't render before lint passes.** Wasted compute.
- **Don't add a full-screen CTA card** at the end. Brendan posts CTAs natively in caption/first-comment.
- **B-roll placeholders are top strips, not center-frame boxes.** Sabrina layout: B-roll above, A-roll below.
- **Iterate on intermediate filenames.** When iterating with the user, save renders as `render-v1.mp4`, `render-v2.mp4` etc. so the user can compare. Final goes to `render.mp4`.
