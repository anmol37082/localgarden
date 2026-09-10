/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  output: "export",

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    workerThreads: true,
    cpus: 1,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],

    // Static export ke liye
    unoptimized: true,
  },
};

export default nextConfig;
