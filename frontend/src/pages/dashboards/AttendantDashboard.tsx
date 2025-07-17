import React from 'react';
import './AttendantDashboard.css';

function AttendantDashboard() {
  return (
    <div className="attendant-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard de Acudiente</h2>
        <p>Bienvenido al panel de control para acudientes</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-cards">
          <div className="card">
            <h3>👥 Estudiantes a Cargo</h3>
            <p>Ver y gestionar información de los estudiantes</p>
          </div>
          
          <div className="card">
            <h3>📊 Rendimiento Académico</h3>
            <p>Seguimiento del progreso académico</p>
          </div>
          
          <div className="card">
            <h3>📅 Cronograma</h3>
            <p>Horarios y actividades programadas</p>
          </div>
          
          <div className="card">
            <h3>💬 Comunicaciones</h3>
            <p>Mensajes y notificaciones del colegio</p>
          </div>
          
          <div className="card">
            <h3>📝 Tareas y Evaluaciones</h3>
            <p>Seguimiento de tareas y evaluaciones</p>
          </div>
          
          <div className="card">
            <h3>💰 Información Financiera</h3>
            <p>Estado de pagos y pensiones</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendantDashboard;
