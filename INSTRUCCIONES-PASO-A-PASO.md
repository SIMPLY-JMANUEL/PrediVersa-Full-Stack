# 🚀 Instrucciones Paso a Paso: Conectar Chatbot Botpress a Llama 3 (AWS Bedrock)

## 🎯 Objetivo
Configurar el chatbot Botpress del frontend para usar **Llama 3** (IA de Meta) como motor mediante **AWS Bedrock**.

---

## ⏱️ Tiempo Total: ~30 minutos

---

## 📋 PASO 1: Preparar AWS (5 min)

### 1.1 Habilitar Llama 3 en AWS Bedrock

```
1. Ve a: https://console.aws.amazon.com/bedrock/
2. Selecciona tu región (ej: us-east-1)
3. Menú izquierdo → "Model Access"
4. Busca: "Meta Llama 3"
5. Haz clic en "Request Access" o "Enable"
6. Espera confirmación (segundos)
7. Debe aparecer en "Enabled models"
```

✅ **Confirmación:** Llama 3 aparece en lista de modelos habilitados

---

## 🔑 PASO 2: Obtener Credenciales AWS (5 min)

### 2.1 Crear/Obtener Access Key

```
1. Ve a: https://console.aws.amazon.com/iam/
2. Menú izquierdo → "Users"
3. Selecciona un usuario (o crea uno nuevo)
4. Pestaña "Security credentials"
5. Botón "Create access key"
6. Copia: Access Key ID y Secret Access Key
7. Guarda en lugar seguro (solo aparece una vez)
```

**Ejemplo de valores:**
```
Access Key ID:     AKIAIOSFODNN7EXAMPLE
Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

✅ **Confirmación:** Tienes 2 credenciales de AWS

---

## ⚙️ PASO 3: Configurar Backend (10 min)

### 3.1 Crear archivo .env

```bash
cd backend

# Si no existe .env, crear desde el ejemplo
cp .env.example .env

# Editar con tu editor favorito
nano .env
# o
code .env
```

### 3.2 Agregar Variables AWS

**Busca estas líneas en `.env`:**
```bash
# ========== AWS BEDROCK - LLAMA 3 CHATBOT ==========
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
CHATBOT_ENABLED=true
CHATBOT_MODEL=llama3_70b
```

**Reemplaza con tus credenciales reales:**
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
CHATBOT_ENABLED=true
CHATBOT_MODEL=llama3_70b
```

⚠️ **IMPORTANTE:** 
- NO comitas `.env` a Git
- Mantén credenciales privadas
- `.gitignore` ya contiene `.env`

✅ **Confirmación:** `.env` tiene las 5 variables AWS

### 3.3 Instalar Dependencias

```bash
cd backend

# Instalar paquetes nuevos
npm install

# Específicamente:
npm install @aws-sdk/client-bedrock-runtime uuid
```

**Output esperado:**
```
added 50 packages in 15s
```

✅ **Confirmación:** `npm list @aws-sdk/client-bedrock-runtime` muestra versión

---

## ✅ PASO 4: Verificar Configuración (3 min)

### 4.1 Ejecutar Verificador

```bash
# Desde raíz del proyecto
node verify-llama3-setup.js
```

**Output esperado:**
```
✅ Rutas de chatbot
✅ Servicio de chatbot
✅ Configuración AWS
✅ Variables de entorno
✅ Dependencias instaladas
✅ Configuración del servidor

✅ TODO ESTÁ CONFIGURADO CORRECTAMENTE
```

❌ **Si hay errores:** 
- Verifica que todos los archivos estén en su lugar
- Revisa variables de entorno
- Reinstala dependencias

---

## 🚀 PASO 5: Iniciar Backend (2 min)

### 5.1 Ejecutar Servidor

```bash
cd backend
npm start
```

**Output esperado:**
```
🚀 Iniciando backend PrediVersa...
🚀 Puerto configurado: 5003
🔐 JWT_SECRET cargado: ✅ SÍ
✅ Database connected
🤖 Chatbot routes loaded
✅ Server running on port 5003
```

✅ **Confirmación:** Backend ejecutando en puerto 5003

### 5.2 En otra terminal, probar conexión:

```bash
curl http://localhost:5003/api/chatbot/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "msg": "AWS Bedrock conectado",
  "data": {
    "connected": true,
    "model": "Llama 3",
    "provider": "AWS Bedrock"
  }
}
```

---

## 🧪 PASO 6: Probar Chatbot (5 min)

### 6.1 Ejecutar Suite de Pruebas

```bash
# En nueva terminal
node test-llama3-chatbot.js
```

**Output esperado:**
```
✅ Test 1: Verificar conexión
✅ Test 2: Crear conversación
✅ Test 3: Enviar mensajes
✅ Test 4: Ver historial
✅ Pruebas completadas exitosamente
```

### 6.2 Respuestas de Ejemplo

**Primera interacción:**
```
Usuario: "¿Hola, cómo funciona PrediVersa?"
Bot:     "¡Hola! Soy tu asistente virtual de PrediVersa..."
```

**Segunda interacción:**
```
Usuario: "¿Cómo reporto un incidente?"
Bot:     "Puedes crear un reporte siguiendo estos pasos..."
```

