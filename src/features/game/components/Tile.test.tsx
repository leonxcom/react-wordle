import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tile from './Tile';
import { LetterState } from '../../../shared/types';

describe('Tile组件', () => {
  it('渲染正确的字母', () => {
    render(<Tile letter="A" state={LetterState.INITIAL} index={0} position="0-0" />);
    // 更具体地检查tile元素
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).toHaveTextContent('A');
  });

  it('为不同状态应用正确的类名', () => {
    const { rerender } = render(
      <Tile letter="A" state={LetterState.CORRECT} index={0} position="0-0" />
    );
    
    // 检查correct状态
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).toHaveClass('revealed');
    
    // 检查back元素是否有correct类
    const backElement = tileElement.querySelector('.back');
    expect(backElement).toHaveClass('correct');
    
    // 重新渲染以测试present状态
    rerender(<Tile letter="B" state={LetterState.PRESENT} index={0} position="0-0" />);
    const backElementAfterRerender = screen.getByRole('gridcell').querySelector('.back');
    expect(backElementAfterRerender).toHaveClass('present');
    
    // 重新渲染以测试absent状态
    rerender(<Tile letter="C" state={LetterState.ABSENT} index={0} position="0-0" />);
    const backElementAfterSecondRerender = screen.getByRole('gridcell').querySelector('.back');
    expect(backElementAfterSecondRerender).toHaveClass('absent');
  });
}); 