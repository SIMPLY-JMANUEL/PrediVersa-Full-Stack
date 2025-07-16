import React, { useState } from 'react';
import './Faq.css';

const Faq = () => {
  const [openItems, setOpenItems] = useState({});

  const faqs = [
    {
      id: 1,
      pregunta: '¿Cómo funciona PrediVersa en mi institución educativa?',
      respuesta:
        'PrediVersa utiliza inteligencia artificial avanzada para analizar patrones de comportamiento y detectar riesgos psicosociales antes de que se conviertan en incidentes críticos. Se integra fácilmente con sus sistemas existentes y proporciona alertas tempranas que han demostrado reducir incidentes hasta en un 85%, mejorando significativamente el clima institucional.',
    },
    {
      id: 2,
      pregunta: '¿Qué garantías ofrecen sobre los resultados?',
      respuesta:
        'Garantizamos implementación completa en 24-48 horas, capacitación integral para todo el personal, soporte técnico 24/7 y mejoras medibles en el clima institucional. Nuestros clientes reportan una reducción del 85% en incidentes, mejora del 92% en satisfacción docente y un ROI visible en los primeros 6 meses de implementación.',
    },
    {
      id: 3,
      pregunta: '¿Cuánto tiempo toma ver resultados concretos?',
      respuesta:
        'Los primeros indicadores de mejora son visibles en las primeras 2-3 semanas de implementación. La reducción significativa de incidentes se observa típicamente entre 30-60 días, y el impacto completo en el clima institucional se consolida en un período de 3-6 meses, con mejoras continuas a largo plazo.',
    },
    {
      id: 4,
      pregunta: '¿Es segura la información de nuestros estudiantes?',
      respuesta:
        'Absolutamente. PrediVersa cumple con las más estrictas normas de protección de datos (GDPR, LOPD, Ley 1581 de Colombia). Toda la información se encripta con estándares de seguridad militar, se almacena en servidores certificados y solo personal debidamente autorizado tiene acceso limitado y auditado.',
    },
    {
      id: 5,
      pregunta: '¿Qué tipo de soporte técnico incluye el servicio?',
      respuesta:
        'Incluimos soporte técnico completo 24/7, capacitación inicial y continua para administradores, actualizaciones automáticas del sistema, monitoreo proactivo, y un equipo de especialistas en psicología educativa disponible para consultas y optimización de estrategias preventivas.',
    },
  ];

  const handleToggle = id => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="faq-section">
      <div className="container-standard">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 className="title-standard">Preguntas Frecuentes</h2>
          <p className="subtitle-standard">
            Resuelve tus dudas sobre PrediVersa
          </p>
          <p className="description-standard">
            Encuentra respuestas rápidas a las preguntas más comunes sobre
            nuestra plataforma de prevención de riesgos psicosociales
          </p>
        </div>

        {/* FAQ Items */}
        <div className="faq-list">
          {faqs.map(faq => (
            <div
              key={faq.id}
              className={`faq-item ${openItems[faq.id] ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => handleToggle(faq.id)}
              >
                <h3>{faq.pregunta}</h3>
                <span className="faq-toggle">+</span>
              </button>

              {openItems[faq.id] && (
                <div className="faq-answer">
                  <p>{faq.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
