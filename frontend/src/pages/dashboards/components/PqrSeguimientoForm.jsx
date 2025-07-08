import React, { useState } from 'react';

const PqrSeguimientoForm = ({ fieldsetStyle, legendStyle, unifiedStyles }) => {
  // Estilos unificados para todos los campos del formulario
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: unifiedStyles?.input?.fontSize || '14px',
    fontFamily: unifiedStyles?.input?.fontFamily || `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`,
    fontWeight: unifiedStyles?.input?.fontWeight || 400,
    height: '36px',
    boxSizing: 'border-box'
  };

  // Estilo para campos de solo lectura
  const readOnlyStyle = {
    ...inputStyle,
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    cursor: 'not-allowed',
    border: '1px solid #e9ecef'
  };

  const [formData, setFormData] = useState({
    // Identificación del caso
    numeroPqr: '#PQR-000123',
    fechaIngreso: '2025-07-01',
    fechaLimiteRespuesta: '2025-07-16',
    fechaRespuestaEnviada: '',
    tiempoTranscurrido: '6 días',
    
    // Estado de la solicitud
    estadoPqr: '',
    responsableAsignado: '',
    
    // Acciones administrativas
    cumplioTiempoRespuesta: '',
    accionesCorrectivas: '',
    observacionesAdicionales: ''
  });

  const [actuacionesList, setActuacionesList] = useState([
    { 
      id: 1, 
      fecha: '2025-07-01', 
      usuario: 'Sistema Automático', 
      accion: 'Recepción de solicitud',
      descripcion: 'PQR ingresada al sistema automáticamente desde formulario web' 
    },
    { 
      id: 2, 
      fecha: '2025-07-02', 
      usuario: 'Ana García - Coordinadora PQR', 
      accion: 'Asignación de responsable',
      descripcion: 'Caso asignado al área de Servicios Estudiantiles para revisión y respuesta' 
    },
    { 
      id: 3, 
      fecha: '2025-07-05', 
      usuario: 'Carlos Mendoza - Especialista', 
      accion: 'Contacto con solicitante',
      descripcion: 'Se contactó al estudiante para aclarar detalles adicionales sobre la solicitud' 
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files : value
    }));
  };

  const handleActuacionChange = (id, field, value) => {
    setActuacionesList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addActuacion = () => {
    const newId = Math.max(...actuacionesList.map(a => a.id)) + 1;
    setActuacionesList(prev => [
      ...prev,
      { 
        id: newId, 
        fecha: new Date().toISOString().split('T')[0], 
        usuario: '', 
        accion: '',
        descripcion: '' 
      }
    ]);
  };

  const removeActuacion = (id) => {
    if (actuacionesList.length > 1) {
      setActuacionesList(prev => prev.filter(item => item.id !== id));
    }
  };

  const calculateDaysDifference = (startDate, endDate = null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Seguimiento de PQR registrado exitosamente');
    console.log('Datos del seguimiento:', { ...formData, actuaciones: actuacionesList });
  };

  const handleUpdateStatus = () => {
    alert('Estado de PQR actualizado exitosamente');
  };

  const handleMarkAsNonCompliant = () => {
    if (window.confirm('¿Está seguro de marcar esta PQR como incumplida? Esta acción generará alertas administrativas.')) {
      alert('PQR marcada como incumplida. Se notificará a coordinación.');
    }
  };

  const handleEscalate = () => {
    if (window.confirm('¿Desea escalar esta PQR a coordinación u otra área?')) {
      alert('PQR escalada exitosamente. Se enviará notificación al área correspondiente.');
    }
  };

  const handleDownloadPDF = () => {
    alert('Descargando seguimiento de PQR en PDF...');
  };

  // Calcular estado del tiempo de respuesta
  const isOverdue = () => {
    if (!formData.fechaLimiteRespuesta) return false;
    const today = new Date();
    const limit = new Date(formData.fechaLimiteRespuesta);
    return today > limit && !formData.fechaRespuestaEnviada;
  };

  const getStatusColor = () => {
    if (formData.estadoPqr === 'respondido_termino') return '#28a745';
    if (formData.estadoPqr === 'respondido_fuera_termino') return '#ffc107';
    if (formData.estadoPqr === 'escalado') return '#dc3545';
    if (isOverdue()) return '#dc3545';
    return '#6c757d';
  };

  return (
    <form className="tab-content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 18 }} onSubmit={handleSubmit}>
      
      {/* 1. Identificación del caso */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Identificación del caso
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Número de PQR:</span>
            <input 
              type="text" 
              name="numeroPqr" 
              value={formData.numeroPqr}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Buscar o seleccionar PQR..."
            />
            <small style={{ color: '#666', fontSize: '0.8em' }}>
              Busque por número de PQR o seleccione de la lista
            </small>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha de ingreso:</span>
            <input 
              type="date" 
              name="fechaIngreso" 
              value={formData.fechaIngreso}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha límite de respuesta:</span>
            <input 
              type="date" 
              name="fechaLimiteRespuesta" 
              value={formData.fechaLimiteRespuesta}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha de respuesta enviada:</span>
            <input 
              type="date" 
              name="fechaRespuestaEnviada" 
              value={formData.fechaRespuestaEnviada}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Tiempo transcurrido:</span>
            <div style={{
              ...readOnlyStyle,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
              color: isOverdue() ? '#dc3545' : '#6c757d'
            }}>
              {calculateDaysDifference(formData.fechaIngreso)} días
              {isOverdue() && (
                <span style={{ marginLeft: 8, color: '#dc3545', fontSize: '0.8em' }}>
                  ⚠️ VENCIDA
                </span>
              )}
            </div>
          </label>
        </div>
      </fieldset>

      {/* 2. Estado de la solicitud */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Estado de la solicitud
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Estado actual de la PQR:</span>
            <select 
              name="estadoPqr" 
              value={formData.estadoPqr}
              onChange={handleInputChange}
              required
              style={{
                ...inputStyle,
                borderColor: getStatusColor(),
                color: getStatusColor()
              }}
            >
              <option value="">Seleccionar estado</option>
              <option value="recibido">Recibido</option>
              <option value="en_revision">En revisión</option>
              <option value="respondido_termino">Respondido en término</option>
              <option value="respondido_fuera_termino">Respondido fuera de término</option>
              <option value="cerrado_sin_respuesta">Cerrado sin respuesta</option>
              <option value="escalado">Escalado</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Responsable asignado:</span>
            <input 
              type="text" 
              name="responsableAsignado" 
              value={formData.responsableAsignado}
              onChange={handleInputChange}
              placeholder="Nombre completo + Rol"
              required
              style={inputStyle}
            />
          </label>
        </div>
      </fieldset>

      {/* 3. Historial de actuaciones */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Historial de actuaciones
        </legend>
        
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: '0.9em', color: '#666', fontStyle: 'italic' }}>
            Registro cronológico de todas las acciones realizadas sobre esta PQR
          </span>
        </div>

        {actuacionesList.map((actuacion, index) => (
          <div key={actuacion.id} style={{ 
            padding: 16, 
            border: '1px solid #e9ecef', 
            borderRadius: 8, 
            backgroundColor: '#f8f9fa',
            marginBottom: 12,
            borderLeft: '4px solid #007bff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ margin: 0, color: '#495057', fontSize: '0.9em' }}>
                Actuación #{index + 1}
              </h4>
              {actuacionesList.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeActuacion(actuacion.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 8px',
                    fontSize: '0.8em',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              )}
            </div>
            
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 500, color: '#333', fontSize: '0.85em' }}>Fecha:</span>
                <input 
                  type="date" 
                  value={actuacion.fecha}
                  onChange={(e) => handleActuacionChange(actuacion.id, 'fecha', e.target.value)}
                  required
                  style={{ ...inputStyle, fontSize: '0.85em', height: '32px' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 500, color: '#333', fontSize: '0.85em' }}>Usuario responsable:</span>
                <input 
                  type="text" 
                  value={actuacion.usuario}
                  onChange={(e) => handleActuacionChange(actuacion.id, 'usuario', e.target.value)}
                  placeholder="Nombre + Rol"
                  required
                  style={{ ...inputStyle, fontSize: '0.85em', height: '32px' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 500, color: '#333', fontSize: '0.85em' }}>Tipo de acción:</span>
                <select 
                  value={actuacion.accion}
                  onChange={(e) => handleActuacionChange(actuacion.id, 'accion', e.target.value)}
                  required
                  style={{ ...inputStyle, fontSize: '0.85em', height: '32px' }}
                >
                  <option value="">Seleccionar</option>
                  <option value="Recepción de solicitud">Recepción de solicitud</option>
                  <option value="Asignación de responsable">Asignación de responsable</option>
                  <option value="Contacto con solicitante">Contacto con solicitante</option>
                  <option value="Investigación del caso">Investigación del caso</option>
                  <option value="Respuesta enviada">Respuesta enviada</option>
                  <option value="Seguimiento realizado">Seguimiento realizado</option>
                  <option value="Escalamiento">Escalamiento</option>
                  <option value="Cierre de caso">Cierre de caso</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
                <span style={{ fontWeight: 500, color: '#333', fontSize: '0.85em' }}>Descripción detallada:</span>
                <textarea 
                  value={actuacion.descripcion}
                  onChange={(e) => handleActuacionChange(actuacion.id, 'descripcion', e.target.value)}
                  rows={2}
                  placeholder="Descripción detallada de la actuación realizada..."
                  required
                  style={{
                    ...inputStyle,
                    fontSize: '0.85em',
                    height: 'auto',
                    minHeight: '60px',
                    resize: 'vertical'
                  }}
                />
              </label>
            </div>
          </div>
        ))}

        <button 
          type="button" 
          onClick={addActuacion}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '8px 16px',
            fontSize: '0.9em',
            cursor: 'pointer',
            marginTop: 8
          }}
        >
          + Agregar nueva actuación
        </button>
      </fieldset>

      {/* 4. Acciones administrativas */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Acciones administrativas
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>¿Cumplió con el tiempo de respuesta?</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: '36px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <input 
                  type="radio" 
                  name="cumplioTiempoRespuesta" 
                  value="si"
                  checked={formData.cumplioTiempoRespuesta === 'si'}
                  onChange={handleInputChange}
                />
                <span>Sí</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <input 
                  type="radio" 
                  name="cumplioTiempoRespuesta" 
                  value="no"
                  checked={formData.cumplioTiempoRespuesta === 'no'}
                  onChange={handleInputChange}
                />
                <span>No</span>
              </label>
            </div>
          </label>

          {formData.cumplioTiempoRespuesta === 'no' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
              <span style={{ fontWeight: 500, color: '#333' }}>Acciones correctivas por incumplimiento:</span>
              <textarea 
                name="accionesCorrectivas" 
                value={formData.accionesCorrectivas}
                onChange={handleInputChange}
                rows={3} 
                placeholder="Ej: Notificación al responsable, revisión de procedimiento, reentrenamiento, plan de mejora..."
                style={{
                  ...inputStyle,
                  height: 'auto',
                  minHeight: '90px',
                  resize: 'vertical'
                }}
              />
            </label>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Observaciones adicionales del seguimiento:</span>
            <textarea 
              name="observacionesAdicionales" 
              value={formData.observacionesAdicionales}
              onChange={handleInputChange}
              rows={3} 
              placeholder="Observaciones adicionales sobre el seguimiento administrativo, lecciones aprendidas, recomendaciones..."
              style={{
                ...inputStyle,
                height: 'auto',
                minHeight: '90px',
                resize: 'vertical'
              }}
            />
          </label>
        </div>
      </fieldset>

      {/* 5. Acciones del formulario */}
      <div className="tab-btn-row" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: 12, 
        marginTop: 20 
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button 
            type="button" 
            onClick={handleUpdateStatus}
            style={{
              background: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '10px 16px',
              fontSize: '0.9em',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
          >
            📊 Actualizar Estado
          </button>

          <button 
            type="button" 
            onClick={handleMarkAsNonCompliant}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '10px 16px',
              fontSize: '0.9em',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            ⚠️ Marcar Incumplida
          </button>

          <button 
            type="button" 
            onClick={handleEscalate}
            style={{
              background: '#fd7e14',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '10px 16px',
              fontSize: '0.9em',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e8650e'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#fd7e14'}
          >
            📈 Escalar
          </button>

          <button 
            type="button" 
            onClick={handleDownloadPDF}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '10px 16px',
              fontSize: '0.9em',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            📄 Descargar PDF
          </button>
        </div>

        <button 
          type="submit"
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '10px 20px',
            fontSize: '0.95em',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
        >
          💾 Registrar Seguimiento
        </button>
      </div>
    </form>
  );
};

export default PqrSeguimientoForm;
