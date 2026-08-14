import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Without this, Turbopack walks up from this directory looking for a
  // lockfile to infer the project root, and finds an unrelated
  // C:\Users\preml\package-lock.json first — treating the user's home
  // directory as the root instead of this project. That silently breaks
  // static chunk serving (some /_next/static/chunks/*.js requests 403,
  // client components fail to hydrate) without breaking SSR, so it's easy
  // to miss until you check the browser console.
  turbopack: {
    root: path.join(__dirname),
  },
  // Allows accessing the dev server from other devices on the LAN (e.g.
  // testing on a phone) via the printed Network URL, without Next.js
  // blocking the HMR websocket as a cross-origin request.
  allowedDevOrigins: ["10.0.0.212"],
};

export default nextConfig;
