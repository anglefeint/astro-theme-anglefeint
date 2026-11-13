/** Shared presentation data only; callers own layout sizes and loading priority. */
export function responsiveImage(image) {
  if (!image?.variants.length) return;
  const fallback = image.variants.find((variant) => variant.width >= 640) ?? image.variants.at(-1);
  return {
    src: fallback.src,
    width: image.width,
    height: image.height,
    srcset: image.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', '),
  };
}
