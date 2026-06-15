'use client';

import React from 'react';
import { cn } from '@lib/utils';
import { InfiniteSlider } from './infinite-slider';
import { ProgressiveBlur } from './progressive-blur';

export interface CustomerLogo {
  src: string;
  alt: string;
}

interface CustomersSectionProps {
  customers?: CustomerLogo[];
  className?: string;
}

export function LogoCloud({ logos }: { logos: CustomerLogo[] }) {
  return (
    <div className="relative mx-auto max-w-4xl py-6 md:border-x border-white/5 bg-transparent overflow-hidden">
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t border-white/5" />

      <InfiniteSlider gap={48} reverse speed={40} speedOnHover={20}>
        {logos.map((logo, index) => (
          <img
            key={`logo-${logo.alt}-${index}`}
            alt={logo.alt}
            className="pointer-events-none h-5 select-none opacity-60 hover:opacity-100 transition-opacity duration-300 filter brightness-0 invert"
            src={logo.src}
            loading="lazy"
          />
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={0.6}
        className="pointer-events-none absolute top-0 left-0 h-full w-[120px]"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={0.6}
        className="pointer-events-none absolute top-0 right-0 h-full w-[120px]"
        direction="right"
      />

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b border-white/5" />
    </div>
  );
}

export function CustomersSection({ customers, className }: CustomersSectionProps) {
  const defaultLogos = [
    {
      src: 'https://svgl.app/library/nvidia-wordmark-light.svg',
      alt: 'Nvidia Logo'
    },
    {
      src: 'https://svgl.app/library/supabase_wordmark_light.svg',
      alt: 'Supabase Logo'
    },
    {
      src: 'https://svgl.app/library/openai_wordmark_light.svg',
      alt: 'OpenAI Logo'
    },
    {
      src: 'https://svgl.app/library/turso-wordmark-light.svg',
      alt: 'Turso Logo'
    },
    {
      src: 'https://svgl.app/library/vercel_wordmark.svg',
      alt: 'Vercel Logo'
    },
    {
      src: 'https://svgl.app/library/github_wordmark_light.svg',
      alt: 'GitHub Logo'
    },
    {
      src: 'https://svgl.app/library/claude-ai-wordmark-icon_light.svg',
      alt: 'Claude AI Logo'
    },
    {
      src: 'https://svgl.app/library/clerk-wordmark-light.svg',
      alt: 'Clerk Logo'
    }
  ];

  const logos = customers && customers.length > 0 ? customers : defaultLogos;

  return (
    <section className={cn('relative w-full bg-transparent py-16 px-4 overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className={cn(
          '-top-1/2 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[120vmin] w-[120vmin] rounded-b-full',
          'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_50%)]',
          'blur-[30px]'
        )}
      />
      <div className="w-full">
        <h2 className="mb-8 text-center">
          <span className="font-bold text-2xl text-white tracking-tight md:text-3xl uppercase tracking-widest">
            Ingredient Suppliers
          </span>
        </h2>

        <LogoCloud logos={logos} />
      </div>
    </section>
  );
}
