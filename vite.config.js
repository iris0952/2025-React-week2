import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/2025-React-week2/',
  build: {
    outDir: 'build' // 將輸出目錄設為 build
  }
})
