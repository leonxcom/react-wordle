import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // 计算到明天午夜的时间
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const difference = tomorrow.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // 立即计算一次
    calculateTimeLeft();
    
    // 设置每秒更新一次
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // 清理
    return () => clearInterval(timer);
  }, []);

  // 格式化数字为两位数
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="countdown-timer">
      <div className="countdown-timer-box">
        <div className="timer-value">{formatNumber(timeLeft.hours)}</div>
        <div className="timer-label">小时</div>
      </div>
      <div className="countdown-timer-box">
        <div className="timer-value">{formatNumber(timeLeft.minutes)}</div>
        <div className="timer-label">分钟</div>
      </div>
      <div className="countdown-timer-box">
        <div className="timer-value">{formatNumber(timeLeft.seconds)}</div>
        <div className="timer-label">秒</div>
      </div>
    </div>
  );
};

export default CountdownTimer; 