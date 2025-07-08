import React from "react";
import { Link } from "react-router-dom";
import "./EnfoqueEducativo.css";

function EnfoqueEducativo() {
  const features = [
    {
      icon: "fas fa-shield-alt",
      title: "Detección Temprana",
      text: "Identificación proactiva de patrones de riesgo mediante algoritmos avanzados de análisis predictivo."
    },
    {
      icon: "fas fa-users",
      title: "Fortalecimiento de Convivencia",
      text: "Estrategias integrales para mejorar las relaciones interpersonales y el clima escolar."
    },
    {
      icon: "fas fa-graduation-cap",
      title: "Empoderamiento Docente",
      text: "Capacitación y herramientas especializadas para que los educadores gestionen eficazmente la prevención."
    },
    {
      icon: "fas fa-heart",
      title: "Apoyo Psicosocial",
      text: "Orientación profesional para equipos especializados en bienestar estudiantil y salud mental."
    }
  ];

  return (
    <div className="enfoque-educativo-page">
      {/* Hero Section */}
      <section className="ee-hero">
        <div className="container">
          <div className="ee-hero-content animate-fade-in-up">
            <h1 className="ee-main-title">Enfoque Educativo</h1>
            <p className="ee-hero-subtitle">
              Transformando la educación a través de la prevención inteligente del bullying escolar
            </p>
            <div className="ee-divider"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="ee-content">
        <div className="container">
          <div className="ee-content-container">
            <article className="ee-main-card animate-fade-in-up-delay hover-lift">
              <div className="ee-card-content">
                <div className="ee-text-section">
                  <h2 className="ee-section-title">Nuestra Propuesta Educativa</h2>
                  <p className="ee-description">
                    <strong>PrediVersa</strong> está diseñada para ayudar a las instituciones educativas a identificar problemáticas de <strong>violencia escolar, bullying, exclusión o agresión</strong>. Se orienta a fortalecer la convivencia escolar, empoderar a docentes y orientar a los equipos psicosociales mediante <strong>tecnología predictiva e intervención pedagógica</strong>.
                  </p>
                  <p className="ee-description">
                    Nuestro enfoque integral combina análisis de datos, inteligencia artificial y metodologías pedagógicas probadas para crear <strong>ambientes educativos seguros, inclusivos y propicios para el aprendizaje</strong>.
                  </p>
                </div>
                <div className="ee-image-section">
                  <img
                    src="https://www.rededuca.net/sites/default/files/2023-07/Dise%C3%B1o%20sin%20t%C3%ADtulo%20%284%29_1.jpg"
                    alt="Estudiantes en ambiente educativo positivo"
                    className="ee-main-image"
                  />
                  <div className="ee-image-overlay"></div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="ee-features">
        <div className="container">
          <div className="ee-features-container">
            <h2 className="ee-features-title">Características Clave</h2>
            <div className="ee-features-grid">
              {features.map((feature, index) => (
                <article key={index} className="ee-feature-card hover-lift">
                  <div className="ee-feature-icon">
                    <i className={feature.icon} aria-hidden="true"></i>
                  </div>
                  <h3 className="ee-feature-title">{feature.title}</h3>
                  <p className="ee-feature-text">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="ee-navigation">
        <div className="container">
          <div className="ee-nav-content animate-fade-in-up">
            <Link to="/" className="ee-back-btn hover-glow">
              <i className="fas fa-arrow-left" aria-hidden="true"></i>
              Regresar al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EnfoqueEducativo;