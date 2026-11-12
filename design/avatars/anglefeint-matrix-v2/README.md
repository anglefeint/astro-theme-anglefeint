---
doc_id: anglefeint_matrix_avatar_v2_sources
doc_role: reference
doc_purpose: Preserve the approved Matrix avatar reference, generated frames and animation exports.
doc_scope: [visual-system]
update_triggers: [visual-change]
source_of_truth: false
---

# Matrix avatar source archive

This directory preserves the character artwork and animation materials, including files that are not used by the website. It is an archival resource, outside the theme package and starter manifest. Archiving these files does not publish a theme update or deploy the avatar integration.

- `reference-original.png`: the user-supplied AngleFeintAvatar1.1.png, unchanged.
- `spritesheet.png`: the original generated 5 × 5 sheet, unchanged.
- `frames/01.png` through `frames/25.png`: individual 256 × 256 frames extracted in row-major order with nearest-neighbor resizing.
- `animation-256.gif`: the original 256px looping GIF.
- `avatar-static-512.png`: the static 512px avatar.
- `logo-128.gif` and `logo-static-128.png`: smaller website renditions, including the reduced-motion still.
- `prompt.txt`: the exact image-generation prompt used with the reference.
- `animation.json`: source-cell crops, playback order, frame durations, palette and SHA-256 hashes of the archived artwork.

The built-in image generator produced the sheet; Sharp extracted and encoded the exports. The 25 source frames form a 65-frame, 8.66-second loop. Typing occupies most of the loop; headphone adjustment and catching code rain occur between typing sequences. The GIF loop value is zero (repeat indefinitely).

The source palette was changed to the homepage's Matrix greens while retaining the hood, black face, asymmetric block eyes and headphones. Website runtime assets are maintained separately under `packages/theme/src/assets/theme/avatars/`.
