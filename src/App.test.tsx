import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('渲染不崩溃', () => {
    // 因为App组件内部引用了Game组件和其他复杂的状态管理，
    // 这里我们只是简单测试它是否能正常渲染
    // 在实际项目中应该使用更完整的测试
    expect(() => render(<App />)).not.toThrow();
  });
}); 