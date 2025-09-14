import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Optional: Set a different port if 5173 is in use
  server: {
    port: 5173,
  },
})