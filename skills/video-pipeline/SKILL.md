---
name: video-pipeline
description: >-
  End-to-end short-form video pipeline for 100x Marketer. Takes a content brief
  (from content-strategist) plus raw recorded clips and produces a rendered MP4
  in our format-competitor style, ready to post. Orchestrates the existing
  HyperFrames skills (hyperframes, hyperframes-cli, gsap) for the actual
  composition and rendering. Use when Brendan says "edit and render this",
  "build the video", "run the pipeline", or hands you raw clips plus a brief.
---

# Video Pipeline, 100x Marketer

You orchestrate the full short-form video pipeline. Brief in, MP4 out. You do not write HyperFrames composition code yourself; you delegate that work to the `hyperframes`, `hyperframes-cli`, and `gsap` skills which know the framework's rules.

This skill is the rendering pipeline. The planning-only sibling skill `video-editor` produces an EDL markdown without rendering; use that when Brendan only wants the plan. Use this one when he wants pixels.

## Before You Start

Read these files in order. Stop and explain if any are missing.

1. The brief. Default location: `content/strategy/content-strategy-{YYYY-MM-DD}.md`. If Brendan didn't specify, default to the most recent file in that folder.
2. `skills/video-editor/references/style-references.md`, the format-competitor style notes.
3. `brand/BRAND_VOICE.md`, voice rules. On-screen text and any spoken script edits must comply.
4. `brand/COLORS.md`, the brand color palette. Every overlay, caption, and CTA card uses these colors.
5. `curriculum/TEACHING_METHOD.md`, the teaching frame.
6. `skills/video-pipeline/references/cta.html`, the reusable outro card every video shares.

## Inputs You Need

Confirm at the start. If anything is missing, ask once and stop.

- **Brief path** (default: most recent `content/strategy/*.md`)
- **Raw clips folder** (default: `content/raw/{YYYY-MM-DD}/`). If empty, stop and tell Brendan where to drop the clips.
- **Which brief in the report** if the report has multiple briefs (default: ask "which brief number, 1, 2, or 3?")

## Phase 1, Shot Inventory

For each raw clip in the folder:

- Path
- Duration via `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 <clip>`
- Type: A-roll (Brendan on camera) or B-roll (screen recording, prompt screenshot, etc.)
- Content summary in one sentence

Write the inventory as a markdown table. Stop and stop and ask if a clip is unusable (zero duration, corrupt, etc.) before continuing.

## Phase 2, Style Match

Open `references/style-references.md` (lives in the sibling `video-editor` skill at `skills/video-editor/references/style-references.md`). Pick the spine style for this video and explain why in 2-3 sentences. The decision should match the brief's teaching beat:

- Receipt brief → kylewhitrow style (screen-recording-heavy)
- Playbook / prompt brief → mavgpt style (full-screen prompts, pause-and-copy)
- Brief / Tool Belt / Guardrails brief → hybrid skeleton (default)

State explicitly: spine style, 3-5 specific patterns from the reference doc you'll apply, and the planned cut cadence.

## Phase 3, Build the EDL

Produce a beat-by-beat timeline from the brief's "On-screen text beats" + "Spoken script" + "Concept" fields. 8-15 beats per video.

Each beat needs:

- Time range (T+seconds)
- Source: which raw clip (with in/out), or "graphic card" (full-bleed text), or "B-roll: <description>"
- Visual action
- On-screen text (exact words, position, brand color from `brand/COLORS.md`)
- Spoken VO (exact words, pulled from the brief)
- Pacing note

Save the EDL to `content/edits/{brief-slug}-{YYYY-MM-DD}/EDL.md`. The EDL is an intermediate artifact; the rendered MP4 is the final output.

## Phase 4, Scaffold HyperFrames Project

Delegate to the `hyperframes-cli` skill for project scaffolding. The pipeline lives at:

```
content/edits/{brief-slug}-{YYYY-MM-DD}/
├── meta.json
├── index.html
├── compositions/
├── assets/
│   ├── clips/
│   ├── audio/
│   └── transcript.json
├── EDL.md
└── render.mp4   (produced in Phase 6)
```

Steps:

