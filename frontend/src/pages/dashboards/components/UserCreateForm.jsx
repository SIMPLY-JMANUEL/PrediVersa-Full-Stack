import React from 'react';

// Opciones para los campos desplegables
const TIPO_DOCUMENTO_OPTIONS = [
  'Cédula de Ciudadanía',
  'Tarjeta de Identidad',
  'Registro Civil',
  'Cédula de Extranjería',
  'Permiso Especial de Permanencia',
  'Permiso por Protección Temporal',
];

const SEXO_OPTIONS = ['Masculino', 'Femenino'];

const EPS_OPTIONS = [
  'Coosalud',
  'Nueva EPS',
  'Mutual Ser',
  'Salud Mía',
  'Aliansalud',
  'Salud Total',
  'Sanitas',
  'Sura',
  'Famisanar',
  'SOS (Servicio Occidental de Salud)',
  'Comfenalco Valle',
  'Compensar',
  'EPM (Empresas Públicas de Medellín)',
  'Fondo de Pasivo Social de Ferrocarriles Nacionales de Colombia',
  'Cajacopi Atlántico',
  'Capresoca',
  'Comfachocó',
  'Comfaoriente',
  'EPS Familiar de Colombia',
  'Asmet Salud',
  'Emssanar',
  'Capital Salud',
  'Savia Salud',
  'Dusakawi EPSI',
  'Asociación Indígena del Cauca EPSI',
  'Anas Wayuu EPSI',
  'Mallamas EPSI',
  'Pijaos Salud EPSI',
];

const CONDICION_ESPECIAL_OPTIONS = [
  'No Aplica',
  'Condición Médica',
  'Condición Sicológica',
];

// Debug: verificar las opciones
console.log('CONDICION_ESPECIAL_OPTIONS:', CONDICION_ESPECIAL_OPTIONS);

const PERFIL_OPTIONS = [
  'Administrador',
  'Moderador',
  'Docente',
  'Acudiente',
  'Estudiante',
];

const ACTIVO_OPTIONS = ['SI', 'NO'];

