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
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    edad: '',
    sexo: '',
    correoElectronico: '',
    telefono: '',
    direccion: '',
    eps: '',
    condicionEspecial: '',
    descripcionCondicion: '',
    contactoEmergencia: '',
    telefonoFamiliar: '',
    estadoActivo: 'SI',
    perfil: '',
    contrasena: '',
  });

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    console.log('Crear usuario:', createForm);
    // Aquí se enviaría el formulario de crear usuario
  };

  const handleCancelCreate = () => {
    setShowCreate(false);
    setCreateForm({
      nombreCompleto: '',
      tipoDocumento: '',
      numeroDocumento: '',
      fechaNacimiento: '',
      edad: '',
      sexo: '',
      correoElectronico: '',
      telefono: '',
      direccion: '',
      eps: '',
      condicionEspecial: '',
      descripcionCondicion: '',
      contactoEmergencia: '',
      telefonoFamiliar: '',
      estadoActivo: 'SI',
      perfil: '',
      contrasena: '',
    });
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: 6,
    fontSize: '14px',
    fontFamily: unifiedStyles?.button?.fontFamily || "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    fontWeight: unifiedStyles?.button?.fontWeight || 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Mostrar SIEMPRE el formulario editable si alwaysShowForm está activo */}
      {alwaysShowForm ? (
        <UserCreateForm
          form={userForm}
          onChange={handleUserFormChange}
          onSubmit={handleUserFormSubmit}
          onCancel={handleClearUser}
          fieldsetStyle={fieldsetStyle}
          legendStyle={legendStyle}
        />
      ) : (
        <>
          {!showCreate && (
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <button
                onClick={() => setShowCreate(true)}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#1976d2',
                  color: 'white',
                }}
              >
                Crear nuevo usuario
              </button>
            </div>
          )}
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
        </>
      )}
    </div>
  );
};

export default UserManagement;
