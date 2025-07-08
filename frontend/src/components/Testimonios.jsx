import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Testimonios.css";
import "../styles/main.css"; // Sistema unificado de estilos

function Testimonios() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonio, setActiveTestimonio] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector('.testimonios-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveTestimonio(prev => (prev + 1) % 3); // Use fixed length instead of testimoniosData.length
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const testimoniosData = [
    {
      id: 1,
      nombre: "Dr. Ana María Rodríguez",
      cargo: "Rectora",
      institucion: "Colegio San Patricio",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonio: "PrediVersa transformó completamente nuestra capacidad para prevenir situaciones de riesgo. En solo 3 meses, redujimos los incidentes de bullying en un 85%. La plataforma es intuitiva y el acompañamiento del equipo es excepcional.",
      estadistica: "85%",
      etiqueta: "Reducción de incidentes",
      rating: 5
    },
    {
      id: 2,
      nombre: "Ing. Carlos Mendoza",
      cargo: "Director de Recursos Humanos",
      institucion: "Corporación Empresarial XYZ",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonio: "Implementamos PrediVersa en nuestras 5 sedes y los resultados han sido extraordinarios. El clima laboral mejoró notablemente y nuestros colaboradores se sienten más seguros. Es una inversión que realmente vale la pena.",
      estadistica: "92%",
      etiqueta: "Mejora en clima laboral",
      rating: 5
    },
    {
      id: 3,
      nombre: "Psic. Laura Jiménez",
      cargo: "Coordinadora de Bienestar",
      institucion: "Universidad Nacional",
      avatar: "https://images.unsplash.com/photo-1594736797933-d0f75ad95d82?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonio: "Como psicóloga, valoro enormemente las herramientas analíticas que nos proporciona PrediVersa. Nos permite intervenir de manera preventiva y personalizada. Ha revolucionado nuestra forma de trabajar.",
      estadistica: "90%",
      etiqueta: "Satisfacción profesional",
      rating: 5
    },
    {
      id: 4,
      nombre: "Dr. José Manuel Calvo",
      cargo: "Especialista en Ciberseguridad",
      institucion: "Instituto Tecnológico",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonio: "La seguridad de datos y privacidad que maneja PrediVersa es impecable. Como experto en ciberseguridad, puedo confirmar que cumple con los más altos estándares internacionales. Confiamos plenamente en la plataforma.",
      estadistica: "100%",
      etiqueta: "Seguridad garantizada",
      rating: 5
    },
    {
      id: 5,
      nombre: "Lic. Patricia Hernández",
      cargo: "Coordinadora Académica",
      institucion: "Colegio Bilingüe Internacional",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      testimonio: "PrediVersa nos ayudó a crear un ambiente más inclusivo y seguro para nuestros estudiantes internacionales. La diversidad cultural ya no es un factor de riesgo, sino una fortaleza en nuestra comunidad educativa.",
      estadistica: "78%",
      etiqueta: "Aumento en inclusión",
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section className="testimonios-section gradient-bg-dark pattern-overlay-dark section" id="testimonios">
      
      <div className="container-large">
        
        {/* Encabezado */}
        <div className={`section-header ${isVisible ? 'animate-in' : 'animate-out'}`}>
          <div className="section-badge">
            <span className="badge-text">Historias de Éxito</span>
          </div>
          
          <h2 className="section-title-main">
            <span className="testimonios-subtitle-small">Lo que Dicen</span>
            Nuestros <span className="section-title-highlight">Clientes</span>
          </h2>
          
          <p className="section-subtitle">
            Más de 200 instituciones confían en PrediVersa para crear 
            ambientes seguros y transformar sus comunidades educativas.
          </p>
        </div>

        {/* Grid de testimonios principales */}
        <div className={`testimonios-grid ${isVisible ? 'animate-in' : ''}`}>
          {testimoniosData.slice(0, 3).map((testimonio, index) => (
            <div 
              key={testimonio.id}
              className={`testimonio-card ${activeTestimonio === index ? 'featured' : ''}`}
              onMouseEnter={() => setActiveTestimonio(index)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              
              {/* Header de la tarjeta */}
              <div className="card-header">
                <div className="avatar-container">
                  <img 
                    src={testimonio.avatar} 
                    alt={testimonio.nombre}
                    className="testimonio-avatar"
                  />
                  <div className="avatar-overlay">
                    <div className="rating">
                      {renderStars(testimonio.rating)}
                    </div>
                  </div>
                </div>
                
                <div className="author-info">
                  <h3 className="author-name">{testimonio.nombre}</h3>
                  <p className="author-role">{testimonio.cargo}</p>
                  <p className="author-institution">{testimonio.institucion}</p>
                </div>
              </div>

              {/* Contenido del testimonio */}
              <div className="card-content">
                <blockquote className="testimonio-text">
                  "{testimonio.testimonio}"
                </blockquote>
              </div>

              {/* Estadística destacada */}
              <div className="card-footer">
                <div className="testimonio-stat">
                  <span className="stat-number">{testimonio.estadistica}</span>
                  <span className="stat-label">{testimonio.etiqueta}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`testimonios-cta ${isVisible ? 'animate-in' : ''}`}>
          <div className="cta-content">
            <h3 className="cta-title">
              ¿Listo para ser la próxima historia de éxito?
            </h3>
            <p className="cta-description">
              Únete a las instituciones que ya transformaron su ambiente 
              educativo con PrediVersa.
            </p>
            <Link to="/contacto" className="testimonios-btn">
              Solicitar Consulta Gratuita
            </Link>
            <p className="cta-note">
              Consulta inicial sin costo • Respuesta en 24 horas
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Testimonios;