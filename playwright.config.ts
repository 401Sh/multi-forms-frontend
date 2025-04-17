import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const host = process.env.VITE_HOST || 'localhost'
const port = parseInt(process.env.VITE_PORT || '5173')

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: `http://${host}:${port}`,
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI
  }
})
