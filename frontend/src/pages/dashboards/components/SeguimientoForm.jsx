import React, { useState } from 'react';
import axios from 'axios';
import api from '../../../utils/axiosConfig';

const SeguimientoForm = ({ fieldsetStyle, legendStyle, unifiedStyles }) => {
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
    // Datos del seguimiento general
    codigoCaso: '#ALR-000123',
    fechaSeguimiento: new Date().toISOString().split('T')[0],
    profesionalSeguimiento: '',
    tipoSeguimiento: '',
    tipoSeguimientoOtro: '',
    
    // Desarrollo del seguimiento
    observacionesResultados: '',
    intervinientes: '',
    evidenciaDocumental: null,
    
    // Acciones posteriores
    proximasAcciones: '',
    requiereSeguimientoAdicional: '',
    fechaProximoSeguimiento: '',
    estadoCaso: '',
    estadoCasoOtro: ''
  });

  const [intervinientesList, setIntervinientesList] = useState([
    { id: 1, nombre: '', rol: '', entidad: '', relacion: '' }
  ]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fechaSeguimiento.trim()) {
      newErrors.fechaSeguimiento = 'La fecha de seguimiento es requerida';
    }

    if (!formData.profesionalSeguimiento.trim()) {
      newErrors.profesionalSeguimiento = 'El profesional que realiza el seguimiento es requerido';
    }

    if (!formData.tipoSeguimiento) {
      newErrors.tipoSeguimiento = 'El tipo de seguimiento es requerido';
    }

    if (formData.tipoSeguimiento === 'otro' && !formData.tipoSeguimientoOtro.trim()) {
      newErrors.tipoSeguimientoOtro = 'Especifique el tipo de seguimiento';
    }

    if (!formData.observacionesResultados.trim()) {
      newErrors.observacionesResultados = 'Las observaciones/resultados del seguimiento son requeridas';
    }

    if (!formData.estadoCaso) {
      newErrors.estadoCaso = 'El estado del caso es requerido';
    }

    if (formData.estadoCaso === 'otro' && !formData.estadoCasoOtro.trim()) {
      newErrors.estadoCasoOtro = 'Especifique el estado del caso';
    }

    if (formData.requiereSeguimientoAdicional === 'si' && !formData.fechaProximoSeguimiento) {
      newErrors.fechaProximoSeguimiento = 'Debe especificar la fecha del próximo seguimiento';
    }

    // Validar al menos un interviniente con datos
    const tieneIntervinientes = intervinientesList.some(i => i.nombre.trim() && i.rol.trim());
    if (!tieneIntervinientes) {
      newErrors.intervinientes = 'Agregue al menos un interviniente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files : value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleIntervinienteChange = (id, field, value) => {
    setIntervinientesList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addInterviniente = () => {
    const newId = Math.max(...intervinientesList.map(i => i.id), 0) + 1;
    setIntervinientesList(prev => [
      ...prev,
      { id: newId, nombre: '', rol: '', entidad: '', relacion: '' }
    ]);
  };

  const removeInterviniente = (id) => {
    if (intervinientesList.length > 1) {
      setIntervinientesList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      console.error('Errores de validación:', errors);
      return;
    }

    setLoading(true);
    try {
      // Obtener token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors({ submit: 'No hay sesión activa. Por favor inicia sesión nuevamente.' });
        setLoading(false);
        return;
      }

      const payload = {
        numeroCaso: formData.codigoCaso,
        descripcionRequerimiento: `${formData.tipoSeguimiento === 'otro' ? formData.tipoSeguimientoOtro : formData.tipoSeguimiento}: ${formData.observacionesResultados}`,
        estadoRequerimiento: formData.estadoCaso === 'otro' ? 'otro' : formData.estadoCaso,
        profesionalAsignado: formData.profesionalSeguimiento,
        fechaSeguimiento: formData.fechaSeguimiento,
        resultadoSeguimiento: formData.observacionesResultados,
        accionesTomadas: formData.observacionesResultados,
        proximasAcciones: formData.proximasAcciones,
        requiereSeguimientoAdicional: formData.requiereSeguimientoAdicional,
        fechaProximoSeguimiento: formData.fechaProximoSeguimiento,
        intervinientes: intervinientesList.filter(i => i.nombre.trim()),
        observaciones: formData.estadoCasoOtro || formData.observacionesResultados
      };

      const response = await api.post(
        '/api/seguimiento/crear',
        payload
      );

      if (response.data.success || response.status === 200) {
        setSuccessMessage('✅ Seguimiento guardado exitosamente como requerimiento');
        console.log('Requerimiento creado:', response.data);
        
        // Resetear formulario
        setTimeout(() => {
          setFormData({
            codigoCaso: '#ALR-000123',
            fechaSeguimiento: new Date().toISOString().split('T')[0],
            profesionalSeguimiento: '',
            tipoSeguimiento: '',
            tipoSeguimientoOtro: '',
            observacionesResultados: '',
            intervinientes: '',
            evidenciaDocumental: null,
            proximasAcciones: '',
            requiereSeguimientoAdicional: '',
            fechaProximoSeguimiento: '',
            estadoCaso: '',
            estadoCasoOtro: ''
          });
          setIntervinientesList([{ id: 1, nombre: '', rol: '', entidad: '', relacion: '' }]);
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error al guardar seguimiento:', error);
      setErrors({ 
        submit: error.response?.data?.msg || error.message || 'Error al guardar el seguimiento'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    alert('Descargando seguimiento en PDF...');
  };

  const handleAddAdditionalFollow = () => {
    alert('Agregando seguimiento adicional...');
  };

  return (
    <form className="tab-content-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, gap: 18 }} onSubmit={handleSubmit}>
      
      {/* Mensajes de estado */}
      {successMessage && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: 6,
          color: '#155724',
          fontSize: '0.95em',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <i className="fas fa-check-circle"></i>
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: 6,
          color: '#721c24',
          fontSize: '0.95em',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <i className="fas fa-exclamation-circle"></i>
          {errors.submit}
        </div>
      )}
      
      {/* 1. Datos del seguimiento general */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Datos del seguimiento general
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Código de caso / alerta relacionada:</span>
            <input 
              type="text" 
              name="codigoCaso" 
              value={formData.codigoCaso}
              readOnly
              style={readOnlyStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha de seguimiento:</span>
            <input 
              type="date" 
              name="fechaSeguimiento" 
              value={formData.fechaSeguimiento}
              onChange={handleInputChange}
              required 
              style={{
                ...inputStyle,
                borderColor: errors.fechaSeguimiento ? '#dc3545' : '#ddd',
                backgroundColor: errors.fechaSeguimiento ? '#fff5f5' : 'white'
              }}
            />
            {errors.fechaSeguimiento && (
              <small style={{ color: '#dc3545', fontSize: '0.8em' }}>
                <i className="fas fa-exclamation-triangle"></i> {errors.fechaSeguimiento}
              </small>
            )}
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Profesional que realiza el seguimiento:</span>
            <input 
              type="text" 
              name="profesionalSeguimiento" 
              value={formData.profesionalSeguimiento}
              onChange={handleInputChange}
              placeholder="Nombre completo + Rol"
              required
              style={{
                ...inputStyle,
                borderColor: errors.profesionalSeguimiento ? '#dc3545' : '#ddd',
                backgroundColor: errors.profesionalSeguimiento ? '#fff5f5' : 'white'
              }}
            />
            {errors.profesionalSeguimiento && (
              <small style={{ color: '#dc3545', fontSize: '0.8em' }}>
                <i className="fas fa-exclamation-triangle"></i> {errors.profesionalSeguimiento}
              </small>
            )}
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Tipo de seguimiento:</span>
            <select 
              name="tipoSeguimiento" 
              value={formData.tipoSeguimiento}
              onChange={handleInputChange}
              required
              style={{
                ...inputStyle,
                borderColor: errors.tipoSeguimiento ? '#dc3545' : '#ddd',
                backgroundColor: errors.tipoSeguimiento ? '#fff5f5' : 'white'
              }}
            >
              <option value="">Seleccionar</option>
              <option value="llamada_telefonica">Llamada telefónica</option>
              <option value="visita_institucional">Visita institucional</option>
              <option value="reunion_acudiente">Reunión con acudiente</option>
              <option value="respuesta_entidad">Respuesta de entidad externa</option>
              <option value="intervencion_directa">Intervención directa</option>
              <option value="otro">Otro</option>
            </select>
            {errors.tipoSeguimiento && (
              <small style={{ color: '#dc3545', fontSize: '0.8em' }}>
                <i className="fas fa-exclamation-triangle"></i> {errors.tipoSeguimiento}
              </small>
            )}
          </label>

          {formData.tipoSeguimiento === 'otro' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontWeight: 500, color: '#333' }}>Especificar otro tipo:</span>
              <input 
                type="text" 
                name="tipoSeguimientoOtro" 
                value={formData.tipoSeguimientoOtro}
                onChange={handleInputChange}
                placeholder="Especificar..."
                style={inputStyle}
              />
            </label>
          )}
        </div>
      </fieldset>

      {/* 2. Desarrollo del seguimiento */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Desarrollo del seguimiento
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Observaciones / resultados del seguimiento:</span>
            <textarea 
              name="observacionesResultados" 
              value={formData.observacionesResultados}
              onChange={handleInputChange}
              rows={4}
              placeholder="Detallar qué se hizo, qué respondió la entidad, si hubo contacto con el usuario, etc."
              style={{ 
                ...inputStyle, 
                height: 'auto',
                resize: 'vertical',
                fontFamily: 'inherit',
                borderColor: errors.observacionesResultados ? '#dc3545' : '#ddd',
                backgroundColor: errors.observacionesResultados ? '#fff5f5' : 'white'
              }}
            />
            {errors.observacionesResultados && (
              <small style={{ color: '#dc3545', fontSize: '0.8em' }}>
                <i className="fas fa-exclamation-triangle"></i> {errors.observacionesResultados}
              </small>
            )}
          </label>

          <div>
            <span style={{ fontWeight: 500, color: '#333', marginBottom: 8, display: 'block', display: 'flex', alignItems: 'center', gap: 4 }}>
              Intervinientes o actores involucrados:
              {errors.intervinientes && <span style={{ color: '#dc3545', fontSize: '0.85em' }}>⚠️ {errors.intervinientes}</span>}
            </span>
            {intervinientesList.map((interviniente, index) => (
              <div key={interviniente.id} style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 4, 
                padding: 12, 
                marginBottom: 8, 
                backgroundColor: '#fafafa' 
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <input 
                    type="text" 
                    placeholder="Nombre"
                    value={interviniente.nombre}
                    onChange={(e) => handleIntervinienteChange(interviniente.id, 'nombre', e.target.value)}
                    style={{ ...inputStyle, fontSize: '0.85em', height: '32px' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Rol"
                    value={interviniente.rol}
                    onChange={(e) => handleIntervinienteChange(interviniente.id, 'rol', e.target.value)}
                    style={{ ...inputStyle, fontSize: '0.85em', height: '32px' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Entidad"
                    value={interviniente.entidad}
                    onChange={(e) => handleIntervinienteChange(interviniente.id, 'entidad', e.target.value)}
                    style={{ ...inputStyle, fontSize: '0.85em', height: '32px' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Relación con el caso"
                    value={interviniente.relacion}
                    onChange={(e) => handleIntervinienteChange(interviniente.id, 'relacion', e.target.value)}
                    style={{ ...inputStyle, fontSize: '0.85em', height: '32px' }}
                  />
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  {index === intervinientesList.length - 1 && (
                    <button 
                      type="button" 
                      onClick={addInterviniente}
                      style={{ 
                        padding: '4px 8px', 
                        background: '#4caf50', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 3,
                        fontSize: '0.8em',
                        cursor: 'pointer' 
                      }}
                    >
                      + Agregar
                    </button>
                  )}
                  {intervinientesList.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeInterviniente(interviniente.id)}
                      style={{ 
                        padding: '4px 8px', 
                        background: '#f44336', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 3,
                        fontSize: '0.8em',
                        cursor: 'pointer' 
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Evidencia documental (si aplica):</span>
            <input 
              type="file" 
              name="evidenciaDocumental" 
              onChange={handleInputChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.mp3,.wav,.mp4"
              style={inputStyle}
            />
            <small style={{ color: '#666', fontSize: '0.8em' }}>
              Acta, constancia, correo, audio, etc.
            </small>
          </label>
        </div>
      </fieldset>

      {/* 3. Acciones posteriores */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>
          Acciones posteriores
        </legend>
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: '1 / -1' }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Próximas acciones sugeridas:</span>
            <textarea 
              name="proximasAcciones" 
              value={formData.proximasAcciones}
              onChange={handleInputChange}
              rows={3}
              placeholder="Ej: enviar nueva remisión, programar reunión, esperar respuesta, archivar"
              style={{ 
                ...inputStyle, 
                height: 'auto',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>¿Requiere seguimiento adicional?:</span>
            <select 
              name="requiereSeguimientoAdicional" 
              value={formData.requiereSeguimientoAdicional}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Fecha del próximo seguimiento (si aplica):</span>
            <input 
              type="date" 
              name="fechaProximoSeguimiento" 
              value={formData.fechaProximoSeguimiento}
              onChange={handleInputChange}
              style={{
                ...inputStyle,
                borderColor: errors.fechaProximoSeguimiento ? '#dc3545' : '#ddd',
                backgroundColor: errors.fechaProximoSeguimiento ? '#fff5f5' : 'white'
              }}
            />
            {errors.fechaProximoSeguimiento && (
              <small style={{ color: '#dc3545', fontSize: '0.8em' }}>
                <i className="fas fa-exclamation-triangle"></i> {errors.fechaProximoSeguimiento}
              </small>
            )}
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500, color: '#333' }}>Estado del caso:</span>
            <select 
              name="estadoCaso" 
              value={formData.estadoCaso}
              onChange={handleInputChange}
              required
              style={{
                ...inputStyle,
                borderColor: errors.estadoCaso ? '#dc3545' : '#ddd',
                backgroundColor: errors.estadoCaso ? '#fff5f5' : 'white'
              }}
            >
              <option value="">Seleccionar</option>
              <option value="en_proceso">En proceso</option>
              <option value="escalado">Escalado</option>
              <option value="cerrado_atencion_completa">Cerrado por atención completa</option>
              <option value="cerrado_inasistencia">Cerrado por inasistencia o retiro</option>
              <option value="derivado_otra_entidad">Derivado a otra entidad</option>
              <option value="otro">Otro</option>
            </select>
          </label>

          {formData.estadoCaso === 'otro' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontWeight: 500, color: '#333' }}>Especificar otro estado:</span>
              <input 
                type="text" 
                name="estadoCasoOtro" 
                value={formData.estadoCasoOtro}
                onChange={handleInputChange}
                placeholder="Especificar..."
                style={{
                  ...inputStyle,
                  borderColor: errors.estadoCasoOtro ? '#dc3545' : '#ddd',
                  backgroundColor: errors.estadoCasoOtro ? '#fff5f5' : 'white'
                }}
              />
              {errors.estadoCasoOtro && (
                <small style={{ color: '#dc3545', fontSize: '0.8em' }}>
                  <i className="fas fa-exclamation-triangle"></i> {errors.estadoCasoOtro}
                </small>
              )}
            </label>
          )}
        </div>
      </fieldset>

      {/* 4. Acciones del formulario */}
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
          disabled={loading}
          style={{
            background: loading ? '#ccc' : 'linear-gradient(90deg, #4caf50 60%, #66bb6a 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: '1em',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'transform 0.2s, box-shadow 0.2s',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Guardando...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              Guardar seguimiento
            </>
          )}
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
          Descargar en PDF
        </button>

        <button 
          type="button"
          onClick={handleAddAdditionalFollow}
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
          <i className="fas fa-plus"></i>
          Agregar seguimiento adicional
        </button>
      </div>
    </form>
  );
};

export default SeguimientoForm;
