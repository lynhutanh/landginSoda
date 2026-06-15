'use client';

import React, { useState } from 'react';
import { cn } from '@lib/utils';

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  reverse?: boolean;
  speed?: number;
  speedOnHover?: number;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 42,
  reverse = false,
  speed = 60,
  speedOnHover,
  className
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const duration = isHovered && speedOnHover !== undefined ? speedOnHover : speed;

  return (
    <div
      className={cn('overflow-hidden w-full flex select-none relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="slider-track"
        style={{
          display: 'flex',
          flexShrink: 0,
          gap: `${gap}px`,
          animationPlayState: 'running',
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {/* Render multiple sets to make it loop seamlessly */}
        {React.Children.map(children, (child) => child)}
        {React.Children.map(children, (child) => child)}
        {React.Children.map(children, (child) => child)}
        {React.Children.map(children, (child) => child)}
      </div>

      <style jsx global>{`
        .slider-track {
          animation: slide-infinite linear infinite;
        }
        @keyframes slide-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - ${gap / 2}px));
          }
        }
      `}</style>
    </div>
  );
}
