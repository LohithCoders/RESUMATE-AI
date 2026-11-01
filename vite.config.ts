import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repository below /RESUMATE-AI/ rather than at the
// domain root. Keeping the base explicit prevents the production bundle from
// requesting its scripts and styles from the wrong URL (the common blank-page
// cause on project Pages sites).
export default defineConfig({
  plugins: [react()],
  // Root hosting (Vercel/custom domains) remains the default. GitHub Pages
  // supplies its repository subpath through VITE_BASE_PATH at build time.
  base: process.env.VITE_BASE_PATH || '/',
});
