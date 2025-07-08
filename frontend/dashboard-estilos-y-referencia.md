# Referencia de Estilos y Lógica para Dashboard PrediVersa

## 1. Centralización de Estilos

Todos los estilos principales del dashboard deben estar en un archivo CSS global, por ejemplo:

`frontend/src/pages/dashboards/components/AdminDashboard.css`

### Ejemplo de variables y utilidades:
```css
:root {
  --color-primary: #1976d2;
  --color-bg-panel: #e3f2fd;
  --color-bg-white: #fff;
  --color-border: #b3c6d6;
  --font-main: 'Inter', Arial, sans-serif;
}
.tab-content-container {
  background: var(--color-bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--color-border);
  padding: 18px 24px;
  margin-bottom: 24px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  width: 100%;
}
.tab-btn-row.right {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.btn-html {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s;
}
.btn-html:hover {
  background: #1251a3;
}
```

---

## 2. Importación de Estilos

En cada archivo principal importa el CSS global:
```jsx
import './components/AdminDashboard.css';
```

---

## 3. Uso de Clases y Distribución Visual

Utiliza las clases en los formularios y paneles:
```jsx
<form className="tab-content-container">
  <fieldset>
    <legend>Datos</legend>
    <div className="form-grid">
      <label>Nombre<input type="text" /></label>
      <label>Correo<input type="email" /></label>
    </div>
  </fieldset>
  <div className="tab-btn-row right">
    <button className="btn-html">Guardar</button>
  </div>
</form>
```

---

## 4. Lógica de Sincronización de Usuario (AdminDashboard.jsx)

```jsx
const [adminProfileState, setAdminProfileState] = useState(adminProfile);
const [profilePhoto, setProfilePhoto] = useState(adminProfile.photo);
const handleSettingsSave = (newProfile) => {
  setAdminProfileState((prev) => ({ ...prev, ...newProfile }));
  if (newProfile.photo) setProfilePhoto(newProfile.photo);
};
```

Renderizado del panel de configuración:
```jsx
{showSettings && (
  <>
    <div className="overlay show" onClick={() => setShowSettings(false)} />
    <SettingsPanel
      onClose={() => setShowSettings(false)}
      onSave={handleSettingsSave}
      initialProfile={adminProfileState}
    />
  </>
)}
```

---

## 5. Ejemplo de Componente de Soporte

```jsx
<form className="tab-content-container">
  <fieldset>
    <legend>Solicitud de soporte</legend>
    <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 18, width: '100%' }}>
      <label>Nombre del usuario (opcional)
        <input type="text" name="nombre_usuario" />
      </label>
      <label>Tipo de solicitud
        <select name="tipo_solicitud" required>
          <option value="">Seleccione</option>
          <option>Soporte técnico</option>
          <option>Ayuda funcional</option>
          <option>Duda general</option>
        </select>
      </label>
      <label style={{ gridColumn: '1 / span 2' }}>Mensaje
        <textarea name="mensaje" rows={3} required placeholder="Describe tu solicitud..." style={{ minHeight: 60, resize: 'vertical' }} />
      </label>
      <label>Archivo adjunto (si aplica)
        <input type="file" name="archivo_adjunto" />
      </label>
      <label>Fecha y hora de solicitud
        <input type="datetime-local" name="fecha_hora" required />
      </label>
      <label>Estado
        <select name="estado" required>
          <option value="">Seleccione</option>
          <option>Pendiente</option>
          <option>En gestión</option>
          <option>Resuelto</option>
        </select>
      </label>
    </div>
  </fieldset>
  <fieldset>
    <legend>Respuesta del equipo</legend>
    <div className="form-grid" style={{ gridTemplateColumns: '1fr', width: '100%' }}>
      <textarea name="respuesta_equipo" rows={2} placeholder="Respuesta del staff..." style={{ minHeight: 60, resize: 'vertical' }} />
    </div>
  </fieldset>
  <fieldset>
    <legend>Chat o historial de respuestas</legend>
    <div className="form-grid" style={{ gridTemplateColumns: '1fr', width: '100%' }}>
      <textarea name="historial_chat" rows={3} placeholder="Historial de mensajes y respuestas..." style={{ minHeight: 60, resize: 'vertical' }} />
    </div>
  </fieldset>
  <div className="tab-btn-row right">
    <button className="btn-html" type="submit">Enviar Solicitud</button>
  </div>
</form>
```

---

## 6. Resumen
- Centraliza y reutiliza las clases CSS.
- Usa variables para colores y fuentes.
- Aplica las clases en todos los componentes y páginas.
- Importa el CSS global en cada archivo relevante.
- Mantén la lógica de sincronización de usuario en el dashboard.

---

**Con esto tendrás una referencia clara y reutilizable para mantener la apariencia y lógica de tu dashboard de manera profesional y consistente.**
