import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';
import '../styles/main.css'; // Sistema unificado de estilos
import Button from './Button'; // Importar desde el index.js del directorio Button

function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  // Función para scroll suave a secciones
  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Función para manejar navegación con scroll
  const handleContactClick = e => {
    e.preventDefault();
    // Si estamos en la página principal, hacer scroll
    if (window.location.pathname === '/') {
      scrollToSection('contacto');
    } else {
      // Si no, navegar a home y luego hacer scroll
      navigate('/');
      window.setTimeout(() => scrollToSection('contacto'), 100);
    }
  };

  // Función para manejar enlaces externos con validación
  const handleExternalLink = (url, platform) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error(`Error al abrir ${platform}:`, error);
      if (window.alert)
        window.alert(`No se pudo abrir ${platform}. Inténtalo más tarde.`);
    }
  };

  // Función para mostrar notificaciones de desarrollo
  const showDevNotification = page => {
    if (window.alert) {
      window.alert(`Página de ${page} en desarrollo`);
    }
  };

  // Función para copiar email al portapapeles
  const copyEmail = () => {
    const email = 'contacto@prediversa.org';
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          if (window.alert) window.alert('Email copiado al portapapeles');
        })
        .catch(() => {
          // Fallback para navegadores que no soporten clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = email;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          if (window.alert) window.alert('Email copiado al portapapeles');
        });
    }
  };

  // Función para hacer llamada directa
  const makeCall = () => {
    const phone = '+5712345677890';
    window.location.href = `tel:${phone}`;
  };

  return (
    <footer className="footer-modern">
      <div className="container">
        <div className="footer-content">
          {/* Sección Principal */}
          <div className="footer-main">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span className="logo-predi">Predi</span>
                <span className="logo-versa">Versa</span>
              </Link>
              <p className="footer-description">
                Plataforma de análisis predictivo que utiliza inteligencia
                artificial para la prevención temprana de riesgos académicos y
                sociales.
              </p>
              <div className="footer-social">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleExternalLink(
                      'https://facebook.com/prediversa',
                      'Facebook'
                    )
                  }
                  className="social-btn"
                  title="Facebook"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleExternalLink(
                      'https://linkedin.com/company/prediversa',
                      'LinkedIn'
                    )
                  }
                  className="social-btn"
                  title="LinkedIn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleExternalLink(
                      'https://instagram.com/prediversa',
                      'Instagram'
                    )
                  }
                  className="social-btn"
                  title="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Navegación */}
            <div className="footer-nav">
              <h3 className="footer-title">Navegación</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/">Inicio</Link>
                </li>
                <li>
                  <Link to="/quienes-somos">Quiénes Somos</Link>
                </li>
                <li>
                  <Link to="/equipo">Equipo</Link>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleContactClick}
                    className="footer-link-btn"
                  >
                    Contacto
                  </Button>
                </li>
                <li>
                  <Link to="/login" className="footer-login-link">
                    Iniciar Sesión
                  </Link>
                </li>
              </ul>
            </div>

            {/* Productos & Servicios */}
            <div className="footer-products">
              <h3 className="footer-title">Productos</h3>
              <ul className="footer-links">
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => showDevNotification('análisis predictivo')}
                    className="footer-link-btn"
                  >
                    Análisis Predictivo
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => showDevNotification('dashboard')}
                    className="footer-link-btn"
                  >
                    Dashboard Inteligente
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => showDevNotification('reportes')}
                    className="footer-link-btn"
                  >
                    Reportes Avanzados
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => showDevNotification('API')}
                    className="footer-link-btn"
                  >
                    API & Integración
                  </Button>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="footer-contact">
              <h3 className="footer-title">Contacto</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyEmail}
                    className="contact-btn"
                    title="Copiar email"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="contact-icon"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    prediversa@gmail.com
                  </Button>
                </div>
                <div className="contact-item">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={makeCall}
                    className="contact-btn"
                    title="Llamar"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="contact-icon"
                    >
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    +57 300 000 0000
                  </Button>
                </div>
                <div className="contact-item">
                  <div className="location">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="contact-icon"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>Medellín, Antioquia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-legal">
              <p className="copyright">
                &copy; {year} PrediVersa AI Solutions. Todos los derechos
                reservados.
              </p>
              <div className="legal-links">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => showDevNotification('términos')}
                  className="legal-link"
                >
                  Términos de Servicio
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => showDevNotification('privacidad')}
                  className="legal-link"
                >
                  Política de Privacidad
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => showDevNotification('cookies')}
                  className="legal-link"
                >
                  Cookies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
