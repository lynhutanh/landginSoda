import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://accounts.google.com https://unpkg.com https://cdnjs.cloudflare.com`,
      "worker-src 'self' blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: http: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' blob: http: https: ws: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' }
];

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: false,
  distDir: '.next',
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.base-code.local',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**'
      }
    ]
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5001'}/:path*`
      }
    ];
  },
  experimental: {},
  turbopack: {
    root: __dirname
  },
  env: {
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    MAX_SIZE_IMAGE: process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE || '1000',
    MAX_SIZE_FILE: process.env.NEXT_PUBLIC_MAX_SIZE_FILE || '1000',
    MAX_SIZE_VIDEO: process.env.NEXT_PUBLIC_MAX_SIZE_VIDEO || '5000',
    NEXT_PUBLIC_SOCKET_ENDPOINT: process.env.NEXT_PUBLIC_SOCKET_ENDPOINT
  },
  webpack(config, { buildId, webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          BUILD_ID: JSON.stringify(buildId)
        }
      })
    );

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false
    };

    return config;
  },
  transpilePackages: []
};

export default nextConfig;
