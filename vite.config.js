import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Özel alan adı (CNAME: omerkandemir.com) için kök yol
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
})
