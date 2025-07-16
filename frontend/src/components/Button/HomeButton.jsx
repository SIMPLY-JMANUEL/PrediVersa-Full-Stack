import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

const HomeButton = ({
  size = 'medium',
  variant = 'primary',
  label = 'Inicio',
}) => {
  const handleClick = () => {
    // Pequeño delay para asegurar que la navegación se complete
    window.setTimeout(() => {
      const heroElement =
        document.querySelector('#hero') || document.querySelector('.hero');
      if (heroElement) {
        heroElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        // Si no encuentra el hero, scroll al top
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  return (
    <Link
      to="/"
      className={`${styles.baseButton} ${styles[variant]} ${styles[size]}`}
      aria-label="Ir a inicio"
      onClick={handleClick}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginRight: '0.5em' }}
      >
        <path
          d="M10 20v-6h4v6a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V12h1a1 1 0 0 0 .7-1.7l-9-8a1 1 0 0 0-1.4 0l-9 8A1 1 0 0 0 3 12h1v8a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2z"
          fill="currentColor"
        />
      </svg>
      {label}
    </Link>
  );
};

export default HomeButton;
