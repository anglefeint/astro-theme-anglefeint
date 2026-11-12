---
doc_id: anglefeint_matrix_avatar_hover_reverse_v1_sources
doc_role: reference
doc_purpose: Preserve the reverse eye-smile reaction and its unchanged-source derivation.
doc_scope: [visual-system]
update_triggers: [visual-change]
source_of_truth: false
---

# Reverse hover reaction: smile back to typing

This is a separate reverse of [the forward hover reaction](../anglefeint-matrix-hover-v1/README.md). The original GIF, frame sheet and all individual frames remain untouched. No new artwork was generated: the 16 source frames are played in exact reverse order, with their original GIF durations reversed too.

- `return-to-typing-256.gif`: one-shot reverse GIF, from smiling eyes to the starting keyboard pose.
- `frames/01.png` through `frames/16.png`: unchanged forward-source PNGs copied in reverse order.
- `spritesheet.png`: reverse sequence in a 4 × 4 sheet.
- `return-to-typing-strip-128.png`: reverse sequence as a vertical image strip.
- `start-smile-static-512.png` and `end-typing-static-512.png`: static start/end poses.
- `transformation.txt` and `animation.json`: provenance, frame order, timing and artwork hashes.

The website reuses the existing preloaded forward strip. A single Web Animation plays forward when the entrance is hovered or keyboard-focused, holds the smile, then reverses on pointer/focus exit. The typing GIF returns only after reverse playback reaches the starting frame. Quick re-entry changes direction at the current playback position instead of jumping to either endpoint. If keyboard focus remains, pointer exit does not interrupt it. Reduced motion and teardown cancel the reaction. Reverse playback needs no extra image request.

The reverse GIF is preserved as an independent reusable asset even though the current website can reverse the existing strip directly. This archive is outside npm runtime packaging and starter distribution.
