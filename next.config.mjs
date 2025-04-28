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
  // Use a custom webpack configuration to completely exclude server-only modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace all server-only modules with empty objects
      config.resolve.alias = {
        ...config.resolve.alias,
        // MongoDB and related packages
        'mongodb': false,
        '@napi-rs/snappy': false,
        '@napi-rs/snappy-linux-x64-gnu': false,
        '@napi-rs/snappy-linux-x64-musl': false,
        'mongodb-client-encryption': false,
        'aws4': false,
        'snappy': false,
        'kerberos': false,
        'bson': false,
        'saslprep': false,
        // Auth packages
        'bcryptjs': false,
        'jsonwebtoken': false,
        // Node.js built-in modules
        'node:process': false,
        'node:fs': false,
        'node:path': false,
        'node:crypto': false,
        'node:stream': false,
        'node:util': false,
        'node:buffer': false,
        'node:zlib': false,
        'node:os': false,
        'node:tty': false,
        'node:child_process': false,
        'node:http': false,
        'node:https': false,
        'node:url': false,
        'node:net': false,
        'node:dns': false,
        'node:tls': false,
        'node:dgram': false,
        'node:readline': false,
        'node:events': false,
        'node:assert': false,
        'node:querystring': false,
        'node:string_decoder': false,
        'node:timers': false,
        'node:vm': false,
        'node:worker_threads': false,
        'node:module': false,
        'node:perf_hooks': false,
        'node:async_hooks': false,
        'node:inspector': false,
        'node:trace_events': false,
        'node:domain': false,
        'node:punycode': false,
        'node:repl': false,
        'node:cluster': false,
        'node:v8': false,
        'node:wasi': false,
        'node:diagnostics_channel': false,
      };
    }
    
    return config;
  },
  // Ensure server-only modules aren't bundled for the client
  experimental: {
    serverComponentsExternalPackages: [
      'mongodb',
      '@napi-rs/snappy',
      '@napi-rs/snappy-linux-x64-gnu',
      '@napi-rs/snappy-linux-x64-musl',
      'mongodb-client-encryption',
      'aws4',
      'snappy',
      'kerberos',
      'bson',
      'saslprep',
      'bcryptjs',
      'jsonwebtoken',
    ],
    // This will help prevent server-only modules from being bundled on the client
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
