'use client';

import React from 'react';
import { cn } from '@lib/utils';

interface ProgressiveBlurProps {
  className?: string;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  blurIntensity?: number;
}

export function ProgressiveBlur({
  className,
  direction = 'left',
  blurIntensity = 1
}: ProgressiveBlurProps) {
  const layers = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        'absolute inset-y-0 w-[160px] pointer-events-none z-10',
        direction === 'left' ? 'left-0' : 'right-0',
        className
      )}
    >
      {layers.map((layer) => {
        const blurAmount = layer * 4 * blurIntensity;
        const start = ((layer - 1) / layers.length) * 100;
        const end = (layer / layers.length) * 100;

        const maskGrad =
          direction === 'left'
            ? `linear-gradient(to right, rgba(0,0,0,1) ${start}%, rgba(0,0,0,0) ${end}%)`
            : `linear-gradient(to left, rgba(0,0,0,1) ${start}%, rgba(0,0,0,0) ${end}%)`;

        return (
          <div
            key={layer}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blurAmount}px)`,
              WebkitBackdropFilter: `blur(${blurAmount}px)`,
              maskImage: maskGrad,
              WebkitMaskImage: maskGrad
            }}
          />
        );
      })}
    </div>
  );
}
