import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/Jobito/',
  plugins: [react()],
  resolve: {
    alias: {
      registry: path.resolve(__dirname, './src/registry'),
    },
  },
})
