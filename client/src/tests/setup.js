import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Setup test environment
beforeAll(() => {
  // Mock localStorage
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  };
});

afterEach(() => {
  // Cleanup
});

afterAll(() => {
  // Final cleanup
});
