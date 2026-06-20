/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ["better-sqlite3"]
  },
  outputFileTracingIncludes: {
    "/api/search": ["./data/quotes.db"]
  }
};

export default nextConfig;
