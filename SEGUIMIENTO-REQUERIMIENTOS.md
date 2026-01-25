# Sistema de Validación y Seguimiento de Requerimientos - Documentación

## Descripción General
Se ha implementado un sistema completo de validación y seguimiento de requerimientos asociados a alertas y casos. El formulario de seguimiento ahora valida todos los campos requeridos, realiza peticiones HTTP al backend y guarda los datos en una tabla dedicada `Requerimientos_Seguimiento`.

---

## Componentes Implementados

### 1. **Base de Datos**

#### Tabla: `Requerimientos_Seguimiento`
- **Ubicación**: AWS RDS MySQL
- **Script de migración**: `database/schema/create-requerimientos-seguimiento.sql`

**Campos principales:**
- `Id_Requerimiento` - Identificador único (PK)
- `Numero_Caso` - Número de caso asociado
- `Descripcion_Requerimiento` - Descripción detallada
- `Estado_Requerimiento` - pendiente, en_proceso, completado, cancelado, suspendido, derivado
- `Prioridad` - baja, normal, alta, urgente
- `Profesional_Asignado` - Nombre del profesional responsable
- `Fecha_Seguimiento` - Fecha cuando se realiza el seguimiento
- `Resultado_Seguimiento` - Resultado del seguimiento
- `Porcentaje_Completitud` - % de avance (0-100)
- `Acciones_Tomadas` - Acciones implementadas
- `Proximas_Acciones` - Próximas acciones a realizar
- `Requiere_Seguimiento_Adicional` - si/no
- `Fecha_Proximo_Seguimiento` - Fecha del próximo seguimiento
- `Intervinientes` - JSON con lista de intervinientes
- `Observaciones` - Observaciones adicionales
- `Usuario_Id` - FK a tabla usuarios

**Índices:**
- `idx_estado` - Búsqueda rápida por estado
- `idx_alerta` - Búsqueda rápida por alerta
- `idx_fecha` - Búsqueda rápida por fecha
- `idx_prioridad` - Búsqueda rápida por prioridad
- `idx_usuario` - Búsqueda rápida por usuario
- `idx_estado_fecha` - Índice compuesto para búsquedas combinadas

---

### 2. **Backend - Modelo (ORM)**

#### Archivo: `backend/models/RequerimientosMySQL.js`

**Métodos CRUD disponibles:**

```javascript
// CREATE
RequerimientosMySQL.createRequerimiento(data)

// READ
RequerimientosMySQL.getRequerimientoById(id)
RequerimientosMySQL.getRequerimientosPorAlerta(idAlerta)
RequerimientosMySQL.getAllRequerimientos(filtros, limit, offset)

// UPDATE
RequerimientosMySQL.updateRequerimiento(id, data)

// DELETE
RequerimientosMySQL.deleteRequerimiento(id)

// ANALYTICS
RequerimientosMySQL.getRequerimientosResumen()
RequerimientosMySQL.getRequerimientosPendientes()
RequerimientosMySQL.getRequerimientosVencidos()
```

**Validaciones incluidas:**
- Normalización de datos null/undefined
- Conversión a formato JSON para campos de intervinientes
- Manejo seguro de parámetros

---

### 3. **Backend - Rutas (API)**

#### Archivo: `backend/routes/seguimiento.js`

