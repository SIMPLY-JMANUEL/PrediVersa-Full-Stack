import React, { useState } from 'react';

const PqrAdminForm = ({ fieldsetStyle, legendStyle, unifiedStyles }) => {
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
    // Datos de la solicitud
    numeroPqr: '#PQR-000456',
    tipoSolicitud: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    solicitanteAnonimo: 'no',
    nombreSolicitante: '',
    documentoSolicitante: '',
    emailSolicitante: '',
    telefonoSolicitante: '',
    medioIngreso: '',
    areaRelacionada: '',
    areaRelacionadaOtra: '',
    descripcionSolicitud: '',
    
    // Gestión y seguimiento
    responsableAsignado: '',
    fechaLimiteRespuesta: '',
    estadoPqr: '',
    prioridadPqr: '',
    respuestaEnviada: 'no',
    fechaRespuesta: '',
    medioRespuesta: '',
    
    // Archivos y evidencias
    documentosAdjuntos: null,
    evidenciaRespuesta: null
  });

  const [actuacionesList, setActuacionesList] = useState([
    { 
      id: 1, 
      fecha: new Date().toISOString().split('T')[0], 
      usuario: '', 
      accion: '', 
      descripcion: '' 
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('PQR guardada/actualizada exitosamente');
    console.log('Datos PQR:', { ...formData, actuaciones: actuacionesList });
  };

  const handleGenerateReport = () => {
    alert('Generando reporte de PQR...');
  };

  const handleSendResponse = () => {
    alert('Enviando respuesta al solicitante...');
  };

  const handleClosePqr = () => {
    if (window.confirm('¿Está seguro de cerrar esta PQR? Esta acción no se puede deshacer.')) {
      alert('PQR cerrada exitosamente');
    }
  };

  return (
    <form className="tab-content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 18 }} onSubmit={handleSubmit}>
      
      {/* 1. Datos de la solicitud */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Datos de la solicitud
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Número PQR:</span>
            <input 
              type="text" 
              name="numeroPqr" 
              value={formData.numeroPqr}
              readOnly
              style={readOnlyStyle}
            />
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
              <option value="">Seleccionar</option>
              <option value="peticion">Petición</option>
              <option value="queja">Queja</option>
              <option value="reclamo">Reclamo</option>
              <option value="sugerencia">Sugerencia</option>
              <option value="felicitacion">Felicitación</option>
              <option value="denuncia">Denuncia</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha de ingreso:</span>
            <input 
              type="date" 
              name="fechaIngreso" 
              value={formData.fechaIngreso}
              onChange={handleInputChange}
              required 
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Medio de ingreso:</span>
            <select 
              name="medioIngreso" 
              value={formData.medioIngreso}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="web">Sitio web</option>
              <option value="fisico">Físico / Presencial</option>
              <option value="app">Aplicación móvil</option>
              <option value="llamada">Llamada telefónica</option>
              <option value="email">Correo electrónico</option>
              <option value="chat">Chat en línea</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Área relacionada:</span>
            <select 
              name="areaRelacionada" 
              value={formData.areaRelacionada}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="docencia">Docencia</option>
              <option value="servicios">Servicios estudiantiles</option>
              <option value="infraestructura">Infraestructura</option>
              <option value="financiera">Área financiera</option>
              <option value="administrativa">Administrativa</option>
              <option value="tecnologia">Tecnología</option>
              <option value="otra">Otra</option>
            </select>
          </label>

          {formData.areaRelacionada === 'otra' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontWeight: 500, color: '#333' }}>Especificar área:</span>
              <input 
                type="text" 
                name="areaRelacionadaOtra" 
                value={formData.areaRelacionadaOtra}
                onChange={handleInputChange}
                placeholder="Especificar el área"
                required
                style={inputStyle}
              />
            </label>
          )}
        </div>
      </fieldset>

      {/* 2. Datos del solicitante */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Datos del solicitante
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Solicitud anónima:</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: '36px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <input 
                  type="radio" 
                  name="solicitanteAnonimo" 
                  value="si"
                  checked={formData.solicitanteAnonimo === 'si'}
                  onChange={handleInputChange}
                />
                <span>Sí</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <input 
                  type="radio" 
                  name="solicitanteAnonimo" 
                  value="no"
                  checked={formData.solicitanteAnonimo === 'no'}
                  onChange={handleInputChange}
                />
                <span>No</span>
              </label>
            </div>
          </label>

          {formData.solicitanteAnonimo === 'no' && (
            <>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
                <span style={{ fontWeight: 500, color: '#333' }}>Nombre completo del solicitante:</span>
                <input 
                  type="text" 
                  name="nombreSolicitante" 
                  value={formData.nombreSolicitante}
                  onChange={handleInputChange}
                  placeholder="Nombre y apellidos completos"
                  required
                  style={inputStyle}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 500, color: '#333' }}>Documento de identidad:</span>
                <input 
                  type="text" 
                  name="documentoSolicitante" 
                  value={formData.documentoSolicitante}
                  onChange={handleInputChange}
                  placeholder="Número de documento"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 500, color: '#333' }}>Correo electrónico:</span>
                <input 
                  type="email" 
                  name="emailSolicitante" 
                  value={formData.emailSolicitante}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 500, color: '#333' }}>Teléfono de contacto:</span>
                <input 
                  type="tel" 
                  name="telefonoSolicitante" 
                  value={formData.telefonoSolicitante}
                  onChange={handleInputChange}
                  placeholder="Número telefónico"
                  style={inputStyle}
                />
              </label>
            </>
          )}
        </div>
      </fieldset>

      {/* 3. Descripción de la solicitud */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Descripción de la solicitud
        </legend>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 500, color: '#333' }}>Descripción detallada:</span>
          <textarea 
            name="descripcionSolicitud" 
            value={formData.descripcionSolicitud}
            onChange={handleInputChange}
            rows={4} 
            required 
            placeholder="Describe detalladamente la solicitud, queja, reclamo o sugerencia..."
            style={{
              ...inputStyle,
              height: 'auto',
              minHeight: '96px',
              resize: 'vertical'
            }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 500, color: '#333' }}>Documentos adjuntos:</span>
          <input 
            type="file" 
            name="documentosAdjuntos" 
            onChange={handleInputChange}
            multiple 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            style={{
              ...inputStyle,
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          />
          <small style={{ color: '#666', fontSize: '0.8em' }}>
            Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada uno)
          </small>
        </label>
      </fieldset>

      {/* 4. Gestión y seguimiento */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Gestión y seguimiento
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Responsable asignado:</span>
            <input 
              type="text" 
              name="responsableAsignado" 
              value={formData.responsableAsignado}
              onChange={handleInputChange}
              placeholder="Nombre del responsable"
              required
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha límite de respuesta:</span>
            <input 
              type="date" 
              name="fechaLimiteRespuesta" 
              value={formData.fechaLimiteRespuesta}
              onChange={handleInputChange}
              required 
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Estado de la PQR:</span>
            <select 
              name="estadoPqr" 
              value={formData.estadoPqr}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="recibida">Recibida</option>
              <option value="en_revision">En revisión</option>
              <option value="en_gestion">En gestión</option>
              <option value="pendiente_respuesta">Pendiente de respuesta</option>
              <option value="respondida">Respondida</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Prioridad:</span>
            <select 
              name="prioridadPqr" 
              value={formData.prioridadPqr}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </label>
        </div>
      </fieldset>

      {/* 5. Historial de actuaciones */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Historial de actuaciones
        </legend>
        
        {actuacionesList.map((actuacion, index) => (
          <div key={actuacion.id} style={{ 
            padding: 16, 
            border: '1px solid #e9ecef', 
            borderRadius: 8, 
            backgroundColor: '#f8f9fa',
            marginBottom: 12
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
                <span style={{ fontWeight: 500, color: '#333', fontSize: '0.85em' }}>Usuario:</span>
                <input 
                  type="text" 
                  value={actuacion.usuario}
                  onChange={(e) => handleActuacionChange(actuacion.id, 'usuario', e.target.value)}
                  placeholder="Nombre del usuario"
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
                  <option value="recepcion">Recepción</option>
                  <option value="revision">Revisión</option>
                  <option value="contacto">Contacto con solicitante</option>
                  <option value="investigacion">Investigación</option>
                  <option value="respuesta">Respuesta enviada</option>
                  <option value="seguimiento">Seguimiento</option>
                  <option value="cierre">Cierre de caso</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
                <span style={{ fontWeight: 500, color: '#333', fontSize: '0.85em' }}>Descripción de la actuación:</span>
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
          + Agregar actuación
        </button>
      </fieldset>

      {/* 6. Respuesta y cierre */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Respuesta y cierre
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Respuesta enviada:</span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: '36px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <input 
                  type="radio" 
                  name="respuestaEnviada" 
                  value="si"
                  checked={formData.respuestaEnviada === 'si'}
                  onChange={handleInputChange}
                />
                <span>Sí</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                <input 
                  type="radio" 
                  name="respuestaEnviada" 
                  value="no"
                  checked={formData.respuestaEnviada === 'no'}
                  onChange={handleInputChange}
                />
                <span>No</span>
              </label>
            </div>
          </label>

          {formData.respuestaEnviada === 'si' && (
            <>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 500, color: '#333' }}>Fecha de respuesta:</span>
                <input 
                  type="date" 
                  name="fechaRespuesta" 
                  value={formData.fechaRespuesta}
                  onChange={handleInputChange}
                  required 
                  style={inputStyle}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 500, color: '#333' }}>Medio de respuesta:</span>
                <select 
                  name="medioRespuesta" 
                  value={formData.medioRespuesta}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Seleccionar</option>
                  <option value="email">Correo electrónico</option>
                  <option value="fisico">Documento físico</option>
                  <option value="llamada">Llamada telefónica</option>
                  <option value="presencial">Reunión presencial</option>
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
                <span style={{ fontWeight: 500, color: '#333' }}>Evidencia de respuesta:</span>
                <input 
                  type="file" 
                  name="evidenciaRespuesta" 
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{
                    ...inputStyle,
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
                />
                <small style={{ color: '#666', fontSize: '0.8em' }}>
                  Adjuntar copia de la respuesta enviada al solicitante
                </small>
              </label>
            </>
          )}
        </div>
      </fieldset>

      {/* 7. Acciones del formulario */}
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
            onClick={handleGenerateReport}
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
            📊 Generar Reporte
          </button>

          {formData.solicitanteAnonimo === 'no' && (
            <button 
              type="button" 
              onClick={handleSendResponse}
              style={{
                background: '#ffc107',
                color: '#212529',
                border: 'none',
                borderRadius: 4,
                padding: '10px 16px',
                fontSize: '0.9em',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e0a800'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}
            >
              📧 Enviar Respuesta
            </button>
          )}

          <button 
            type="button" 
            onClick={handleClosePqr}
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
            🔒 Cerrar PQR
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
          💾 Guardar/Actualizar PQR
        </button>
      </div>
    </form>
  );
};

export default PqrAdminForm;
