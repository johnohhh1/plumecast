import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['deck.gl', '@deck.gl/layers', '@deck.gl/react'],

};

export default nextConfig;