**Endpoints disponibles:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/seguimiento/crear` | Crear nuevo requerimiento |
| GET | `/api/seguimiento/:id` | Obtener requerimiento por ID |
| GET | `/api/seguimiento/alerta/:idAlerta` | Obtener requerimientos de una alerta |
| GET | `/api/seguimiento` | Listar todos (con filtros) |
| PUT | `/api/seguimiento/:id` | Actualizar requerimiento |
| DELETE | `/api/seguimiento/:id` | Eliminar requerimiento |
| GET | `/api/seguimiento/resumen/estadisticas` | Obtener resumen estadístico |
| GET | `/api/seguimiento/pendientes/lista` | Obtener pendientes |
| GET | `/api/seguimiento/vencidos/lista` | Obtener vencidos |

**Parámetros de query en GET `/api/seguimiento`:**
```
?estado=pendiente
&prioridad=alta
&profesional=Juan%20Pérez
&numeroAlerta=ALR-000123
&limit=50
&offset=0
```

**Ejemplo de request POST:**
```json
{
  "numeroCaso": "#ALR-000123",
  "descripcionRequerimiento": "Llamada telefónica: Seguimiento de caso",
  "estadoRequerimiento": "en_proceso",
  "profesionalAsignado": "Dr. Juan Pérez",
  "fechaSeguimiento": "2026-01-25",
  "resultadoSeguimiento": "Se contactó con acudiente...",
  "accionesTomadas": "Envío de referencia...",
  "proximasAcciones": "Seguimiento en 5 días",
  "requiereSeguimientoAdicional": "si",
  "fechaProximoSeguimiento": "2026-02-01",
  "intervinientes": [
    {
      "nombre": "María Gómez",
      "rol": "Acudiente",
      "entidad": "Familia",
      "relacion": "Madre"
    }
  ]
}
```

---

### 4. **Frontend - Formulario**

#### Archivo: `frontend/src/pages/dashboards/components/SeguimientoForm.jsx`

**Mejoras implementadas:**

✅ **Validación completa:**
- Campos requeridos validados
- Mensajes de error dinámicos
- Indicadores visuales (bordes rojo, fondo claro)

✅ **Manejo de estados:**
- Estado de carga durante envío
- Botón deshabilitado mientras se procesa
- Spinner animado en botón de guardado

✅ **Integración con API:**
- Petición POST a `http://localhost:5003/api/seguimiento/crear`
- Manejo de errores con respuesta clara
- Reseteo de formulario después de éxito

✅ **UX mejorada:**
- Mensajes de éxito en verde
- Mensajes de error en rojo
- Validación en tiempo real
- Autocompletado de datos

**Validaciones incluidas:**
- Fecha de seguimiento obligatoria
- Profesional asignado obligatorio
- Tipo de seguimiento obligatorio
- Observaciones/resultados obligatorios
- Estado del caso obligatorio
- Al menos un interviniente con nombre y rol
- Si requiere seguimiento adicional, fecha obligatoria

---

### 5. **Frontend - Tabla de Requerimientos**

#### Archivo: `frontend/src/pages/dashboards/components/RequerimientosTable.jsx`

**Características:**

✅ **Visualización completa:**
- Tabla responsiva con scroll horizontal
- Codificación de colores por estado y prioridad
- Barra de progreso visual para % completitud

✅ **Filtrado dinámico:**
- Por estado (pendiente, en_proceso, completado, etc.)
- Por prioridad (baja, normal, alta, urgente)
- Por nombre de profesional

✅ **Paginación:**
- Navegación anterior/siguiente
- Límite configurable de registros
- Indicador de rango mostrado

✅ **Resumen estadístico:**
- Widgets de estados
- Contadores por prioridad
- Actualización en tiempo real

---

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│  1. Usuario completa SeguimientoForm                    │
│     - Selecciona tipo de seguimiento                    │
│     - Ingresa observaciones                             │
│     - Agrega intervinientes                             │
│     - Define estado del caso                            │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  2. SeguimientoForm valida formulario                   │
│     - Verifica campos requeridos                        │
│     - Muestra errores en tiempo real                    │
│     - Deshabilita botón si hay errores                  │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  3. POST /api/seguimiento/crear                         │
│     - Envía datos al backend                            │
│     - Muestra spinner de carga                          │
│     - Maneja errores de red                             │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  4. Backend: Route seguimiento.js                       │
│     - Valida requerimientos                             │
│     - Obtiene user_id del token JWT                     │
│     - Normaliza datos                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  5. Backend: RequerimientosMySQL.createRequerimiento()  │
│     - Inserta en tabla Requerimientos_Seguimiento       │
│     - Serializa JSON de intervinientes                  │
│     - Retorna ID creado                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  6. Frontend recibe respuesta exitosa                   │
│     - Muestra mensaje verde "✅ Guardado"               │
│     - Resetea formulario                                │
│     - Auto-limpia mensaje en 3 segundos                 │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  7. RequerimientosTable.jsx carga datos                 │
│     - Fetch a GET /api/seguimiento                      │
│     - Muestra tabla con requerimientos                  │
│     - Permite filtrado y paginación                     │
└─────────────────────────────────────────────────────────┘
```

---

## Integración en AdminDashboard

Para integrar la tabla de requerimientos en el AdminDashboard:

```jsx
import RequerimientosTable from './components/RequerimientosTable';

