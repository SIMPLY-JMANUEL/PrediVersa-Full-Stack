import React, { useState, useEffect } from 'react';
import './BackToTop.css';
import '../styles/main.css'; // Importar estilos comunes

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar/ocultar botón basado en scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'visible' : 'hidden'}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
      type="button"
    >
      <i className="fas fa-chevron-up"></i>
    </button>
  );
}

export default BackToTop;
