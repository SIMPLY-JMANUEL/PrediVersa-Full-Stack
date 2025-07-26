import React from 'react';
import './Features.css';
import Button from './Button/Button';
import { FaBrain, FaShieldAlt, FaChartBar, FaLock } from 'react-icons/fa';
import F4 from '../assets/img/F4.png';

const FEATURES = [
  {
    icon: <FaBrain aria-hidden="true" />,
    iconClass: 'icon-blue',
    title: 'Análisis Predictivo Inteligente',
    description:
      'Tecnología avanzada de IA que analiza patrones de comportamiento en tiempo real para identificar situaciones de riesgo antes de que ocurran.',
    statNumber: '95%',
    statLabel: 'Precisión',
  },
  {
    icon: <FaShieldAlt aria-hidden="true" />,
    iconClass: 'icon-orange',
    title: 'Prevención Integral 360°',
    description:
      'Sistema completo de monitoreo y prevención que opera las 24 horas para garantizar un ambiente escolar seguro y protegido.',
    statNumber: '24/7',
    statLabel: 'Operación',
  },
  {
    icon: <FaChartBar aria-hidden="true" />,
    iconClass: 'icon-purple',
    title: 'Dashboard Intuitivo',
    description:
      'Interfaz moderna y fácil de usar que proporciona visualizaciones claras y reportes detallados para la toma de decisiones.',
    statNumber: '500+',
    statLabel: 'Métricas',
  },
  {
    icon: <FaLock aria-hidden="true" />,
    iconClass: 'icon-yellow',
    title: 'Seguridad y Privacidad',
    description:
      'Protección de datos de nivel empresarial con encriptación avanzada y cumplimiento de estándares internacionales de seguridad.',
    statNumber: 'ISO',
    statLabel: '27001',
  },
];

const Features = () => {
  return (
    <section
      className="features-hero"
      aria-labelledby="features-title"
      role="region"
    >
      {/* Imagen de fondo */}
      <div className="features-background-image">
        <img src={F4} alt="Fondo PrediVersa" className="background-img" />
      </div>

      <div className="features-container">
        {/* Columna Izquierda */}
        <div className="features-text">
          <h1 className="features-title" id="features-title">
            Transformamos la Educación con{' '}
            <span className="title-accent">PrediVersa</span>
          </h1>
          <h2 className="features-subtitle">
            Tecnología de prevención avanzada para crear ambientes escolares
            seguros y libres de violencia
          </h2>
          <p className="features-description">
            PrediVersa es una plataforma inteligente que combina inteligencia
            artificial y análisis de datos para identificar riesgos de violencia
            escolar antes de que ocurran. Nuestra tecnología permite implementar
            intervenciones preventivas efectivas.
          </p>
          <Button
            variant="outline"
            size="medium"
            className="btn-learn"
            aria-label="Empieza a prevenir hoy con PrediVersa"
          >
            Empieza a prevenir hoy
          </Button>
        </div>

        {/* Columna Derecha: Features dinámicas */}
        <div className="features-grid" role="list">
          {FEATURES.map(feature => (
            <article
              className="feature-card"
              tabIndex={0}
              role="listitem"
              aria-label={feature.title}
              key={feature.title}
            >
              <div className={`icon ${feature.iconClass}`}>{feature.icon}</div>
              <h2 className="feature-title">{feature.title}</h2>
              <p className="card-description">{feature.description}</p>
              <div className="card-stats">
                <span className="stat-number">{feature.statNumber}</span>
                <span className="stat-label">{feature.statLabel}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
