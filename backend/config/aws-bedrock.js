// config/aws-bedrock.js
// Configuración de AWS Bedrock para Llama 3

require('dotenv').config();

module.exports = {
  // Configuración de AWS
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  // Modelos disponibles
  models: {
    // Meta Llama 3
    llama3_70b: 'meta.llama3-70b-instruct-v1:0',
    llama3_8b: 'meta.llama3-8b-instruct-v1:0',
    
    // Alternativas
    claude_3_sonnet: 'anthropic.claude-3-sonnet-20240229-v1:0',
    claude_3_haiku: 'anthropic.claude-3-haiku-20240307-v1:0',
  },

  // Configuración del modelo Llama 3
  llama3: {
    modelId: 'meta.llama3-70b-instruct-v1:0',
    maxTokens: 512,
    temperature: 0.7,
    topP: 0.9,
    topK: 50,
  },

  // Configuración de conversaciones
  conversation: {
    maxHistoryLength: 10, // Mantener últimos 10 mensajes
    ttl: 24 * 60 * 60 * 1000, // TTL de 24 horas
  },

  // System prompt para PrediVersa
  systemPrompt: `Eres un asistente virtual amable y empático de PrediVersa, una plataforma educativa enfocada en la diversidad e inclusión.

Tu rol es:
1. Ayudar a estudiantes con dudas sobre la plataforma
2. Proporcionar orientación sobre bienestar emocional
3. Responder preguntas sobre recursos de apoyo
4. Ser empático y comprensivo ante situaciones difíciles
5. Sugerir que busquen ayuda profesional cuando sea necesario

Directrices importantes:
- Siempre responde en español
- Sé breve pero completo
- Si alguien reporta pensamientos de autolesión, ofrece recursos de ayuda
- Mantén la privacidad y confidencialidad
- No proporciones diagnósticos médicos`,
};
