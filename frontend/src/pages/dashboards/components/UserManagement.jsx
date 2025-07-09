import React, { useState } from 'react';
import UserCreateForm from './UserCreateForm';

const UserManagement = ({
  userForm,
  handleUserFormChange,
  handleUserFormSubmit,
  handleClearUser,
  fieldsetStyle,
  legendStyle,
  unifiedStyles,
  alwaysShowForm = false,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: '',
    documento: '',
    correo: '',
    telefono: '',
    direccion: '',
    nombreFamiliar: '',
    telefonoFamiliar: '',
    rol: '',
    emailInstitucional: '',
    username: '',
    password: '',
  });
  const handleCreateChange = e => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };
  const handleCreateSubmit = e => {
    e.preventDefault();
    alert(`Usuario creado: ${JSON.stringify(createForm, null, 2)}`);
    setCreateForm({
      nombre: '',
      documento: '',
      correo: '',
      telefono: '',
      direccion: '',
      nombreFamiliar: '',
      telefonoFamiliar: '',
      rol: '',
      emailInstitucional: '',
      username: '',
      password: '',
    });
    setShowCreate(false);
  };
  const handleCancelCreate = () => {
    setShowCreate(false);
    setCreateForm({
      nombre: '',
      documento: '',
      correo: '',
      telefono: '',
      direccion: '',
      nombreFamiliar: '',
      telefonoFamiliar: '',
      rol: '',
      emailInstitucional: '',
      username: '',
      password: '',
    });
  };

  // Estilos unificados aplicando unifiedStyles
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: unifiedStyles?.input?.fontSize || '14px',
    fontFamily:
      unifiedStyles?.input?.fontFamily ||
      "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    fontWeight: unifiedStyles?.input?.fontWeight || 400,
    transition: 'border-color 0.2s ease',
    '&:focus': {
      borderColor: '#1976d2',
      outline: 'none',
    },
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: unifiedStyles?.label?.fontWeight || 500,
    fontSize: unifiedStyles?.label?.fontSize || '14px',
    color: '#333',
    fontFamily:
      unifiedStyles?.label?.fontFamily ||
      "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  };

  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: unifiedStyles?.button?.fontSize || '14px',
    fontFamily:
      unifiedStyles?.button?.fontFamily ||
      "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    fontWeight: unifiedStyles?.button?.fontWeight || 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Mostrar SIEMPRE el formulario editable si alwaysShowForm está activo */}
      <form onSubmit={handleUserFormSubmit} autoComplete="off">
        {alwaysShowForm ? (
          <>
            {/* DATOS PERSONALES - Distribución horizontal */}
            <fieldset
              data-section="datos-personales"
              style={{
                ...fieldsetStyle,
                marginBottom: 32,
                border: '1.5px solid #b6c6e3',
                background: '#fafdff',
                boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.04)',
              }}
            >
              <legend
                style={{
                  ...legendStyle,
                  fontSize: unifiedStyles?.legend?.fontSize || '16px',
                  fontFamily:
                    unifiedStyles?.legend?.fontFamily ||
                    "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
                  fontWeight: unifiedStyles?.legend?.fontWeight || 600,
                  letterSpacing: 0.5,
                  background: '#fafdff',
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #e3eafc',
                  boxShadow: '0 1px 4px 0 #e3eafc',
                }}
              >
                Datos personales
              </legend>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 0.7fr 1fr 1fr',
                  gap: 16,
                  marginBottom: 0,
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Nombre completo
                    <input
                      type="text"
                      name="nombreCompleto"
                      value={userForm.nombreCompleto}
                      onChange={handleUserFormChange}
                      style={inputStyle}
                    />
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>
                    Tipo de documento
                    <select
                      name="tipoDocumento"
                      value={userForm.tipoDocumento}
                      onChange={handleUserFormChange}
                      style={inputStyle}
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="C.C">C.C</option>
                      <option value="T.I">T.I</option>
                      <option value="R.C">R.C</option>
                      <option value="NUIP">NUIP</option>
                      <option value="C.E">C.E</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>
                    Número de documento
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={userForm.numeroDocumento}
                      onChange={handleUserFormChange}
                      style={inputStyle}
                    />
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>
                    Fecha de nacimiento
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={userForm.fechaNacimiento}
                      onChange={handleUserFormChange}
                      placeholder="dd/mm/aaaa"
                      style={inputStyle}
                    />
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>
                    Edad
                    <input
                      type="number"
                      name="edad"
                      value={userForm.edad}
                      onChange={handleUserFormChange}
                      style={inputStyle}
                    />
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>
                    Sexo / Género
                    <select
                      name="sexoGenero"
                      value={userForm.sexoGenero}
                      onChange={handleUserFormChange}
                      style={inputStyle}
                    >
                      <option value="">Seleccionar género</option>
                      <option value="MASCULINO">MASCULINO</option>
                      <option value="FEMENINO">FEMENINO</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>
                    Estado civil
                    <select
                      name="estadoCivil"
                      value={userForm.estadoCivil}
                      onChange={handleUserFormChange}
                      style={inputStyle}
                    >
                      <option value="">Seleccionar estado civil</option>
                      <option value="CASADO">CASADO</option>
                      <option value="SOLTERO">SOLTERO</option>
                      <option value="VIUDO">VIUDO</option>
                      <option value="UNION LIBRE">UNION LIBRE</option>
                    </select>
                  </label>
                </div>
              </div>
            </fieldset>
            {/* CONTACTO */}
            <fieldset
              data-section="contacto"
              style={{
                ...fieldsetStyle,
                marginBottom: 32,
                border: '1.5px solid #b6c6e3',
                background: '#fafdff',
                boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.04)',
              }}
            >
              <legend
                style={{
                  ...legendStyle,
                  fontSize: '1.12em',
                  letterSpacing: 0.5,
                  background: '#fafdff',
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #e3eafc',
                  boxShadow: '0 1px 4px 0 #e3eafc',
                }}
              >
                Contacto
              </legend>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 2fr',
                  gap: 20,
                  marginBottom: 0,
                }}
              >
                <div>
                  <label>
                    Correo electrónico
                    <input
                      type="email"
                      name="correoElectronico"
                      value={userForm.correoElectronico}
                      onChange={handleUserFormChange}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Teléfono del usuario
                    <input
                      type="text"
                      name="telefonoUsuario"
                      value={userForm.telefonoUsuario}
                      onChange={handleUserFormChange}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Dirección de residencia
                    <input
                      type="text"
                      name="direccionResidencia"
                      value={userForm.direccionResidencia}
                      onChange={handleUserFormChange}
                    />
                  </label>
                </div>
              </div>
            </fieldset>
            {/* INSTITUCIÓN Y SALUD */}
            <fieldset
              data-section="institucion-salud"
              style={{
                ...fieldsetStyle,
                marginBottom: 32,
                border: '1.5px solid #b6c6e3',
                background: '#fafdff',
                boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.04)',
              }}
            >
              <legend
                style={{
                  ...legendStyle,
                  fontSize: '1.12em',
                  letterSpacing: 0.5,
                  background: '#fafdff',
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #e3eafc',
                  boxShadow: '0 1px 4px 0 #e3eafc',
                }}
              >
                Institución y salud
              </legend>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr',
                  gap: 18,
                  marginBottom: 0,
                }}
              >
                <div>
                  <label>
                    EPS o seguro médico
                    <input
                      type="text"
                      name="epsSeguroMedico"
                      value={userForm.epsSeguroMedico}
                      onChange={handleUserFormChange}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Antecedentes médicos
                    <input
                      type="text"
                      name="antecedentesMedicos"
                      value={userForm.antecedentesMedicos}
                      onChange={handleUserFormChange}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Condición especial
                    <input
                      type="text"
                      name="condicionEspecial"
                      value={userForm.condicionEspecial}
                      onChange={handleUserFormChange}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Grado o cargo
                    <input
                      type="text"
                      name="gradoCargo"
                      value={userForm.gradoCargo}
                      onChange={handleUserFormChange}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Institución o empresa
                    <input
                      type="text"
                      name="institucionEmpresa"
                      value={userForm.institucionEmpresa}
                      onChange={handleUserFormChange}
                    />
                  </label>
                </div>
              </div>
            </fieldset>
            {/* CONTACTO DE EMERGENCIA */}
            <fieldset
              data-section="emergencia"
              style={{
                ...fieldsetStyle,
                marginBottom: 32,
                border: '1.5px solid #b6c6e3',
                background: '#fafdff',
                boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.04)',
              }}
            >
              <legend
                style={{
                  ...legendStyle,
                  fontSize: unifiedStyles?.legend?.fontSize || '16px',
                  fontFamily:
                    unifiedStyles?.legend?.fontFamily ||
                    "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
                  fontWeight: unifiedStyles?.legend?.fontWeight || 600,
                  letterSpacing: 0.5,
                  background: '#fafdff',
                  padding: '0 12px',
                  borderRadius: 6,
                  border: '1px solid #e3eafc',
                  boxShadow: '0 1px 4px 0 #e3eafc',
                }}
              >
                Contacto de emergencia
              </legend>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 24,
                  marginBottom: 0,
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Nombre de familiar de contacto
                    <input
                      type="text"
                      name="nombreFamiliarContacto"
                      value={userForm.nombreFamiliarContacto}
                      onChange={handleUserFormChange}
                      style={inputStyle}
                    />
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>
                    Teléfono de familiar de contacto
                    <input
                      type="text"
                      name="telefonoFamiliarContacto"
                      value={userForm.telefonoFamiliarContacto}
                      onChange={handleUserFormChange}
                      style={inputStyle}
                    />
                  </label>
                </div>
              </div>
            </fieldset>
            <div className="tab-btn-row right">
              <button
                className="btn-html user-found-clear-btn"
                onClick={handleClearUser}
                type="button"
                style={{
                  ...buttonStyle,
                  marginRight: 12,
                  background: '#e3eafc',
                  color: '#1976d2',
                  border: '1px solid #b6c6e3',
                }}
              >
                Limpiar datos
              </button>
              <button
                className="btn-html"
                type="submit"
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(90deg,#1976d2 60%,#388e3c 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                  padding: '10px 32px',
                  borderRadius: 8,
                  transition: 'background 0.2s',
                }}
              >
                Guardar usuario
              </button>
            </div>
          </>
        ) : (
          <>{/* ...existing code... */}</>
        )}
      </form>
      {/* Estilos globales para inputs y labels del formulario de usuario */}
      <style>{`
        .user-create-section fieldset label {
          display: flex;
          flex-direction: column;
          font-weight: ${unifiedStyles?.label?.fontWeight || 500};
          color: #1976d2;
          font-size: ${unifiedStyles?.label?.fontSize || '14px'};
          font-family: ${
            unifiedStyles?.label?.fontFamily ||
            "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif"
          };
          margin-bottom: 2px;
        }
        .user-create-section fieldset input,
        .user-create-section fieldset select {
          margin-top: 4px;
          padding: 10px 12px;
          border: 1.5px solid #b6c6e3;
          border-radius: 7px;
          font-size: ${unifiedStyles?.input?.fontSize || '14px'};
          font-family: ${
            unifiedStyles?.input?.fontFamily ||
            "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif"
          };
          font-weight: ${unifiedStyles?.input?.fontWeight || 400};
          background: #fff;
          color: #222;
          outline: none;
          transition: border 0.18s, box-shadow 0.18s;
          box-shadow: 0 1px 4px 0 #e3eafc;
        }
        .user-create-section fieldset input:focus,
        .user-create-section fieldset select:focus {
          border: 1.5px solid #1976d2;
          box-shadow: 0 2px 8px 0 #b6c6e3;
        }
        .user-create-section fieldset input[type="date"] {
          font-family: inherit;
        }
        .user-create-section fieldset {
          margin-bottom: 32px !important;
        }
        /* Responsividad para distribución horizontal */
        @media (max-width: 1400px) {
          .user-create-section fieldset[data-section="datos-personales"] > div {
            grid-template-columns: 2fr 1fr 1fr 1fr 0.8fr 1fr !important;
          }
        }
        @media (max-width: 1200px) {
          .user-create-section fieldset[data-section="datos-personales"] > div {
            grid-template-columns: 2fr 1fr 1fr 1fr !important;
          }
          .user-create-section fieldset[data-section="datos-personales"] > div > div:nth-child(5),
          .user-create-section fieldset[data-section="datos-personales"] > div > div:nth-child(6),
          .user-create-section fieldset[data-section="datos-personales"] > div > div:nth-child(7) {
            grid-column: span 1 !important;
          }
          .user-create-section fieldset[data-section="institucion-salud"] > div {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .user-create-section fieldset[data-section="institucion-salud"] > div > div:nth-child(4),
          .user-create-section fieldset[data-section="institucion-salud"] > div > div:nth-child(5) {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 900px) {
          .user-create-section fieldset > div {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .user-create-section fieldset[data-section="contacto"] > div {
            grid-template-columns: 1fr 1fr !important;
          }
          .user-create-section fieldset[data-section="contacto"] > div > div:nth-child(3) {
            grid-column: span 2 !important;
          }
        }
        @media (max-width: 700px) {
          .user-create-section fieldset > div {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .user-create-section fieldset > div > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
      {showCreate && (
        <UserCreateForm
          form={createForm}
          onChange={handleCreateChange}
          onSubmit={handleCreateSubmit}
          onCancel={handleCancelCreate}
          fieldsetStyle={fieldsetStyle}
          legendStyle={legendStyle}
        />
      )}
    </div>
  );
};

export default UserManagement;
