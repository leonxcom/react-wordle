import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';
import { LetterState } from '../../../shared/types';
import * as wordsModule from '../../../shared/utils/words';
import * as storageModule from '../../../shared/utils/storage';

// 模拟依赖
vi.mock('../../../shared/utils/words', () => ({
  getWordOfTheDay: vi.fn().mockReturnValue('react'),
}));

vi.mock('../../../shared/utils/storage', () => ({
  saveGameState: vi.fn(),
  loadGameState: vi.fn().mockReturnValue(null),
  updateWinStatistics: vi.fn(),
  updateLossStatistics: vi.fn(),
}));

vi.mock('../../../shared/utils/gameLogic', () => ({
  validateGuess: vi.fn().mockImplementation((row: Array<{letter: string; state: LetterState}>, answer: string, letterStates: Record<string, LetterState>) => {
    // 简化的验证逻辑，仅用于测试
    const isValidWord = true; 
    const newRow = row.map((tile, i) => ({
      ...tile,
      state: tile.letter === answer[i] 
        ? LetterState.CORRECT
        : answer.includes(tile.letter) 
          ? LetterState.PRESENT 
          : LetterState.ABSENT
    }));
    
    // 更新字母状态
    const newLetterStates = { ...letterStates };
    row.forEach((tile, i) => {
      const letter = tile.letter;
      const currentState = newLetterStates[letter];
      const newState = newRow[i].state;
      
      // 如果字母没有状态或新状态优先级更高，则更新
      if (
        currentState === undefined ||
        (currentState !== LetterState.CORRECT && 
          (newState === LetterState.CORRECT || 
           (newState === LetterState.PRESENT && currentState !== LetterState.PRESENT)))
      ) {
        newLetterStates[letter] = newState;
      }
    });
    
    return { isValidWord, newRow, newLetterStates };
  }),
  generateResultGrid: vi.fn().mockReturnValue(''),
}));

describe('useGame钩子', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // 模拟loadGameState返回null，确保每次测试都从新游戏开始
    vi.mocked(storageModule.loadGameState).mockReturnValue(null);
  });
  
  it('初始化游戏板', () => {
    const { result } = renderHook(() => useGame());
    
    // 检查初始化的游戏板（6行5列的空板）
    expect(result.current.board.length).toBe(6);
    result.current.board.forEach(row => {
      expect(row.length).toBe(5);
      row.forEach(tile => {
        expect(tile.letter).toBe('');
        expect(tile.state).toBe(LetterState.INITIAL);
      });
    });
    
    // 检查其他初始状态
    expect(result.current.currentRowIndex).toBe(0);
    expect(result.current.success).toBe(false);
    expect(result.current.letterStates).toEqual({});
  });
  
  it('处理按键输入', () => {
    const { result } = renderHook(() => useGame());
    
    // 测试添加字母
    act(() => {
      result.current.onKey('r');
    });
    
    expect(result.current.board[0][0].letter).toBe('r');
    
    // 添加更多字母
    act(() => {
      result.current.onKey('e');
      result.current.onKey('a');
      result.current.onKey('c');
      result.current.onKey('t');
    });
    
    // 检查第一行是否填满
    const firstRow = result.current.board[0];
    expect(firstRow.map(tile => tile.letter).join('')).toBe('react');
    
    // 测试退格键
    act(() => {
      result.current.onKey('Backspace');
    });
    
    expect(result.current.board[0][4].letter).toBe('');
    
    // 重新添加字母't'
    act(() => {
      result.current.onKey('t');
    });
    
    // 测试回车键（提交猜测）
    act(() => {
      result.current.onKey('Enter');
    });
    
    // 由于答案也是'react'，所以应该显示成功
    expect(result.current.success).toBe(true);
    
    // 检查字母状态是否正确更新
    expect(result.current.letterStates['r']).toBe(LetterState.CORRECT);
    expect(result.current.letterStates['e']).toBe(LetterState.CORRECT);
    expect(result.current.letterStates['a']).toBe(LetterState.CORRECT);
    expect(result.current.letterStates['c']).toBe(LetterState.CORRECT);
    expect(result.current.letterStates['t']).toBe(LetterState.CORRECT);
  });
  
  it('在游戏成功后不再接受输入', () => {
    const { result } = renderHook(() => useGame());
    
    // 输入获胜单词并提交
    act(() => {
      result.current.onKey('r');
      result.current.onKey('e');
      result.current.onKey('a');
      result.current.onKey('c');
      result.current.onKey('t');
      result.current.onKey('Enter');
    });
    
    // 验证游戏成功状态
    expect(result.current.success).toBe(true);
    
    // 尝试在成功后继续输入
    act(() => {
      result.current.onKey('x');
    });
    
    // 确认第二行没有接受新输入
    expect(result.current.board[1][0].letter).toBe('');
  });
}); 