1. `cd content/edits/{brief-slug}-{YYYY-MM-DD}/`
2. `npx hyperframes init` (delegate to `hyperframes-cli` skill for any prompts)
3. Copy raw A-roll and B-roll clips into `assets/clips/` (use `cp`, not symlinks; HyperFrames needs real paths)
4. Extract VO audio from the primary A-roll clip:
   ```bash
   ffmpeg -i assets/clips/<a-roll>.mov -vn -acodec libmp3lame assets/audio/vo.mp3
   ```
5. Generate the word-level transcript:
   ```bash
   npx hyperframes transcribe assets/audio/vo.mp3 -o assets/transcript.json
   ```
   (delegate to `hyperframes-cli` skill if any flags are unclear)

## Phase 5, Compose

Delegate composition writing to the `hyperframes` skill. Hand it:

- The EDL from Phase 3
- The style decisions from Phase 2
- The brand color tokens from `brand/COLORS.md` (always pass these as CSS variables in the composition)
- The transcript path for word-by-word captions
- The shared CTA card path: `skills/video-pipeline/references/cta.html` (copy or include as `compositions/cta.html`)

The `hyperframes` skill knows the framework's rules:

- Every timed element needs `class="clip"` with `data-start`, `data-duration`, `data-track-index`
- Videos use `muted`; audio is a separate `<audio>` element
- Timelines must be paused and registered on `window.__timelines`
- Sub-compositions referenced via `data-composition-src`
- No `Date.now()`, no `Math.random()`, no network fetches

### Hard rules every composition must satisfy

These are non-negotiable. The `hyperframes` skill's output must respect all of them:

1. **Cold open.** No fade-in on beat 1. First frame is the hook.
2. **Hook in 3 seconds.** First beat shows the result, the artifact, or the on-screen text claim. NOT a face.
3. **Visual change every 8 seconds maximum.** Per `TEACHING_METHOD.md`. Default cadence: 1.5-3s on screen recording, 3-6s on A-roll talking head.
4. **Pause-and-copy holds.** Any prompt or config block on screen holds for at least 2.5 seconds, with a "Pause. Copy this." overlay (use `--brand-green` for the cue).
5. **Captions throughout.** Word-by-word from `transcript.json`. White (`--brand-white`) with 4-6px black stroke. Bottom-center. Never overlapping headline overlays (move to top-third on those beats if needed).
6. **CTA card outro.** 4-6 second hold using `compositions/cta.html`. Same card every video.
7. **Brand colors only.** All text and overlays use tokens from `brand/COLORS.md`. No hard-coded hex except the ones in COLORS.md.
8. **No music.** v1 ships music-less. Audio track is the VO only.

## Phase 6, Lint + Auto-Render

```bash
npx hyperframes lint
```

Fix all errors (delegate to `hyperframes` skill if errors are framework-specific). Warnings are informational.

If lint passes, auto-render. Brendan picked auto-render in v1, so do NOT stop at preview unless he explicitly says "preview only" in the run prompt.

```bash
npx hyperframes render -o render.mp4
```

After render completes:

1. Verify `render.mp4` exists and is non-zero bytes
2. Get duration via `ffprobe` to sanity-check it matches target (30-50s)
3. Print the absolute path
4. Print the EDL path so Brendan can review beat-by-beat alongside the video

## Output

Final summary should be 5 lines:

- Brief used: `<path>`
- Style spine: `<kylewhitrow / mavgpt / hybrid>`
- EDL: `<path>`
- Render: `<absolute path to render.mp4>`, duration `<X>s`
- One-line note on anything Brendan should review (e.g., "Beat 4 cut may feel rushed; preview before posting")

## Important Notes

- Do NOT reimplement HyperFrames composition logic. Delegate every HTML-writing step to the `hyperframes` skill. Delegate every CLI step to `hyperframes-cli`. The job of THIS skill is orchestration: brief → EDL → scaffold → compose → render.
- If Brendan's raw clips don't match the EDL (e.g., he intended 3 screen recordings but only delivered 2), stop and ask. Do not silently substitute b-roll.
- The CTA card is shared across every video. If Brendan wants to update it, he edits `skills/video-pipeline/references/cta.html` once and every future render picks it up.
- The EDL stays as an intermediate artifact even after render. It's the spec for what was built and the place to debug if a render looks wrong.
