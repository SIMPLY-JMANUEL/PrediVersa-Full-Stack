import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequerimientosTable = ({ fieldsetStyle, legendStyle }) => {
  const [requerimientos, setRequerimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    profesional: '',
    limit: 20,
    offset: 0
  });
  const [resumen, setResumen] = useState(null);

  // Estilos para tabla
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9em',
    marginTop: 16
  };

  const thStyle = {
    backgroundColor: '#f5f5f5',
    padding: 12,
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: '2px solid #ddd',
    color: '#333'
  };

  const tdStyle = {
    padding: 10,
    borderBottom: '1px solid #ddd',
    color: '#555'
  };

  const getStatusColor = (estado) => {
    const colors = {
      'pendiente': '#ffc107',
      'en_proceso': '#17a2b8',
      'completado': '#28a745',
      'cancelado': '#dc3545',
      'suspendido': '#6c757d',
      'derivado': '#007bff'
    };
    return colors[estado] || '#999';
  };

  const getPriorityColor = (prioridad) => {
    const colors = {
      'baja': '#28a745',
      'normal': '#17a2b8',
      'alta': '#ffc107',
      'urgente': '#dc3545'
    };
    return colors[prioridad] || '#999';
  };

  useEffect(() => {
    fetchRequerimientos();
    fetchResumen();
  }, [filtros]);

  const fetchRequerimientos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.prioridad) params.append('prioridad', filtros.prioridad);
      if (filtros.profesional) params.append('profesional', filtros.profesional);
      params.append('limit', filtros.limit);
      params.append('offset', filtros.offset);

      const response = await axios.get(
        `http://localhost:5003/api/seguimiento?${params.toString()}`
      );

      if (response.data.success) {
        setRequerimientos(response.data.data || []);
      }
    } catch (error) {
      console.error('Error cargando requerimientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumen = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5003/api/seguimiento/resumen/estadisticas'
      );

      if (response.data.success) {
        setResumen(response.data.data || []);
      }
    } catch (error) {
      console.error('Error cargando resumen:', error);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
      offset: 0
    }));
  };

  const handlePaginar = (direction) => {
    setFiltros(prev => ({
      ...prev,
      offset: direction === 'next' 
        ? prev.offset + prev.limit 
        : Math.max(0, prev.offset - prev.limit)
    }));
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div style={{ width: '100%', padding: 16 }}>
      {/* Resumen estadístico */}
      {resumen && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 24
        }}>
          {resumen.map((stat, idx) => (
            <div
              key={idx}
              style={{
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
                border: '1px solid #ddd',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '0.8em',
                color: '#666',
                marginBottom: 8,
                textTransform: 'capitalize'
              }}>
                {stat.estado}
              </div>
              <div style={{
                fontSize: '1.5em',
                fontWeight: 600,
                color: getStatusColor(stat.estado),
                marginBottom: 8
              }}>
                {stat.total}
              </div>
              <div style={{
                fontSize: '0.75em',
                color: '#999',
                display: 'flex',
                justifyContent: 'space-around'
              }}>
                <span>🔴 {stat.alta || 0}</span>
                <span>🟡 {stat.normal || 0}</span>
                <span>🟢 {stat.baja || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>Filtros de búsqueda</legend>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12
        }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333', fontSize: '0.9em' }}>Estado:</span>
            <select
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              style={{
                padding: '8px 10px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: '0.9em'
              }}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333', fontSize: '0.9em' }}>Prioridad:</span>
            <select
              name="prioridad"
              value={filtros.prioridad}
              onChange={handleFiltroChange}
              style={{
                padding: '8px 10px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: '0.9em'
              }}
            >
              <option value="">Todas</option>
              <option value="baja">Baja</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333', fontSize: '0.9em' }}>Profesional:</span>
            <input
              type="text"
              name="profesional"
              value={filtros.profesional}
              onChange={handleFiltroChange}
              placeholder="Buscar por nombre..."
              style={{
                padding: '8px 10px',
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: '0.9em'
              }}
            />
          </label>
        </div>
      </fieldset>

      {/* Tabla */}
      <div style={{ overflowX: 'auto', marginTop: 16 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Nº Caso</th>
              <th style={thStyle}>Descripción</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Prioridad</th>
              <th style={thStyle}>Profesional</th>
              <th style={thStyle}>Fecha Seguimiento</th>
              <th style={thStyle}>% Completitud</th>
              <th style={thStyle}>Fecha Límite</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', padding: 20 }}>
                  <i className="fas fa-spinner fa-spin"></i> Cargando requerimientos...
                </td>
              </tr>
            ) : requerimientos.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', padding: 20, color: '#999' }}>
                  No hay requerimientos para mostrar
                </td>
              </tr>
            ) : (
              requerimientos.map((req, idx) => (
                <tr key={idx} style={{
                  backgroundColor: idx % 2 === 0 ? '#fafafa' : 'white',
                  transition: 'background-color 0.2s'
                }}>
                  <td style={tdStyle}>
                    <strong>{req.Numero_Caso || '-'}</strong>
                  </td>
                  <td style={{
                    ...tdStyle,
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {req.Descripcion_Requerimiento?.substring(0, 50)}...
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: getStatusColor(req.Estado_Requerimiento),
                      color: 'white',
                      borderRadius: 4,
                      fontSize: '0.8em',
                      fontWeight: 500
                    }}>
                      {req.Estado_Requerimiento}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: getPriorityColor(req.Prioridad),
                      color: 'white',
                      borderRadius: 4,
                      fontSize: '0.8em',
                      fontWeight: 500
                    }}>
                      {req.Prioridad}
                    </span>
                  </td>
                  <td style={tdStyle}>{req.Profesional_Asignado || '-'}</td>
                  <td style={tdStyle}>{formatearFecha(req.Fecha_Seguimiento)}</td>
                  <td style={tdStyle}>
                    <div style={{
                      width: 60,
                      height: 20,
                      backgroundColor: '#e0e0e0',
                      borderRadius: 10,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${req.Porcentaje_Completitud}%`,
                        height: '100%',
                        backgroundColor: req.Porcentaje_Completitud >= 50 ? '#28a745' : '#ffc107',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </td>
                  <td style={tdStyle}>{formatearFecha(req.Fecha_Limite)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {requerimientos.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid #ddd'
        }}>
          <span style={{ color: '#666', fontSize: '0.9em' }}>
            Mostrando registros {filtros.offset + 1} - {filtros.offset + requerimientos.length}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => handlePaginar('prev')}
              disabled={filtros.offset === 0}
              style={{
                padding: '8px 16px',
                backgroundColor: filtros.offset === 0 ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: filtros.offset === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Anterior
            </button>
            <button
              onClick={() => handlePaginar('next')}
              disabled={requerimientos.length < filtros.limit}
              style={{
                padding: '8px 16px',
                backgroundColor: requerimientos.length < filtros.limit ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: requerimientos.length < filtros.limit ? 'not-allowed' : 'pointer'
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequerimientosTable;