**Tercera interacción:**
```
Usuario: "Gracias por tu ayuda"
Bot:     "De nada. Estoy aquí para apoyarte..."
```

✅ **Confirmación:** El chatbot responde con respuestas inteligentes

---

## 🎨 PASO 7: Conectar Frontend (Botpress)

### 7.1 El frontend ya está configurado

Botpress está en:
```
frontend/src/App.jsx → useEffect (línea ~140)
```

**Ya incluye:**
```javascript
// Script de Botpress se carga automáticamente
window.botpressWebChat?.sendEvent({...})
```

### 7.2 Prueba en navegador

```
1. Inicia frontend: npm start (en carpeta frontend/)
2. Abre: http://localhost:3000
3. Busca icono de chat en esquina inferior derecha
4. Escribe un mensaje
5. Llama 3 responde automáticamente
```

✅ **Confirmación:** El chat funciona en el navegador

---

## 💡 PASO 8: Casos de Uso (Ejemplos)

### 8.1 Estudiantes pueden preguntar:

```
✅ "¿Cómo denuncio acoso?"
✅ "¿Me sientes deprimido?"
✅ "¿Qué recursos hay de apoyo?"
✅ "¿Cómo funciona esto?"
✅ "¿Es normal sentir esto?"
```

### 8.2 El Bot responde inteligentemente

```
Bot: "Entiendo que estés pasando por un momento difícil.
      Aquí hay recursos de apoyo disponibles:
      - Línea de atención: 1-800-XXX-XXXX
      - Chat con psicólogo: [enlace]
      - Más información: [enlace]"
```

---

## 🔍 PASO 9: Troubleshooting

### Problema 1: "AWS credentials not provided"

**Solución:**
```bash
1. Verifica que .env existe en backend/
2. Valida que tenga AWS_ACCESS_KEY_ID
3. Valida que tenga AWS_SECRET_ACCESS_KEY
4. Reinicia el servidor: npm start
```

### Problema 2: "Model not available"

**Solución:**
```bash
1. Ve a AWS Console → Bedrock → Model Access
2. Busca Meta Llama 3
3. Haz clic en "Request Access" o "Enable"
4. Espera confirmación
5. Intenta de nuevo
```

### Problema 3: "Cannot find module @aws-sdk"

**Solución:**
```bash
cd backend
npm install @aws-sdk/client-bedrock-runtime
npm start
```

### Problema 4: "CORS error"

**Solución:** Ya está configurado en `backend/server.js`
```javascript
cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    }
  }
})
```

### Problema 5: "Port 5003 already in use"

**Solución:**
```bash
# Linux/Mac: Buscar y matar proceso
lsof -ti:5003 | xargs kill -9

# Windows: Cambiar puerto en .env
PORT=5004
```

---

## 📊 PASO 10: Monitoreo

### 10.1 Ver logs del backend

```bash
# Los logs aparecen en la terminal donde ejecutaste npm start
# Busca líneas como:
# 🤖 Chatbot message received
# ✅ Response from Llama 3
# ❌ Error calling AWS Bedrock
```

### 10.2 Ver requests a AWS

```bash
# AWS CloudWatch Logs
1. AWS Console → CloudWatch → Logs
2. Busca logs de Bedrock
3. Verifica requests exitosos
```

### 10.3 Costos (opcional)

```bash
# AWS Console → Billing → Cost Explorer
# Busca costos de Bedrock
# Ejemplo: $0.02-0.05 USD/día para 100 usuarios
```

---

## ✨ CHECKLIST FINAL

Marca cuando completes cada paso:

- [ ] ✅ Habilité Llama 3 en AWS Bedrock
- [ ] ✅ Obtuve credenciales AWS (Access Key)
- [ ] ✅ Configuré .env con credenciales
- [ ] ✅ Instalé dependencias (npm install)
- [ ] ✅ Verifiqué setup (verify script)
- [ ] ✅ Inicié backend (npm start)
- [ ] ✅ Ejecuté pruebas (test script)
- [ ] ✅ Probé en navegador
- [ ] ✅ El chatbot responde correctamente
- [ ] ✅ Documentación leída

---

## 🎉 ¡COMPLETADO!

Tu chatbot ahora está conectado a **Llama 3** via **AWS Bedrock**.

### Próximos pasos opcionales:

1. **Agregar persistencia:** Guardar conversaciones en BD
2. **Analytics:** Trackear uso del chatbot
3. **Moderación:** Validar contenido
4. **Multi-idioma:** Soportar más idiomas
5. **Dashboard:** Ver stats en admin

---

## 📞 Ayuda Rápida

**¿No funciona algo?**

1. Lee: `SETUP-CHATBOT-LLAMA3-AWS.md`
2. Revisa: Sección de Troubleshooting arriba
3. Ejecuta: `node verify-llama3-setup.js`
4. Verifica: Logs del backend

**¿Preguntas técnicas?**

- AWS Bedrock Docs: https://docs.aws.amazon.com/bedrock/
- Llama 3: https://www.meta.com/research/publications/
- Express.js: https://expressjs.com/

---

**Última actualización:** 31 de enero de 2026  
**Versión:** 1.0  
**Estado:** ✅ Funcional y Listo
