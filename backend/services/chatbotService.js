// services/chatbotService.js
// Servicio para integración con Llama 3 en AWS Bedrock

const { BedrockRuntime } = require('@aws-sdk/client-bedrock-runtime');
const { v4: uuidv4 } = require('uuid');

class ChatbotService {
  constructor() {
    // Inicializar cliente de AWS Bedrock
    this.client = new BedrockRuntime({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Modelo Llama 3 en Bedrock
    this.modelId = 'meta.llama3-70b-instruct-v1:0'; // Meta Llama 3 70B
    
    // Almacenamiento en memoria (reemplazar con DB en producción)
    this.conversations = new Map();
    
    // Contexto del sistema para PrediVersa
    this.systemPrompt = `Eres un asistente virtual amable y empático de PrediVersa, una plataforma educativa enfocada en la diversidad e inclusión. 

Tu rol es:
1. Ayudar a estudiantes con dudas sobre la plataforma
2. Proporcionar orientación sobre bienestar emocional
3. Responder preguntas sobre recursos de apoyo
4. Ser empático y comprensivo ante situaciones difíciles
5. Sugerir que busquen ayuda profesional cuando sea necesario

Siempre responde en español, de manera clara y accesible. Sé breve pero completo en tus respuestas.`;
  }

  /**
   * Enviar mensaje a Llama 3 via AWS Bedrock
   */
  async sendMessage({ userMessage, userId, context = {} }) {
    try {
      // Obtener o crear conversación
      let conversationId = context.conversationId || uuidv4();
      let conversation = this.conversations.get(conversationId) || {
        id: conversationId,
        userId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Agregar mensaje del usuario
      conversation.messages.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      });

      // Construir historial para el modelo
      const messageHistory = conversation.messages
        .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
        .join('\n');

      const prompt = `${this.systemPrompt}

Historial de conversación:
${messageHistory}

Asistente:`;

      // Llamar a Llama 3
      const response = await this.callBedrock(prompt);

      // Agregar respuesta del bot
      conversation.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      });

      // Guardar conversación actualizada
      conversation.updatedAt = new Date();
      this.conversations.set(conversationId, conversation);

      return {
        message: response,
        conversationId,
      };
    } catch (error) {
      console.error('❌ Error en sendMessage:', error);
      throw new Error(`Error procesando mensaje: ${error.message}`);
    }
  }

  /**
   * Llamar a Bedrock con Llama 3
   */
  async callBedrock(prompt) {
    try {
      const input = {
        modelId: this.modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          prompt: prompt,
          max_gen_len: 512,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 50,
        }),
      };

      const command = new (require('@aws-sdk/client-bedrock-runtime').InvokeModelCommand)(input);
      const response = await this.client.send(command);

      // Parsear respuesta
      const bodyString = new TextDecoder().decode(response.body);
      const responseData = JSON.parse(bodyString);

      // Extraer texto de la respuesta
      const text = responseData.generation || responseData.text || '';
      
      return text.trim();
    } catch (error) {
      console.error('❌ Error llamando a Bedrock:', error);
      
      // Fallback a respuesta local si hay error
      if (error.message.includes('ResourceNotFoundException')) {
        throw new Error('Modelo Llama 3 no disponible en esta región. Verifica la configuración de AWS.');
      }
      
      throw error;
    }
  }

  /**
   * Crear nueva conversación
   */
  async createConversation({ userId, topic = 'general' }) {
    const conversationId = uuidv4();
    const conversation = {
      id: conversationId,
      userId,
      topic,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.conversations.set(conversationId, conversation);

    return {
      id: conversationId,
      topic,
      createdAt: conversation.createdAt,
    };
  }

  /**
   * Obtener conversación
   */
  async getConversation({ conversationId, userId }) {
    const conversation = this.conversations.get(conversationId);

    if (!conversation) {
      return null;
    }

    // Verificar que el usuario sea propietario
    if (conversation.userId !== userId) {
      throw new Error('No tienes permiso para acceder a esta conversación');
    }

    return {
      id: conversation.id,
      topic: conversation.topic,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  /**
   * Eliminar conversación
   */
  async deleteConversation({ conversationId, userId }) {
    const conversation = this.conversations.get(conversationId);

    if (!conversation) {
      throw new Error('Conversación no encontrada');
    }

    // Verificar que el usuario sea propietario
    if (conversation.userId !== userId) {
      throw new Error('No tienes permiso para eliminar esta conversación');
    }

    this.conversations.delete(conversationId);
  }

  /**
   * Verificar estado de conexión
   */
  async checkHealth() {
    try {
      // Intenta una llamada simple para verificar la conexión
      const testPrompt = 'Responde brevemente con "Conectado" en español.';
      const response = await this.callBedrock(testPrompt);
      
      return {
        connected: response.length > 0,
        message: 'AWS Bedrock conectado correctamente',
      };
    } catch (error) {
      console.error('❌ Error en health check:', error.message);
      return {
        connected: false,
        message: error.message,
      };
    }
  }
}

module.exports = ChatbotService;
