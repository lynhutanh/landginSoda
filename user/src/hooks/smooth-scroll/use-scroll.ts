import { create } from "zustand";

interface ScrollState {
  stop: () => void;
  start: () => void;
}

export const useScroll = create<ScrollState>(() => ({
  stop: () => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  },
  start: () => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "";
    }
  },
}));
