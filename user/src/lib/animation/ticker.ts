type TickerCallback = (time: number) => void;
type TickerGetFramerate = () => number;

interface TickerSubscriber {
  callback: TickerCallback;
  getFramerate: TickerGetFramerate;
  lastTime: number;
}

const subscribers = new Set<TickerSubscriber>();
let animationFrameId: number | null = null;

const tick = (time: number) => {
  subscribers.forEach((sub) => {
    const framerate = sub.getFramerate();
    const elapsed = time - sub.lastTime;
    if (elapsed >= framerate) {
      sub.callback(time);
      sub.lastTime = time;
    }
  });

  if (subscribers.size > 0) {
    animationFrameId = requestAnimationFrame(tick);
  } else {
    animationFrameId = null;
  }
};

export const subscribeToTicker = (
  callback: TickerCallback,
  getFramerate: TickerGetFramerate
): (() => void) => {
  const subscriber: TickerSubscriber = {
    callback,
    getFramerate,
    lastTime: 0,
  };

  subscribers.add(subscriber);

  if (animationFrameId === null) {
    animationFrameId = requestAnimationFrame(tick);
  }

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0 && animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };
};
