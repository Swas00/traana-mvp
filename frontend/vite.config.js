import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 3000,
    host: true, // Exposes on LAN (0.0.0.0) so phones and laptops on the same Wi-Fi can connect
    allowedHosts: true, // Allows external tunnel domains (localtunnel, ngrok, cloudflare)
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
