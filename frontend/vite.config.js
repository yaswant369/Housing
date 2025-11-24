 import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- Add this 'server' section ---
  server: {
    proxy: {
      // This tells vite to proxy any request starting with /api
      // to your backend server running on http://localhost:5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Set to false if your backend is not using https
      },
    },
  },
  // ---------------------------------
})