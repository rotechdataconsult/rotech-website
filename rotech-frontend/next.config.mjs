import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the root: a package-lock.json higher up (e.g. the home folder) otherwise
  // makes Turbopack resolve tailwindcss from the wrong directory.
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
};

export default nextConfig;
