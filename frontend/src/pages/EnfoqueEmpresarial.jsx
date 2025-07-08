import React from "react";
import { Link } from "react-router-dom";
import "./EnfoqueEmpresarial.css";

function EnfoqueEmpresarial() {
  const features = [
    {
      icon: "fas fa-chart-line",
      title: "Evaluación Psicosocial",
      text: "Análisis integral de factores psicosociales que impactan el bienestar y productividad laboral."
    },
    {
      icon: "fas fa-thermometer-half",
      title: "Clima Organizacional",
      text: "Medición y seguimiento continuo del ambiente laboral y las dinámicas interpersonales."
    },
    {
      icon: "fas fa-exclamation-triangle",
      title: "Detección de Riesgos",
      text: "Identificación temprana de situaciones de acoso, estrés laboral y burnout organizacional."
    },
    {
      icon: "fas fa-seedling",
      title: "Ambientes Saludables",
      text: "Estrategias para fomentar espacios laborales productivos y promotores del bienestar."
    }
  ];

  return (
    <div className="enfoque-empresarial-page">
      {/* Hero Section */}
      <section className="emp-hero">
        <div className="container">
          <div className="emp-hero-content animate-fade-in-up">
            <h1 className="emp-main-title">Enfoque Empresarial</h1>
            <p className="emp-hero-subtitle">
              Impulsando el bienestar organizacional a través de la prevención inteligente del acoso laboral
            </p>
            <div className="emp-divider"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="emp-content">
        <div className="container">
          <div className="emp-content-container">
            <article className="emp-main-card animate-fade-in-up-delay hover-lift">
              <div className="emp-card-content">
                <div className="emp-text-section">
                  <h2 className="emp-section-title">Nuestra Propuesta Empresarial</h2>
                  <p className="emp-description">
                    En el contexto laboral, <strong>PrediVersa</strong> se adapta para evaluar <strong>factores psicosociales, clima organizacional y riesgos</strong> asociados al acoso, estrés o burnout.
                  </p>
                  <p className="emp-description">
                    Permite a las empresas identificar <strong>zonas de alerta, tomar decisiones preventivas</strong> y fomentar ambientes laborales saludables y productivos, mejorando tanto el bienestar de los colaboradores como los resultados organizacionales.
                  </p>
                </div>
                <div className="emp-image-section">
                  <img
                    src="https://empresas.divulgaciondinamica.es/wp-content/uploads/2021/11/GERENCIA3.jpg"
                    alt="Equipo de trabajo colaborativo en ambiente empresarial saludable"
                    className="emp-main-image"
                  />
                  <div className="emp-image-overlay"></div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="emp-features">
        <div className="container">
          <div className="emp-features-container">
            <h2 className="emp-features-title">Beneficios Empresariales</h2>
            <div className="emp-features-grid">
              {features.map((feature, index) => (
                <article key={index} className="emp-feature-card hover-lift">
                  <div className="emp-feature-icon">
                    <i className={feature.icon} aria-hidden="true"></i>
                  </div>
                  <h3 className="emp-feature-title">{feature.title}</h3>
                  <p className="emp-feature-text">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="emp-navigation">
        <div className="container">
          <div className="emp-nav-content animate-fade-in-up">
            <Link to="/" className="emp-back-btn hover-glow">
              <i className="fas fa-arrow-left" aria-hidden="true"></i>
              Regresar al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EnfoqueEmpresarial;