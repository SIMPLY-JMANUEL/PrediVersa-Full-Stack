# 🤖 Chatbot Llama 3 + AWS Bedrock - Guía Rápida

## ¿Qué se configuró?

Se integró **Llama 3** (modelo de Meta) como el motor de IA del chatbot Botpress usando **AWS Bedrock**:

```
Botpress (Frontend) ↔ Node.js Backend ↔ AWS Bedrock ↔ Llama 3 (Meta)
```

---

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ Configurar AWS

```bash
# A. En AWS Console:
# 1. Ve a Bedrock → Model Access
# 2. Busca "Meta Llama 3" 
# 3. Haz clic en "Request Access"
# 4. Espera confirmación (segundos)

# B. Obtén credenciales:
# 1. IAM → Usuarios
# 2. Access Key → Copia ID y Secret
```

### 2️⃣ Configurar Backend

```bash
cd backend

# Crear .env con credenciales AWS
cp .env.example .env
# Edita .env y agrega:
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=tu_key_aqui
# AWS_SECRET_ACCESS_KEY=tu_secret_aqui

# Instalar dependencias
npm install @aws-sdk/client-bedrock-runtime uuid

# Iniciar
npm start
```

### 3️⃣ Probar

```bash
# En otra terminal
node test-llama3-chatbot.js
```

**Esperado:**
```
✅ Test 1: Verificar conexión
✅ Test 2: Crear conversación
✅ Test 3: Enviar mensajes
✅ Test 4: Ver historial
```

---

## 📁 Archivos Creados

| Archivo | Descripción |
|---------|------------|
| `backend/routes/chatbot.js` | 🔌 Endpoints API para chatbot |
| `backend/services/chatbotService.js` | 🧠 Lógica de conexión con Llama 3 |
| `backend/config/aws-bedrock.js` | ⚙️ Configuración de AWS Bedrock |
| `test-llama3-chatbot.js` | ✅ Script de pruebas |
| `SETUP-CHATBOT-LLAMA3-AWS.md` | 📖 Documentación completa |

---

## 🔌 Endpoints API

| Método | URL | Descripción |
|--------|-----|------------|
| POST | `/api/chatbot/message` | Enviar mensaje a Llama 3 |
| POST | `/api/chatbot/conversation` | Crear conversación |
| GET | `/api/chatbot/conversation/:id` | Ver historial |
| DELETE | `/api/chatbot/conversation/:id` | Eliminar conversación |
| GET | `/api/chatbot/health` | Verificar conexión |

### Ejemplo: Enviar Mensaje

```bash
curl -X POST http://localhost:5003/api/chatbot/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "message": "¿Hola, cómo estás?"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "userMessage": "¿Hola, cómo estás?",
    "botResponse": "¡Hola! Soy tu asistente virtual...",
    "conversationId": "uuid-aqui"
  }
}
```

---

## 🎯 Casos de Uso

### ✅ El chatbot puede:
- Responder preguntas sobre PrediVersa
- Ayudar con bienestar emocional
- Guiar sobre reportes de violencia
- Proporcionar recursos de apoyo
- Mantener conversaciones naturales

### ❌ El chatbot NO:
- Diagnostica condiciones médicas
- Reemplaza profesionales de salud
- Almacena datos sensibles en caché
- Funciona sin credenciales AWS válidas

---

## 🚀 Variables de Entorno Necesarias

```bash
# .env backend/
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJal...
CHATBOT_ENABLED=true
CHATBOT_MODEL=llama3_70b
```

---

## 💰 Costos

**Estimado para 100 usuarios/día:**

| Modelo | Input | Output | Total |
|--------|-------|--------|-------|
| Llama 3 70B | $0.003 | $0.012 | ~$0.02-0.05 |
| Llama 3 8B | $0.0003 | $0.0006 | ~$0.01 |

---

## ❓ Troubleshooting

### Error: "AWS credentials not provided"
```
Solución: Verifica que .env tenga AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY
```

### Error: "Model not available"
```
Solución: Habilita Llama 3 en AWS Bedrock → Model Access
```

### Error: "CORS"
```
Solución: Se permite CORS en server.js (ya configurado)
```

---

## 📚 Documentación Completa

Para detalles técnicos, consulta: [SETUP-CHATBOT-LLAMA3-AWS.md](./SETUP-CHATBOT-LLAMA3-AWS.md)

---

## 🔒 Seguridad

⚠️ **IMPORTANTE:**
- ✅ `.env` está en `.gitignore` (seguro)
- ✅ Credenciales NO van en el código
- ✅ Rate limiting habilitado
- ✅ Validación JWT en todos los endpoints

---

## ✨ Próximas Mejoras

- [ ] Persistencia de conversaciones en BD
- [ ] Analytics de uso
- [ ] Moderación de contenido
- [ ] Webhooks para notificaciones
- [ ] Support para idiomas adicionales

---

**¿Necesitas ayuda?** Consulta [SETUP-CHATBOT-LLAMA3-AWS.md](./SETUP-CHATBOT-LLAMA3-AWS.md)

Última actualización: 31 de enero de 2026
