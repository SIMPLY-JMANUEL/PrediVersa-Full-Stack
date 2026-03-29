# 🤖 Configuración: Chatbot Botpress + Llama 3 (AWS Bedrock)

## Overview
Este documento describe cómo conectar el chatbot Botpress de PrediVersa con **Llama 3** (modelo de Meta) a través de **AWS Bedrock**.

---

## 📋 Prerrequisitos

1. **Cuenta AWS activa** con acceso a Bedrock
2. **Credenciales AWS** (Access Key ID y Secret Access Key)
3. **Región AWS** que soporte Bedrock (us-east-1, us-west-2, eu-west-1, etc.)
4. **Node.js 18+** en el servidor backend

---

## 🔧 Paso 1: Configurar AWS Bedrock

### 1.1 Habilitar Acceso a Llama 3 en Bedrock

```bash
# 1. Ve a AWS Console → Bedrock → Model Access
# 2. Busca "Meta Llama 3"
# 3. Haz clic en "Request Access" o "Enable"
# 4. Espera confirmación (generalmente instantáneo)
# 5. Verifica que aparezca en "Enabled models"
```

### 1.2 Obtener Credenciales AWS

```bash
# 1. Ve a AWS Console → IAM → Users
# 2. Crea nuevo usuario o usa uno existente
# 3. Permisos necesarios: bedrockruntime:InvokeModel
# 4. Genera Access Key ID y Secret Access Key
# 5. Guarda en lugar seguro
```

### 1.3 Crear Policy IAM para Bedrock (Recomendado)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/meta.llama3-70b-instruct-v1:0",
        "arn:aws:bedrock:*::foundation-model/meta.llama3-8b-instruct-v1:0"
      ]
    }
  ]
}
```

---

## 🔑 Paso 2: Configurar Variables de Entorno

### Archivo `.env` en la carpeta `backend/`

```bash
# ========== AWS BEDROCK CONFIGURATION ==========
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_key_aqui

# ========== CHATBOT CONFIG ==========
CHATBOT_ENABLED=true
CHATBOT_MODEL=llama3_70b
CHATBOT_MAX_TOKENS=512
CHATBOT_TEMPERATURE=0.7
```

### Instalación de Dependencias

```bash
cd backend

# Instalar las nuevas dependencias
npm install @aws-sdk/client-bedrock-runtime uuid

