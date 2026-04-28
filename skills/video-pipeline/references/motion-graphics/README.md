# Motion Graphics Library — 100x Marketer Video Pipeline

Reusable motion-graphic components for HyperFrames compositions. Drop these into the top-strip slot (where B-roll placeholders go) until real B-roll is recorded. Each component is self-contained HTML + CSS, no external JS, no GSAP timeline registration needed (animations are pure CSS keyframes that fire when the clip becomes visible at its `data-start`).

All components are designed to fit the **top 760px of a 1080×1920 frame** (the b-roll strip slot). They use brand tokens from `brand/COLORS.md`:
- `--brand-black` `#0a0a0a`
- `--brand-orange` `#ff6b00`
- `--brand-white` `#ffffff`

## Components

| File | Use case | Slot duration |
|---|---|---|
| [`counter.html`](counter.html) | Big number reveal (e.g., "11 MINUTES", "42 POSTS", "$400/mo") | 2-3s |
| [`before-after.html`](before-after.html) | Two-state comparison ("3 HOURS → 11 MIN") | 3-5s |
| [`list-reveal.html`](list-reveal.html) | Stagger-in numbered list (e.g., the 4 mental models) | 4-8s |
| [`pulse-callout.html`](pulse-callout.html) | Glowing ring around a key word/value, draws attention | 1-2s |

## How to use

Each file is a **fragment** (just the `<div class="clip ...">` block + a `<style>` block). Inline both into your `index.html` where you'd otherwise have a `broll-strip` placeholder. Set `data-start`, `data-duration`, and `data-track-index="7"` to match your beat.

Example: replace this placeholder:
```html
<div class="clip broll-strip" data-start="19.50" data-duration="2.50" data-track-index="7" style="z-index: 7">
  <div class="label">B-roll needed</div>
  <div>Stopwatch hitting 11:00</div>
</div>
```

with the counter:
```html
<!-- paste contents of counter.html here, set data-start/data-duration -->
```

When Brendan records real B-roll, swap the motion graphic back to a `<video class="clip" src="assets/broll/...">`. The motion graphic was a polished placeholder; the real footage is the upgrade.

## Lint compliance

All components use:
- `class="clip"` ✓
- `data-start` / `data-duration` / `data-track-index` ✓
- No external image/font dependencies (system fonts only)
- Only deterministic CSS animations (no `Math.random`, no `Date.now`)
- Self-contained styles with unique class prefixes (e.g., `mg-counter-*`) so they don't collide with the parent comp's `.headline` or `.caption` classes
