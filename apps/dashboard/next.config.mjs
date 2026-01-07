/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@clipfactory/platform-core",
    "@clipfactory/opencut-engine", 
    "@clipfactory/events"
  ],
};

export default nextConfig;
