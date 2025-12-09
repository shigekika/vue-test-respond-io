import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Get API configuration from environment variables with fallback
  const API_BASE_URL = env.VITE_API_BASE_URL || 
    'https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com'
  const API_PAYLOAD_PATH = env.VITE_API_PAYLOAD_PATH || 
    '/candidate-assessments/payload.json'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api/payload': {
          target: API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/payload/, API_PAYLOAD_PATH)
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js'
    }
  }
})
