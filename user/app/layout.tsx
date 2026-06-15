import '@total-typescript/ts-reset';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import React from 'react';

import '../style/globals.css';

import { Providers } from './providers';

const siteUrl = process.env.SITE_URL || 'https://base-code.local';
const stripExtensionAttributesScript = `
(() => {
  const strip = (root = document) => {
    root.querySelectorAll?.('[bis_skin_checked]').forEach((node) => {
      node.removeAttribute('bis_skin_checked');
    });
  };
  strip();
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
        mutation.target.removeAttribute('bis_skin_checked');
      }
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) strip(node);
      });
    }
  }).observe(document.documentElement, { attributes: true, childList: true, subtree: true });
})();
`;

export const metadata: Metadata = {
  title: {
    default: 'Base Code',
    template: '%s | Base Code'
  },
  description: 'Hệ thống quản lý kho hàng',
  icons: {
    icon: '/logo.ico',
    apple: '/logo.png'
  },
  other: {
    language: 'Vietnamese'
  }
};

export const viewport: Viewport = {
  themeColor: '#3b82f6'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Base Code',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Hệ thống quản lý kho hàng'
  };

  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Paper Grain Texture Overlay (Botanical Design System) */}
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.012]"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E\')',
            backgroundRepeat: 'repeat'
          }}
        />
        <Script
          id="strip-extension-hydration-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: stripExtensionAttributesScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
