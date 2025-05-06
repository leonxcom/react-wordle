import React from 'react';
import { LetterState } from '../../../shared/types';
import Tile from './Tile';

interface BoardProps {
  board: Array<Array<{ letter: string; state: LetterState }>>;
  currentRowIndex: number;
  shakeRowIndex: number;
  success: boolean;
}

const Board: React.FC<BoardProps> = ({ 
  board, 
  currentRowIndex, 
  shakeRowIndex, 
  success
}) => {
  return (
    <div id="board" role="grid" aria-label="React-dle游戏板">
      {board.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`row ${shakeRowIndex === rowIndex ? 'shake' : ''} ${
            success && currentRowIndex === rowIndex ? 'jump' : ''
          }`}
          role="row"
          aria-rowindex={rowIndex + 1}
          aria-current={currentRowIndex === rowIndex ? 'true' : 'false'}
        >
          {row.map((tile, tileIndex) => (
            <Tile 
              key={tileIndex} 
              letter={tile.letter} 
              state={tile.state} 
              index={tileIndex} 
              position={`${rowIndex}-${tileIndex}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board; 