import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo-prediversa.png';
import Footer from '../../components/Footer';
import '../../components/SettingsPanel.css';
import './_dashboard-variables.css';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSaveSettings = () => {
    // Lógica para guardar configuraciones
    setShowSettings(false);
  };

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <h1>Dashboard Docente</h1>
        <div className="header-actions">
          <button
            onClick={() => setShowSettings(true)}
            className="settings-btn"
          >
            ⚙️ Configuración
          </button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </header>

      {/* Modal de configuración */}
      {showSettings && (
        <div className="settings-modal">
          <div className="modal-content">
            <h2>Configuración</h2>
            <div className="settings-form">
              {/* Formulario de configuración */}
              <label>
                Tema:
                <select>
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>
              </label>
              <label>
                Idioma:
                <select>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowSettings(false)}>Cancelar</button>
              <button onClick={handleSaveSettings}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Resto del contenido del dashboard */}
      <div className="dashboard-content-html">
        <main className="construction-container">
          <div className="construction-card">
            <div className="construction-icon">
              <i className="fas fa-tools" />
            </div>
            <h1 className="construction-title">Dashboard Docente</h1>
            <p className="construction-subtitle">
              Esta sección está en desarrollo activo
            </p>
            <div className="construction-features">
              <h3>Próximas funcionalidades:</h3>
              <ul>
                <li>
                  <i className="fas fa-users" /> Gestión de estudiantes
                </li>
                <li>
                  <i className="fas fa-chart-line" /> Seguimiento académico
                </li>
                <li>
                  <i className="fas fa-calendar" /> Programación de clases
                </li>
                <li>
                  <i className="fas fa-file-alt" /> Reportes de progreso
                </li>
                <li>
                  <i className="fas fa-comments" /> Comunicación con padres
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

export default TeacherDashboard;
