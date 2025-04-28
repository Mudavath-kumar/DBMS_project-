/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Only include MongoDB and related packages in server-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mongodb: false,
        '@napi-rs/snappy': false,
        'mongodb-client-encryption': false,
        'aws4': false,
        'snappy': false,
        'kerberos': false,
        'bson': false,
        'mongodb-client-encryption': false,
        'supports-color': false,
        'saslprep': false,
        'fs': false,
        'path': false,
        'util': false,
        'crypto': false,
        'process': false,
        'buffer': false,
        'stream': false,
        'zlib': false,
        'node:process': false,
        'node:fs': false,
        'node:path': false,
        'node:util': false,
        'node:crypto': false,
        'node:buffer': false,
        'node:stream': false,
        'node:zlib': false,
      };
    }
    return config;
  },
  // Ensure server-only modules aren't bundled for the client
  experimental: {
    serverComponentsExternalPackages: [
      'mongodb',
      '@napi-rs/snappy',
      'mongodb-client-encryption',
      'aws4',
      'snappy',
      'kerberos',
      'bson',
      'saslprep'
    ],
  },
};

export default nextConfig;
