# 100x Marketer Brand Colors

Source of truth for brand color use across video, web, social graphics, and any other rendered output. Extracted from `BRAND_VOICE.md` ("the aesthetic is 'operator who ships.' Terminal green-on-black, monospace, sharp edits, no soft lo-fi").

If a tool or skill needs colors, it reads this file. Don't hard-code hex values anywhere else.

---

## Primary palette

| Token | Hex | Use |
|---|---|---|
| `--brand-black` | `#0a0a0a` | Backgrounds, terminal base, full-bleed text panels. Default video background. |
| `--brand-green` | `#39ff14` | Primary accent. Headlines, prompt highlights, CTA card brand mark. The "100x" green. |
| `--brand-white` | `#ffffff` | Body text on dark backgrounds, captions, secondary headlines. |

## Supporting palette

| Token | Hex | Use |
|---|---|---|
| `--brand-gray-1` | `#1a1a1a` | Slightly elevated surfaces (e.g., terminal window chrome on a black background). |
| `--brand-gray-2` | `#666666` | Muted text, timestamps, secondary metadata. |
| `--brand-stroke-black` | `#000000` | Caption/text stroke on light contexts. |

## Rules of use

- **Default video background:** `--brand-black`. No gradients, no imagery behind text.
- **On-screen text headlines:** `--brand-green` on `--brand-black`, or `--brand-white` on `--brand-black`. Never green on white.
- **Captions (word-by-word):** `--brand-white` with a 4-6px `--brand-stroke-black` outline. Bottom-center, never overlapping headline overlays.
- **Highlight sweeps on prompts:** `--brand-green` translucent (~20% opacity) underline or bar.
- **CTA card:** `--brand-black` background, `--brand-green` brand mark, `--brand-white` supporting text.

## Don't

- No off-brand greens (lime, mint, emerald). Only `#39ff14`.
- No drop shadows softer than 2px. Sharp edges only.
- No color overlays on video clips. Footage is graded neutral.
- No gradients between brand colors.
