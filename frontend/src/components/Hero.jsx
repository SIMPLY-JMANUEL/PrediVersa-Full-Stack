import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import '../styles/main.css';
import fondo11 from '../assets/img/fondo11.png';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = window.setTimeout(() => setIsVisible(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section modern-hero" id="hero">
      {/* FONDO CON IMAGEN OPTIMIZADA */}
      <div
        className="bg-image"
        style={{ backgroundImage: `url(${fondo11})` }}
      />
      <div className="hero-video-overlay" />

      {/* Contenido principal */}
      <div className="hero-content-wrapper">
        <div className="container">
          <div
            className={`hero-content ${isVisible ? 'animate-fade-in-up' : ''}`}
          >
            {/* Badge de innovación */}
            <div className="hero-badge">
              <i className="badge-icon fas fa-shield-alt" />
              Plataforma de Prevención Educativa
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
              Plataforma inteligente de{' '}
              <strong>prevención y análisis predictivo</strong>
              para crear ambientes educativos seguros, libres de violencia y
              bullying escolar.
            </p>

            {/* Estadísticas clave */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">85%</div>
                <div className="stat-label">Reducción de Incidentes</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Monitoreo Continuo</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Estudiantes Protegidos</div>
              </div>
            </div>

            {/* Indicadores de confianza */}
            <div className="hero-trust-indicators">
              <div className="trust-item">
                <i className="fas fa-check-circle" />
                <span className="trust-text">Tecnología Validada</span>
              </div>
              <div className="trust-item">
                <i className="fas fa-shield-alt" />
                <span className="trust-text">Datos Protegidos</span>
              </div>
              <div className="trust-item">
                <i className="fas fa-graduation-cap" />
                <span className="trust-text">Enfoque Educativo</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="hero-cta-group">
              <Link to="/login" className="hero-cta-primary">
                <i className="fas fa-play-circle" />
                Comenzar Demo
              </Link>
              <Link to="/contact" className="hero-cta-secondary">
                <i className="fas fa-info-circle" />
                Más Información
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ACCIONES ADICIONALES */}
      <div className="hero-additional-info">
        <p className="hero-external-info">
          <strong>¿Listo para crear un ambiente educativo más seguro?</strong>
          <br />
          Solicita una demo personalizada y descubre cómo PrediVersa puede
          transformar tu institución.
        </p>
      </div>
    </section>
  );
};

export default Hero;
