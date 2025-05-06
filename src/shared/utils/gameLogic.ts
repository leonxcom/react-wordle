import { LetterState } from '../types';
import { allWords } from './words';

interface Tile {
  letter: string;
  state: LetterState;
}

/**
 * Validates a guess against the answer
 * @param guess The player's guess
 * @param answer The correct word
 * @returns Object containing validity and the new states for the tiles
 */
export function validateGuess(
  currentRow: Tile[], 
  answer: string,
  letterStates: Record<string, LetterState>
): {
  isValidWord: boolean;
  newRow: Tile[];
  newLetterStates: Record<string, LetterState>;
} {
  const guess = currentRow.map(tile => tile.letter).join('');
  
  // Check if word is in dictionary
  if (!allWords.includes(guess) && guess !== answer) {
    return {
      isValidWord: false,
      newRow: currentRow,
      newLetterStates: letterStates
    };
  }

  const answerLetters: (string | null)[] = answer.split('');
  const states: LetterState[] = Array(5).fill(LetterState.ABSENT);
  const newLetterStates = { ...letterStates };

  // First pass: check for correct positions
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      states[i] = LetterState.CORRECT;
      answerLetters[i] = null; // Mark as matched
      newLetterStates[guess[i]] = LetterState.CORRECT;
    }
  }

  // Second pass: check for present letters
  for (let i = 0; i < 5; i++) {
    if (states[i] === LetterState.CORRECT) continue; // Skip already correct
    
    const guessLetter = guess[i];
    const index = answerLetters.indexOf(guessLetter);
    
    if (index !== -1) {
      states[i] = LetterState.PRESENT;
      answerLetters[index] = null; // Mark as matched
      if (newLetterStates[guessLetter] !== LetterState.CORRECT) {
        newLetterStates[guessLetter] = LetterState.PRESENT;
      }
    } else {
      if (!newLetterStates[guessLetter]) {
        newLetterStates[guessLetter] = LetterState.ABSENT;
      }
    }
  }

  const newRow = currentRow.map((tile, i) => ({
    letter: tile.letter,
    state: states[i]
  }));

  return {
    isValidWord: true,
    newRow,
    newLetterStates,
  };
}

/**
 * Generates a shareable result grid from the game board
 */
export function generateResultGrid(
  board: Tile[][],
  currentRowIndex: number,
  dayString: string
): string {
  const rows = board.slice(0, currentRowIndex).map(row => {
    return row.map(tile => {
      switch (tile.state) {
        case LetterState.CORRECT:
          return '🟩';
        case LetterState.PRESENT:
          return '🟨';
        default:
          return '⬛';
      }
    }).join('');
  });

  let result = `React-dle ${dayString} ${
    currentRowIndex > 6 ? 'X' : currentRowIndex
  }/6\n\n`;
  
  result += rows.join('\n');
  
  return result;
} 