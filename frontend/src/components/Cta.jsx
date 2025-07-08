import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cta.css";
import "../styles/main.css"; // Sistema unificado de estilos

function Cta() {
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

    const section = document.querySelector('.cta-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="cta-section gradient-bg-dark pattern-overlay-dark section-fullscreen" id="contacto">
      <div className="container-large">
        <div className={`section-header ${isVisible ? 'animate-in' : 'animate-out'}`}>
          
          {/* Encabezado principal */}
          <h2 className="section-title-main">
            Transforma tu Institución con <span className="section-title-highlight">PrediVersa</span>
          </h2>
          <p className="section-subtitle">
            Únete a más de 200 instituciones que ya confían en nuestra 
            plataforma para crear ambientes educativos seguros y libres de violencia.
          </p>

          {/* Beneficios clave */}
          <div className="cta-benefits">
            <div className="benefit-item">
              <h3 className="benefit-title">Implementación Rápida</h3>
              <p className="benefit-desc">Configuración completa en menos de 24 horas</p>
            </div>
            <div className="benefit-item">
              <h3 className="benefit-title">Resultados Comprobados</h3>
              <p className="benefit-desc">95% de reducción en incidentes reportados</p>
            </div>
            <div className="benefit-item">
              <h3 className="benefit-title">Soporte Especializado</h3>
              <p className="benefit-desc">Acompañamiento continuo de nuestro equipo</p>
            </div>
          </div>

          {/* Llamada a la acción principal */}
          <div className="cta-action">
            <Link to="/contacto" className="btn-inicio cta-button primary">
              Solicitar Consulta Gratuita
            </Link>
            <p className="cta-note">
              Sin compromiso • Consulta inicial gratuita • Respuesta en 24 horas
            </p>
          </div>

          {/* Enlaces adicionales */}
          <div className="cta-links">
            <Link to="/capacitaciones" className="btn-regresar cta-link">Ver Capacitaciones</Link>
            <Link to="/noticias" className="btn-regresar cta-link">Casos de Éxito</Link>
            <Link to="/equipo" className="btn-regresar cta-link">Conocer al Equipo</Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Cta;
