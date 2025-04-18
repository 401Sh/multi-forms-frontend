import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react-swc"
import dotenv from "dotenv"

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_HOST || 'localhost',
    port: parseInt(process.env.VITE_PORT || '5173')
  },
  test: {
    environment: 'jsdom',
    globals: true, // для использования `describe`, `test`, `expect` без импорта
    setupFiles: ['./setupTests.tsx'], // опционально
    exclude: ['e2e/**', 'node_modules/**']
  }
})
