// routes/chatbot.js
// Rutas para integración del chatbot con Llama 3 en AWS

const express = require('express');
const router = express.Router();
const { jwtRequired } = require('../utils/jwt');
const ChatbotService = require('../services/chatbotService');

// Servicio de chatbot
const chatbotService = new ChatbotService();

/**
 * POST /api/chatbot/message
 * Enviar mensaje al chatbot (Llama 3)
 */
router.post('/message', jwtRequired, async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    const userId = req.user?.id;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        msg: 'El mensaje no puede estar vacío',
      });
    }

    // Llamar a Llama 3 via AWS Bedrock
    const response = await chatbotService.sendMessage({
      userMessage: message.trim(),
      userId,
      context,
    });

    res.json({
      success: true,
      msg: 'Mensaje procesado correctamente',
      data: {
        userMessage: message,
        botResponse: response.message,
        conversationId: response.conversationId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error en chatbot:', error.message);
    res.status(500).json({
      success: false,
      msg: 'Error procesando el mensaje',
      error: error.message,
    });
  }
});

/**
 * POST /api/chatbot/conversation
 * Crear nueva conversación
 */
router.post('/conversation', jwtRequired, async (req, res) => {
  try {
    const { topic = 'general' } = req.body;
    const userId = req.user?.id;

    const conversation = await chatbotService.createConversation({
      userId,
      topic,
    });

    res.json({
      success: true,
      msg: 'Conversación creada',
      data: conversation,
    });
  } catch (error) {
    console.error('❌ Error creando conversación:', error.message);
    res.status(500).json({
      success: false,
      msg: 'Error creando conversación',
      error: error.message,
    });
  }
});

/**
 * GET /api/chatbot/conversation/:conversationId
 * Obtener historial de conversación
 */
router.get('/conversation/:conversationId', jwtRequired, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;

    const conversation = await chatbotService.getConversation({
      conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        msg: 'Conversación no encontrada',
      });
    }

    res.json({
      success: true,
      msg: 'Conversación recuperada',
      data: conversation,
    });
  } catch (error) {
    console.error('❌ Error recuperando conversación:', error.message);
    res.status(500).json({
      success: false,
      msg: 'Error recuperando conversación',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/chatbot/conversation/:conversationId
 * Eliminar conversación
 */
router.delete('/conversation/:conversationId', jwtRequired, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id;

    await chatbotService.deleteConversation({
      conversationId,
      userId,
    });

    res.json({
      success: true,
      msg: 'Conversación eliminada',
    });
  } catch (error) {
    console.error('❌ Error eliminando conversación:', error.message);
    res.status(500).json({
      success: false,
      msg: 'Error eliminando conversación',
      error: error.message,
    });
  }
});

/**
 * GET /api/chatbot/health
 * Verificar estado de la conexión con AWS Bedrock
 */
router.get('/health', async (req, res) => {
  try {
    const health = await chatbotService.checkHealth();
    
    res.json({
      success: health.connected,
      msg: health.connected ? 'AWS Bedrock conectado' : 'Error de conexión',
      data: {
        connected: health.connected,
        model: 'Llama 3',
        provider: 'AWS Bedrock',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Error verificando salud:', error.message);
    res.status(500).json({
      success: false,
      msg: 'Error verificando conexión',
      error: error.message,
    });
  }
});

module.exports = router;
