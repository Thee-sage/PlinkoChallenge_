import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // This allows external access
    port: 5173,
    strictPort: true,
  },
  define: {
    // Use environment variables with fallback to localhost for development
    'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || '983130641378-fnd6gehev1mmc45c1kmu9smmo1bosv6j.apps.googleusercontent.com'),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3001'),
    'process.env.VITE_SOCKET_URL': JSON.stringify(process.env.VITE_SOCKET_URL || 'http://localhost:3001')
  }
})
