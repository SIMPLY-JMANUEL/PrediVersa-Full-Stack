import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo-prediversa.png';
import Footer from '../../components/Footer';
import '../../components/SettingsPanel.css';
import './_dashboard-variables.css';
import './ParentDashboard.css';

function ParentDashboard() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container dashboard-parent">
      {/* Header */}
      <header className="header-main-html" role="banner">
        <div className="header-logo-title-html">
          <img
            src={logo}
            alt="PrediVersa Logo"
            className="header-logo-img-html"
          />
          <span className="header-title-html">Panel de Padre/Madre</span>
        </div>
        <div className="header-user-actions-html">
          <span className="header-user-name-html">
            <i className="fas fa-heart" style={{ marginRight: '8px' }} />
            Familia PrediVersa
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
              <i className="fas fa-home" />
            </div>
            <h1 className="construction-title">Dashboard Padre/Madre</h1>
            <p className="construction-subtitle">
              Portal familiar en construcción
            </p>
            <div className="construction-features">
              <h3>Funcionalidades familiares:</h3>
              <ul>
                <li>
                  <i className="fas fa-child" /> Seguimiento del hijo/a
                </li>
                <li>
                  <i className="fas fa-graduation-cap" /> Progreso académico
                </li>
                <li>
                  <i className="fas fa-calendar-check" /> Citas y reuniones
                </li>
                <li>
                  <i className="fas fa-comments" /> Comunicación con docentes
                </li>
                <li>
                  <i className="fas fa-bell" /> Notificaciones importantes
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

export default ParentDashboard;
