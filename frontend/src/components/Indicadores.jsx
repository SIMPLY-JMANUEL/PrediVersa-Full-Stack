import React from "react";
import "./Indicadores.css";
import "../styles/main.css"; // Sistema unificado de estilos

function Indicadores() {
  return (
    <section className="indicadores-section section" id="indicadores">
      <div className="container">
        <h2 className="section-title-main text-center">Nuestros Impactos Clave</h2>
        <div className="indicadores-grid">
          {/* Card 1 */}
          <div className="indicador-card">
            <div className="indicador-chart">
              <svg viewBox="0 0 36 36" className="circular-chart blue">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray="85, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  +85
                </text>
              </svg>
            </div>
            <div className="indicador-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3 className="indicador-label">Instituciones Protegidas</h3>
            <p className="indicador-description">
              Hemos implementado protocolos de seguridad avanzados que protegen a 85 instituciones financieras y educativas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="indicador-card">
            <div className="indicador-chart">
              <svg viewBox="0 0 36 36" className="circular-chart green">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray="75, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  +2,500
                </text>
              </svg>
            </div>
            <div className="indicador-icon">
              <i className="fas fa-search-plus"></i>
            </div>
            <h3 className="indicador-label">Casos Detectados</h3>
            <p className="indicador-description">
              Nuestros sistemas han identificado y prevenido más de 2,500 incidentes de seguridad potenciales.
            </p>
          </div>

          {/* Card 3 */}
          <div className="indicador-card">
            <div className="indicador-chart">
              <svg viewBox="0 0 36 36" className="circular-chart orange">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray="70, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  70%
                </text>
              </svg>
            </div>
            <div className="indicador-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <h3 className="indicador-label">Reducción de Riesgos</h3>
            <p className="indicador-description">
              Hemos reducido en un 70% los casos de acoso laboral mediante programas de capacitación continua.
            </p>
          </div>

          {/* Card 4 */}
          <div className="indicador-card">
            <div className="indicador-chart">
              <svg viewBox="0 0 36 36" className="circular-chart yellow">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray="60, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  60%
                </text>
              </svg>
            </div>
            <div className="indicador-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="indicador-label">Crecimiento Sostenido</h3>
            <p className="indicador-description">
              Hemos logrado un crecimiento sostenido del 60% en nuestra red de apoyo y colaboración interinstitucional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Indicadores;