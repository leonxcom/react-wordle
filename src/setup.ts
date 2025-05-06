import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 模拟matchMedia - 在jsdom环境中不可用
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // 已废弃
    removeListener: vi.fn(), // 已废弃
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}); 