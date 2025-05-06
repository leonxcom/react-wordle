import React from 'react';
import { LetterState } from '../../../shared/types';

interface TileProps {
  letter: string;
  state: LetterState;
  index: number;
  position: string;
}

const Tile: React.FC<TileProps> = ({ letter, state, index, position }) => {
  const [row, col] = position.split('-').map(Number);
  
  return (
    <div
      className={`tile ${letter ? 'filled' : ''} ${state ? 'revealed' : ''}`}
      role="gridcell"
      aria-label={letter ? `字母 ${letter}，位置 ${row + 1}行 ${col + 1}列，状态 ${
        state === LetterState.CORRECT ? '正确' : 
        state === LetterState.PRESENT ? '位置不对' : 
        state === LetterState.ABSENT ? '不在单词中' : '未提交'
      }` : `空格，位置 ${row + 1}行 ${col + 1}列`}
      aria-rowindex={row + 1}
      aria-colindex={col + 1}
    >
      <div 
        className="front" 
        style={{ transitionDelay: `${index * 300}ms` }}
      >
        {letter}
      </div>
      <div 
        className={`back ${state}`}
        style={{ transitionDelay: `${index * 300}ms` }}
      >
        {letter}
      </div>
    </div>
  );
};

export default Tile; 