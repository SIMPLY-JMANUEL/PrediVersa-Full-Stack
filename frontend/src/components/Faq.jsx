import React, { useState, useEffect } from "react";
import "./Faq.css";
import "../styles/main.css"; // Sistema unificado de estilos

const preguntasFrecuentes = [
  {
    categoria: "General",
    pregunta: "¿Qué es PrediVersa y cómo funciona en mi institución?",
    respuesta: "PrediVersa es una plataforma inteligente de prevención que utiliza análisis predictivo y machine learning para detectar patrones de riesgo psicosocial antes de que se materialicen en incidentes. Funciona integrándose de manera discreta en el ecosistema digital de tu institución, analizando datos comportamentales y ofreciendo alertas tempranas y recomendaciones personalizadas."
  },
  {
    categoria: "Implementación",
    pregunta: "¿Cuánto tiempo toma implementar PrediVersa?",
    respuesta: "La implementación básica toma entre 24-48 horas. Incluye configuración inicial, integración con sistemas existentes, capacitación del equipo y puesta en marcha del monitoreo predictivo. Nuestro equipo especializado te acompaña en todo el proceso para garantizar una transición fluida."
  },
  {
    categoria: "Cobertura",
    pregunta: "¿PrediVersa funciona tanto para colegios como empresas?",
    respuesta: "Sí, tenemos enfoques especializados para ambos sectores. Para instituciones educativas ofrecemos prevención de bullying, violencia escolar y riesgos psicosociales estudiantiles. Para empresas, nos enfocamos en clima laboral, prevención de acoso, estrés ocupacional y bienestar organizacional."
  },
  {
    categoria: "Pricing",
    pregunta: "¿Cuáles son los costos y planes disponibles?",
    respuesta: "Ofrecemos planes escalables desde $299/mes para instituciones pequeñas hasta soluciones enterprise personalizadas. Incluye consulta gratuita, implementación, capacitación, soporte 24/7 y actualizaciones. Contáctanos para una cotización personalizada según tu tamaño y necesidades específicas."
  },
  {
    categoria: "Soporte",
    pregunta: "¿Qué tipo de soporte y capacitación ofrecen?",  
    respuesta: "Brindamos soporte integral: implementación guiada, capacitación especializada para tu equipo, soporte técnico 24/7, webinars mensuales, biblioteca de recursos, y acompañamiento continuo en la interpretación de datos y toma de decisiones estratégicas."
  },
  {
    categoria: "Seguridad",
    pregunta: "¿Cómo garantizan la privacidad y seguridad de los datos?",
    respuesta: "Cumplimos con los más altos estándares de seguridad: certificación ISO 27001, encriptación end-to-end, servidores en Colombia con backup internacional, cumplimiento GDPR y normativas locales. Los datos nunca se comparten con terceros y tienes control total sobre la información de tu institución."
  }
];

function FAQItem({ question, children, category, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <div className="faq-header" onClick={onToggle}>
        <div className="faq-category">{category}</div>
        <button
          className="faq-question"
          aria-expanded={isOpen}
          type="button"
        >
          {question}
        </button>
        <div className="faq-toggle">
          <span className={`toggle-icon ${isOpen ? 'rotated' : ''}`}>+</span>
        </div>
      </div>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <div className="faq-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const [openItems, setOpenItems] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector('.faq-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section className="faq-section section gradient-bg-dark pattern-overlay" id="faq">
      
      {/* Formas de fondo */}
      <div className="faq-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
      </div>

      <div className="container-large">
        
        {/* Encabezado */}
        <div className={`section-header ${isVisible ? 'animate-in' : ''}`}>
          <div className="section-badge">
            <span className="badge-text">Preguntas Frecuentes</span>
          </div>
          
          <h2 className="section-title">
            <span className="section-title-line">¿Tienes dudas sobre</span>
            <span className="section-title-line">
              <span className="section-title-highlight">PrediVersa</span>?
            </span>
          </h2>
          
          <p className="section-subtitle">
            Encuentra respuestas a las preguntas más comunes sobre nuestra 
            plataforma de prevención inteligente.
          </p>
        </div>

        {/* Grid de preguntas */}
        <div className={`faq-grid ${isVisible ? 'animate-in' : ''}`}>
          {preguntasFrecuentes.map((item, index) => (
            <FAQItem 
              key={index} 
              question={item.pregunta}
              category={item.categoria}
              isOpen={openItems[index]}
              onToggle={() => toggleItem(index)}
            >
              {item.respuesta}
            </FAQItem>
          ))}
        </div>

        {/* Call to action adicional */}
        <div className={`faq-cta ${isVisible ? 'animate-in' : ''}`}>
          <div className="cta-content">
            <h3 className="cta-title">¿No encontraste lo que buscabas?</h3>
            <p className="cta-text">
              Nuestro equipo de expertos está listo para resolver todas tus dudas 
              y acompañarte en el proceso.
            </p>
            <div className="cta-actions">
              <a href="/contacto" className="btn btn-primary">
                <span className="btn-text">Hablar con un Experto</span>
                <span className="btn-icon">💬</span>
              </a>
              <a href="mailto:info@prediversa.com" className="btn btn-secondary">
                <span className="btn-text">Enviar Email</span>
                <span className="btn-icon">📧</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Faq;