const UserCreateForm = ({
  form,
  onChange,
  onSubmit,
  onCancel,
  fieldsetStyle,
  legendStyle,
}) => {
  // Función para generar contraseña segura
  const generateSecurePassword = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Manejar la generación de contraseña
  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    const fakeEvent = {
      target: {
        name: 'contrasena',
        value: newPassword,
      },
    };
    onChange(fakeEvent);
  };

  // Manejar el cambio en condición especial
  const handleCondicionEspecialChange = e => {
    const { value } = e.target;
    console.log('Condición especial seleccionada:', value); // Debug
    onChange(e);
  };

  return (
    <form
      className="tab-content-container"
      style={{ marginTop: 18, marginBottom: 0 }}
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>Datos básicos del usuario</legend>
        <div className="form-grid">
          {/* Nombre Completo - Solo alfabético */}
          <label>
            Nombre Completo *
            <input
              type="text"
              name="nombreCompleto"
              value={form.nombreCompleto || ''}
              onChange={onChange}
              placeholder="Solo letras y espacios"
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              title="Solo se permiten letras y espacios"
              required
            />
          </label>

          {/* Tipo de Documento - Desplegable */}
          <label>
            Tipo de Documento *
            <select
              name="tipoDocumento"
              value={form.tipoDocumento || ''}
              onChange={onChange}
              required
            >
              <option value="">Seleccione tipo de documento</option>
              {TIPO_DOCUMENTO_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {/* Número de Documento - Numérico 5-15 caracteres */}
          <label>
            Número de Documento *
            <input
              type="text"
              name="numeroDocumento"
              value={form.numeroDocumento || ''}
              onChange={onChange}
              placeholder="Entre 5 y 15 números"
              pattern="\d{5,15}"
              minLength="5"
              maxLength="15"
              title="Solo números, entre 5 y 15 caracteres"
              required
            />
          </label>

          {/* Fecha de Nacimiento */}
          <label>
            Fecha de Nacimiento *
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento || ''}
              onChange={onChange}
              required
            />
          </label>

          {/* Edad - Calculado automáticamente */}
          <label>
            Edad
            <input
              type="number"
              name="edad"
              value={form.edad || ''}
              readOnly
              placeholder="Se calcula automáticamente"
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
          </label>

          {/* Sexo - Desplegable */}
          <label>
            Sexo *
            <select
              name="sexo"
              value={form.sexo || ''}
              onChange={onChange}
              required
            >
              <option value="" disabled>
                Seleccione sexo
              </option>
              {SEXO_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {/* Correo Electrónico */}
          <label>
            Correo Electrónico *
            <input
              type="email"
              name="correoElectronico"
              value={form.correoElectronico || ''}
              onChange={onChange}
              placeholder="usuario@ejemplo.com"
              required
            />
          </label>

          {/* Teléfono Usuario - 10 caracteres exactos */}
          <label>
            Teléfono Usuario *
            <input
              type="text"
              name="telefono"
              value={form.telefono || ''}
              onChange={onChange}
              placeholder="Exactamente 10 números"
              pattern="\d{10}"
              minLength="10"
              maxLength="10"
              title="Exactamente 10 números"
              required
            />
          </label>

          {/* Dirección Residencia */}
          <label>
            Dirección Residencia *
            <input
              type="text"
              name="direccion"
              value={form.direccion || ''}
              onChange={onChange}
              placeholder="Dirección completa"
              required
            />
          </label>

          {/* EPS o Seguro Médico */}
          <label>
            EPS o Seguro Médico *
            <select
              name="epsSeguroMedico"
              value={form.epsSeguroMedico || ''}
              onChange={onChange}
              required
            >
              <option value="" disabled>
                Seleccione EPS
              </option>
              {EPS_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {/* Condición Especial */}
          <label>
            Condición Especial *
            <select
              name="condicionEspecial"
              value={form.condicionEspecial || ''}
              onChange={handleCondicionEspecialChange}
              required
            >
              <option value="" disabled>
                Seleccione condición
              </option>
              {CONDICION_ESPECIAL_OPTIONS.map((option, index) => (
                <option key={`condicion-${index}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {/* Descripción Condición - Campo opcional */}
          <label>
            Descripción de la Condición (Opcional)
            <textarea
              name="descripcionCondicion"
              value={form.descripcionCondicion || ''}
              onChange={onChange}
              placeholder="Describa la condición específica (opcional)"
              rows="3"
            />
          </label>

          {/* Contacto de Emergencia - Solo alfabético */}
          <label>
            Nombre de Familiar/Contacto de Emergencia *
            <input
              type="text"
              name="contactoEmergencia"
              value={form.contactoEmergencia || ''}
              onChange={onChange}
              placeholder="Solo letras y espacios"
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              title="Solo se permiten letras y espacios"
              required
            />
          </label>

          {/* Teléfono Familiar - 10 caracteres exactos */}
          <label>
            Teléfono de Contacto de Emergencia *
            <input
              type="text"
              name="telefonoFamiliar"
              value={form.telefonoFamiliar || ''}
              onChange={onChange}
              placeholder="Exactamente 10 números"
              pattern="\d{10}"
              minLength="10"
              maxLength="10"
              title="Exactamente 10 números"
              required
            />
          </label>

          {/* Estado Activo */}
          <label>
            Estado Activo *
            <select
              name="usuarioActivo"
              value={form.usuarioActivo || 'SI'}
              onChange={onChange}
              required
            >
              {ACTIVO_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {/* Usuario (Nombre de usuario único) */}
          <label>
            Usuario *
            <input
              type="text"
              name="usuario"
              value={form.usuario || ''}
              onChange={onChange}
              placeholder="Nombre de usuario único"
              pattern="^[a-zA-Z0-9._\-]+$"
              title="Solo se permiten letras, números, puntos, guiones y guiones bajos"
              minLength="3"
              maxLength="20"
              required
            />
          </label>

          {/* Perfil */}
          <label>
            Perfil *
            <select
              name="perfil"
              value={form.perfil || ''}
              onChange={onChange}
              required
            >
              <option value="" disabled>
                Seleccione perfil
              </option>
              {PERFIL_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {/* Contraseña con generador */}
          <label>
            Contraseña *
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
              <input
                type="text"
                name="contrasena"
                value={form.contrasena || ''}
                onChange={onChange}
                placeholder="Contraseña segura"
                minLength="8"
                required
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                }}
                title="Generar contraseña segura"
              >
                Generar
              </button>
            </div>
            <small style={{ color: '#666', fontSize: '0.85em' }}>
              Mínimo 8 caracteres. Use el botón "Generar" para crear una
              contraseña segura.
            </small>
          </label>
        </div>

        <div className="tab-btn-row right">
          <button
            className="btn-html"
            type="submit"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            Crear Usuario
          </button>
          <button
            className="btn-html"
            type="button"
            onClick={onCancel}
            style={{ background: '#b0b8d1', color: '#222' }}
          >
            Limpiar Formulario
          </button>
        </div>
      </fieldset>

      <style jsx>{`
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-grid label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-grid input,
        .form-grid select,
        .form-grid textarea {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s ease;
        }

        .form-grid input:focus,
        .form-grid select:focus,
        .form-grid textarea:focus {
          border-color: #1976d2;
          outline: none;
        }

        .form-grid input:invalid {
          border-color: #f44336;
        }

        .tab-btn-row {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn-html {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .btn-html:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .tab-btn-row {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  );
};

export default UserCreateForm;
