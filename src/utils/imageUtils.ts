/**
 * Helper to get local image paths dynamically
 */
export const getOperatorAvatar = (name: string): string => {
  return new URL(`../assets/images/${name}_avatar.png`, import.meta.url).href;
};

export const getOperatorFull = (name: string): string => {
  return new URL(`../assets/images/${name}_full.png`, import.meta.url).href;
};
