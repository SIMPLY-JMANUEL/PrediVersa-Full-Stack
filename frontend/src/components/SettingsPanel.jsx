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
      <div className="settings-panel-content" style={{ maxWidth: 540 }}>
        <h2>Configuración</h2>
        <div
          className="settings-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}
        >
          <div style={{ gridColumn: '1 / span 2', textAlign: 'center' }}>
            <label style={{ fontWeight: 600, color: '#15304b' }}>
              Fotografía de perfil
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />
            </label>
            {profile.photo && (
              <img
                src={profile.photo}
                alt="Perfil"
                className="settings-profile-img"
              />
            )}
          </div>
          <label>
            Nombre
            <input
              type="text"
              name="name"
              value={profile.name || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Apellido
            <input
              type="text"
              name="lastName"
              value={profile.lastName || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Cargo
            <input
              type="text"
              name="role"
              value={profile.role || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Tipo documento
            <input
              type="text"
              name="documentType"
              value={profile.documentType || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Número documento
            <input
              type="text"
              name="documentNumber"
              value={profile.documentNumber || ''}
              readOnly
              style={{ background: '#f3f6fa' }}
            />
          </label>
          <label>
            Correo
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              readOnly
              style={{ background: '#f3f6fa' }}
            />
          </label>
          <label>
            Teléfono
            <input
              type="text"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
              maxLength={20}
            />
          </label>
          <label>
            Dirección
            <input
              type="text"
              name="address"
              value={profile.address || ''}
              onChange={handleChange}
              maxLength={100}
            />
          </label>
          <label>
            Paleta de color
            <select name="theme" value={profile.theme} onChange={handleChange}>
              {themes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
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
        <div className="settings-panel-actions">
          <button onClick={handleSave} className="settings-save-btn">
            Guardar
          </button>
          <button onClick={onClose} className="settings-cancel-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
