import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cierre.css";
import "../styles/main.css"; // Sistema unificado de estilos

function Cierre() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.querySelector('.cierre-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="cierre-section gradient-bg-dark" id="cierre">
      
      {/* Formas de fondo */}
      <div className="floating-patterns">
        <div className="floating-pattern floating-pattern-1"></div>
        <div className="floating-pattern floating-pattern-2"></div>
        <div className="pattern-overlay-dark"></div>
      </div>

      <div className="container">
        <div className={`cierre-content ${isVisible ? 'animate-in' : 'animate-out'}`}>
          
          {/* Badge de agradecimiento */}
          <div className="section-badge" style={{background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', color: 'rgba(255, 255, 255, 0.9)'}}>
            Gracias por Confiar en Nosotros
          </div>

          {/* Título principal */}
          <h2 className="cierre-title">
            <span className="title-line-1">Juntos Construimos</span>
            <span className="title-line-2">
              <span className="title-highlight">Ambientes Seguros</span>
            </span>
          </h2>

          {/* Subtítulo */}
          <p className="cierre-subtitle">
            Tu confianza en <strong>PrediVersa</strong> nos impulsa a seguir innovando 
            en la prevención de riesgos psicosociales. Estamos aquí para acompañarte 
            en cada paso hacia un futuro más seguro.
          </p>

          {/* Estadísticas de impacto */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-number">200+</div>
              <div className="stat-label">Instituciones Protegidas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Vidas Impactadas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Reducción de Incidentes</div>
            </div>
          </div>

          {/* Acciones principales */}  
          <div className="actions-container">
            <Link to="/contacto" className="btn-primary-special">
              <span className="btn-text">Comenzar Ahora</span>
            </Link>
            
            <div className="secondary-actions">
              <Link to="/equipo" className="action-link">
                <span className="link-text">Conoce al Equipo</span>
              </Link>
              <Link to="/noticias" className="action-link">
                <span className="link-text">Últimas Noticias</span>
              </Link>
            </div>
          </div>

          {/* Mensaje de compromiso */}
          <div className="glass-card">
            <div className="commitment-content">
              <h3 className="commitment-title">
                Nuestro Compromiso Contigo
              </h3>
              <div className="commitment-items">
                <div className="commitment-item">
                  <span className="item-text">Acompañamiento personalizado</span>
                </div>
                <div className="commitment-item">
                  <span className="item-text">Máxima seguridad y privacidad</span>
                </div>
                <div className="commitment-item">
                  <span className="item-text">Innovación constante</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información de contacto rápido */}
          <div className="cierre-contact-info">
            <p className="contact-text">
              ¿Tienes preguntas? Estamos aquí para ayudarte.
            </p>
            <div className="contact-methods">
              <a href="mailto:info@gmail.com" className="contact-method">
                <span className="method-text">prediversa@gmail.com</span>
              </a>
              <a href="tel:+573000000000" className="contact-method">
                <span className="method-text">+57 300 000 0000</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Cierre;
