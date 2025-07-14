import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import "../styles/main.css"; // Sistema unificado de estilos

function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section section-fullscreen">
        {/* Fondo de video */}
        <div className="hero-video-container">
          <iframe
            src="https://www.youtube.com/embed/tPdBUTJPgEA?autoplay=1&loop=1&playlist=tPdBUTJPgEA&t=20&mute=1&playsinline=1&controls=0&showinfo=0&autohide=1&allowfullscreen=true&mode=transparent"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="PrediVersa - Plataforma de Prevención de Violencia Escolar"
            className="hero-video-iframe"
          ></iframe>
          <div className="hero-video-overlay"></div>
        </div>

        {/* Contenido principal */}
        <div className="hero-content-wrapper">
          <div className="container">
            <div className={`hero-content ${isVisible ? 'animate-in' : 'animate-out'}`}>
              
              {/* Badge de innovación */}
              <div className="section-badge" style={{background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6'}}>
                Tecnología de Prevención Avanzada
              </div>

              {/* Título principal */}
              <h1 className="hero-title">
                <span className="title-line-1">Transformamos la</span>
                <span className="title-line-2">
                  <span className="title-highlight">Educación</span> con
                </span>
                <span className="title-line-3">
                  <strong className="brand-name">PrediVersa</strong>
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="hero-subtitle">
                Plataforma inteligente de <strong>prevención y análisis predictivo</strong> 
                para crear ambientes educativos seguros, libres de violencia y bullying escolar.
              </p>

              {/* Estadísticas clave */}
              <div className="stats-container">
                <div className="stat-card">
                  <div className="stat-number" data-aos="count-up">95%</div>
                  <div className="stat-label">Efectividad</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number" data-aos="count-up">24/7</div>
                  <div className="stat-label">Monitoreo</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number" data-aos="count-up">50K+</div>
                  <div className="stat-label">Estudiantes</div>
                </div>
              </div>

              {/* Indicadores de confianza */}
              <div className="hero-trust-indicators">
                <div className="trust-item">
                  <span className="trust-text">Avalado por MinEducación</span>
                </div>
                <div className="trust-item">
                  <span className="trust-text">Certificación ISO 27001</span>
                </div>
                <div className="trust-item">
                  <span className="trust-text">Validado por UNESCO</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="hero-actions">
                <Link to="/login" className="btn-inicio">
                  <i className="fas fa-play-circle"></i>
                  Comenzar Demo
                </Link>
                <Link to="/quienes-somos" className="btn-regresar">
                  <i className="fas fa-info-circle"></i>
                  Más Información
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator">
          <div className="scroll-line"></div>
          <span className="scroll-text">Descubre más</span>
        </div>

      </section>
  );
}

export default Hero;