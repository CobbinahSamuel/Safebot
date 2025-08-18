import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 👈 Required for resolving paths
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // This allows Vite to be accessed from a public host like ngrok
    host: true,
    allowedHosts: ['.ngrok-free.app'],
  },
})
