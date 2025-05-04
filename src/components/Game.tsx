import React, { useState, useEffect, useMemo } from 'react';
import { getWordOfTheDay, allWords } from '../words';
import Keyboard from './Keyboard';
import { LetterState } from '../types';
import '../game.css';

// 定义接口
interface Tile {
  letter: string;
  state: LetterState;
}

const Game: React.FC = () => {
  // 获取每日单词
  const answer = useMemo(() => getWordOfTheDay(), []);

  // 棋盘状态 - 每个格子由 { letter, state } 表示
  const [board, setBoard] = useState<Tile[][]>(
    Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => ({
        letter: '',
        state: LetterState.INITIAL
      }))
    )
  );

  // 当前活跃行
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  
  // 反馈状态
  const [message, setMessage] = useState('');
  const [grid, setGrid] = useState('');
  const [shakeRowIndex, setShakeRowIndex] = useState(-1);
  const [success, setSuccess] = useState(false);
  
  // 跟踪已揭示的字母状态，用于虚拟键盘
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});
  
  // 处理输入控制
  const [allowInput, setAllowInput] = useState(true);
  
  // 当前行的计算属性
  const currentRow = useMemo(() => board[currentRowIndex], [board, currentRowIndex]);

  // 处理键盘输入
  const onKeyup = (e: KeyboardEvent) => onKey(e.key);

  useEffect(() => {
    window.addEventListener('keyup', onKeyup);
    return () => {
      window.removeEventListener('keyup', onKeyup);
    };
  }, [allowInput, currentRowIndex, board]);

  // 响应来自键盘或屏幕键盘的按键
  function onKey(key: string) {
    if (!allowInput) return;
    if (/^[a-zA-Z]$/.test(key)) {
      fillTile(key.toLowerCase());
    } else if (key === 'Backspace') {
      clearTile();
    } else if (key === 'Enter') {
      completeRow();
    }
  }

  function fillTile(letter: string) {
    const newBoard = [...board];
    for (let i = 0; i < currentRow.length; i++) {
      if (!currentRow[i].letter) {
        newBoard[currentRowIndex][i].letter = letter;
        setBoard(newBoard);
        break;
      }
    }
  }

  function clearTile() {
    const newBoard = [...board];
    for (let i = currentRow.length - 1; i >= 0; i--) {
      if (currentRow[i].letter) {
        newBoard[currentRowIndex][i].letter = '';
        setBoard(newBoard);
        break;
      }
    }
  }

  function completeRow() {
    if (currentRow.every((tile) => tile.letter)) {
      const guess = currentRow.map((tile) => tile.letter).join('');
      if (!allWords.includes(guess) && guess !== answer) {
        shake();
        showMessage('Not in word list');
        return;
      }

      const answerLetters: (string | null)[] = answer.split('');
      const newBoard = [...board];
      const newLetterStates = { ...letterStates };
      
      // 第一遍: 标记正确的字母
      currentRow.forEach((tile, i) => {
        if (answerLetters[i] === tile.letter) {
          newBoard[currentRowIndex][i].state = newLetterStates[tile.letter] = LetterState.CORRECT;
          answerLetters[i] = null;
        }
      });
      
      // 第二遍: 标记存在但位置不对的字母
      currentRow.forEach((tile, i) => {
        if (!newBoard[currentRowIndex][i].state && answerLetters.includes(tile.letter)) {
          newBoard[currentRowIndex][i].state = LetterState.PRESENT;
          answerLetters[answerLetters.indexOf(tile.letter)] = null;
          if (!newLetterStates[tile.letter]) {
            newLetterStates[tile.letter] = LetterState.PRESENT;
          }
        }
      });
      
      // 第三遍: 标记不存在的字母
      currentRow.forEach((tile, i) => {
        if (!newBoard[currentRowIndex][i].state) {
          newBoard[currentRowIndex][i].state = LetterState.ABSENT;
          if (!newLetterStates[tile.letter]) {
            newLetterStates[tile.letter] = LetterState.ABSENT;
          }
        }
      });

      setBoard(newBoard);
      setLetterStates(newLetterStates);
      setAllowInput(false);

      if (newBoard[currentRowIndex].every((tile) => tile.state === LetterState.CORRECT)) {
        // 猜对了!
        setTimeout(() => {
          const resultGrid = genResultGrid();
          setGrid(resultGrid);
          showMessage(
            ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'][
              currentRowIndex
            ],
            -1
          );
          setSuccess(true);
        }, 1600);
      } else if (currentRowIndex < board.length - 1) {
        // 转到下一行
        setTimeout(() => {
          setCurrentRowIndex(currentRowIndex + 1);
          setAllowInput(true);
        }, 1600);
      } else {
        // 游戏结束
        setTimeout(() => {
          showMessage(answer.toUpperCase(), -1);
        }, 1600);
      }
    } else {
      shake();
      showMessage('Not enough letters');
    }
  }

  function showMessage(msg: string, time = 1000) {
    setMessage(msg);
    if (time > 0) {
      setTimeout(() => {
        setMessage('');
      }, time);
    }
  }

  function shake() {
    setShakeRowIndex(currentRowIndex);
    setTimeout(() => {
      setShakeRowIndex(-1);
    }, 1000);
  }

  const icons = {
    [LetterState.CORRECT]: '🟩',
    [LetterState.PRESENT]: '🟨',
    [LetterState.ABSENT]: '⬜',
    [LetterState.INITIAL]: null
  };

  function genResultGrid() {
    return board
      .slice(0, currentRowIndex + 1)
      .map((row) => {
        return row.map((tile) => icons[tile.state]).join('');
      })
      .join('\n');
  }

  // 在窗口调整大小时调整面板大小
  function onResize() {
    // 在移动设备上获取实际的vh
    document.body.style.setProperty('--vh', window.innerHeight + 'px');
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    // 启动时设置大小
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      {message && (
        <div className="message">
          {message}
          {grid && <pre>{grid}</pre>}
        </div>
      )}
      <header>
        <h1>WORDLE</h1>
        <a
          id="source-link"
          href="https://github.com/yyx990803/vue-wordle"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </header>
      <div id="board">
        {board.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`row ${shakeRowIndex === rowIndex ? 'shake' : ''} ${
              success && currentRowIndex === rowIndex ? 'jump' : ''
            }`}
          >
            {row.map((tile, tileIndex) => (
              <div
                key={tileIndex}
                className={`tile ${tile.letter ? 'filled' : ''} ${tile.state ? 'revealed' : ''}`}
              >
                <div 
                  className="front" 
                  style={{ transitionDelay: `${tileIndex * 300}ms` }}
                >
                  {tile.letter}
                </div>
                <div
                  className={`back ${tile.state || ''}`}
                  style={{
                    transitionDelay: `${tileIndex * 300}ms`,
                    animationDelay: `${tileIndex * 100}ms`
                  }}
                >
                  {tile.letter}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Keyboard letterStates={letterStates} onKey={onKey} />
    </>
  );
};

export default Game; 