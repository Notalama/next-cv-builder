import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_SPEED_READER_REMOTE_ENTRY:
      process.env.NEXT_PUBLIC_SPEED_READER_REMOTE_ENTRY ??
      "http://localhost:3002/mf-manifest.json",
    NEXT_PUBLIC_SPRITE_GENERATOR_REMOTE_ENTRY:
      process.env.NEXT_PUBLIC_SPRITE_GENERATOR_REMOTE_ENTRY ??
      "http://localhost:3003/mf-manifest.json",
  },
};

export default nextConfig;
