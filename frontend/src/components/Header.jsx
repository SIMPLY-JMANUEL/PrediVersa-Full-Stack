import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo-prediversa.png";
import "./Header.css";
import "../styles/main.css"; // Sistema unificado de estilos

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navMenuRef = useRef();

  // Declarar funciones fuera de useEffect para cumplir con Sourcery
  const handleClick = (e) => {
    if (
      navMenuRef.current &&
      !navMenuRef.current.contains(e.target) &&
      !e.target.closest(".mobile-menu-toggle")
    ) {
      setMobileOpen(false);
      setOpenSubmenu(null);
      document.body.style.overflow = "";
    }
  };

  const handleResize = () => {
    if (window.innerWidth > 992) {
      setMobileOpen(false);
      setOpenSubmenu(null);
      document.body.style.overflow = "";
    }
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cerrar menú al redimensionar
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Control overflow body
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
    setOpenSubmenu(null); // Cierra submenús al abrir/cerrar menú móvil
  };

  const handleSubmenuToggle = (submenu) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu);
  };

  return (
    <header className="main-header" role="banner">
      <div className="header-inner">
        {/* Logo Container (Izquierda) */}
        <div className="logo-container">
          <Link to="/" className="logo" aria-label="Logo PrediVersa">
            <img src={logo} alt="Logo PrediVersa" className="logo-img" />
          </Link>
        </div>

        {/* Navigation Container (Derecha) */}
        <nav
          className={`nav-menu${mobileOpen ? " open" : ""}`}
          id="navMenu"
          role="navigation"
          aria-label="Menú principal"
          ref={navMenuRef}
        >
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link btn-inicio" onClick={() => setMobileOpen(false)}>
                <i className="fas fa-home"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/noticias" className="nav-link btn-regresar" onClick={() => setMobileOpen(false)}>
                Noticias
              </Link>
            </li>

            {/* Menú Servicios */}
            <li className={`nav-item has-submenu${openSubmenu === "servicios" ? " open" : ""}`}>
              <button
                className="nav-link btn-regresar submenu-toggle"
                aria-expanded={openSubmenu === "servicios"}
                onClick={() => handleSubmenuToggle("servicios")}
                type="button"
              >
                Servicios <i className="fas fa-chevron-down dropdown-icon"></i>
              </button>
              <ul className="submenu" style={{ display: openSubmenu === "servicios" ? "block" : "none" }}>
                <li>
                  <Link to="/enfoque-educativo" className="submenu-link" onClick={() => setMobileOpen(false)}>
                    Enfoque educativo
                  </Link>
                </li>
                <li>
                  <Link to="/enfoque-empresarial" className="submenu-link" onClick={() => setMobileOpen(false)}>
                    Enfoque empresarial
                  </Link>
                </li>
                <li>
                  <Link to="/capacitaciones" className="submenu-link" onClick={() => setMobileOpen(false)}>
                    Capacitaciones
                  </Link>
                </li>
              </ul>
            </li>

            {/* Menú Quiénes Somos */}
            <li className={`nav-item has-submenu${openSubmenu === "quienes" ? " open" : ""}`}>
              <button
                className="nav-link btn-regresar submenu-toggle"
                aria-expanded={openSubmenu === "quienes"}
                onClick={() => handleSubmenuToggle("quienes")}
                type="button"
              >
                Quiénes Somos <i className="fas fa-chevron-down dropdown-icon"></i>
              </button>
              <ul className="submenu" style={{ display: openSubmenu === "quienes" ? "block" : "none" }}>
                <li>
                  <Link to="/quienes-somos" className="submenu-link" onClick={() => setMobileOpen(false)}>
                    Misión y Visión
                  </Link>
                </li>
                <li>
                  <Link to="/objetivos" className="submenu-link" onClick={() => setMobileOpen(false)}>
                    Objetivos
                  </Link>
                </li>
                <li>
                  <Link to="/equipo" className="submenu-link" onClick={() => setMobileOpen(false)}>
                    Equipo
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/contacto" className="nav-link btn-regresar cta-link" onClick={() => setMobileOpen(false)}>
                Contacto
              </Link>
            </li>

            {/* Botón de Login */}
            <li className="nav-item">
              <Link to="/login" className="nav-link btn-login animate-login" onClick={() => setMobileOpen(false)}>
                <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
              </Link>
            </li>
          </ul>
        </nav>

        {/* Menú móvil */}
        <button
          className={`mobile-menu-toggle${mobileOpen ? " open" : ""}`}
          id="mobileMenuToggle"
          aria-label="Menú móvil"
          onClick={handleMobileToggle}
          type="button"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>
      </div>
    </header>
  );
}

export default Header;