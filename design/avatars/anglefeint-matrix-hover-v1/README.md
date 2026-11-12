---
doc_id: anglefeint_matrix_avatar_hover_v1_sources
doc_role: reference
doc_purpose: Preserve the Matrix avatar eye-smile hover reaction and its source frames.
doc_scope: [visual-system]
update_triggers: [visual-change]
source_of_truth: false
---

# Matrix hover reaction: stop, turn and smile with eyes

This is a separate reaction for the approved right-facing typing character. The character stops typing, straightens, turns toward the viewer and smiles using only the eyes. The face has no mouth. Original idle and mirrored avatar archives remain unchanged.

- `reference-typing.png`: the approved typing frame used as the image-generation reference.
- `spritesheet.png`: original 4 × 4 imagegen output.
- `frames/01.png` through `frames/16.png`: normalized 256px source frames.
- `hover-turn-smile-256.gif`: one-shot 16-frame GIF that ends on the eye-smile pose.
- `smile-static-512.png`: static final pose.
- `hover-turn-smile-strip-128.png`: vertical 16-frame PNG strip for deterministic hover playback.
- `prompt.txt`: exact built-in imagegen prompt.
- `animation.json`: source crops, export timings and artwork hashes.

The website uses the PNG strip to hold the final pose without reloading a GIF. A matching image preload in the homepage head starts the request early. The image also loads eagerly with the initial page and is decoded before hover switching is enabled. While loading or after decode failure, the idle avatar remains visible. On fine-pointer devices with motion enabled, hover or keyboard focus plays the strip forward in 900ms. Leaving both states reverses the same animation from its current pose, returning to typing only at the start; quick re-entry resumes forward from current progress. Reduced motion keeps the existing static avatar. No additional hover-time HTTP request or JavaScript animation loop is needed. The separately archived [reverse GIF](../anglefeint-matrix-hover-reverse-v1/README.md) preserves an export; runtime reverse playback uses this same strip.

This archive is outside the theme package and starter. The runtime strip is copied to `packages/theme/src/assets/theme/avatars/matrix-typist-hover-strip.png`.
