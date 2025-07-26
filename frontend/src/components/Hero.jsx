import React, { useState, useEffect } from 'react';
import './Hero.css';
import '../styles/main.css';
import F2 from '../assets/img/F2.png';

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
      <div className="bg-image" style={{ backgroundImage: `url(${F2})` }} />

      {/* Contenido principal */}
      <div className="hero-content-wrapper">
        <div
          className={`hero-content ${isVisible ? 'animate-fade-in-up' : ''}`}
        >
          {/* Tarjeta contenedora profesional */}
          <div className="hero-content-card">
            {/* Badge de innovación superior */}
            <div className="hero-innovation-badge">
              <i className="badge-icon fas fa-shield-alt" />
              <span>Solución Tecnológica Empresarial</span>
            </div>

            {/* Título principal */}
            <h1 className="hero-title">
              Plataforma Inteligente para la
              <span className="title-highlight"> Prevención Escolar</span>
            </h1>

            {/* Subtítulo */}
            <h2 className="hero-subtitle">
              <strong className="brand-name">PrediVersa:</strong> Anticipamos el
              riesgo, protegemos el futuro
            </h2>

            {/* Párrafo introductorio */}
            <div className="hero-intro">
              <p className="intro-text">
                En <strong>PrediVersa</strong> transformamos la forma en que las
                instituciones educativas enfrentan la violencia escolar, el
                bullying y los riesgos psicosociales. Nuestra plataforma
                predictiva analiza datos reales en tiempo real para detectar
                señales tempranas de riesgo, emitir alertas automáticas y guiar
                acciones efectivas antes, durante y después de los hechos.
              </p>
            </div>

            {/* Beneficios empresariales */}
            <div className="hero-benefits">
              <ul className="benefits-list">
                <li className="benefit-item">
                  <i className="fas fa-search" />
                  <span>Detección temprana de factores de riesgo</span>
                </li>
                <li className="benefit-item">
                  <i className="fas fa-exclamation-triangle" />
                  <span>Alertas inteligentes con perfil de criticidad</span>
                </li>
                <li className="benefit-item">
                  <i className="fas fa-route" />
                  <span>Rutas institucionales de atención y seguimiento</span>
                </li>
              </ul>
            </div>

            {/* Frase de valor institucional */}
            <div className="hero-value-proposition">
              <p className="value-text">
                <strong>
                  Más que tecnología: somos una herramienta para transformar
                  culturas escolares.
                </strong>
              </p>
            </div>

            {/* Llamada a la acción */}
            <div className="hero-cta-section">
              <h3 className="cta-title">
                ¿Listo para crear un ambiente educativo más seguro?
              </h3>
              <p className="cta-description">
                Solicita una demo personalizada y descubre cómo PrediVersa puede
                transformar tu institución.
              </p>
              <div className="cta-actions">
                <button className="primary-cta-button">
                  <i className="fas fa-play-circle"></i>
                  Solicitar Demo
                </button>
                <button className="secondary-cta-button">
                  <i className="fas fa-info-circle"></i>
                  Más Información
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
