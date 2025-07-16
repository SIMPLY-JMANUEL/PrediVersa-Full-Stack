import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cierre.css';
import Button from './Button/Button';

function Cierre() {
  const navigate = useNavigate();

  return (
    <section className="cierre-section" id="cierre">
      {/* FONDO DINÁMICO CON OVERLAY */}
      <div className="cierre-background">
        <div className="bg-overlay" />
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="container-standard">
        <div className="cierre-grid">
          {/* COLUMNA IZQUIERDA - INFORMACIÓN PRINCIPAL */}
          <div className="cierre-main-content">
            <div className="brand-section">
              <div className="brand-badge">
                <span className="badge-text">IA AVANZADA</span>
                <div className="badge-glow" />
              </div>
              <h1 className="brand-title">
                <span className="title-primary">Predi</span>
                <span className="title-accent">Versa</span>
              </h1>
              <h2 className="brand-subtitle">
                Prevención de Riesgos Psicosociales con
                <span className="highlight-text"> Inteligencia Artificial</span>
              </h2>
            </div>

            <div className="value-proposition">
              <p className="proposition-text">
                <strong>Transformamos instituciones educativas</strong> en
                espacios seguros mediante tecnología predictiva que detecta y
                previene el bullying antes de que ocurra.
              </p>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Reducción de incidentes</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24h</div>
                <div className="stat-label">Implementación</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Instituciones</div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA - CALL TO ACTION */}
          <div className="cierre-cta-content">
            <div className="cta-card">
              <div className="cta-header">
                <h3 className="cta-title">
                  ¿Listo para transformar tu institución?
                </h3>
                <p className="cta-description">
                  Únete a más de 500 instituciones que ya protegen a sus
                  estudiantes con PrediVersa
                </p>
              </div>

              <div className="cta-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Demo gratuita personalizada</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Implementación en 24 horas</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Soporte 24/7 incluido</span>
                </div>
              </div>

              <div className="cta-actions">
                <Button
                  variant="primary"
                  size="lg"
                  className="demo-button"
                  onClick={() => navigate('/contacto')}
                  aria-label="Solicitar demostración de PrediVersa"
                >
                  <span className="button-text">Solicitar Demo Gratis</span>
                  <span className="button-icon">→</span>
                </Button>
                <p className="cta-note">
                  Sin compromiso • Respuesta en 2 horas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cierre;
