import React from 'react';
import './Cta.css';

function Cta() {
  return (
    <section className="cta-section">
      {/* Layout de dos columnas */}
      <div className="two-column-layout">
        {/* Columna Izquierda - ¿Quiénes Somos? */}
        <div className="left-column">
          <h2>¿Quiénes Somos?</h2>
          <p>
            Desde Antioquia, donde las aulas enfrentaban desafíos invisibles,
            nació PrediVersa como respuesta a una realidad alarmante: más del
            35% de los estudiantes reportaban casos de bullying.
          </p>
          <p>
            Hoy, PrediVersa es más que una herramienta: es un aliado confiable
            que acompaña a docentes, orientadores y familias, transformando la
            prevención del acoso escolar, una institución a la vez.
          </p>
          <blockquote>
            "Cada estudiante merece un entorno educativo libre de violencia y
            lleno de oportunidades para crecer."
          </blockquote>
        </div>

        {/* Columna Derecha - Beneficios */}
        <div className="right-column">
          <h2>Beneficios Clave de PrediVersa</h2>

          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Activación Inmediata</h3>
              <div className="highlight">&lt; 24h ACTIVACIÓN</div>
              <p>
                Tu institución protegida en menos de 24 horas. Sin esperas, sin
                complicaciones.
              </p>
            </div>

            <div className="benefit-card">
              <h3>Resultados Garantizados</h3>
              <div className="highlight">95% MENOS BULLYING</div>
              <p>
                Reducción del 95% en incidentes. Datos reales, impacto
                inmediato.
              </p>
            </div>

            <div className="benefit-card">
              <h3>Respaldo Total</h3>
              <div className="highlight">24/7 SOPORTE</div>
              <p>
                Nuestro equipo especializado te acompaña en cada paso. Soporte
                técnico y humano, siempre disponible.
              </p>
            </div>

            <div className="benefit-card">
              <h3>Toma de Decisiones Inteligente</h3>
              <div className="highlight">ANÁLISIS EN TIEMPO REAL</div>
              <p>
                Recibe reportes automáticos, alertas personalizadas y métricas
                accionables. Empodera a tu equipo con información clara para
                intervenir con eficacia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="cta-final-container">
        <div className="cta-final">
          <h3>Transforma tu Institución con PrediVersa</h3>
          <p>
            Únete a las instituciones que ya confían en nuestra plataforma para
            crear ambientes educativos seguros y libres de violencia.
          </p>
          <p>
            Sin compromiso • Consulta inicial gratuita • Respuesta en 24 horas
          </p>
        </div>
      </div>
    </section>
  );
}

export default Cta;
