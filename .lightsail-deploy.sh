#!/bin/bash
# Script de despliegue para Amazon Lightsail
# PrediVersa Full Stack Application

echo "🚀 Desplegando PrediVersa en Amazon Lightsail..."

# Variables de configuración
INSTANCE_NAME="prediversa-app"
REGION="us-east-1"
BUNDLE_ID="nano_2_0"  # 512 MB RAM, 1 vCPU, 20 GB SSD

# 1. Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install --production

# 2. Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd ../frontend
npm install

# 3. Construir el frontend
echo "🔨 Construyendo frontend..."
npm run build

# 4. Configurar PM2 para mantener el servidor corriendo
echo "⚙️ Configurando PM2..."
cd ..
npm install -g pm2

# 5. Crear archivo de configuración de PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'prediversa-backend',
      cwd: './backend',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 5003
      }
    },
    {
      name: 'prediversa-api-gateway',
      cwd: './api-gateway',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
};
EOF

echo "✅ Configuración completada"
echo ""
echo "📝 Próximos pasos:"
echo "1. Crear instancia Lightsail: aws lightsail create-instances --instance-names $INSTANCE_NAME --availability-zone ${REGION}a --bundle-id $BUNDLE_ID --blueprint-id ubuntu_20_04"
echo "2. Subir archivos a la instancia"
echo "3. Configurar base de datos Lightsail"
echo "4. Iniciar aplicación con: pm2 start ecosystem.config.js"
echo "5. Configurar dominio y SSL"
