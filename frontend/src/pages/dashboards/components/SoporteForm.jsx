import React, { useState } from 'react';

const SoporteForm = ({ fieldsetStyle, legendStyle, unifiedStyles }) => {
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
    // Solicitud del usuario
    numeroTicket: '#SUP-000789',
    nombreUsuario: '',
    correoElectronico: '',
    tipoSolicitud: '',
    tipoSolicitudOtro: '',
    mensaje: '',
    archivoAdjunto: null,
    fechaHoraSolicitud: new Date().toISOString().slice(0, 16),
    
    // Gestión de soporte
    estadoSolicitud: 'recibida',
    respuestaEquipoTecnico: '',
    prioridadTicket: 'media',
    responsableAsignado: '',
    fechaResolucion: ''
  });

  const [chatHistorial, setChatHistorial] = useState([
    {
      id: 1,
      fecha: '2025-07-07',
      hora: '10:21',
      remitente: 'Usuario',
      mensaje: 'No carga la pantalla de alertas.',
      tipo: 'usuario'
    },
    {
      id: 2,
      fecha: '2025-07-07',
      hora: '10:45',
      remitente: 'Staff - Ana García',
      mensaje: 'Reinicie sesión y verifique la conexión. ¿Persiste el problema?',
      tipo: 'staff'
    },
    {
      id: 3,
      fecha: '2025-07-07',
      hora: '11:15',
      remitente: 'Usuario',
      mensaje: 'Sí, continúa el problema. He reiniciado varias veces.',
      tipo: 'usuario'
    }
  ]);

  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [tipoRemitente, setTipoRemitente] = useState('staff');

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files : value
    }));
  };

  const handleAgregarMensaje = () => {
    if (nuevoMensaje.trim() === '') return;

    const now = new Date();
    const nuevoId = Math.max(...chatHistorial.map(m => m.id)) + 1;
    
    const mensaje = {
      id: nuevoId,
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().slice(0, 5),
      remitente: tipoRemitente === 'usuario' ? 'Usuario' : 'Staff - Administrador',
      mensaje: nuevoMensaje,
      tipo: tipoRemitente
    };

    setChatHistorial(prev => [...prev, mensaje]);
    setNuevoMensaje('');
  };

  const handleEliminarMensaje = (id) => {
    setChatHistorial(prev => prev.filter(msg => msg.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Solicitud de soporte enviada exitosamente');
    console.log('Datos del soporte:', { ...formData, chatHistorial });
  };

  const handleActualizarEstado = () => {
    alert('Estado de solicitud actualizado exitosamente');
  };

  const handleDescargarHistorial = () => {
    alert('Descargando historial de soporte en PDF...');
  };

  const getEstadoColor = () => {
    switch (formData.estadoSolicitud) {
      case 'recibida': return '#6c757d';
      case 'en_proceso': return '#ffc107';
      case 'resuelta': return '#28a745';
      case 'cerrada': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPrioridadColor = () => {
    switch (formData.prioridadTicket) {
      case 'baja': return '#28a745';
      case 'media': return '#ffc107';
      case 'alta': return '#fd7e14';
      case 'urgente': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <form className="tab-content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 18 }} onSubmit={handleSubmit}>
      
      {/* 1. Solicitud del usuario */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Solicitud del usuario
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Número de ticket:</span>
            <input 
              type="text" 
              name="numeroTicket" 
              value={formData.numeroTicket}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Nombre del usuario:</span>
            <input 
              type="text" 
              name="nombreUsuario" 
              value={formData.nombreUsuario}
              onChange={handleInputChange}
              placeholder="Opcional - para solicitudes no anónimas"
              style={inputStyle}
            />
            <small style={{ color: '#666', fontSize: '0.8em' }}>
              Opcional - deje vacío para solicitud anónima
            </small>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Correo electrónico:</span>
            <input 
              type="email" 
              name="correoElectronico" 
              value={formData.correoElectronico}
              onChange={handleInputChange}
              placeholder="email@ejemplo.com"
              style={inputStyle}
            />
            <small style={{ color: '#666', fontSize: '0.8em' }}>
              Para recibir respuesta por email
            </small>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Tipo de solicitud:</span>
            <select 
              name="tipoSolicitud" 
              value={formData.tipoSolicitud}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar tipo</option>
              <option value="soporte_tecnico">Soporte técnico</option>
              <option value="duda_funcionalidad">Duda sobre funcionalidad</option>
              <option value="reporte_error">Reporte de error</option>
              <option value="sugerencia">Sugerencia</option>
              <option value="capacitacion">Solicitud de capacitación</option>
              <option value="otro">Otro</option>
            </select>
          </label>

          {formData.tipoSolicitud === 'otro' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontWeight: 500, color: '#333' }}>Especificar tipo:</span>
              <input 
                type="text" 
                name="tipoSolicitudOtro" 
                value={formData.tipoSolicitudOtro}
                onChange={handleInputChange}
                placeholder="Especificar el tipo de solicitud"
                required
                style={inputStyle}
              />
            </label>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha y hora de solicitud:</span>
            <input 
              type="datetime-local" 
              name="fechaHoraSolicitud" 
              value={formData.fechaHoraSolicitud}
              onChange={handleInputChange}
              required 
              style={inputStyle}
            />
          </label>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Mensaje:</span>
            <textarea 
              name="mensaje" 
              value={formData.mensaje}
              onChange={handleInputChange}
              rows={4} 
              required 
              placeholder="Describa detalladamente su solicitud, problema o duda..."
              style={{
                ...inputStyle,
                height: 'auto',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </label>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Archivo adjunto:</span>
            <input 
              type="file" 
              name="archivoAdjunto" 
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.log"
              style={{
                ...inputStyle,
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.8em' }}>
              Formatos permitidos: PDF, DOC, DOCX, JPG, PNG, TXT, LOG (máx. 10MB)
            </small>
          </label>
        </div>
      </fieldset>

      {/* 2. Gestión de soporte */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Gestión de soporte
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Estado de la solicitud:</span>
            <select 
              name="estadoSolicitud" 
              value={formData.estadoSolicitud}
              onChange={handleInputChange}
              required
              style={{
                ...inputStyle,
                borderColor: getEstadoColor(),
                color: getEstadoColor()
              }}
            >
              <option value="recibida">Recibida</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelta">Resuelta</option>
              <option value="cerrada">Cerrada sin respuesta</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Prioridad del ticket:</span>
            <select 
              name="prioridadTicket" 
              value={formData.prioridadTicket}
              onChange={handleInputChange}
              required
              style={{
                ...inputStyle,
                borderColor: getPrioridadColor(),
                color: getPrioridadColor()
              }}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Responsable asignado:</span>
            <input 
              type="text" 
              name="responsableAsignado" 
              value={formData.responsableAsignado}
              onChange={handleInputChange}
              placeholder="Nombre del técnico responsable"
              style={inputStyle}
            />
          </label>

          {(formData.estadoSolicitud === 'resuelta' || formData.estadoSolicitud === 'cerrada') && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontWeight: 500, color: '#333' }}>Fecha de resolución:</span>
              <input 
                type="datetime-local" 
                name="fechaResolucion" 
                value={formData.fechaResolucion}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </label>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Respuesta del equipo técnico:</span>
            <textarea 
              name="respuestaEquipoTecnico" 
              value={formData.respuestaEquipoTecnico}
              onChange={handleInputChange}
              rows={3} 
              placeholder="Respuesta oficial del equipo de soporte técnico..."
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

      {/* 3. Chat o historial de respuestas */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Chat o historial de respuestas
        </legend>
        
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: '0.9em', color: '#666', fontStyle: 'italic' }}>
            Historial conversacional entre usuario y equipo de soporte
          </span>
        </div>

        {/* Historial de mensajes */}
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto', 
          border: '1px solid #e9ecef', 
          borderRadius: 8, 
          padding: 16,
          backgroundColor: '#f8f9fa',
          marginBottom: 16
        }}>
          {chatHistorial.map((mensaje) => (
            <div key={mensaje.id} style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
              backgroundColor: mensaje.tipo === 'usuario' ? '#e3f2fd' : '#f1f8e9',
              borderLeft: `4px solid ${mensaje.tipo === 'usuario' ? '#2196f3' : '#4caf50'}`
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 8 
              }}>
                <div style={{ 
                  fontSize: '0.85em', 
                  color: '#666', 
                  fontWeight: 500 
                }}>
                  <span style={{ color: mensaje.tipo === 'usuario' ? '#1976d2' : '#388e3c' }}>
                    {mensaje.remitente}
                  </span>
                  <span style={{ marginLeft: 8 }}>
                    {mensaje.fecha} {mensaje.hora}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleEliminarMensaje(mensaje.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontSize: '0.7em',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ 
                fontSize: '0.9em', 
                color: '#333',
                lineHeight: 1.4 
              }}>
                {mensaje.mensaje}
              </div>
            </div>
          ))}
        </div>

        {/* Agregar nuevo mensaje */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: 8, 
          padding: 16,
          backgroundColor: '#fff'
        }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 500, color: '#333', fontSize: '0.9em' }}>
              Agregar nueva respuesta:
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input 
                type="radio" 
                name="tipoRemitente" 
                value="usuario"
                checked={tipoRemitente === 'usuario'}
                onChange={(e) => setTipoRemitente(e.target.value)}
              />
              <span style={{ fontSize: '0.9em' }}>Usuario</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input 
                type="radio" 
                name="tipoRemitente" 
                value="staff"
                checked={tipoRemitente === 'staff'}
                onChange={(e) => setTipoRemitente(e.target.value)}
              />
              <span style={{ fontSize: '0.9em' }}>Staff</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <textarea 
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              rows={2}
              placeholder="Escribir mensaje..."
              style={{
                ...inputStyle,
                height: 'auto',
                minHeight: '60px',
                resize: 'vertical',
                flex: 1
              }}
            />
            <button 
              type="button" 
              onClick={handleAgregarMensaje}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                padding: '8px 16px',
                fontSize: '0.9em',
                cursor: 'pointer',
                height: '36px'
              }}
            >
              Agregar
            </button>
          </div>
        </div>
      </fieldset>

      {/* 4. Acciones del formulario */}
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
            onClick={handleActualizarEstado}
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
            onClick={handleDescargarHistorial}
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
            📄 Descargar Historial
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
          📧 Enviar Solicitud
        </button>
      </div>
    </form>
  );
};

export default SoporteForm;
