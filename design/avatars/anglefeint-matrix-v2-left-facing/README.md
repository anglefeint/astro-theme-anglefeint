---
doc_id: anglefeint_matrix_avatar_v2_left_facing_sources
doc_role: reference
doc_purpose: Preserve the horizontally mirrored Matrix avatar and all derived animation materials.
doc_scope: [visual-system]
update_triggers: [visual-change]
source_of_truth: false
---

# Matrix avatar: character at right, facing left

This is a horizontally mirrored counterpart of [the original right-facing version](../anglefeint-matrix-v2/README.md). Both versions are retained. This variant puts the character on the right and the computer on the left, suitable for an entrance on the right side of the page.

Every frame is mirrored individually. The pixel artwork, animation order, green palette and 8.66-second timing are preserved; there is no AI redraw. Sprite-sheet cells are mirrored in place rather than reversing the entire sheet and its frame order.

- `animation-256.gif`: full-size mirrored animation.
- `logo-128.gif`: smaller mirrored website rendition.
- `avatar-static-512.png` and `logo-static-128.png`: mirrored static avatars.
- `frames/01.png` through `frames/25.png`: all mirrored source frames.
- `spritesheet.png`: mirrored 5 × 5 sheet with original cell order.
- `reference-original.png`: unchanged user-supplied reference for provenance.
- `reference-mirrored.png`: mirrored reference image.
- `prompt.txt`: unchanged original generation prompt.
- `transformation.txt`: derivation details.
- `animation.json`: source reference, crop layout, playback sequence, timing and artwork hashes.
- `mirror-gif.mjs`: reproducible palette-preserving GIF mirror tool; run from the repository root. It verifies every decoded output pixel against the mirrored original before saving.

The original archive is unchanged. This directory is archival and is not included in the npm package or starter. Runtime copies are maintained separately in the theme's avatar assets; changing the local preview is separate from publishing the theme package.
