import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/_botid': {
        target: 'https://botid.vercel-infra.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/_botid/, ''),
      },
    },
  },
})
