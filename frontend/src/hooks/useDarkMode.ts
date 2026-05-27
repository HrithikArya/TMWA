import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('tf_theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
    localStorage.setItem('tf_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  return { isDark, toggleDarkMode };
};
