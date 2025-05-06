import React, { useState } from 'react';
import Board from './components/Board';
import Keyboard from '../../features/keyboard/components/Keyboard';
import { useGame } from './hooks/useGame';
import ThemeToggle from './components/ThemeToggle';
import StatsModal from './components/StatsModal';

const Game: React.FC = () => {
  const {
    board,
    currentRowIndex,
    shakeRowIndex,
    success,
    message,
    showMessage,
    letterStates,
    answer,
    onKey,
    copyGrid,
    grid
  } = useGame();

  const [showStats, setShowStats] = useState(false);
  const dayNumber = Math.floor((Date.now() - new Date(2022, 0, 1).getTime()) / 86400000);

  // 自动显示统计数据（游戏结束时）
  React.useEffect(() => {
    if ((success || currentRowIndex > 5) && grid) {
      const timer = setTimeout(() => {
        setShowStats(true);
      }, 2500); // 等待动画完成
      
      return () => clearTimeout(timer);
    }
  }, [success, currentRowIndex, grid]);

  // 显示统计数据
  const openStats = () => {
    setShowStats(true);
  };

  return (
    <div>
      <header>
        <h1>React-dle</h1>
        <div className="header-right">
          <ThemeToggle />
          <button 
            className="stats-button" 
            onClick={openStats}
            aria-label="显示统计数据"
          >
            📊
          </button>
          <a
            id="source-link"
            href="https://github.com/react-wordle/react-dle"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </div>
      </header>
      
      <main>
        <div 
          className="game-status" 
          aria-live="polite" 
          role="status"
          style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}
        >
          {success ? '恭喜你猜对了!' : currentRowIndex > 5 ? '游戏结束，正确答案是 ' + answer.toUpperCase() : `第 ${currentRowIndex + 1} 行，共 6 行`}
        </div>
        
        <Board 
          board={board}
          currentRowIndex={currentRowIndex}
          shakeRowIndex={shakeRowIndex}
          success={success}
        />
        
        <Keyboard letterStates={letterStates} onKey={onKey} />
        
        <div className={`message ${showMessage ? '' : 'hidden'}`} onClick={copyGrid} role="alert">
          {message}
        </div>

        <StatsModal 
          isOpen={showStats} 
          onClose={() => setShowStats(false)}
          dayNumber={dayNumber}
          gameResult={grid}
        />
      </main>
    </div>
  );
};

export default Game; 