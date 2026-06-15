import React from 'react';

interface AnimatedGroupProps {
  children: React.ReactNode;
  className?: string;
  variants?: any;
}

export function AnimatedGroup({ children, className }: AnimatedGroupProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
