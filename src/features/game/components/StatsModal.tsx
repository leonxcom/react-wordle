import React from 'react';
import { loadStatistics } from '../../../shared/utils/storage';
import CountdownTimer from './CountdownTimer';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  gameResult?: string; // 添加游戏结果，用于分享
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, dayNumber, gameResult }) => {
  const stats = loadStatistics();
  
  if (!isOpen) return null;
  
  const winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
  
  // 找出最高的猜词回合统计数字，用于计算图表比例
  const maxDistribution = Math.max(...stats.guessDistribution, 1);
  
  // 处理分享按钮点击
  const handleShare = () => {
    if (!gameResult) return;
    
    // 构建分享文本
    const shareText = `React-dle ${dayNumber} ${stats.gamesWon}/${stats.gamesPlayed}\n\n${gameResult}`;
    
    // 尝试使用Web Share API
    if (navigator.share) {
      navigator.share({
        title: 'React-dle 游戏结果',
        text: shareText
      }).catch(error => {
        console.error('分享失败:', error);
        // 失败时回退到剪贴板
        copyToClipboard(shareText);
      });
    } else {
      // 不支持 Web Share API，使用剪贴板
      copyToClipboard(shareText);
    }
  };
  
  // 复制到剪贴板并显示提示
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('已复制结果到剪贴板');
      })
      .catch(err => {
        console.error('无法复制到剪贴板:', err);
        alert('无法复制到剪贴板。请手动复制以下内容:\n\n' + text);
      });
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h3>统计</h3>
        
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{stats.gamesPlayed}</div>
            <div className="stat-label">进行</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{winPercentage}</div>
            <div className="stat-label">胜率%</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.currentStreak}</div>
            <div className="stat-label">当前连胜</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.maxStreak}</div>
            <div className="stat-label">最大连胜</div>
          </div>
        </div>
        
        <h4>猜词回合统计</h4>
        <div className="guess-distribution">
          {stats.guessDistribution.map((count, index) => (
            <div className="guess-row" key={index}>
              <div className="guess-number">{index + 1}</div>
              <div className="guess-bar-container">
                <div 
                  className="guess-bar" 
                  style={{
                    width: `${Math.max((count / maxDistribution) * 100, 7)}%`,
                    backgroundColor: index + 1 === dayNumber ? 'var(--correct-color)' : 'var(--key-bg)'
                  }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="countdown-section">
          <h4>下一个React-dle</h4>
          <CountdownTimer />
          <div className="share-section">
            <button 
              className="share-button" 
              onClick={handleShare}
              disabled={!gameResult}
            >
              分享
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal; 