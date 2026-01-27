import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../utils/axiosConfig';

const ReportesForm = ({ fieldsetStyle, legendStyle, unifiedStyles }) => {
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
    display: 'block',
    marginBottom: '8px',
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
  const [formData, setFormData] = useState({
    numeroIncidente: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    estadoAlerta: '',
    tipoAlerta: '',
    nivelGravedad: '',
    atencionInmediata: '',
    institucionSede: '',
    nombreEstudiante: '',
    gradoGrupo: '',
    lugarSuceso: '',
    fechaHoraSuceso: '',
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    edad: '',
    sexoGenero: '',
    estadoCivil: '',
    correoElectronico: '',
    telefonoContacto: '',
    direccionResidencia: '',
    responsableAsignado: '',
    descripcionDetallada: '',
    medidasTomadas: '',
    contactoFamiliar: '',
    nombreFamiliar: '',
    telefonoFamiliar: '',
    archivosAdjuntos: null,
    observacionesAdicionales: ''
  });

  const [statusType, setStatusType] = useState(''); // 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [filters, setFilters] = useState({ estado: '', tipo: '' });

  const bannerStyle = (type) => ({
    padding: '10px 12px',
    borderRadius: 6,
    marginBottom: 12,
    color: type === 'success' ? '#155724' : '#721c24',
    background: type === 'success' ? '#d4edda' : '#f8d7da',
    border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
  });

  const fetchRecentReports = async (limit = 5, opts = {}) => {
    try {
      const estado = opts.estado ?? filters.estado;
      const tipo = opts.tipo ?? filters.tipo;
      const qs = new URLSearchParams();
      qs.set('limit', String(limit));
      if (estado) qs.set('estado', estado);
      if (tipo) qs.set('tipo', tipo);
      const resp = await api.get(`/api/admin/reportes?${qs.toString()}`);
      if (resp.data?.success) setRecentReports(resp.data.data || []);
    } catch (err) {
      // Silencioso para no interrumpir el flujo
      console.warn('No se pudieron cargar los últimos reportes:', err?.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files : value
    }));
  };

  const generateIncidentNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    return `INC-${year}${month}${day}-${timestamp}`;
  };

  const handleGenerateNumber = () => {
    setFormData(prev => ({
      ...prev,
      numeroIncidente: generateIncidentNumber()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de token
    const token = localStorage.getItem('token');
    if (!token) {
      setStatusType('error');
      setStatusMsg('No hay token de autenticación. Por favor inicia sesión nuevamente.');
      return;
    }

    // Validaciones básicas
    if (!formData.fechaIngreso || !formData.estadoAlerta || !formData.tipoAlerta) {
      alert('Por favor completa los campos requeridos del incidente');
      return;
    }

    if (!formData.nombreCompleto || !formData.descripcionDetallada) {
      alert('Por favor completa Nombre Completo y Descripción Detallada');
      return;
    }

    try {
      setLoading(true);
      setStatusType('');
      setStatusMsg('');

      // Enviamos sin numeroIncidente para que el backend lo genere
      const payload = { ...formData, numeroIncidente: '' };
      const response = await api.post('/api/admin/reportes', payload);

      if (response.data.success) {
        setStatusType('success');
        setStatusMsg(`Reporte creado exitosamente. Número: ${response.data.data.numeroIncidente}`);
        // Reiniciar formulario
        setFormData({
          numeroIncidente: '',
          fechaIngreso: new Date().toISOString().split('T')[0],
          estadoAlerta: '',
          tipoAlerta: '',
          nivelGravedad: '',
          atencionInmediata: '',
          institucionSede: '',
          nombreEstudiante: '',
          gradoGrupo: '',
          lugarSuceso: '',
          fechaHoraSuceso: '',
          nombreCompleto: '',
          tipoDocumento: '',
          numeroDocumento: '',
          fechaNacimiento: '',
          edad: '',
          sexoGenero: '',
          estadoCivil: '',
          correoElectronico: '',
          telefonoContacto: '',
          direccionResidencia: '',
          responsableAsignado: '',
          descripcionDetallada: '',
          medidasTomadas: '',
          contactoFamiliar: '',
          nombreFamiliar: '',
          telefonoFamiliar: '',
          archivosAdjuntos: [],
          observacionesAdicionales: ''
        });
        fetchRecentReports();
      } else {
        setStatusType('error');
        setStatusMsg(response.data.msg || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error enviando reporte:', error);
      const msg = error.response?.data?.msg || error.message;
      setStatusType('error');
      setStatusMsg(msg.includes('409') ? 'Número duplicado, intenta nuevamente.' : msg);
    }
    finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    alert('Exportando reporte a PDF...');
  };

  const handleExportExcel = () => {
    alert('Exportando reporte a Excel...');
  };

  const handleSendToExternal = () => {
    alert('Enviando reporte a entidad externa...');
  };

  return (
    <form className="tab-content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 18 }} onSubmit={handleSubmit}>
      {statusMsg && (
        <div style={bannerStyle(statusType)}>
          {statusMsg}
        </div>
      )}
      
      {/* 1. Información del incidente */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Información del Incidente
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input 
              type="text" 
              name="numeroIncidente" 
              value={formData.numeroIncidente}
              readOnly
              placeholder="Se generará automáticamente al guardar"
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                border: '1px solid #ddd', 
                borderRadius: 4,
                minWidth: 0,
                height: '36px',
                boxSizing: 'border-box',
                background: '#f8f8f8'
              }}
            />
          </div>
          
          <label style={{...labelStyle, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: unifiedStyles?.label?.fontWeight || 500, color: '#333', fontFamily: unifiedStyles?.label?.fontFamily || `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif` }}>Fecha de ingreso del reporte:</span>
            <input 
              type="date" 
              name="fechaIngreso" 
              value={formData.fechaIngreso}
              onChange={handleInputChange}
              required 
              style={inputStyle}
            />
          </label>

          <label style={{...labelStyle, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: unifiedStyles?.label?.fontWeight || 500, color: '#333', fontFamily: unifiedStyles?.label?.fontFamily || `'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif` }}>Estado de la alerta:</span>
            <select 
              name="estadoAlerta" 
              value={formData.estadoAlerta}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="activa">Activa</option>
              <option value="seguimiento">En seguimiento</option>
              <option value="cerrada">Cerrada</option>
              <option value="escalada">Escalada</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Tipo de alerta:</span>
            <select 
              name="tipoAlerta" 
              value={formData.tipoAlerta}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="violencia_fisica">Violencia física</option>
              <option value="violencia_psicologica">Violencia psicológica</option>
              <option value="acoso">Acoso</option>
              <option value="bullying">Bullying</option>
              <option value="otro">Otro</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Nivel de gravedad:</span>
            <select 
              name="nivelGravedad" 
              value={formData.nivelGravedad}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="leve">Leve</option>
              <option value="moderado">Moderado</option>
              <option value="alto">Alto</option>
              <option value="critico">Crítico</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>¿Requiere atención inmediata?:</span>
            <select 
              name="atencionInmediata" 
              value={formData.atencionInmediata}
              onChange={handleInputChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Institución / sede:</span>
            <input 
              type="text" 
              name="institucionSede" 
              value={formData.institucionSede}
              onChange={handleInputChange}
              required 
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Nombre del estudiante (opcional):</span>
            <input 
              type="text" 
              name="nombreEstudiante" 
              value={formData.nombreEstudiante}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Grado / grupo (si aplica):</span>
            <input 
              type="text" 
              name="gradoGrupo" 
              value={formData.gradoGrupo}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Lugar del suceso:</span>
            <input 
              type="text" 
              name="lugarSuceso" 
              value={formData.lugarSuceso}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha y hora del suceso (si conocida):</span>
            <input 
              type="datetime-local" 
              name="fechaHoraSuceso" 
              value={formData.fechaHoraSuceso}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>
        </div>
      </fieldset>

      {/* 2. Datos personales del involucrado principal */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Datos Personales del Involucrado Principal
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Nombre completo:</span>
            <input 
              type="text" 
              name="nombreCompleto" 
              value={formData.nombreCompleto}
              onChange={handleInputChange}
              required 
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Tipo de documento:</span>
            <select 
              name="tipoDocumento" 
              value={formData.tipoDocumento}
              onChange={handleInputChange}
              required
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            >
              <option value="">Seleccionar</option>
              <option value="cc">Cédula de Ciudadanía</option>
              <option value="ti">Tarjeta de Identidad</option>
              <option value="ce">Cédula de Extranjería</option>
              <option value="rc">Registro Civil</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Número de documento:</span>
            <input 
              type="text" 
              name="numeroDocumento" 
              value={formData.numeroDocumento}
              onChange={handleInputChange}
              required 
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha de nacimiento:</span>
            <input 
              type="date" 
              name="fechaNacimiento" 
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              required 
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Edad:</span>
            <input 
              type="number" 
              name="edad" 
              value={formData.edad}
              onChange={handleInputChange}
              min="0"
              max="120"
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Sexo / Género:</span>
            <select 
              name="sexoGenero" 
              value={formData.sexoGenero}
              onChange={handleInputChange}
              required
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            >
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="prefiero_no_decir">Prefiero no decir</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Estado civil:</span>
            <select 
              name="estadoCivil" 
              value={formData.estadoCivil}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            >
              <option value="">Seleccionar</option>
              <option value="soltero">Soltero(a)</option>
              <option value="casado">Casado(a)</option>
              <option value="union_libre">Unión libre</option>
              <option value="divorciado">Divorciado(a)</option>
              <option value="viudo">Viudo(a)</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Correo electrónico:</span>
            <input 
              type="email" 
              name="correoElectronico" 
              value={formData.correoElectronico}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Teléfono de contacto:</span>
            <input 
              type="tel" 
              name="telefonoContacto" 
              value={formData.telefonoContacto}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: 'span 2' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Dirección de residencia:</span>
            <input 
              type="text" 
              name="direccionResidencia" 
              value={formData.direccionResidencia}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>
        </div>
      </fieldset>

      {/* 3. Información del seguimiento */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Información del Seguimiento
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Responsable asignado (gestor del caso):</span>
            <input 
              type="text" 
              name="responsableAsignado" 
              value={formData.responsableAsignado}
              onChange={handleInputChange}
              required 
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>¿Se ha contactado al familiar?:</span>
            <select 
              name="contactoFamiliar" 
              value={formData.contactoFamiliar}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Nombre del familiar (si aplica):</span>
            <input 
              type="text" 
              name="nombreFamiliar" 
              value={formData.nombreFamiliar}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Teléfono del familiar (si aplica):</span>
            <input 
              type="tel" 
              name="telefonoFamiliar" 
              value={formData.telefonoFamiliar}
              onChange={handleInputChange}
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: 'span 2' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Descripción detallada del caso:</span>
            <textarea 
              name="descripcionDetallada" 
              value={formData.descripcionDetallada}
              onChange={handleInputChange}
              rows={4}
              required 
              placeholder="Describe detalladamente los hechos, circunstancias y contexto del incidente..."
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, resize: 'vertical' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: 'span 2' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Medidas tomadas internamente (si existen):</span>
            <textarea 
              name="medidasTomadas" 
              value={formData.medidasTomadas}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe las acciones, medidas o protocolos ya implementados..."
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, resize: 'vertical' }}
            />
          </label>
        </div>
      </fieldset>

      {/* 4. Evidencias y archivos */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Evidencias y Archivos
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Adjuntar documentos (PDF, imagen, audio, video, etc.):</span>
            <input 
              type="file" 
              name="archivosAdjuntos" 
              onChange={handleInputChange}
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.wav,.doc,.docx,.xls,.xlsx"
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
            />
            <small style={{ color: '#666', fontSize: '0.9em' }}>
              Formatos permitidos: PDF, imágenes, audio, video, documentos de Office
            </small>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Notas u observaciones adicionales:</span>
            <textarea 
              name="observacionesAdicionales" 
              value={formData.observacionesAdicionales}
              onChange={handleInputChange}
              rows={4}
              placeholder="Información adicional relevante, observaciones del caso, recomendaciones..."
              style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, resize: 'vertical' }}
            />
          </label>
        </div>
      </fieldset>

      {/* 5. Acciones del reporte */}
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
          Registrar y Guardar Reporte
        </button>

        <button 
          type="button"
          onClick={handleExportPDF}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(90deg, #f44336 60%, #ef5350 100%)',
            color: 'white',
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
          Exportar PDF
        </button>

        <button 
          type="button"
          onClick={handleExportExcel}
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
          <i className="fas fa-file-excel"></i>
          Exportar Excel
        </button>

        <button 
          type="button"
          onClick={handleSendToExternal}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(90deg, #ff9800 60%, #ffb74d 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <i className="fas fa-paper-plane"></i>
          Enviar a Entidad Externa
        </button>
      </div>
      {/* Ultimos reportes */}
      <fieldset style={{ ...fieldsetStyle, marginTop: 8 }}>
        <legend style={legendStyle}>Últimos reportes</legend>
        {/* Filtros rápidos */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
          <div style={{ flex: '0 0 220px' }}>
            <label style={labelStyle}>Estado</label>
            <select
              name="estado"
              value={filters.estado}
              onChange={(e) => {
                const v = e.target.value;
                setFilters((prev) => ({ ...prev, estado: v }));
                fetchRecentReports(5, { estado: v });
              }}
              style={{ ...inputStyle, height: 36 }}
            >
              <option value="">Todos</option>
              <option value="Abierto">Abierto</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>
          <div style={{ flex: '0 0 220px' }}>
            <label style={labelStyle}>Tipo</label>
            <select
              name="tipo"
              value={filters.tipo}
              onChange={(e) => {
                const v = e.target.value;
                setFilters((prev) => ({ ...prev, tipo: v }));
                fetchRecentReports(5, { tipo: v });
              }}
              style={{ ...inputStyle, height: 36 }}
            >
              <option value="">Todos</option>
              <option value="Bullying">Bullying</option>
              <option value="Acoso">Acoso</option>
              <option value="Violencia">Violencia</option>
              <option value="Consumo">Consumo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => fetchRecentReports(5)}
            style={{ ...buttonStyle, background: '#1976d2', color: '#fff', height: 36 }}
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={() => {
              setFilters({ estado: '', tipo: '' });
              fetchRecentReports(5, { estado: '', tipo: '' });
            }}
            style={{ ...buttonStyle, background: '#9e9e9e', color: '#fff', height: 36 }}
          >
            Limpiar
          </button>
        </div>
        {recentReports?.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {recentReports.slice(0, 5).map((r, idx) => (
              <div key={`${r.Id_Reporte || idx}`} style={{ border: '1px solid #eee', borderRadius: 6, padding: 10 }}>
                <div style={{ fontWeight: 600 }}>{r.Numero_Incidente || 'N/A'}</div>
                <div style={{ fontSize: 13, color: '#555' }}>Estado: {r.Estado_Alerta}</div>
                <div style={{ fontSize: 13, color: '#555' }}>Tipo: {r.Tipo_Alerta}</div>
                <div style={{ fontSize: 12, color: '#777' }}>Fecha: {String(r.Fecha_Ingreso).split('T')[0]}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#777' }}>No hay reportes recientes.</div>
        )}
      </fieldset>

      {/* Botón enviar con estado */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" style={{ ...buttonStyle, background: '#2e7d32', color: '#fff' }} disabled={loading}>
          {loading ? 'Guardando...' : 'Registrar y Guardar Reporte'}
        </button>
      </div>
    </form>
  );
};

export default ReportesForm;
