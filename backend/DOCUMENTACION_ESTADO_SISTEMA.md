# Documentación de la integración: Estado del Sistema en el Dashboard de Administrador

## Objetivo

Mostrar métricas reales/simuladas del sistema (rendimiento, seguridad, uso de recursos, uptime, usuarios activos, peticiones, versión de Node.js, plataforma) en el dashboard del administrador de PrediVersa.

---

## Cambios realizados

### 1. Backend (`backend/routes/admin.js`)

- Se agregó el endpoint protegido `/admin/system-status` que retorna:
  - `rendimiento`: porcentaje simulado.
  - `seguridad`: estado simulado ("Óptima").
  - `usoRecursos`: porcentaje de uso de memoria del sistema.
  - `uptime`: minutos desde que el servidor está activo.
  - `usuariosActivos`: número simulado de usuarios activos.
  - `peticionesUltimaHora`: número simulado de peticiones recientes.
  - `version`: versión de Node.js.
  - `plataforma`: sistema operativo.
- El endpoint requiere autenticación y rol de administrador.

### 2. Frontend

#### a) Componente `SystemStatus.jsx`

- Se creó/actualizó el componente en `frontend/src/pages/dashboards/components/SystemStatus.jsx`.
- Ahora usa `fetch` en vez de `axios` para evitar problemas de dependencias y polyfills.
- Muestra las métricas con diseño visual moderno, íconos y colores para cada métrica.
- Incluye manejo de estado de carga y error.

#### b) Integración en el Dashboard

- Se importó e insertó el componente `SystemStatus` en la barra lateral del dashboard de administrador (`AdminDashboard.jsx`), reemplazando los valores estáticos.

---

## Pruebas y recomendaciones

- Para probar la funcionalidad, inicia el backend y el frontend normalmente (`npm start` en cada uno).
- Inicia sesión como administrador y verifica que el panel muestre el estado del sistema con los datos dinámicos.
- Puedes personalizar las métricas en el backend para mostrar datos reales según tus necesidades.

---

## Notas técnicas

- El uso de `fetch` elimina la necesidad de instalar o configurar `axios` y sus dependencias.
- El endpoint `/admin/system-status` puede ser extendido para métricas reales de base de datos, usuarios, seguridad, etc.
- El diseño visual es fácilmente adaptable a la identidad de la app.

---

**Con esto, el dashboard del administrador ahora refleja el estado del sistema de forma dinámica y visualmente atractiva.**
