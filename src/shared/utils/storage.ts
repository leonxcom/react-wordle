// 游戏状态存储工具

const GAME_STATE_KEY = 'react-dle-game-state';
const STATISTICS_KEY = 'react-dle-statistics';
const LAST_PLAYED_KEY = 'react-dle-last-played';

interface GameState {
  board: Array<Array<{ letter: string; state: number | string }>>;
  currentRowIndex: number;
  letterStates: Record<string, number | string>;
  answer: string;
  day: number;
}

interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastWin: number | null;
}

// 保存游戏状态
export function saveGameState(state: GameState): void {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  localStorage.setItem(LAST_PLAYED_KEY, Date.now().toString());
}

// 加载游戏状态
export function loadGameState(): GameState | null {
  const state = localStorage.getItem(GAME_STATE_KEY);
  const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
  
  if (state && lastPlayed) {
    // 检查是否是今天
    const today = new Date();
    const lastPlayedDate = new Date(parseInt(lastPlayed, 10));
    
    if (today.toDateString() === lastPlayedDate.toDateString()) {
      return JSON.parse(state);
    }
  }
  
  return null;
}

// 保存统计信息
export function saveStatistics(stats: Statistics): void {
  localStorage.setItem(STATISTICS_KEY, JSON.stringify(stats));
}

// 加载统计信息
export function loadStatistics(): Statistics {
  const stats = localStorage.getItem(STATISTICS_KEY);
  
  if (stats) {
    return JSON.parse(stats);
  }
  
  // 返回默认统计信息
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastWin: null
  };
}

// 更新获胜统计
export function updateWinStatistics(attempts: number): void {
  const stats = loadStatistics();
  const today = Date.now();
  
  // 检查是否有上一次获胜，判断连胜
  if (stats.lastWin) {
    // 如果上次获胜是昨天或更早，且相差不超过1天，则连胜+1
    const lastWinDate = new Date(stats.lastWin);
    const todayDate = new Date(today);
    
    // 重置时间部分，只比较日期
    lastWinDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    
    const dayDiff = Math.floor((todayDate.getTime() - lastWinDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      stats.currentStreak += 1;
    } else if (dayDiff > 1) {
      stats.currentStreak = 1;
    }
  } else {
    stats.currentStreak = 1;
  }
  
  // 更新最大连胜
  stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  
  // 更新游戏总数和胜利总数
  stats.gamesPlayed += 1;
  stats.gamesWon += 1;
  
  // 更新猜词回合统计
  stats.guessDistribution[attempts - 1] += 1;
  
  // 记录今天的时间戳
  stats.lastWin = today;
  
  saveStatistics(stats);
}

// 更新失败统计
export function updateLossStatistics(): void {
  const stats = loadStatistics();
  
  // 增加游戏场次
  stats.gamesPlayed += 1;
  
  // 重置连胜
  stats.currentStreak = 0;
  
  saveStatistics(stats);
} 