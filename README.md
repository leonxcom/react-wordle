# React-dle

A word guessing game built with React, inspired by Wordle. This is a fun project focused on delivering a smooth user experience with clean code.

## About

React-dle is a daily word game where players have 6 attempts to guess a 5-letter word. After each guess, the game provides color-coded feedback:
- 🟩 Green: Correct letter in the right position
- 🟨 Yellow: Correct letter in the wrong position
- ⬛ Gray: Letter not in the word

This project was originally converted from [Vue Wordle](https://github.com/yyx990803/vue-wordle) with several added features and optimizations:
- Light/dark theme support with system preference detection
- Game state persistence in localStorage
- Complete statistics tracking
- Game result sharing
- Responsive design for desktop and mobile devices

## Installation & Usage

1. Clone the repository
   ```
   git clone https://github.com/your-username/react-dle.git
   cd react-dle
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run development server
   ```
   pnpm run dev
   ```

4. Build for production
   ```
   pnpm run build
   ```

## Custom Words

You can create your own word puzzle and share it with friends by base64-encoding a word and including it as the URL query parameter:
```
https://your-deployed-site.com/?YmxpbXA=
```

This method also allows using words that aren't in the default dictionary.

## Project Structure

The project uses a feature-based organization rather than organizing by technical type:

```
src/
├── features/          # Feature-based components
│   ├── game/          # Core game functionality
│   │   ├── components/  # Game-related components
│   │   │   ├── Board.tsx     # Game board component
│   │   │   ├── Tile.tsx      # Individual tile component
│   │   │   ├── ThemeToggle.tsx  # Theme toggle component
│   │   │   └── StatsModal.tsx   # Statistics modal component
│   │   ├── hooks/      # Game-related hooks
│   │   │   └── useGame.ts     # Game logic hook
│   │   └── Game.tsx    # Main game component
│   └── keyboard/       # Keyboard module
│       └── components/
│           └── Keyboard.tsx  # Keyboard component
├── shared/           # Shared resources
│   ├── data/         # Data files
│   │   ├── answerWords.ts    # Answer word list
│   │   └── allowedWords.ts   # Allowed guess word list
│   ├── types/        # Type definitions
│   │   └── index.ts          # Shared types
│   └── utils/        # Utility functions
│       ├── gameLogic.ts      # Game logic
│       ├── storage.ts        # Storage utilities
│       └── words.ts          # Word processing
└── styles/           # Style files
    ├── game.css      # Game styles
    └── index.css     # Main style entry point
```

## Future Improvements

1. Add internationalization support
2. Implement difficulty modes
3. Add word hint functionality
4. Optimize mobile experience
5. Add more statistical visualizations

## License

MIT