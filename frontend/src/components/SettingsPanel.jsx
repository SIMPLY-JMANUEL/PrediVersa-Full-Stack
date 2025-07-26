import React, { useState } from 'react';
import './SettingsPanel.css';

const defaultProfile = {
  photo: '',
  theme: 'light',
  language: 'es',
  name: '',
  lastName: '',
  role: '',
  documentType: '',
  documentNumber: '',
  email: '',
  phone: '',
  address: '',
};

const themes = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'blue', label: 'Azul' },
];

const languages = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
];

const SettingsPanel = ({ onClose, onSave, initialProfile }) => {
  const [profile, setProfile] = useState(initialProfile || defaultProfile);

  React.useEffect(() => {
    setProfile(initialProfile || defaultProfile);
  }, [initialProfile]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = ev => {
        setProfile(p => ({ ...p, photo: ev.target.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setProfile(p => ({ ...p, [name]: value }));
    }
  };

  const handleSave = () => {
    onSave(profile);
    onClose();
  };

  return (
    <div className="settings-panel-modal">
      <div className="settings-panel-content">
        <div className="settings-header">
          <h2>Configuración</h2>
          <button
            className="settings-close-btn"
            onClick={onClose}
            aria-label="Cerrar configuración"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="settings-form">
          {/* Sección de foto de perfil */}
          <div className="settings-photo-section">
            <div className="photo-upload-container">
              <div className="photo-preview">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="Perfil"
                    className="settings-profile-img"
                  />
                ) : (
                  <div className="photo-placeholder">
                    <i className="fas fa-user" />
                  </div>
                )}
              </div>
              <label className="photo-upload-label">
                Fotografía de perfil
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="photo-input"
                />
                <span className="file-status">
                  {profile.photo
                    ? 'Archivo seleccionado'
                    : 'Ningún archivo seleccionado'}
                </span>
              </label>
            </div>
          </div>

          {/* Grid de campos de información organizados por secciones */}
          <div className="settings-sections">
            {/* Sección: Información Personal */}
            <div className="settings-section">
              <h3 className="section-title">
                <i className="fas fa-user" />
                Información Personal
              </h3>
              <div className="settings-grid">
                <div className="settings-field">
                  <label>
                    Nombre
                    <input
                      type="text"
                      name="name"
                      value={profile.name || ''}
                      onChange={handleChange}
                      placeholder="Administrador"
                    />
                  </label>
                </div>

                <div className="settings-field">
                  <label>
                    Apellido
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName || ''}
                      onChange={handleChange}
                      placeholder="Azul"
                    />
                  </label>
                </div>

                <div className="settings-field">
                  <label>
                    Cargo
                    <input
                      type="text"
                      name="role"
                      value={profile.role || ''}
                      onChange={handleChange}
                      placeholder="ADMIN"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Sección: Documentación */}
            <div className="settings-section">
              <h3 className="section-title">
                <i className="fas fa-id-card" />
                Documentación
              </h3>
              <div className="settings-grid">
                <div className="settings-field">
                  <label>
                    Tipo documento
                    <select
                      name="documentType"
                      value={profile.documentType || ''}
                      onChange={handleChange}
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Cédula de Ciudadanía">
                        Cédula de Ciudadanía
                      </option>
                      <option value="Tarjeta de Identidad">
                        Tarjeta de Identidad
                      </option>
                      <option value="Registro Civil">Registro Civil</option>
                      <option value="Cédula de Extranjería">
                        Cédula de Extranjería
                      </option>
                    </select>
                  </label>
                </div>

                <div className="settings-field">
                  <label>
                    Número documento
                    <input
                      type="text"
                      name="documentNumber"
                      value={profile.documentNumber || ''}
                      readOnly
                      className="readonly-field"
                      placeholder="1"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Sección: Contacto */}
            <div className="settings-section">
              <h3 className="section-title">
                <i className="fas fa-address-book" />
                Información de Contacto
              </h3>
              <div className="settings-grid">
                <div className="settings-field">
                  <label>
                    Correo
                    <input
                      type="email"
                      name="email"
                      value={profile.email || ''}
                      readOnly
                      className="readonly-field"
                      placeholder="AD.01@prediversa.com"
                    />
                  </label>
                </div>

                <div className="settings-field">
                  <label>
                    Teléfono
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      maxLength={20}
                      placeholder="+57 300 123 4567"
                    />
                  </label>
                </div>

                <div className="settings-field settings-field-full">
                  <label>
                    Dirección
                    <input
                      type="text"
                      name="address"
                      value={profile.address || ''}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="Sede Principal PrediVersa"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Sección: Preferencias */}
            <div className="settings-section">
              <h3 className="section-title">
                <i className="fas fa-cog" />
                Preferencias del Sistema
              </h3>
              <div className="settings-grid">
                <div className="settings-field">
                  <label>
                    Paleta de color
                    <select
                      name="theme"
                      value={profile.theme}
                      onChange={handleChange}
                    >
                      {themes.map(t => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="settings-field">
                  <label>
                    Idioma
                    <select
                      name="language"
                      value={profile.language}
                      onChange={handleChange}
                    >
                      {languages.map(l => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="settings-actions">
            <button onClick={handleSave} className="settings-save-btn">
              <i className="fas fa-save" />
              Guardar
            </button>
            <button onClick={onClose} className="settings-cancel-btn">
              <i className="fas fa-times" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
