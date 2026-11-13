export type ResponsiveImage = {
  width: number;
  height: number;
  variants: { src: string; width: number; height: number }[];
};

/** Build-only data shared by the page adapters and virtual manifest. */
export type ImageManifest = {
  root: string;
  base: string;
  posts: Record<string, string>;
  fragments: Record<string, Record<string, string>>;
  sources: Record<string, ResponsiveImage>;
};
