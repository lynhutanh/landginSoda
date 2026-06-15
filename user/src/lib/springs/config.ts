export const isMobileDisabled = (disableOnMobile?: boolean, width?: number): boolean => {
  if (!disableOnMobile) return false;
  const currentWidth = width ?? (typeof window !== "undefined" ? window.innerWidth : 1200);
  return currentWidth < 768;
};

export const springsConfig = {
  disableOnMobile: {
    hover: false,
    spring: false,
    inview: false,
    springtrigger: false,
  },
};
