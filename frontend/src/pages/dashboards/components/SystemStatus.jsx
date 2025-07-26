import React, { useEffect, useState } from 'react';

function SystemStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5003/api/admin/system-status', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => setStatus(null));
  }, []);

  if (!status)
    return (
      <div className="system-status-card">Cargando estado del sistema...</div>
    );

  return (
    <div
      className="system-status-card"
      style={{
        background: '#fafdff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
        padding: 20,
        marginBottom: 16,
        border: '1px solid #e0e7ef',
      }}
    >
      <h3 style={{ color: '#1976d2', marginBottom: 12 }}>
        <i className="fas fa-tachometer-alt" style={{ marginRight: 8 }} />{' '}
        Estado del Sistema
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: 8 }}>
          <i
            className="fas fa-bolt"
            style={{ color: '#ffb300', marginRight: 8 }}
          />
          <strong>Rendimiento:</strong> {status.rendimiento}%
        </li>
        <li style={{ marginBottom: 8 }}>
          <i
            className="fas fa-shield-alt"
            style={{ color: '#43a047', marginRight: 8 }}
          />
          <strong>Seguridad:</strong> {status.seguridad}
        </li>
        <li style={{ marginBottom: 8 }}>
          <i
            className="fas fa-microchip"
            style={{ color: '#1976d2', marginRight: 8 }}
          />
          <strong>Uso de Recursos:</strong> {status.usoRecursos}%
        </li>
        <li style={{ marginBottom: 8 }}>
          <i
            className="fas fa-clock"
            style={{ color: '#1976d2', marginRight: 8 }}
          />
          <strong>Uptime:</strong> {status.uptime} min
        </li>
        <li style={{ marginBottom: 8 }}>
          <i
            className="fas fa-users"
            style={{ color: '#1976d2', marginRight: 8 }}
          />
          <strong>Usuarios activos:</strong> {status.usuariosActivos}
        </li>
        <li style={{ marginBottom: 8 }}>
          <i
            className="fas fa-network-wired"
            style={{ color: '#1976d2', marginRight: 8 }}
          />
          <strong>Peticiones última hora:</strong> {status.peticionesUltimaHora}
        </li>
        <li style={{ marginBottom: 8 }}>
          <i
            className="fab fa-node-js"
            style={{ color: '#43a047', marginRight: 8 }}
          />
          <strong>Node.js:</strong> {status.version}
        </li>
        <li>
          <i
            className="fas fa-desktop"
            style={{ color: '#1976d2', marginRight: 8 }}
          />
          <strong>Plataforma:</strong> {status.plataforma}
        </li>
      </ul>
    </div>
  );
}

export default SystemStatus;
