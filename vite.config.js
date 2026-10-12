import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'VITE_API_BASE_URL=https://pklf-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'VITE_API_BASE_URL=https://pklf-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
