import React, { useState, useEffect } from "react";
import "./Preloader.css";
import "../styles/main.css"; // Sistema unificado de estilos

function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simular progreso de carga
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!loading) {
    return null;
  }

  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="preloader-logo">
          <div className="logo-animation">
            <span className="logo-text">PrediVersa</span>
            <div className="logo-underline"></div>
          </div>
        </div>
        
        <div className="loading-bar">
          <div 
            className="loading-progress" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="loading-text">
          <span className="loading-percentage">{Math.round(progress)}%</span>
          <span className="loading-message">Cargando experiencia...</span>
        </div>
        
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Preloader;