// En el JSX del AdminDashboard:
{activeTab === 'requerimientos' && (
  <section className="premium-tab-section" style={{ /* estilos */ }}>
    <RequerimientosTable 
      fieldsetStyle={fieldsetStyle}
      legendStyle={legendStyle}
    />
  </section>
)}
```

---

## Variables de Entorno Requeridas

```env
# Backend (.env)
DB_HOST=prediversa-db.ce1qo0a0sygg.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=Pruebas2026...
DB_DATABASE=PrediVersa
DB_PORT=3306
JWT_SECRET=tu_secret_aqui
PORT=5003

# Frontend (ya configurado)
# Usa http://localhost:5003/api para peticiones
```

---

## Seguridad Implementada

✅ **Validación en cliente:**
- Validación de campos requeridos
- Verificación de formato de datos
- Indicadores visuales de errores

✅ **Validación en servidor:**
- Verificación de autenticación JWT
- Validación de datos recibidos
- Manejo de excepciones

✅ **SQL Injection Prevention:**
- Uso de prepared statements (`?` placeholders)
- Escape automático de parámetros

✅ **XSS Prevention:**
- Sanitización automática con React
- Escape en JSONencode

---

## Estados Disponibles

```javascript
const ESTADOS = [
  'pendiente',        // No iniciado
  'en_proceso',       // Actualmente en desarrollo
  'completado',       // Finalizado exitosamente
  'cancelado',        // Cancelado por alguna razón
  'suspendido',       // Pausado temporalmente
  'derivado'          // Derivado a otra entidad
];

const PRIORIDADES = [
  'baja',             // Importancia baja
  'normal',           // Importancia normal
  'alta',             // Urgencia alta
  'urgente'           // Urgencia máxima
];
```

---

## Próximas Mejoras Sugeridas

1. **Exportación a PDF/Excel:**
   - Implementar generación de reportes
   - Descargar en PDF con datos del requerimiento

2. **Notificaciones:**
   - Alertas de requerimientos vencidos
   - Recordatorios de seguimientos pendientes

3. **Integración con calendario:**
   - Vista de seguimientos en calendario
   - Recordatorios automáticos

4. **Auditoría:**
   - Registro de cambios en requerimientos
   - Historial de actualizaciones

5. **Graficadores:**
   - Gráficos de estados
   - Análisis de tiempos de respuesta
   - Efectividad de seguimientos

---

## Pruebas

### Prueba manual del formulario:
1. Navegar a pestña de Seguimiento en AdminDashboard
2. Llenar formulario SeguimientoForm
3. Intentar guardar sin llenar campos requeridos → Debe mostrar errores
4. Llenar todos los campos correctamente
5. Hacer clic en "Guardar seguimiento"
6. Esperar mensaje de éxito verde
7. Verificar que en RequerimientosTable aparece el nuevo registro

### Prueba de API con curl:
```bash
curl -X POST http://localhost:5003/api/seguimiento/crear \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "numeroCaso": "#ALR-000123",
    "descripcionRequerimiento": "Test de seguimiento",
    "estadoRequerimiento": "pendiente",
    "profesionalAsignado": "Dr. Test",
    "fechaSeguimiento": "2026-01-25"
  }'
```

---

## Autores y Contribuciones

- **Modelo de datos:** RequerimientosMySQL.js
- **API Backend:** routes/seguimiento.js
- **Frontend - Validación:** SeguimientoForm.jsx
- **Frontend - Visualización:** RequerimientosTable.jsx
- **Database:** create-requerimientos-seguimiento.sql

---

**Última actualización:** 25 de enero de 2026  
**Versión:** 1.0.0
