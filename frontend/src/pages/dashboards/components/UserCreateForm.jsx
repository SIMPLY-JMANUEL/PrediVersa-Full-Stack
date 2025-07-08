import React, { useState } from 'react';

const UserCreateForm = ({ form, onChange, onSubmit, onCancel, fieldsetStyle, legendStyle }) => {
  const [showAccess, setShowAccess] = useState(false);
  return (
    <form className="tab-content-container" style={{ marginTop: 18, marginBottom: 0 }} onSubmit={onSubmit} autoComplete="off">
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>Datos básicos del usuario</legend>
        <div className="form-grid">
          <label>
            Nombre completo
            <input type="text" name="nombre" value={form.nombre} onChange={onChange} required />
          </label>
          <label>
            Documento
            <input type="text" name="documento" value={form.documento} onChange={onChange} required />
          </label>
          <label>
            Correo electrónico
            <input type="email" name="correo" value={form.correo} onChange={onChange} required />
          </label>
          <label>
            Teléfono del usuario
            <input type="text" name="telefono" value={form.telefono || ''} onChange={onChange} required />
          </label>
          <label>
            Dirección de residencia
            <input type="text" name="direccion" value={form.direccion || ''} onChange={onChange} required />
          </label>
          <label>
            Nombre de familiar
            <input type="text" name="nombreFamiliar" value={form.nombreFamiliar || ''} onChange={onChange} required />
          </label>
          <label>
            Teléfono de familiar
            <input type="text" name="telefonoFamiliar" value={form.telefonoFamiliar || ''} onChange={onChange} required />
          </label>
          <label>
            Rol
            <select name="rol" value={form.rol} onChange={onChange} required>
              <option value="">Seleccione</option>
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="padre">Padre</option>
              <option value="moderador">Moderador</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
        </div>
        <div className="tab-btn-row right">
          <button className="btn-html" type="button" style={{ background: 'var(--color-primary)', color: '#fff' }} onClick={() => setShowAccess(true)} disabled={showAccess}>Siguiente: Asignar acceso</button>
          <button className="btn-html" type="button" onClick={onCancel} style={{ background: '#b0b8d1', color: '#222' }}>Cancelar</button>
        </div>
      </fieldset>
      {showAccess && (
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Asignación de acceso institucional</legend>
          <div className="form-grid">
            <label>
              Email institucional
              <input type="email" name="emailInstitucional" value={form.emailInstitucional || ''} onChange={onChange} required />
            </label>
            <label>
              Usuario
              <input type="text" name="username" value={form.username || ''} onChange={onChange} required />
            </label>
            <label>
              Contraseña inicial
              <input type="text" name="password" value={form.password || ''} onChange={onChange} required minLength={6} />
              <span style={{ fontSize: '0.9em', color: '#888' }}>El usuario deberá cambiarla en su primer ingreso.</span>
            </label>
          </div>
          <div className="tab-btn-row right">
            <button className="btn-html" type="submit" style={{ background: 'var(--color-primary)', color: '#fff' }}>Crear usuario</button>
          </div>
        </fieldset>
      )}
    </form>
  );
};

export default UserCreateForm;
