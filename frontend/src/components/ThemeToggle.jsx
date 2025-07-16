import React, { useState, useEffect } from 'react';
import '../styles/main.css'; // Sistema CSS unificado

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Detectar preferencia del sistema
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Aplicar clase al body
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  useEffect(() => {
    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = e => setIsDark(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn-icon btn-icon-circle theme-toggle"
      aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
      title={`Tema ${isDark ? 'claro' : 'oscuro'}`}
      data-theme={isDark ? 'dark' : 'light'}
    >
      <span className={`icon-theme ${isDark ? 'icon-sun' : 'icon-moon'}`}>
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;
