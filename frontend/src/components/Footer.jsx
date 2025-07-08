import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Footer.css";
import "../styles/main.css"; // Sistema unificado de estilos

function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  // Función para scroll suave a secciones
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Función para manejar navegación con scroll
  const handleContactClick = (e) => {
    e.preventDefault();
    // Si estamos en la página principal, hacer scroll
    if (window.location.pathname === '/') {
      scrollToSection('contacto');
    } else {
      // Si no, navegar a home y luego hacer scroll
      navigate('/');
      setTimeout(() => scrollToSection('contacto'), 100);
    }
  };

  // Función para manejar enlaces externos con validación
  const handleExternalLink = (url, platform) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error(`Error al abrir ${platform}:`, error);
      alert(`No se pudo abrir ${platform}. Inténtalo más tarde.`);
    }
  };

  // Función para copiar email al portapapeles
  const copyEmail = () => {
    const email = 'contacto@prediversa.org';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        alert('Email copiado al portapapeles');
      }).catch(() => {
        // Fallback para navegadores que no soporten clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Email copiado al portapapeles');
      });
    }
  };

  // Función para hacer llamada directa
  const makeCall = () => {
    const phone = '+5712345677890';
    window.location.href = `tel:${phone}`;
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Columna 1: Marca y redes */}
          <div className="footer-col">
            <Link to="/" className="footer-logo">PrediVersa</Link>
            <p className="footer-desc">
              Plataforma líder en análisis predictivo para prevención de riesgos psicosociales.
            </p>
            <div className="social-links">
              <button 
                onClick={() => handleExternalLink('https://facebook.com/prediversa', 'Facebook')}
                className="social-link" 
                aria-label="Abrir Facebook de PrediVersa"
              >
                <span className="social-text">Facebook</span>
              </button>
              <button 
                onClick={() => handleExternalLink('https://twitter.com/prediversa', 'Twitter')}
                className="social-link" 
                aria-label="Abrir Twitter de PrediVersa"
              >
                <span className="social-text">Twitter</span>
              </button>
              <button 
                onClick={() => handleExternalLink('https://linkedin.com/company/prediversa', 'LinkedIn')}
                className="social-link" 
                aria-label="Abrir LinkedIn de PrediVersa"
              >
                <span className="social-text">LinkedIn</span>
              </button>
              <button 
                onClick={() => handleExternalLink('https://instagram.com/prediversa', 'Instagram')}
                className="social-link" 
                aria-label="Abrir Instagram de PrediVersa"
              >
                <span className="social-text">Instagram</span>
              </button>
            </div>
          </div>
          {/* Columna 2: Enlaces rápidos */}
          <div className="footer-col">
            <h3 className="footer-title">Enlaces rápidos</h3>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
              <li><Link to="/noticias">Noticias</Link></li>
              <li><Link to="/equipo">Equipo</Link></li>
              <li>
                <button 
                  onClick={handleContactClick}
                  className="footer-link-btn"
                  aria-label="Ir a la sección de contacto"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>
          {/* Columna 3: Legal */}
          <div className="footer-col">
            <h3 className="footer-title">Legal</h3>
            <ul className="footer-links">
              <li>
                <button 
                  onClick={() => alert('Página de términos en desarrollo')}
                  className="footer-link-btn"
                >
                  Términos de servicio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert('Página de privacidad en desarrollo')}
                  className="footer-link-btn"
                >
                  Política de privacidad
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert('Página de protección de datos en desarrollo')}
                  className="footer-link-btn"
                >
                  Protección de datos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert('Página de cookies en desarrollo')}
                  className="footer-link-btn"
                >
                  Cookies
                </button>
              </li>
            </ul>
          </div>
          {/* Columna 4: Contacto */}
          <div className="footer-col">
            <h3 className="footer-title">Contacto</h3>
            <ul className="footer-links contact-info">
              <li>
                <span className="contact-label">Email:</span> 
                <button 
                  onClick={copyEmail}
                  className="contact-action"
                  title="Clic para copiar email"
                >
                  prediversa@gmail.com
                </button>
              </li>
              <li>
                <span className="contact-label">Teléfono:</span> 
                <button 
                  onClick={makeCall}
                  className="contact-action"
                  title="Clic para llamar"
                >
                  +57 300 000 0000
                </button>
              </li>
              <li>
                <span className="contact-label">Ubicación:</span> 
                <button 
                  onClick={() => handleExternalLink('https://maps.google.com/?q=Medellín,Antioquia,Colombia', 'Google Maps')}
                  className="contact-action"
                  title="Ver en Google Maps"
                >
                  Medellín, Antioquia
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; <span>{year}</span> PrediVersa. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;