/* eslint-disable no-undef */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const timeoutRef = React.useRef();

  const handleMouseEnter = label => {
    clearTimeout(timeoutRef.current);
    setOpenMenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 180); // retardo de 180ms
  };

  return (
    <header className="header-basic">
      <div className="header-basic-content">
        <div className="header-menu-block">
          <Link to="/" className="header-basic-logo">
            <img src={logo} alt="PrediVersa Logo" width="48" height="48" />
          </Link>
          <nav className="header-main-nav">
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
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link to={menu.path} className="header-main-link">
                      {menu.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="header-basic-actions">
          <Link to="/contacto" className="header-main-link">
            Contacto
          </Link>
          <Link to="/login" className="header-login-btn">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
