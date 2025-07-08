import React, { useState } from 'react';

const AlertarForm = ({ fieldsetStyle, legendStyle, unifiedStyles }) => {
  const [formData, setFormData] = useState({
    // Información básica de la alerta
    tipo_alerta: '',
    fecha_hora: '',
    ubicacion: '',
    requiere_atencion_inmediata: '',
    es_reiterativo: '',
    canal_reporte: '',
    
    // Datos del reportado
    nombre_estudiante: '',
    identificacion_estudiante: '',
    curso_grado: '',
    edad: '',
    tipo_reportado: '',
    
    // Datos del reportante
    nombre_reportante: '',
    identificacion_reportante: '',
    relacion_reportado: '',
    telefono_reportante: '',
    email_reportante: '',
    
    // Contenido del reporte
    categoria_incidente: '',
    descripcion_detallada: '',
    evidencias: '',
    testigos: '',
    contexto_previo: '',
    
    // Gestión institucional
    estado_alerta: '',
    prioridad: '',
    coordinador_asignado: '',
    observaciones_preliminares: '',
    
    // Legalidad y privacidad
    consentimiento_informado: false,
    proteccion_datos: false,
    cumplimiento_normativo: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de la alerta:', formData);
    // Aquí se implementaría la lógica para enviar los datos al backend
    alert('Alerta registrada exitosamente');
  };

  // Estilos unificados para todos los campos del formulario
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: unifiedStyles?.input?.fontSize || '14px',
    fontFamily: unifiedStyles?.input?.fontFamily || `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`,
    fontWeight: unifiedStyles?.input?.fontWeight || 400,
    transition: 'border-color 0.2s ease',
    '&:focus': {
      borderColor: '#1976d2',
      outline: 'none'
    }
  };

  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontWeight: unifiedStyles?.label?.fontWeight || 500,
    fontSize: unifiedStyles?.label?.fontSize || '14px',
    color: '#333',
    fontFamily: unifiedStyles?.label?.fontFamily || `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`,
  };

  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: unifiedStyles?.button?.fontSize || '14px',
    fontFamily: unifiedStyles?.button?.fontFamily || `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`,
    fontWeight: unifiedStyles?.button?.fontWeight || 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <form className="tab-content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 18 }} onSubmit={handleSubmit}>
      {/* 1. Información básica de la alerta */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>1. Información básica de la alerta</legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={labelStyle}>
            <span style={{ fontWeight: unifiedStyles?.label?.fontWeight || 500, color: '#333', fontFamily: unifiedStyles?.label?.fontFamily || `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif` }}>Tipo de alerta *</span>
            <select 
              name="tipo_alerta" 
              value={formData.tipo_alerta}
              onChange={handleChange}
              required 
              style={inputStyle}
            >
              <option value="">Seleccionar tipo</option>
              <option value="bullying">Bullying/Acoso escolar</option>
              <option value="violencia_fisica">Violencia física</option>
              <option value="violencia_psicologica">Violencia psicológica</option>
              <option value="abuso_sexual">Abuso sexual</option>
              <option value="negligencia">Negligencia</option>
              <option value="ciberbullying">Ciberbullying</option>
              <option value="discriminacion">Discriminación</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          
          <label style={labelStyle}>
            <span style={{ fontWeight: unifiedStyles?.label?.fontWeight || 500, color: '#333', fontFamily: unifiedStyles?.label?.fontFamily || `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif` }}>Fecha y hora del incidente *</span>
            <input 
              type="datetime-local" 
              name="fecha_hora"
              value={formData.fecha_hora}
              onChange={handleChange}
              required 
              style={inputStyle}
            />
          </label>
          
          <label style={labelStyle}>
            Ubicación del incidente *
            <input 
              type="text" 
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              placeholder="Ej: Aula 201, patio, baños, etc."
              required 
              style={inputStyle}
            />
          </label>
          
          <label style={labelStyle}>
            ¿Requiere atención inmediata? *
            <select 
              name="requiere_atencion_inmediata"
              value={formData.requiere_atencion_inmediata}
              onChange={handleChange}
              required 
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
          
          <label style={labelStyle}>
            ¿Es reiterativo? *
            <select 
              name="es_reiterativo"
              value={formData.es_reiterativo}
              onChange={handleChange}
              required 
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
          
          <label style={labelStyle}>
            Canal de reporte *
            <select 
              name="canal_reporte"
              value={formData.canal_reporte}
              onChange={handleChange}
              required 
              style={inputStyle}
            >
              <option value="">Seleccionar canal</option>
              <option value="app">App móvil</option>
              <option value="presencial">Presencial</option>
              <option value="telefono">Teléfono</option>
              <option value="correo">Correo electrónico</option>
              <option value="otro">Otro</option>
            </select>
          </label>
        </div>
      </fieldset>

      {/* 2. Datos del reportado */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>2. Datos del reportado (si aplica)</legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={labelStyle}>
            Nombre del estudiante / trabajador
            <input 
              type="text" 
              name="nombre_estudiante"
              value={formData.nombre_estudiante}
              onChange={handleChange}
              placeholder="Nombre completo"
              style={inputStyle}
            />
          </label>
          
          <label style={labelStyle}>
            Identificación
            <input 
              type="text" 
              name="identificacion_estudiante"
              value={formData.identificacion_estudiante}
              onChange={handleChange}
              placeholder="Documento de identidad"
              style={inputStyle}
            />
          </label>
          
          <label style={labelStyle}>
            Curso/Grado
            <input 
              type="text" 
              name="curso_grado"
              value={formData.curso_grado}
              onChange={handleChange}
              placeholder="Ej: 5°A, 10°B"
              style={inputStyle}
            />
          </label>
          
          <label style={labelStyle}>
            Edad
            <input 
              type="number" 
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              placeholder="Edad en años"
              min="3"
              max="25"
              style={inputStyle}
            />
          </label>
          
          <label style={labelStyle}>
            Tipo de persona reportada
            <select 
              name="tipo_reportado"
              value={formData.tipo_reportado}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
              <option value="directivo">Directivo</option>
              <option value="personal_apoyo">Personal de apoyo</option>
              <option value="padre_familia">Padre de familia</option>
              <option value="externo">Persona externa</option>
            </select>
          </label>
        </div>
      </fieldset>

      {/* 3. Datos del reportante */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>3. Datos del reportante (usuario que reportó)</legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={labelStyle}>
            Nombre completo *
            <input 
              type="text" 
              name="nombre_reportante"
              value={formData.nombre_reportante}
              onChange={handleChange}
              placeholder="Nombre de quien reporta"
              required
              style={inputStyle}
            />
          </label>
          
          <label style={labelStyle}>
            Identificación *
            <input 
              type="text" 
              name="identificacion_reportante"
              value={formData.identificacion_reportante}
              onChange={handleChange}
              placeholder="Documento de identidad"
              required
              style={inputStyle}
            />
          </label>
          
          <label style={labelStyle}>
            Relación con el reportado
            <select 
              name="relacion_reportado"
              value={formData.relacion_reportado}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Seleccionar relación</option>
              <option value="estudiante">Estudiante (compañero)</option>
              <option value="docente">Docente</option>
              <option value="padre_madre">Padre/Madre</option>
              <option value="familiar">Familiar</option>
              <option value="directivo">Directivo</option>
              <option value="personal_apoyo">Personal de apoyo</option>
              <option value="anonimo">Anónimo</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          
          <label style={labelStyle}>
            Teléfono de contacto
            <input 
              type="tel" 
              name="telefono_reportante"
              value={formData.telefono_reportante}
              onChange={handleChange}
              placeholder="Número de teléfono"
              style={inputStyle}
            />
          </label>
          
          <label style={labelStyle}>
            Email de contacto
            <input 
              type="email" 
              name="email_reportante"
              value={formData.email_reportante}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              style={inputStyle}
            />
          </label>
        </div>
      </fieldset>

      {/* 4. Contenido del reporte */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>4. Contenido del reporte</legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={labelStyle}>
            Categoría del incidente *
            <select 
              name="categoria_incidente"
              value={formData.categoria_incidente}
              onChange={handleChange}
              required 
              style={inputStyle}
            >
              <option value="">Seleccionar categoría</option>
              <option value="agresion_fisica">Agresión física</option>
              <option value="agresion_verbal">Agresión verbal</option>
              <option value="exclusion_social">Exclusión social</option>
              <option value="ciberacoso">Ciberacoso</option>
              <option value="discriminacion">Discriminación</option>
              <option value="abuso_autoridad">Abuso de autoridad</option>
              <option value="negligencia_cuidado">Negligencia en el cuidado</option>
              <option value="violencia_sexual">Violencia sexual</option>
              <option value="vandalismo">Vandalismo</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          
          <label style={labelStyle}>
            Testigos del incidente
            <input 
              type="text" 
              name="testigos"
              value={formData.testigos}
              onChange={handleChange}
              placeholder="Nombres de testigos (si los hay)"
              style={inputStyle}
            />
          </label>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>
            Descripción detallada del incidente *
            <textarea 
              name="descripcion_detallada"
              value={formData.descripcion_detallada}
              onChange={handleChange}
              placeholder="Describe detalladamente lo ocurrido, incluyendo acciones, palabras, contexto y consecuencias..."
              required
              rows="4"
              style={{...inputStyle, resize: 'vertical', minHeight: '100px'}}
            />
          </label>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>
            Evidencias disponibles
            <textarea 
              name="evidencias"
              value={formData.evidencias}
              onChange={handleChange}
              placeholder="Describe las evidencias: fotos, videos, mensajes, documentos, etc."
              rows="3"
              style={{...inputStyle, resize: 'vertical'}}
            />
          </label>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>
            Contexto previo
            <textarea 
              name="contexto_previo"
              value={formData.contexto_previo}
              onChange={handleChange}
              placeholder="¿Hubo situaciones previas relacionadas? ¿Antecedentes relevantes?"
              rows="3"
              style={{...inputStyle, resize: 'vertical'}}
            />
          </label>
        </div>
      </fieldset>

      {/* 5. Gestión institucional */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>5. Gestión institucional</legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={labelStyle}>
            Estado de alerta *
            <select 
              name="estado_alerta"
              value={formData.estado_alerta}
              onChange={handleChange}
              required 
              style={inputStyle}
            >
              <option value="">Seleccionar estado</option>
              <option value="nuevo">Nuevo</option>
              <option value="en_revision">En revisión</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
              <option value="archivado">Archivado</option>
            </select>
          </label>
          
          <label style={labelStyle}>
            Nivel de prioridad *
            <select 
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              required 
              style={inputStyle}
            >
              <option value="">Seleccionar prioridad</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </label>
          
          <label style={labelStyle}>
            Coordinador asignado
            <select 
              name="coordinador_asignado"
              value={formData.coordinador_asignado}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Asignar coordinador</option>
              <option value="coord_convivencia">Coordinador de Convivencia</option>
              <option value="coord_academico">Coordinador Académico</option>
              <option value="rector">Rector</option>
              <option value="psicologo">Psicólogo</option>
              <option value="trabajador_social">Trabajador Social</option>
              <option value="otro">Otro</option>
            </select>
          </label>
        </div>
        
        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>
            Observaciones preliminares
            <textarea 
              name="observaciones_preliminares"
              value={formData.observaciones_preliminares}
              onChange={handleChange}
              placeholder="Observaciones iniciales del equipo directivo o psicosocial..."
              rows="3"
              style={{...inputStyle, resize: 'vertical'}}
            />
          </label>
        </div>
      </fieldset>

      {/* 6. Legalidad y privacidad */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>6. Legalidad y privacidad</legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
            <input 
              type="checkbox" 
              name="consentimiento_informado"
              checked={formData.consentimiento_informado}
              onChange={handleChange}
              required
              style={{ margin: '0' }}
            />
            He obtenido el consentimiento informado necesario para este reporte según la normativa institucional *
          </label>
          
          <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
            <input 
              type="checkbox" 
              name="proteccion_datos"
              checked={formData.proteccion_datos}
              onChange={handleChange}
              required
              style={{ margin: '0' }}
            />
            Confirmo que se han seguido los protocolos de protección de datos personales *
          </label>
          
          <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
            <input 
              type="checkbox" 
              name="cumplimiento_normativo"
              checked={formData.cumplimiento_normativo}
              onChange={handleChange}
              required
              style={{ margin: '0' }}
            />
            Este reporte cumple con la Ley 1620 de 2013 y el Decreto 1965 de 2013 sobre convivencia escolar *
          </label>
        </div>
      </fieldset>

      {/* Acciones de la alerta */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        justifyContent: 'center', 
        flexWrap: 'wrap', 
        padding: '20px 0',
        borderTop: '1px solid #e0e0e0',
        marginTop: 16
      }}>
        <button 
          type="submit"
          style={{
            ...buttonStyle,
            background: 'linear-gradient(90deg, #4caf50 60%, #66bb6a 100%)',
            color: 'white',
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
          Registrar Alerta
        </button>

        <button 
          type="button"
          onClick={() => setFormData({
            tipo_alerta: '', fecha_hora: '', ubicacion: '', requiere_atencion_inmediata: '',
            es_reiterativo: '', canal_reporte: '', nombre_estudiante: '', identificacion_estudiante: '',
            curso_grado: '', edad: '', tipo_reportado: '', nombre_reportante: '', identificacion_reportante: '',
            relacion_reportado: '', telefono_reportante: '', email_reportante: '', categoria_incidente: '',
            descripcion_detallada: '', evidencias: '', testigos: '', contexto_previo: '', estado_alerta: '',
            prioridad: '', coordinador_asignado: '', observaciones_preliminares: '', consentimiento_informado: false,
            proteccion_datos: false, cumplimiento_normativo: false
          })}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(90deg, #9e9e9e 60%, #bdbdbd 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(158, 158, 158, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <i className="fas fa-eraser"></i>
          Limpiar Formulario
        </button>

        <button 
          type="button"
          onClick={() => console.log('Vista previa:', formData)}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(90deg, #2196f3 60%, #42a5f5 100%)',
            color: 'white',
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
          <i className="fas fa-eye"></i>
          Vista Previa
        </button>
      </div>
    </form>
  );
};

export default AlertarForm;
