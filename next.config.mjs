/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ["better-sqlite3"]
  }
};

export default nextConfig;
