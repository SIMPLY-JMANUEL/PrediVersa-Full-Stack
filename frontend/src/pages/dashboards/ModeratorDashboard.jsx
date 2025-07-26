import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo-prediversa.png';
import Footer from '../../components/Footer';
import '../../components/SettingsPanel.css';
import './_dashboard-variables.css';
import './ModeratorDashboard.css';

function ModeratorDashboard() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container dashboard-moderator">
      {/* Header */}
      <header className="header-main-html" role="banner">
        <div className="header-logo-title-html">
          <img
            src={logo}
            alt="PrediVersa Logo"
            className="header-logo-img-html"
          />
          <span className="header-title-html">Panel del Moderador</span>
        </div>
        <div className="header-user-actions-html">
          <span className="header-user-name-html">
            <i className="fas fa-shield-alt" style={{ marginRight: '8px' }} />
            Moderador PrediVersa
          </span>
          <button
            className="header-btn-html"
            onClick={() => setShowSettings(true)}
            title="Configuración"
          >
            <i className="fas fa-cog" />
          </button>
          <button
            className="header-btn-html"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <i className="fas fa-sign-out-alt" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content-html">
        <main className="construction-container">
          <div className="construction-card">
            <div className="construction-icon">
              <i className="fas fa-hard-hat" />
            </div>
            <h1 className="construction-title">Dashboard Moderador</h1>
            <p className="construction-subtitle">
              Panel de moderación y control en desarrollo
            </p>
            <div className="construction-features">
              <h3>Funcionalidades planificadas:</h3>
              <ul>
                <li>
                  <i className="fas fa-eye" /> Supervisión de contenido
                </li>
                <li>
                  <i className="fas fa-flag" /> Gestión de reportes
                </li>
                <li>
                  <i className="fas fa-ban" /> Moderación de usuarios
                </li>
                <li>
                  <i className="fas fa-shield-check" /> Control de calidad
                </li>
                <li>
                  <i className="fas fa-history" /> Auditoría de actividades
                </li>
              </ul>
            </div>
            <div className="construction-actions">
              <button
                className="btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                <i className="fas fa-arrow-left" />
                Volver al Dashboard Principal
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer institucional */}
      <Footer />
    </div>
  );
}

export default ModeratorDashboard;