# Verificar instalación
npm list @aws-sdk/client-bedrock-runtime
```

---

## 🚀 Paso 3: Endpoints de API

### 3.1 POST `/api/chatbot/message`
Enviar mensaje al chatbot

**Request:**
```json
{
  "message": "¿Cómo puedo denunciar acoso?",
  "context": {
    "topic": "violencia"
  }
}
```

**Response:**
```json
{
  "success": true,
  "msg": "Mensaje procesado correctamente",
  "data": {
    "userMessage": "¿Cómo puedo denunciar acoso?",
    "botResponse": "Tienes varias opciones...",
    "conversationId": "uuid-aqui",
    "timestamp": "2026-01-31T10:30:00Z"
  }
}
```

### 3.2 POST `/api/chatbot/conversation`
Crear nueva conversación

**Request:**
```json
{
  "topic": "bienestar_emocional"
}
```

**Response:**
```json
{
  "success": true,
  "msg": "Conversación creada",
  "data": {
    "id": "conv-uuid-aqui",
    "topic": "bienestar_emocional",
    "createdAt": "2026-01-31T10:30:00Z"
  }
}
```

### 3.3 GET `/api/chatbot/conversation/:conversationId`
Obtener historial de conversación

### 3.4 DELETE `/api/chatbot/conversation/:conversationId`
Eliminar conversación

### 3.5 GET `/api/chatbot/health`
Verificar estado de conexión

---

## 🎨 Paso 4: Integración en Frontend

### 4.1 Crear Servicio de Chatbot

**`frontend/src/services/chatbotService.js`:**

```javascript
export const chatbotService = {
  async sendMessage(message, context = {}) {
    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message, context })
      });

      if (!response.ok) throw new Error('Error enviando mensaje');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createConversation(topic = 'general') {
    try {
      const response = await fetch('/api/chatbot/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) throw new Error('Error creando conversación');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async checkHealth() {
    try {
      const response = await fetch('/api/chatbot/health');
      return await response.json();
    } catch (error) {
      console.error('Error verificando salud:', error);
      return { success: false };
    }
  }
};
```

### 4.2 Actualizar Botpress para usar Llama 3

En **`frontend/src/App.jsx`**, reemplaza el script de Botpress con:

```javascript
// Cargar Botpress y configurar para usar Llama 3
window.setTimeout(() => {
  window.botpressWebChat?.sendEvent({
    type: 'proactive_message',
    payload: {
      text: '¡Hola! Soy tu asistente virtual. Soy alimentado por Llama 3, el modelo de IA de Meta.'
    }
  });

  // Interceptar mensajes para enviar a nuestro backend
  if (window.botpress) {
    window.botpress.on('MESSAGE', async (event) => {
      try {
        const { text } = event.payload;
        const response = await chatbotService.sendMessage(text);
        
        window.botpressWebChat?.sendEvent({
          type: 'message',
          payload: {
            type: 'text',
            text: response.data.botResponse
          }
        });
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
}, 1000);
```

---

## 🧪 Paso 5: Pruebas

### 5.1 Verificar Conexión

```bash
# Desde el backend
cd backend
npm start

# En otra terminal, probar health check
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
    "provider": "AWS Bedrock",
    "timestamp": "2026-01-31T10:30:00Z"
  }
}
```

### 5.2 Enviar Mensaje de Prueba

```bash
curl -X POST http://localhost:5003/api/chatbot/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "message": "¿Hola, cómo funciona PrediVersa?"
  }'
```

### 5.3 Prueba Desde Frontend

```javascript
// En la consola del navegador
import { chatbotService } from './services/chatbotService';

// Crear conversación
const conv = await chatbotService.createConversation('bienestar');
console.log('Conversación:', conv);

// Enviar mensaje
const response = await chatbotService.sendMessage(
  '¿Me sientes?',
  { conversationId: conv.data.id }
);
console.log('Respuesta:', response);
```

---

## 📊 Modelos Disponibles en AWS Bedrock

| Modelo | ID | Tokens | Costo | Recomendado |
|--------|-----|--------|-------|------------|
| Llama 3 70B | `meta.llama3-70b-instruct-v1:0` | 8K | $$$ | ✅ Mejor calidad |
| Llama 3 8B | `meta.llama3-8b-instruct-v1:0` | 8K | $$ | ✅ Más rápido |
| Claude 3 Sonnet | `anthropic.claude-3-sonnet...` | 200K | $$$ | Alternativa |
| Claude 3 Haiku | `anthropic.claude-3-haiku...` | 200K | $ | Rápido y barato |

---

## 💰 Costos Estimados (AWS Bedrock)

### Llama 3 70B Instruct
- **Input:** $0.00315 por 1M tokens
- **Output:** $0.0126 por 1M tokens

### Ejemplo:
- 100 conversaciones/día × 500 tokens = 50K tokens
- Costo estimado: ~$0.01-0.05 USD/día

---

## 🛠️ Troubleshooting

### Error: "ResourceNotFoundException"
```
Solución: El modelo no está disponible en tu región
- Ve a AWS Bedrock → Model Access
- Verifica que Llama 3 esté enabled
- Cambia región en .env si es necesario
```

### Error: "InvalidParameterException"
```
Solución: Los parámetros no son válidos
- Verifica que max_gen_len esté entre 1-2048
- temperature entre 0-2
- Consulta la documentación de Bedrock
```

### Error: "AccessDeniedException"
```
Solución: Credenciales de AWS incorrectas o sin permisos
- Verifica AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY
- Confirma que el usuario tiene permisos bedrockruntime:InvokeModel
- Revisa la Policy IAM asignada
```

### Errores de CORS
```
Solución: Agregar origen en allowed origins
En backend/server.js, agregar tu dominio:
allowedOrigins.push('https://tu-dominio.com');
```

---

## 🔒 Seguridad

1. **Nunca** comitas credenciales AWS en git
2. Usa `.env` local y agrega a `.gitignore`
3. Rota credenciales regularmente
4. Usa IAM roles en lugar de credenciales en producción
5. Habilita logging de CloudTrail para auditoría
6. Implementa rate limiting (ya configurado)

---

## 📈 Próximos Pasos

1. ✅ Conectar con base de datos para persistencia de conversaciones
2. ✅ Agregar analytics de conversaciones
3. ✅ Implementar caching de respuestas frecuentes
4. ✅ Agregar moderación de contenido
5. ✅ Webhooks para notificaciones

---

## 📞 Soporte

Para problemas:
1. Revisa CloudWatch Logs en AWS
2. Verifica los logs del backend
3. Consulta documentación de Bedrock: https://docs.aws.amazon.com/bedrock/
4. Abre issue en GitHub

---

**Última actualización:** 31 de enero de 2026
