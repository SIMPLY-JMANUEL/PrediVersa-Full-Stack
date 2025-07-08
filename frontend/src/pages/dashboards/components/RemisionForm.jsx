import React, { useState } from 'react';

const RemisionForm = ({ fieldsetStyle, legendStyle, unifiedStyles }) => {
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
    // Datos vinculados de la alerta (cargados automáticamente)
    numeroAlertaVinculada: '#ALR-000123',
    tipoAlerta: 'Violencia psicológica',
    nombreEstudiante: 'María Elena Rodríguez García',
    edad: '14',
    gradoCargo: '9° Grado',
    institucionSede: 'Colegio San José',
    descripcionBreveFecho: 'Situación de acoso escolar reportada por compañeros de clase...',
    estadoActualAlerta: 'Activa',
    
    // Datos de la remisión
    fechaRemision: new Date().toISOString().split('T')[0],
    motivoRemision: '',
    areaDestino: '',
    entidadReceptora: '',
    profesionalAsignado: '',
    estadoRemision: '',
    comentariosRemitente: '',
    
    // Evidencias y seguimiento
    archivoAdjunto: null,
    notificoAcudiente: '',
    fechaHoraCita: '',
    observacionesSeguimiento: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Remisión registrada exitosamente');
    console.log('Datos de la remisión:', formData);
  };

  const handleDownloadPDF = () => {
    alert('Descargando documento de remisión en PDF...');
  };

  const handleSendEmail = () => {
    alert('Enviando por correo a entidad receptora...');
  };

  return (
    <form className="tab-content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 18 }} onSubmit={handleSubmit}>
      
      {/* 1. Datos vinculados de la alerta */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Datos vinculados de la alerta (se cargan automáticamente)
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Número de alerta vinculada:</span>
            <input 
              type="text" 
              name="numeroAlertaVinculada" 
              value={formData.numeroAlertaVinculada}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Tipo de alerta:</span>
            <input 
              type="text" 
              name="tipoAlerta" 
              value={formData.tipoAlerta}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Nombre del afectado:</span>
            <input 
              type="text" 
              name="nombreEstudiante" 
              value={formData.nombreEstudiante}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Edad:</span>
            <input 
              type="text" 
              name="edad" 
              value={formData.edad}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Grado / cargo (si aplica):</span>
            <input 
              type="text" 
              name="gradoCargo" 
              value={formData.gradoCargo}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Institución / sede:</span>
            <input 
              type="text" 
              name="institucionSede" 
              value={formData.institucionSede}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Descripción breve del hecho:</span>
            <textarea 
              name="descripcionBreveFecho" 
              value={formData.descripcionBreveFecho}
              readOnly
              rows={3}
              style={{ 
                ...readOnlyStyle,
                height: 'auto',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Estado actual de la alerta:</span>
            <input 
              type="text" 
              name="estadoActualAlerta" 
              value={formData.estadoActualAlerta}
              readOnly
              style={readOnlyStyle}
            />
          </label>
        </div>
      </fieldset>

      {/* 2. Datos de la remisión */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Datos de la remisión
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha de remisión:</span>
            <input 
              type="date" 
              name="fechaRemision" 
              value={formData.fechaRemision}
              onChange={handleInputChange}
              required 
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Área de destino:</span>
            <select 
              name="areaDestino" 
              value={formData.areaDestino}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="psicologia">Psicología</option>
              <option value="medicina">Medicina</option>
              <option value="trabajo_social">Trabajo social</option>
              <option value="fiscalia">Fiscalía</option>
              <option value="comisaria">Comisaría</option>
              <option value="otro">Otro</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Entidad receptora / Institución externa:</span>
            <input 
              type="text" 
              name="entidadReceptora" 
              value={formData.entidadReceptora}
              onChange={handleInputChange}
              placeholder="Nombre de la institución o entidad"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Profesional asignado:</span>
            <input 
              type="text" 
              name="profesionalAsignado" 
              value={formData.profesionalAsignado}
              onChange={handleInputChange}
              placeholder="Nombre y rol del profesional"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Estado de la remisión:</span>
            <select 
              name="estadoRemision" 
              value={formData.estadoRemision}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="atendida">Atendida</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Motivo de la remisión:</span>
            <textarea 
              name="motivoRemision" 
              value={formData.motivoRemision}
              onChange={handleInputChange}
              rows={3}
              placeholder="Ej: atención psicológica, examen médico, asesoría legal, etc."
              style={{ 
                ...inputStyle, 
                height: 'auto',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Comentarios del remitente:</span>
            <textarea 
              name="comentariosRemitente" 
              value={formData.comentariosRemitente}
              onChange={handleInputChange}
              rows={3}
              placeholder="Comentarios adicionales sobre la remisión..."
              style={{ 
                ...inputStyle, 
                height: 'auto',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </label>
        </div>
      </fieldset>

      {/* 3. Evidencias y seguimiento */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Evidencias y seguimiento
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Adjuntar archivo (Remisión firmada, acta, autorización, etc.):</span>
            <input 
              type="file" 
              name="archivoAdjunto" 
              onChange={handleInputChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>¿Se notificó al acudiente o familiar?:</span>
            <select 
              name="notificoAcudiente" 
              value={formData.notificoAcudiente}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha y hora de la cita (si ya existe):</span>
            <input 
              type="datetime-local" 
              name="fechaHoraCita" 
              value={formData.fechaHoraCita}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Observaciones de seguimiento (uso interno):</span>
            <textarea 
              name="observacionesSeguimiento" 
              value={formData.observacionesSeguimiento}
              onChange={handleInputChange}
              rows={3}
              placeholder="Observaciones internas sobre el seguimiento del caso..."
              style={{ 
                ...inputStyle, 
                height: 'auto',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </label>
        </div>
      </fieldset>

      {/* 4. Acciones */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 12, 
        justifyContent: 'flex-end',
        marginTop: 'auto',
        paddingTop: 16
      }}>
        <button 
          type="submit"
          style={{
            background: 'linear-gradient(90deg, #4caf50 60%, #66bb6a 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: '1em',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <i className="fas fa-save"></i>
          Registrar remisión
        </button>

        <button 
          type="button"
          onClick={handleDownloadPDF}
          style={{
            background: 'linear-gradient(90deg, #f44336 60%, #ef5350 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: '1em',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <i className="fas fa-file-pdf"></i>
          Descargar documento de remisión (PDF)
        </button>

        <button 
          type="button"
          onClick={handleSendEmail}
          style={{
            background: 'linear-gradient(90deg, #2196f3 60%, #42a5f5 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: '1em',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <i className="fas fa-paper-plane"></i>
          Enviar por correo a entidad receptora
        </button>
      </div>
    </form>
  );
};

export default RemisionForm;
