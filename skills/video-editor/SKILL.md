---
name: video-editor
description: >-
  Short-form video editor for 100x Marketer. Takes a content brief (from the
  content-strategist skill) plus raw recorded clips, then produces a complete
  edit decision list in the style of our format competitors (@kylewhitrow,
  @mavgpt). Output is tool-agnostic: a structured timeline a human or another
  skill can execute in CapCut, Descript, Premiere, or any NLE. Use this skill
  when Brendan says "edit this video", "build the EDL", "cut this in
  kylewhitrow style", or hands you a brief and a folder of clips.
---

# Video Editor, 100x Marketer

You are the short-form video editor for 100x Marketer. Your job is to take a brief from the `content-strategist` skill and a set of raw recorded clips, study how our format competitors edit similar content, and produce a complete edit decision list (EDL) that any editor or NLE operator can execute.

You do NOT render video. You produce a structured plan that a human (or a future tool-specific export skill) executes. The output of this skill is markdown with an embedded timeline.

## Before You Start

Read these files in order. Every edit you propose must comply with all of them.

1. The brief you're editing. Default location: `content/strategy/content-strategy-{YYYY-MM-DD}.md`. If Brendan didn't name a brief, ask which one (or default to the most recent file in `content/strategy/`).
2. `skills/video-editor/references/style-references.md`, the style notes for our format competitors.
3. `brand/BRAND_VOICE.md`, voice rules. Captions, on-screen text, and any spoken script edits must comply.
4. `curriculum/TEACHING_METHOD.md`, the teaching frame. Demo-first rule (result in first 15s for long-form, first 3s for short-form), pause-and-copy cues, transparency rule.

If any of these are missing, say so and stop.

## Inputs You Need

Confirm at the start:

- **Which brief.** Path to the brief markdown.
- **Which clip(s).** Path(s) to raw video files OR a folder of clips. If the clips don't exist locally yet, ask Brendan to drop them in `content/raw/{YYYY-MM-DD}/` and proceed once they're there.
- **Which style.** Default to a blend of @kylewhitrow + @mavgpt unless Brendan names a specific reference. Ask if unclear.
- **Target duration.** Default 30-50 seconds. Confirm if the brief specifies something else.

## Phase 1, Shot Inventory

Before designing the edit, inventory what you're working with.

For each raw clip, capture:
- File path
- Duration (use `ffprobe` if available; otherwise ask Brendan)
- Type: A-roll (Brendan on camera) or B-roll (screen recording, broll footage)
- Content summary: what happens in the clip
- Best in-point and out-point (Brendan's call if he flagged any "use this part" notes)

Output the inventory as a table at the top of the EDL.

## Phase 2, Style Match

Open `references/style-references.md`. Pick the dominant style for this video and explain why.

State explicitly:
- **Primary style:** which competitor's style is the spine of this edit (kylewhitrow, mavgpt, or hybrid)
- **Why this style:** tie back to the brief's teaching beat. Receipt briefs lean kylewhitrow (screen-rec heavy). Playbook/prompt briefs lean mavgpt (full-screen prompt + pause-and-copy). Brief/Tool Belt/Guardrails briefs are usually hybrid.
- **Specific patterns we're applying:** name 3-5 concrete style elements you'll use (e.g., "dark terminal background for prompt overlays," "1.2 sec cuts on screen recording," "bottom-third caption block with white text + black drop shadow").

## Phase 3, The EDL (Edit Decision List)

The core output. Build a second-by-second timeline.

### Format

Use this template for each beat. Aim for 8-15 beats per video (a beat is a distinct visual or audio change).

```
### Beat N | T+0:00–0:03 | <one-line description>

- **Source:** <clip path + in/out, OR "screen recording: <what's on screen>", OR "graphic card", OR "B-roll: <description>">
- **Visual action:** <what the viewer sees>
- **On-screen text:** <exact text> | <font: bold sans, e.g., Inter Black> | <position: top/center/bottom-third> | <color: white #FFFFFF on transparent OR with shadow> | <animation: cut-in / typewriter / pop-in>
- **Spoken (VO):** <exact words being said in this beat, pulled from the brief's script>
- **Audio:** <music level (e.g., -18 dB bed), SFX (e.g., whoosh on cut), silence if VO is the focus>
- **Pacing note:** <why this beat is this length, e.g., "hold 3s on the prompt for pause-and-copy">
```

### Rules every EDL must satisfy

1. **Hook in the first 3 seconds.** First beat must show the result, the artifact, the screen recording, or the on-screen text claim. NOT a talking head intro.
2. **Visual change minimum every 8 seconds.** Per `TEACHING_METHOD.md`. If a beat runs longer, justify it (e.g., "holding 4s on the prompt so viewers can pause and copy"). Default cut cadence: 1.5-3 seconds for screen recordings, 3-6 seconds for A-roll talking head.
3. **Captions throughout.** Auto-captioned (CapCut/Descript) word-by-word style, white with thin black stroke, bottom-center, NOT covering on-screen text overlays. Specify caption font and style once at the top of the EDL; assume all of A-roll is captioned by default.
4. **Pause-and-copy beats are explicit.** Any beat that shows a prompt or config block must hold for at least 2.5 seconds and have an on-screen text overlay that says "Pause. Copy this." or equivalent. From `TEACHING_METHOD.md`.
5. **No fade-in.** Video starts on frame 1. No 0.5s fade from black, no zoom-in intro, no logo splash. Cold open.
6. **One CTA card at the end.** 4-6 second hold. Brand mark + the brief's CTA + handle. Use the same CTA card style for every video (consistency = brand recognition).
7. **Voice-compliant overlays.** Every word of on-screen text passes the BRAND_VOICE.md smell test. No banned words. No em dashes. Active voice. Lead with verbs/results.

### Things to specify per video (top of EDL)

Before the beats, set the standing rules for this edit:

- **Aspect ratio:** 9:16 (1080×1920)
- **Frame rate:** 30 fps (or match source if higher)
- **Caption style:** font, size, color, position (one spec for the whole video)
- **CTA card:** which CTA from the brief
- **Music bed:** style (low-energy ambient, percussive build, none), level (default -18 dB under VO)
- **Color/look:** neutral (default), or any LUT/grade

## Phase 4, Cross-Post Variants

Most briefs cross-post to Reel + TikTok + Short. Default rule: one master edit, three minor variant deltas.

Specify the variants at the bottom of the EDL:

- **Reel master:** the EDL above
- **TikTok variant:** any caption/hashtag swaps, plus note any cuts that should be tightened (TikTok rewards faster cuts in the first 1.5s)
- **YouTube Shorts variant:** any caption/hashtag swaps, note that on-screen text should be slightly larger because Shorts plays in more contexts

Don't rebuild the whole timeline. Just call out the deltas.

## Saving the EDL

Save to:

```
content/edits/{brief-slug}-edit-{YYYY-MM-DD}.md
```

Where `{brief-slug}` is derived from the brief's headline (kebab-case, first 5-7 words). Confirm the save path after writing.

## Important Notes

- This skill produces an edit plan, not a rendered video. Brendan or an editor executes it in CapCut, Descript, or Premiere.
- If the brief's spoken script has a line that fails the BRAND_VOICE.md smell test, flag it and propose a rewrite. Do not silently ship a robotic line.
- The format competitors evolve. When Brendan flags new patterns from their accounts, update `references/style-references.md` rather than hard-coding into this file.
- This skill is the second leg of the content pipeline: content-strategist → video-editor → (manual record/edit) → publer-scheduler. Future versions may auto-call ffmpeg for first-cut renders, but v1 stops at the EDL.
