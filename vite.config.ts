import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true, // Ensure global test functions like describe, it, etc., are available
    environment: 'jsdom', // Set environment to jsdom for DOM-related tests
    setupFiles: 'src/setupTests.js' // Optional: Setup file for global configurations
  }
});