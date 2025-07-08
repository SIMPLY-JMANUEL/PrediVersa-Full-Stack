import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo-prediversa.png";
import "./DashboardHeader.css";

function DashboardHeader({ 
  title = "Panel Docente", // Valor por defecto actualizado para coincidir con el uso real
  userName, 
  onLogout, 
  onConfig 
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleConfigClick = () => {
    if (onConfig) {
      onConfig();
    } else {
      // Opcional: podrías implementar un modal de configuración básico aquí
      console.log("Configuración clickeada");
    }
  };

  return (
    <header className="dashboard-header-bar">
      <div className="dashboard-header-left">
        <img 
          src={logo} 
          alt="PrediVersa Logo" 
          className="dashboard-logo-large" 
        />
        <span className="dashboard-title">{title}</span>
      </div>
      
      <div className="dashboard-header-spacer" />
      
      <div className="dashboard-header-actions">
        <span className="dashboard-username">
          {userName}
        </span>
        <button
          className="dashboard-config-btn"
          onClick={handleConfigClick}
          aria-label="Configuración"
        >
          ⚙️
        </button>
        <button
          className="dashboard-logout-btn"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

DashboardHeader.propTypes = {
  title: PropTypes.string,
  userName: PropTypes.string.isRequired, // Hacer requerido si siempre lo usas
  onLogout: PropTypes.func,
  onConfig: PropTypes.func,
};

export default DashboardHeader;