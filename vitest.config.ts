import { defineConfig } from 'vitest/config';

// Domain tests run in node; component tests opt into jsdom with a `// @vitest-environment jsdom` docblock.
export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
    testTimeout: 120_000,
  },
});
