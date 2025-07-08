import React, { useState, useEffect } from "react";
import "./Features.css";
import "../styles/main.css"; // Sistema unificado de estilos

function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector('.features-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Auto-rotate features every 4 seconds
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveFeature(prev => (prev + 1) % 4); // Use fixed length instead of featuresData.length
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const featuresData = [
    {
      id: 1,
      icon: "🧠",
      title: "Análisis Predictivo Inteligente",
      description: "Algoritmos de machine learning que detectan patrones de riesgo antes de que se materialicen en incidentes de violencia escolar.",
      stats: { number: "95%", label: "Precisión" },
      progress: 95,
      details: [
        "Análisis de comportamiento en tiempo real",
        "Detección temprana de riesgos",
        "Alertas automatizadas personalizadas"
      ]
    },
    {
      id: 2,
      icon: "🛡️",
      title: "Prevención Integral 360°",
      description: "Sistema completo de prevención que abarca desde el aula hasta el hogar, creando una red de protección total.",
      stats: { number: "24/7", label: "Monitoreo" },
      progress: 88,
      details: [
        "Monitoreo continuo de ambientes",
        "Intervenciones personalizadas",
        "Seguimiento a largo plazo"
      ]
    },
    {
      id: 3,
      icon: "📊",
      title: "Dashboard Intuitivo",
      description: "Interface clara y poderosa que permite a educadores tomar decisiones informadas basadas en datos reales y actualizados.",
      stats: { number: "500+", label: "Métricas" },
      progress: 92,
      details: [
        "Visualización de datos en tiempo real",
        "Reportes automatizados",
        "Análisis de tendencias"
      ]
    },
    {
      id: 4,
      icon: "🤝",
      title: "Colaboración Multidisciplinaria",
      description: "Plataforma que conecta psicólogos, docentes, directivos y familias para una respuesta coordinada y efectiva.",
      stats: { number: "99%", label: "Satisfacción" },
      progress: 90,
      details: [
        "Comunicación integrada",
        "Casos compartidos seguros",
        "Planes de acción colaborativos"
      ]
    },
    {
      id: 5,
      icon: "🎯",
      title: "Intervenciones Personalizadas",
      description: "Estrategias específicas adaptadas a cada situación, estudiante e institución para máxima efectividad.",
      stats: { number: "85%", label: "Efectividad" },
      progress: 85,
      details: [
        "Planes de intervención únicos",
        "Seguimiento individualizado",
        "Adaptación continua"
      ]
    },
    {
      id: 6,
      icon: "🔒",
      title: "Seguridad y Privacidad",
      description: "Máximos estándares de protección de datos con certificaciones internacionales y cumplimiento normativo total.",
      stats: { number: "ISO", label: "27001" },
      progress: 100,
      details: [
        "Encriptación end-to-end",
        "Cumplimiento GDPR",
        "Auditorías de seguridad"
      ]
    }
  ];

  return (
    <section className="features-section gradient-bg-primary pattern-overlay section" id="features">
      
      {/* Encabezado de la sección */}
      <div className="container-large">
        <div className={`section-header ${isVisible ? 'animate-in' : 'animate-out'}`}>
          <div className="section-badge">
            <span className="badge-text">Características Innovadoras</span>
          </div>
          
          <h2 className="section-title-main">
            Descubre el Poder de{" "}
            <span className="section-title-highlight">PrediVersa</span>
          </h2>
          
          <p className="section-subtitle">
            Una plataforma integral que combina inteligencia artificial, 
            análisis predictivo y expertise educativo para transformar la 
            prevención de violencia escolar.
          </p>
        </div>

        {/* Grid de características */}
        <div className={`features-grid ${isVisible ? 'animate-in' : ''}`}>
          {featuresData.map((feature, index) => (
            <div 
              key={feature.id}
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              
              {/* Ícono de la característica */}
              <div className="feature-img-bg">
                <div className="feature-img">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>

                {/* Lista de detalles */}
                <ul className="feature-details-list">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="detail-item">
                      <span className="detail-icon">✓</span>
                      <span className="detail-text">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Estadísticas y progreso */}
              <div className="feature-details">
                <div className="feature-stats">
                  <div className="feature-stat">
                    <span className="stat-number">{feature.stats.number}</span>
                    <span className="stat-label">{feature.stats.label}</span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="progress-indicator">
                  <div 
                    className="progress-bar" 
                    style={{ '--progress': `${feature.progress}%` }}
                  ></div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Sección de historia como complemento */}
        <div className={`features-story ${isVisible ? 'animate-in' : ''}`}>
          <div className="story-content">
            
            <div className="story-text">
              <div className="story-badge">
                <span className="badge-text">Nuestra Historia</span>
              </div>
              
              <h3 className="story-title">
                Nacida en <span className="highlight">Antioquia</span>,
                <br />Impactando <span className="highlight">Latinoamérica</span>
              </h3>
              
              <div className="story-description">
                <p>
                  En lo profundo de Antioquia, donde las aulas enfrentaban desafíos invisibles, 
                  nació <strong>PrediVersa</strong> como respuesta a una realidad alarmante: 
                  más del 35% de estudiantes reportaban bullying.
                </p>
                
                <blockquote className="story-quote">
                  "Cada estudiante merece un entorno educativo libre de violencia 
                  y lleno de oportunidades para crecer."
                </blockquote>
                
                <p>
                  Hoy somos más que una herramienta: somos un aliado que acompaña 
                  a docentes, orientadores y familias, transformando la prevención 
                  del acoso escolar, una institución a la vez.
                </p>
              </div>

              <div className="story-impact">
                <div className="impact-item">
                  <span className="impact-number">200+</span>
                  <span className="impact-label">Instituciones</span>
                </div>
                <div className="impact-item">
                  <span className="impact-number">50K+</span>
                  <span className="impact-label">Estudiantes</span>
                </div>
                <div className="impact-item">
                  <span className="impact-number">95%</span>
                  <span className="impact-label">Efectividad</span>
                </div>
              </div>
            </div>

            <div className="story-visual">
              <div className="visual-container">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Estudiantes colaborando en un ambiente seguro"
                  className="story-image"
                />
                <div className="visual-overlay">
                  <div className="overlay-content">
                    <span className="overlay-icon">🎓</span>
                    <span className="overlay-text">Ambientes Seguros</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Features;
