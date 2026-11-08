import { defineConfig } from 'vitest/config';

/* Eigene Config, damit vite.config.js (Multi-Page-Build, Dev-Server) unberuehrt bleibt. */
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.mjs'],
    environment: 'node',
  },
});
