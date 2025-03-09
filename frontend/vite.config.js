import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/transcribe-audio': 'http://localhost:8000',
      '/analyze-image': 'http://localhost:8000',
      '/first-aid': 'http://localhost:8000'
    }
  },
  // Add esbuild configuration to handle JSX in .js files
  esbuild: {
    loader: {
      '.js': 'jsx',
    },
  }
});
