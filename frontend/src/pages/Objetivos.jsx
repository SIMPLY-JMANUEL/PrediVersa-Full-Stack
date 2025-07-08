import React from "react";
import { Link } from "react-router-dom";
import "./Objetivos.css";

const objetivosEspecificos = [
  "Recopilar y analizar datos escolares, sociales y demográficos relevantes para detectar patrones de violencia.",
  "Construir un modelo predictivo basado en técnicas de aprendizaje automático que identifique factores de riesgo.",
  "Validar el modelo con pruebas reales para garantizar su precisión y aplicabilidad en contextos educativos.",
  "Implementar estrategias de intervención personalizadas según el nivel de riesgo detectado.",
  "Extender la aplicación del modelo a entornos empresariales, promoviendo el bienestar psicosocial laboral.",
  "Reducir significativamente los casos de bullying en las instituciones participantes.",
  "Mejorar el clima escolar y las relaciones interpersonales entre los estudiantes.",
  "Capacitar a los docentes en técnicas de detección temprana y manejo adecuado del acoso escolar.",
  "Empoderar a los estudiantes con herramientas que les permitan protegerse y apoyar a sus compañeros."
];

function Objetivos() {
  return (
    <div className="objetivos-page">
      {/* Hero Section */}
      <section className="obj-hero">
        <div className="container">
          <div className="obj-hero-content animate-fade-in-up">
            <h1 className="obj-main-title">Nuestros Objetivos</h1>
            <p className="obj-hero-subtitle">
              Metas concretas que nos impulsan hacia un cambio positivo en la educación y la prevención del bullying escolar
            </p>
            <div className="obj-divider"></div>
          </div>
        </div>
      </section>

      {/* Objetivo General */}
      <section className="obj-general-section">
        <div className="container">
          <div className="obj-general-container">
            <article 
              className="obj-general-card animate-fade-in-up-delay hover-lift"
              tabIndex={0}
              aria-label="Objetivo General de PrediVersa"
            >
              <header className="obj-general-header">
                <div className="obj-general-icon">
                  <i className="fas fa-bullseye" aria-hidden="true"></i>
                </div>
                <h2 className="obj-general-title">Objetivo General</h2>
              </header>
              <div className="obj-general-content">
                <p className="obj-general-text">
                  Desarrollar y aplicar un <strong>modelo predictivo innovador</strong> que permita prevenir y reducir los casos de violencia escolar, apoyando la toma de decisiones en instituciones educativas y empresariales mediante herramientas tecnológicas, analíticas y de acompañamiento profesional.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Objetivos Específicos */}
      <section className="obj-especificos-section">
        <div className="container">
          <div className="obj-especificos-container">
            <h2 className="obj-section-title">Objetivos Específicos</h2>
            <div className="obj-grid">
              {objetivosEspecificos.map((objetivo, idx) => (
                <article
                  key={idx}
                  className="obj-card hover-lift"
                  tabIndex={0}
                  aria-label={`Objetivo Específico ${idx + 1}`}
                >
                  <header className="obj-card-header">
                    <div className="obj-number">{idx + 1}</div>
                  </header>
                  <div className="obj-card-body">
                    <p className="obj-card-content">{objetivo}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="obj-navigation">
        <div className="container">
          <div className="obj-nav-content animate-fade-in-up">
            <Link to="/" className="obj-back-btn hover-glow">
              <i className="fas fa-arrow-left" aria-hidden="true"></i>
              Regresar al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Objetivos;