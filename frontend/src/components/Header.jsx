/* eslint-disable no-undef */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo-prediversa.png';
import './Header.css';

const MENU_PRINCIPAL = [
  {
    label: 'Servicios',
    submenu: [
      { label: 'App Enfoque Educativo', path: '/servicios/educativo' },
      { label: 'App Enfoque Empresarial', path: '/servicios/empresarial' },
      { label: 'Capacitaciones', path: '/servicios/capacitaciones' },
      { label: 'Estudios y Analisis', path: '/servicios/entorno' },
    ],
  },
  {
    label: 'Quiénes Somos',
    submenu: [
      { label: 'Misión y Visión', path: '/quienes/mision' },
      { label: 'Objetivos', path: '/quienes/objetivos' },
      { label: 'Metas', path: '/quienes/metas' },
    ],
  },
  {
    label: 'Equipo de Trabajo',
    submenu: [
      { label: 'Gestión de Producto', path: '/equipo/producto' },
      { label: 'Diseño de Experiencia', path: '/equipo/diseno' },
      { label: 'Desarrollo Backend', path: '/equipo/backend' },
    ],
  },
  {
    label: 'Planes',
    path: '/planes',
  },
];

const Header = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = React.useRef();
  const location = useLocation();

  // Detectar si estamos en la página de login
  const isLoginPage = location.pathname === '/login';

  const handleMouseEnter = label => {
    clearTimeout(timeoutRef.current);
    setOpenMenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 180); // retardo de 180ms
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Header especial para página de login
  if (isLoginPage) {
    return (
      <header className="header-basic">
        <div className="header-basic-content">
          <div className="header-menu-block">
            <Link to="/" className="header-basic-logo">
              <img src={logo} alt="PrediVersa Logo" width="48" height="48" />
            </Link>
          </div>
          <div className="header-basic-actions">
            <Link to="/" className="header-home-btn">
              <i className="fas fa-home" aria-hidden="true" />
              Inicio
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Header normal para todas las demás páginas
  return (
    <header className="header-basic">
      <div className="header-basic-content">
        <div className="header-menu-block">
          <Link to="/" className="header-basic-logo">
            <img src={logo} alt="PrediVersa Logo" width="48" height="48" />
          </Link>
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Menú móvil"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>
          <nav
            className={`header-main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}
          >
            <ul className="header-main-menu">
              {MENU_PRINCIPAL.map(menu => (
                <li
                  key={menu.label}
                  className="header-main-item"
                  onMouseEnter={() =>
                    menu.submenu && handleMouseEnter(menu.label)
                  }
                  onMouseLeave={handleMouseLeave}
                  tabIndex={0}
                  aria-haspopup={menu.submenu ? 'true' : 'false'}
                  aria-expanded={openMenu === menu.label}
                >
                  {menu.submenu ? (
                    <>
                      <span className="header-main-link">{menu.label}</span>
                      {openMenu === menu.label && (
                        <ul className="header-submenu">
                          {menu.submenu.map(sub => (
                            <li key={sub.label}>
                              <Link
                                to={sub.path}
                                className="header-submenu-link"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={menu.path}
                      className="header-main-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {menu.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="header-basic-actions">
          <Link
            to="/noticias"
            className="header-main-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Noticias
          </Link>
          <Link
            to="/contacto"
            className="header-main-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contacto
          </Link>
          <Link
            to="/login"
            className="header-login-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
