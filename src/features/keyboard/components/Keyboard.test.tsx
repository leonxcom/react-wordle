import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Keyboard from './Keyboard';
import { LetterState } from '../../../shared/types';

describe('Keyboard组件', () => {
  it('渲染所有按键', () => {
    render(<Keyboard letterStates={{}} onKey={() => {}} />);
    
    // 检查是否所有字母键都存在
    'qwertyuiopasdfghjklzxcvbnm'.split('').forEach(letter => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
    
    // 检查特殊按键
    expect(screen.getByText('Enter')).toBeInTheDocument();
    // Backspace键显示的是一个SVG图标，所以我们检查它的aria-label
    expect(screen.getByLabelText('删除')).toBeInTheDocument();
  });
  
  it('点击按键触发回调', () => {
    const onKeyMock = vi.fn();
    render(<Keyboard letterStates={{}} onKey={onKeyMock} />);
    
    // 点击字母按键
    fireEvent.click(screen.getByText('a'));
    expect(onKeyMock).toHaveBeenCalledWith('a');
    
    // 点击Enter按键
    fireEvent.click(screen.getByText('Enter'));
    expect(onKeyMock).toHaveBeenCalledWith('Enter');
    
    // 点击Backspace按键
    fireEvent.click(screen.getByLabelText('删除'));
    expect(onKeyMock).toHaveBeenCalledWith('Backspace');
  });
  
  it('按键状态正确显示', () => {
    const letterStates = {
      'a': LetterState.CORRECT,
      'b': LetterState.PRESENT,
      'c': LetterState.ABSENT
    };
    
    render(<Keyboard letterStates={letterStates} onKey={() => {}} />);
    
    // 检查正确状态的按键
    const aButton = screen.getByText('a').closest('button');
    expect(aButton).toHaveClass('correct');
    
    // 检查存在状态的按键
    const bButton = screen.getByText('b').closest('button');
    expect(bButton).toHaveClass('present');
    
    // 检查不存在状态的按键
    const cButton = screen.getByText('c').closest('button');
    expect(cButton).toHaveClass('absent');
  });
}); 