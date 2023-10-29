export const getAssetsImgFile = (url: string): string => {
  return new URL(`../assets/img/${url}`, import.meta.url).href;
};
