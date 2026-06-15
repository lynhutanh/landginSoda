import { useEffect } from "react";

interface UseAdaptiveGridProps {
  baseWidth: number;
  coef?: number;
}

export const useAdaptiveGrid = ({ baseWidth, coef = 1 }: UseAdaptiveGridProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width > baseWidth) {
        const ratio = width / baseWidth;
        const scaledFontSize = 16 * (1 + (ratio - 1) * coef);
        document.documentElement.style.fontSize = `${scaledFontSize}px`;
      } else {
        document.documentElement.style.fontSize = "";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (typeof window !== "undefined") {
        document.documentElement.style.fontSize = "";
      }
    };
  }, [baseWidth, coef]);
};
