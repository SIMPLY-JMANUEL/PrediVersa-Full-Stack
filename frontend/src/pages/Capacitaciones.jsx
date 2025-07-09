import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Capacitaciones.css';

function Capacitaciones() {
  const [expandedCard, setExpandedCard] = useState(null);

  const capacitaciones = [
    {
      id: 1,
      title: 'Prevención de Riesgos Psicosociales',
      description:
        'Capacitación integral para identificar y prevenir riesgos en entornos educativos y empresariales mediante estrategias científicamente respaldadas.',
      image:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      icon: 'fas fa-shield-alt',
      features: [
        'Detección temprana de acoso, estrés y burnout',
        'Talleres interactivos con inoculación del estrés',
        'Herramientas digitales: Headspace, Calm, wearables',
        'Protocolos de intervención personalizada',
        'Seguimiento y evaluación continua',
      ],
      impact:
        'Reducción del 32% en niveles de estrés y mejora significativa del clima laboral',
      additionalInfo: {
        title: 'Metodología Integral',
        content:
          'Nuestro programa combina técnicas de neurociencia aplicada, psicología positiva y tecnología wearable para crear un ecosistema completo de prevención. Incluye sesiones presenciales, plataforma digital 24/7 y seguimiento personalizado con profesionales especializados.',
      },
    },
    {
      id: 2,
      title: 'Bienestar Laboral Integral',
      description:
        'Herramientas y estrategias avanzadas para promover el bienestar organizacional y la salud mental en el entorno de trabajo moderno.',
      image:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      icon: 'fas fa-heart',
      features: [
        'Desarrollo de cultura inclusiva y reconocimiento interno',
        'Implementación de flexibilidad laboral efectiva',
        'Programas de equilibrio vida-trabajo',
        'Apoyo emocional: EAP, líneas de ayuda especializadas',
        'Capacitación en liderazgo empático',
      ],
      impact:
        'Incremento del 21% en productividad y 35% en satisfacción laboral',
      additionalInfo: {
        title: 'Transformación Cultural',
        content:
          'Implementamos un cambio cultural profundo que abarca desde políticas organizacionales hasta prácticas diarias. Nuestro enfoque incluye coaching ejecutivo, talleres de mindfulness corporativo y creación de espacios de bienestar físico y mental en el lugar de trabajo.',
      },
    },
    {
      id: 3,
      title: 'Gestión Avanzada del Estrés',
      description:
        'Técnicas innovadoras y basadas en evidencia para la gestión del estrés organizacional y la mejora del clima laboral sostenible.',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      icon: 'fas fa-brain',
      features: [
        'Mindfulness y meditación aplicada al trabajo',
        'Simulaciones realistas con inoculación del estrés',
        'Monitoreo biométrico con wearables especializados',
        'Formación en resiliencia e inteligencia emocional',
        'Técnicas de respiración y relajación progresiva',
      ],
      impact:
        'Reducción del 40% en licencias por estrés y mejora del 28% en rendimiento',
      additionalInfo: {
        title: 'Ciencia del Estrés',
        content:
          'Utilizamos las últimas investigaciones en neuroplasticidad y biofeedback para crear programas personalizados. Cada participante recibe un plan adaptado basado en su perfil de estrés, medido a través de biomarcadores y tecnología avanzada de monitoreo continuo.',
      },
    },
  ];

  const toggleExpanded = cardId => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="capacitaciones-page">
      {/* Hero Section */}
      <section className="cap-hero">
        <div className="container">
          <div className="cap-hero-content animate-fade-in-up">
            <h1 className="cap-main-title">Capacitaciones PrediVersa</h1>
            <p className="cap-hero-subtitle">
              Programas especializados de formación y prevención en riesgos
              psicosociales para instituciones educativas y empresas modernas
            </p>
            <div className="cap-divider" />
          </div>
        </div>
      </section>

      {/* Capacitaciones Grid */}
      <section className="cap-content">
        <div className="container">
          <div className="cap-content-container">
            <div className="cap-grid">
              {capacitaciones.map(capacitacion => (
                <article
                  key={capacitacion.id}
                  className="cap-card animate-stagger hover-lift"
                >
                  <div className="cap-image-container">
                    <img
                      src={capacitacion.image}
                      alt={`Capacitación en ${capacitacion.title}`}
                      className="cap-image"
                    />
                    <div className="cap-image-overlay">
                      <div className="cap-overlay-icon">
                        <i className={capacitacion.icon} aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div className="cap-card-content">
                    <h2 className="cap-card-title">{capacitacion.title}</h2>
                    <p className="cap-card-description">
                      {capacitacion.description}
                    </p>

                    <ul className="cap-features-list">
                      {capacitacion.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>

                    <div className="cap-impact">
                      <strong>Impacto Comprobado:</strong> {capacitacion.impact}
                    </div>

                    <div className="cap-button-group">
                      <button
                        className="btn-inicio cap-btn cap-btn-primary"
                        onClick={() => toggleExpanded(capacitacion.id)}
                        aria-expanded={expandedCard === capacitacion.id}
                      >
                        <i
                          className={`fas fa-${
                            expandedCard === capacitacion.id ? 'minus' : 'plus'
                          }`}
                          aria-hidden="true"
                        />
                        {expandedCard === capacitacion.id
                          ? 'Ocultar detalles'
                          : 'Ver más detalles'}
                      </button>
                      <a
                        href="#contacto"
                        className="btn-regresar cap-btn cap-btn-secondary"
                      >
                        <i className="fas fa-envelope" aria-hidden="true" />
                        Solicitar info
                      </a>
                    </div>

                    <div
                      className={`cap-expandable-info ${
                        expandedCard === capacitacion.id ? 'show' : ''
                      }`}
                    >
                      {expandedCard === capacitacion.id && (
                        <div className="cap-info-content">
                          <h4 className="cap-info-title">
                            {capacitacion.additionalInfo.title}
                          </h4>
                          <p>{capacitacion.additionalInfo.content}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="cap-navigation">
        <div className="container">
          <div className="cap-nav-content animate-fade-in-up">
            <Link to="/" className="cap-back-btn hover-glow">
              <i className="fas fa-arrow-left" aria-hidden="true" />
              Regresar al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Capacitaciones;
