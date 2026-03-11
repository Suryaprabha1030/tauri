// lib/store/ShareStore.ts
const ShareStore = new Map<string, string>(); // slug -> base64Image

export const saveImage = (slug: string, base64: string) => {
  ShareStore.set(slug, base64);
};

export const getImage = (slug: string) => {
  return ShareStore.get(slug);
};
