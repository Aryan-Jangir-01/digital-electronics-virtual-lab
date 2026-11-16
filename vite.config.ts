import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/digital-electronics-virtual-lab/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Allows access from phone on local Wi-Fi network!
    port: 5173,
  }
})
