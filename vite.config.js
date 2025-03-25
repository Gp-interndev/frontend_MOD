import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Set your preferred port here
    historyApiFallback: true, // Ensures React Router works when directly accessing routes
    proxy: {
      '/api': 'http://127.0.0.1:5000', // Proxy requests to backend API
    },
  },
  base: '/', // Ensure the base path is set correctly
});