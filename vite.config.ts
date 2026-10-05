import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves this repo from /Portfolio/; a custom domain or CloudFront serves from /.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
