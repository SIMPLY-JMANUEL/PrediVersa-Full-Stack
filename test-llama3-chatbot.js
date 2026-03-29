#!/usr/bin/env node

/**
 * test-llama3-chatbot.js
 * Script para probar la conexión con Llama 3 via AWS Bedrock
 */

require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5003/api';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Token de prueba (reemplazar con token válido)
let TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo1LCJub21icmUiOiJUZXN0IFVzdWFyaW8iLCJjb3JyZW8iOiJ0ZXN0QHRlc3QuY29tIiwidXN1YXJpbyI6InRlc3R1c2VyIiwicm9sIjoiRXN0dWRpYW50ZSIsImFjdGl2byI6IlNJIn0sImlhdCI6MTcwODAxNDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.test';

async function log(message, type = 'info') {
  const prefix = {
    success: `${colors.green}✅${colors.reset}`,
    error: `${colors.red}❌${colors.reset}`,
    info: `${colors.blue}ℹ️${colors.reset}`,
    warning: `${colors.yellow}⚠️${colors.reset}`,
  };
  console.log(`${prefix[type] || prefix.info} ${message}`);
}

async function testHealthCheck() {
  try {
    log('Probando health check...', 'info');
    const response = await axios.get(`${API_BASE_URL}/chatbot/health`);

    if (response.data.success) {
      log('✓ Conexión con AWS Bedrock establecida', 'success');
      log(`  Modelo: ${response.data.data.model}`, 'info');
      log(`  Proveedor: ${response.data.data.provider}`, 'info');
      return true;
    } else {
      log(`✗ Error: ${response.data.msg}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Error en health check: ${error.message}`, 'error');
    
    if (error.code === 'ECONNREFUSED') {
      log('El backend no está ejecutándose. Inicia el servidor primero:', 'error');
      log('  cd backend && npm start', 'info');
    }
    
    return false;
  }
}

async function testCreateConversation() {
  try {
    log('Creando conversación...', 'info');
    const response = await axios.post(
      `${API_BASE_URL}/chatbot/conversation`,
      { topic: 'bienestar_emocional' },
      { headers: { Authorization: `Bearer ${TEST_TOKEN}` } }
    );

    if (response.data.success) {
      log('✓ Conversación creada', 'success');
      log(`  ID: ${response.data.data.id}`, 'info');
      log(`  Tópico: ${response.data.data.topic}`, 'info');
      return response.data.data.id;
    } else {
      log(`✗ Error: ${response.data.msg}`, 'error');
      return null;
    }
  } catch (error) {
    log(`Error creando conversación: ${error.message}`, 'error');
    
    if (error.response?.status === 401) {
      log('Token inválido o expirado. Actualiza TEST_TOKEN.', 'warning');
    }
    
    return null;
  }
}

async function testSendMessage(conversationId, message) {
  try {
    log(`Enviando mensaje: "${message}"`, 'info');
    const response = await axios.post(
      `${API_BASE_URL}/chatbot/message`,
      {
        message,
        context: { conversationId }
      },
      { headers: { Authorization: `Bearer ${TEST_TOKEN}` } }
    );

    if (response.data.success) {
      log('✓ Mensaje enviado y procesado', 'success');
      log(`  Respuesta: ${response.data.data.botResponse}`, 'info');
      return true;
    } else {
      log(`✗ Error: ${response.data.msg}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Error enviando mensaje: ${error.message}`, 'error');
    log(JSON.stringify(error.response?.data, null, 2), 'error');
    return false;
  }
}

async function testGetConversation(conversationId) {
  try {
    log('Recuperando historial de conversación...', 'info');
    const response = await axios.get(
      `${API_BASE_URL}/chatbot/conversation/${conversationId}`,
      { headers: { Authorization: `Bearer ${TEST_TOKEN}` } }
    );

    if (response.data.success) {
      log('✓ Conversación recuperada', 'success');
      log(`  Mensajes: ${response.data.data.messages.length}`, 'info');
      
      response.data.data.messages.forEach((msg, idx) => {
        const role = msg.role === 'user' ? '👤' : '🤖';
        log(`  ${idx + 1}. ${role} ${msg.content.substring(0, 50)}...`, 'info');
      });
      
      return true;
    } else {
      log(`✗ Error: ${response.data.msg}`, 'error');
      return false;
    }
  } catch (error) {
    log(`Error recuperando conversación: ${error.message}`, 'error');
    return false;
  }
}

async function runTests() {
  console.log('\n' + colors.cyan + '════════════════════════════════════════════' + colors.reset);
  console.log(colors.cyan + '   🤖 Test Llama 3 Chatbot (AWS Bedrock)' + colors.reset);
  console.log(colors.cyan + '════════════════════════════════════════════\n' + colors.reset);

  // Test 1: Health Check
  console.log(colors.blue + '\n📋 Test 1: Verificar conexión\n' + colors.reset);
  const healthOk = await testHealthCheck();

  if (!healthOk) {
    log('No se pudo conectar. Verifica la configuración de AWS.', 'error');
    return;
  }

  // Test 2: Create Conversation
  console.log(colors.blue + '\n📋 Test 2: Crear conversación\n' + colors.reset);
  const conversationId = await testCreateConversation();

  if (!conversationId) {
    log('No se pudo crear conversación', 'error');
    return;
  }

  // Test 3: Send Messages
  console.log(colors.blue + '\n📋 Test 3: Enviar mensajes\n' + colors.reset);
  
  const messages = [
    '¿Hola, cómo funciona PrediVersa?',
    '¿Cómo puedo reportar un incidente?',
    'Gracias por tu ayuda'
  ];

  for (const msg of messages) {
    await testSendMessage(conversationId, msg);
    console.log(''); // Espacio
  }

  // Test 4: Get Conversation History
  console.log(colors.blue + '\n📋 Test 4: Ver historial de conversación\n' + colors.reset);
  await testGetConversation(conversationId);

  // Resumen
  console.log(colors.cyan + '\n════════════════════════════════════════════' + colors.reset);
  console.log(colors.green + '✅ Pruebas completadas exitosamente' + colors.reset);
  console.log(colors.cyan + '════════════════════════════════════════════\n' + colors.reset);
}

// Ejecutar pruebas
runTests().catch(error => {
  log(`Error fatal: ${error.message}`, 'error');
  process.exit(1);
});
