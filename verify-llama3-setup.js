#!/usr/bin/env node

/**
 * verify-llama3-setup.js
 * Verifica que todo esté configurado correctamente para Llama 3
 */

const fs = require('fs');
const path = require('path');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, type = 'info') {
  const prefix = {
    success: `${colors.green}✅${colors.reset}`,
    error: `${colors.red}❌${colors.reset}`,
    info: `${colors.blue}ℹ️${colors.reset}`,
    warning: `${colors.yellow}⚠️${colors.reset}`,
  };
  console.log(`${prefix[type] || prefix.info} ${message}`);
}

async function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`${description}`, 'success');
  } else {
    log(`${description} - NO ENCONTRADO`, 'error');
  }
  return exists;
}

async function checkEnvVariables() {
  const envPath = path.join(__dirname, 'backend', '.env');
  
  if (!fs.existsSync(envPath)) {
    log('Archivo .env no encontrado', 'warning');
    log('Crea uno basado en .env.example', 'info');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
  ];

  let allFound = true;
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      log(`Variable .env: ${varName}`, 'success');
    } else {
      log(`Variable .env: ${varName} - NO ENCONTRADA`, 'error');
      allFound = false;
    }
  });

  return allFound;
}

async function checkDependencies() {
  const packagePath = path.join(__dirname, 'backend', 'package.json');
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = [
    '@aws-sdk/client-bedrock-runtime',
    'uuid',
  ];

  let allFound = true;
  requiredDeps.forEach(dep => {
    if (packageContent.dependencies[dep]) {
      log(`Dependencia: ${dep}`, 'success');
    } else {
      log(`Dependencia: ${dep} - NO ENCONTRADA`, 'error');
      allFound = false;
    }
  });

  return allFound;
}

async function checkServerConfiguration() {
  const serverPath = path.join(__dirname, 'backend', 'server.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');

  if (serverContent.includes("require('./routes/chatbot')")) {
    log('Rutas de chatbot integradas en server.js', 'success');
  } else {
    log('Rutas de chatbot NO integradas en server.js', 'error');
    return false;
  }

  return true;
}

async function runVerification() {
  console.log('\n' + colors.cyan + '════════════════════════════════════════════' + colors.reset);
  console.log(colors.cyan + '   ✅ Verificador: Setup Llama 3 + AWS' + colors.reset);
  console.log(colors.cyan + '════════════════════════════════════════════\n' + colors.reset);

  // 1. Verificar archivos
  console.log(colors.blue + '📁 Verificando archivos creados...\n' + colors.reset);
  
  let filesOk = true;
  filesOk &= await checkFileExists(
    path.join(__dirname, 'backend', 'routes', 'chatbot.js'),
    'Rutas de chatbot'
  );
  filesOk &= await checkFileExists(
    path.join(__dirname, 'backend', 'services', 'chatbotService.js'),
    'Servicio de chatbot'
  );
  filesOk &= await checkFileExists(
    path.join(__dirname, 'backend', 'config', 'aws-bedrock.js'),
    'Configuración de AWS Bedrock'
  );

  // 2. Verificar variables de entorno
  console.log(colors.blue + '\n🔐 Verificando variables de entorno...\n' + colors.reset);
  const envOk = await checkEnvVariables();

  // 3. Verificar dependencias
  console.log(colors.blue + '\n📦 Verificando dependencias...\n' + colors.reset);
  const depsOk = await checkDependencies();

  // 4. Verificar configuración del servidor
  console.log(colors.blue + '\n⚙️ Verificando configuración del servidor...\n' + colors.reset);
  const serverOk = await checkServerConfiguration();

  // Resumen
  console.log(colors.cyan + '\n════════════════════════════════════════════' + colors.reset);
  
  if (filesOk && envOk && depsOk && serverOk) {
    console.log(colors.green + '✅ TODO ESTÁ CONFIGURADO CORRECTAMENTE' + colors.reset);
    console.log(colors.green + '\n   Próximos pasos:' + colors.reset);
    console.log(colors.green + '   1. npm install (en backend/)' + colors.reset);
    console.log(colors.green + '   2. npm start (en backend/)' + colors.reset);
    console.log(colors.green + '   3. node test-llama3-chatbot.js' + colors.reset);
  } else {
    console.log(colors.red + '❌ HAY PROBLEMAS EN LA CONFIGURACIÓN' + colors.reset);
    console.log(colors.yellow + '\n   Verifica:' + colors.reset);
    if (!filesOk) console.log(colors.yellow + '   - Que se crearon todos los archivos' + colors.reset);
    if (!envOk) console.log(colors.yellow + '   - Las variables de entorno en .env' + colors.reset);
    if (!depsOk) console.log(colors.yellow + '   - Las dependencias en package.json' + colors.reset);
    if (!serverOk) console.log(colors.yellow + '   - La configuración en server.js' + colors.reset);
  }
  
  console.log(colors.cyan + '════════════════════════════════════════════\n' + colors.reset);

  process.exit(filesOk && envOk && depsOk && serverOk ? 0 : 1);
}

// Ejecutar
runVerification().catch(error => {
  log(`Error fatal: ${error.message}`, 'error');
  process.exit(1);
});
