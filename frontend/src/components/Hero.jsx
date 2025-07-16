import React from 'react';
import './Hero.css';
import Button from './Button/Button';
import fondo11 from '../assets/img/fondo11.png';

const Hero = () => {
  return (
    <section
      className="section-standard bg-gradient hero-section full-width-section"
      id="hero"
    >
      {/* FONDO CON IMAGEN OPTIMIZADA */}
      <div
        className="bg-image full-width-section"
        style={{ backgroundImage: `url(${fondo11})` }}
      />
      <div className="bg-overlay full-width-section" />

      {/* CONTENEDOR ESTÁNDAR */}
      <div className="container-standard">
        {/* HEADER DE SECCIÓN */}
        <div className="section-header">
          <h1 className="title-standard hero-title">
            Transformamos la Educación con{' '}
            <span className="title-accent">PrediVersa</span>
          </h1>
          <div className="hero-content-block">
            <p className="subtitle-standard">
              Tecnología de prevención avanzada para crear ambientes escolares
              seguros y libres de violencia
            </p>
          </div>
          <div className="hero-content-block">
            <p className="description-standard">
              PrediVersa es una plataforma inteligente que combina inteligencia
              artificial y análisis de datos para identificar riesgos de
              violencia escolar antes de que ocurran.
            </p>
          </div>
        </div>
        {/* ACCIONES CON BOTÓN OPTIMIZADO */}
        <div className="section-actions text-center">
          <Button
            variant="primary"
            size="large"
            className="hero-cta-button"
            onClick={() => {
              // Aquí iría la lógica de navegación o modal
            }}
          >
            <i className="icon-play" />
            Empieza a prevenir hoy
          </Button>
          <p className="hero-external-info">
            <strong>Solicita una demo gratuita</strong> o conoce cómo PrediVersa
            puede transformar tu institución.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
