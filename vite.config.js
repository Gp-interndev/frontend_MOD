import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Ensures React Router works when directly accessing routes
  },
  base: '/', // Ensure the base path is set correctly, or adjust if your app is deployed under a sub-path
})
