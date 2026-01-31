#!/bin/bash
# Script de instalación completa para EC2
# Copia y pega estos comandos uno por uno en la terminal de AWS Console

# ========== PASO 2: Actualizar sistema e instalar Node.js ==========
echo "🔄 Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

echo "📦 Instalando Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

echo "✅ Verificando instalación..."
node --version
npm --version

# ========== PASO 3: Clonar o subir código ==========
echo "📂 Creando directorio para el proyecto..."
cd ~
mkdir -p prediversa-backend
cd prediversa-backend

# Aquí copiaremos los archivos del backend

# ========== PASO 4: Configurar variables de entorno ==========
echo "🔐 Creando archivo .env..."
cat > .env << 'EOF'
# Puerto del servidor
PORT=5003

# AWS Bedrock para Llama 3
AWS_REGION=us-east-1
# Si la EC2 tiene IAM Role, no necesitas credenciales aquí
# Si no, agrega:
# AWS_ACCESS_KEY_ID=tu_key
# AWS_SECRET_ACCESS_KEY=tu_secret

# Chatbot
CHATBOT_ENABLED=true
CHATBOT_MODEL=llama3_70b

# JWT Secret
JWT_SECRET=prediversa_super_secret_key_2026_cambiar_en_produccion

# Base de datos (ajusta según tu configuración)
DB_HOST=localhost
DB_DATABASE=PrediVersa
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=tu_password
EOF

echo "✅ Archivo .env creado"

# ========== PASO 5: Crear package.json si no existe ==========
echo "📦 Verificando package.json..."

# ========== PASO 6: Instalar PM2 ==========
echo "🔧 Instalando PM2..."
sudo npm install -g pm2

echo "✅ Instalación base completada"
echo ""
echo "📋 Siguiente paso: Subir código del backend"
