import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    // Run test files serially — they share a real database and do file-level
    // resets, so parallel execution would cause race conditions between resets.
    fileParallelism: false,
    setupFiles: ["./src/test/setup.ts"],
  },
});
