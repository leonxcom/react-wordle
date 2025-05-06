import React, { useState, useEffect } from 'react';

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === Theme.LIGHT || savedTheme === Theme.DARK) {
      return savedTheme as Theme;
    }
    return Theme.AUTO;
  });
  
  // Apply theme to document
  const applyTheme = (newTheme: string) => {
    document.body.classList.remove(Theme.LIGHT, Theme.DARK);
    document.body.classList.add(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };
  
  // Apply theme
  useEffect(() => {
    if (theme === Theme.AUTO) {
      localStorage.removeItem('theme');
      document.body.removeAttribute('data-theme');
      
      // Immediately apply system theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? Theme.DARK : Theme.LIGHT);
    } else {
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    }
    
    // Log current theme for debugging
    console.log('Current theme:', theme);
  }, [theme]);
  
  // Handle auto theme
  useEffect(() => {
    if (theme !== Theme.AUTO) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyAutoTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const autoTheme = e.matches ? Theme.DARK : Theme.LIGHT;
      applyTheme(autoTheme);
      console.log('Auto theme changed to:', autoTheme);
    };
    
    // Set up listener
    mediaQuery.addEventListener('change', applyAutoTheme);
    
    return () => {
      mediaQuery.removeEventListener('change', applyAutoTheme);
    };
  }, [theme]);
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === Theme.LIGHT 
      ? Theme.DARK 
      : theme === Theme.DARK 
        ? Theme.AUTO 
        : Theme.LIGHT;
    
    setTheme(newTheme);
    console.log('Toggled theme to:', newTheme);
  };
  
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Current theme: ${theme === Theme.AUTO ? 'Auto' : theme === Theme.LIGHT ? 'Light' : 'Dark'}`}
    >
      {theme === Theme.LIGHT && '☀️'}
      {theme === Theme.DARK && '🌙'}
      {theme === Theme.AUTO && '🖥️'}
    </button>
  );
};

export default ThemeToggle;