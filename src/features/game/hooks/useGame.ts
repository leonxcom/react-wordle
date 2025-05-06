import { useState, useCallback, useEffect } from 'react';
import { LetterState } from '../../../shared/types';
import { validateGuess, generateResultGrid } from '../../../shared/utils/gameLogic';
import { getWordOfTheDay } from '../../../shared/utils/words';
import { 
  saveGameState, 
  loadGameState, 
  updateWinStatistics, 
  updateLossStatistics 
} from '../../../shared/utils/storage';

export function useGame() {
  // 获取当天的单词
  const answer = getWordOfTheDay();
  const dayNumber = Math.floor((Date.now() - new Date(2022, 0, 1).getTime()) / 86400000);
  
  // 尝试从本地存储加载游戏状态
  const savedState = loadGameState();
  const isSameDay = savedState?.day === dayNumber;
  const isSameAnswer = savedState?.answer === answer;
  
  // 游戏板状态 - 每个方块由 { letter, state } 表示
  const [board, setBoard] = useState<Array<Array<{ letter: string; state: LetterState }>>>(() => {
    // 如果有存储的状态且是今天的答案，使用它
    if (savedState && isSameDay && isSameAnswer) {
      return savedState.board as Array<Array<{ letter: string; state: LetterState }>>;
    }
    
    // 否则创建新游戏
    return Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => ({
        letter: '',
        state: LetterState.INITIAL
      }))
    );
  });

  // 当前激活的行
  const [currentRowIndex, setCurrentRowIndex] = useState(() => 
    (savedState && isSameDay && isSameAnswer) ? savedState.currentRowIndex : 0
  );
  
  // 反馈状态
  const [message, setMessage] = useState('');
  const [grid, setGrid] = useState('');
  const [shakeRowIndex, setShakeRowIndex] = useState(-1);
  const [success, setSuccess] = useState(() => 
    (savedState && isSameDay && isSameAnswer) ? 
      savedState.board.some(row => row.every((tile, i) => tile.letter === answer[i] && tile.state === LetterState.CORRECT)) : 
      false
  );
  const [showMessage, setShowMessage] = useState(false);
  
  // 字母状态用于键盘
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>(() => 
    (savedState && isSameDay && isSameAnswer) ? savedState.letterStates as Record<string, LetterState> : {}
  );

  // 消息显示逻辑
  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 检查URL中的base64编码单词
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.has('') && query.get('') !== null) {
      const encodedAnswer = query.get('') || '';
      try {
        const decoded = atob(encodedAnswer);
        if (decoded.length === 5) {
          localStorage.setItem('answer', decoded);
          window.location.href = window.location.pathname;
        }
      } catch (e) {
        // 无效的base64，忽略
      }
    }
  }, []);

  // 处理键盘输入
  const onKey = useCallback((key: string) => {
    if (currentRowIndex > 5 || success) {
      return;
    }

    // 当前行
    const currentRow = [...board[currentRowIndex]];
    
    // 查找当前行的下一个空位
    const emptyTileIndex = currentRow.findIndex(tile => !tile.letter);
    
    if (key === 'Backspace') {
      // 删除模式
      const lastNonEmptyTileIndex = 
        emptyTileIndex === -1 ? 4 : emptyTileIndex - 1;
      
      if (lastNonEmptyTileIndex >= 0) {
        const newRow = [...currentRow];
        newRow[lastNonEmptyTileIndex] = {
          letter: '',
          state: LetterState.INITIAL
        };
        
        const newBoard = [...board];
        newBoard[currentRowIndex] = newRow;
        setBoard(newBoard);
      }
    } else if (key === 'Enter') {
      // 提交猜测
      if (emptyTileIndex !== -1) {
        setMessage('Not enough letters');
        setShakeRowIndex(currentRowIndex);
        
        setTimeout(() => {
          setShakeRowIndex(-1);
        }, 500);
        
        return;
      }
      
      // 验证猜测
      const { isValidWord, newRow, newLetterStates } = validateGuess(
        currentRow,
        answer,
        letterStates
      );
      
      if (!isValidWord) {
        setMessage('Not in word list');
        setShakeRowIndex(currentRowIndex);
        
        setTimeout(() => {
          setShakeRowIndex(-1);
        }, 500);
        
        return;
      }
      
      // 更新游戏板
      const newBoard = [...board];
      newBoard[currentRowIndex] = newRow;
      setBoard(newBoard);
      
      // 更新键盘字母状态
      setLetterStates(newLetterStates);
      
      // 检查猜测是否正确
      const isCorrect = newRow.every(
        (tile, i) => tile.letter === answer[i]
      );
      
      if (isCorrect) {
        setSuccess(true);
        setTimeout(() => {
          const dayNumber = Math.floor(
            (Date.now() - new Date(2022, 0, 1).getTime()) / 86400000
          );
          setGrid(generateResultGrid(newBoard, currentRowIndex + 1, dayNumber.toString()));
          setMessage('Correct!');
          
          // 记录胜利
          updateWinStatistics(currentRowIndex + 1);
        }, 1600);
      } else if (currentRowIndex >= 5) {
        // 游戏结束
        setTimeout(() => {
          const dayNumber = Math.floor(
            (Date.now() - new Date(2022, 0, 1).getTime()) / 86400000
          );
          setGrid(generateResultGrid(newBoard, currentRowIndex + 1, dayNumber.toString()));
          setMessage(answer.toUpperCase());
          
          // 记录失败
          updateLossStatistics();
        }, 1600);
      } else {
        // 移动到下一行
        setCurrentRowIndex(currentRowIndex + 1);
      }
    } else if (/^[a-zA-Z]$/.test(key) && emptyTileIndex !== -1) {
      // 添加字母
      const newRow = [...currentRow];
      newRow[emptyTileIndex] = {
        letter: key.toLowerCase(),
        state: LetterState.INITIAL
      };
      
      const newBoard = [...board];
      newBoard[currentRowIndex] = newRow;
      setBoard(newBoard);
    }
  }, [currentRowIndex, success, board, answer, letterStates]);

  // 处理剪贴板复制
  const copyGrid = useCallback(() => {
    if (grid) {
      navigator.clipboard.writeText(grid).then(() => {
        setMessage('Copied results to clipboard');
      });
    }
  }, [grid]);

  // 添加键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        onKey('Backspace');
      } else if (e.key === 'Enter') {
        onKey('Enter');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        onKey(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKey]);

  // 保存游戏状态
  useEffect(() => {
    // 仅当状态改变且游戏正在进行时保存
    saveGameState({
      board,
      currentRowIndex,
      letterStates,
      answer,
      day: dayNumber
    });
  }, [board, currentRowIndex, letterStates, answer, dayNumber]);

  return {
    board,
    currentRowIndex,
    shakeRowIndex,
    success,
    message,
    showMessage,
    letterStates,
    grid,
    answer,
    onKey,
    copyGrid
  };
} 