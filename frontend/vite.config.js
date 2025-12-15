// Vite config with Tailwind CSS v4 support
export default {
  server: {
    port: 5173,
    host: true,
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
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}