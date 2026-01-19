# Guía de Despliegue en Amazon Lightsail

## 📋 Prerequisitos

1. Cuenta de AWS activa
2. AWS CLI instalado y configurado
3. Node.js 18+ instalado localmente

## 🚀 Opciones de Despliegue

### Opción 1: Instancia + Base de Datos Lightsail

**Recursos necesarios:**
- **Instancia**: $10/mes (2 GB RAM, 1 vCPU, 60 GB SSD)
- **Base de datos**: $15/mes (SQL Server Standard, 1 GB RAM)
- **Total**: ~$25/mes

### Opción 2: Contenedores Lightsail

**Recursos necesarios:**
- **Contenedor Nano**: $7/mes (512 MB RAM, 0.25 vCPU)
- **Base de datos**: $15/mes
- **Total**: ~$22/mes

## 📝 Pasos de Configuración

### 1. Crear Instancia Lightsail

```bash
# Iniciar sesión en AWS CLI
aws configure

# Crear instancia
aws lightsail create-instances \
  --instance-names prediversa-app \
  --availability-zone us-east-1a \
  --bundle-id medium_2_0 \
  --blueprint-id ubuntu_20_04

# Obtener IP pública
aws lightsail get-instance --instance-name prediversa-app --query 'instance.publicIpAddress'
```

### 2. Crear Base de Datos Lightsail

```bash
# Crear base de datos SQL Server
aws lightsail create-relational-database \
  --relational-database-name prediversa-db \
  --availability-zone us-east-1a \
  --relational-database-bundle-id micro_1_0 \
  --master-database-name PrediVersa \
  --master-username admin \
  --master-user-password "TuContraseñaSegura123!"

# Obtener endpoint de la base de datos
aws lightsail get-relational-database \
  --relational-database-name prediversa-db \
  --query 'relationalDatabase.masterEndpoint'
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.production` en el backend:

```env
# Base de datos Lightsail
DB_HOST=prediversa-db.xxxxx.us-east-1.rds.amazonaws.com
DB_DATABASE=PrediVersa
DB_PORT=1433
DB_USER=admin
DB_PASSWORD=TuContraseñaSegura123!

# JWT
JWT_SECRET=tu-clave-jwt-super-segura-cambiar
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com

# Puerto
PORT=5003
NODE_ENV=production
```

### 4. Conectarse a la Instancia

```bash
# Descargar clave SSH
aws lightsail download-default-key-pair \
  --region us-east-1 \
  --output text > lightsail-key.pem

chmod 400 lightsail-key.pem

# Conectarse vía SSH
ssh -i lightsail-key.pem ubuntu@[IP_PUBLICA]
```

### 5. Instalar Dependencias en la Instancia

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 para gestionar procesos
sudo npm install -g pm2

# Instalar Nginx como proxy reverso
sudo apt install -y nginx

# Instalar Git
sudo apt install -y git
```

### 6. Clonar y Configurar Aplicación

```bash
# Clonar repositorio
cd /var/www
sudo git clone https://github.com/tu-usuario/PrediVersa-Full-Stack.git
cd PrediVersa-Full-Stack

# Dar permisos
sudo chown -R $USER:$USER /var/www/PrediVersa-Full-Stack

# Instalar dependencias del backend
cd backend
npm install --production
cp .env.example .env
# Editar .env con las credenciales correctas
nano .env

# Instalar dependencias del API Gateway
cd ../api-gateway
npm install --production

# Construir frontend
cd ../frontend
npm install
npm run build
```

### 7. Configurar PM2

```bash
cd /var/www/PrediVersa-Full-Stack

# Crear archivo de configuración
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
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'prediversa-gateway',
      cwd: './api-gateway',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

# Iniciar aplicaciones
pm2 start ecosystem.config.js

# Configurar PM2 para iniciar al arrancar
pm2 startup
pm2 save
```

### 8. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/prediversa

# Agregar configuración:
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Frontend
    location / {
        root /var/www/PrediVersa-Full-Stack/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API Gateway
    location /gateway {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/prediversa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. Configurar Firewall

```bash
# En la consola de Lightsail, abrir puertos:
# - Puerto 80 (HTTP)
# - Puerto 443 (HTTPS)
# - Puerto 22 (SSH)

# O por CLI:
aws lightsail open-instance-public-ports \
  --instance-name prediversa-app \
  --port-info fromPort=80,toPort=80,protocol=tcp

aws lightsail open-instance-public-ports \
  --instance-name prediversa-app \
  --port-info fromPort=443,toPort=443,protocol=tcp
```

### 10. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática
sudo certbot renew --dry-run
```

## 🔧 Mantenimiento

### Actualizar Aplicación

```bash
cd /var/www/PrediVersa-Full-Stack
git pull origin main

# Backend
cd backend
npm install --production

# Frontend
cd ../frontend
npm install
npm run build

# Reiniciar servicios
pm2 restart all
```

### Monitoreo

```bash
# Ver estado de aplicaciones
pm2 status

# Ver logs
pm2 logs

# Monitorear recursos
pm2 monit
```

### Backup de Base de Datos

```bash
# Crear snapshot de la base de datos
aws lightsail create-relational-database-snapshot \
  --relational-database-name prediversa-db \
  --relational-database-snapshot-name prediversa-backup-$(date +%Y%m%d)
```

## 💰 Estimación de Costos

- **Instancia Medium (2GB RAM)**: $10/mes
- **Base de datos Micro (1GB RAM)**: $15/mes
- **Backup automático**: Incluido
- **Transferencia de datos**: 1 TB incluido
- **Total estimado**: $25/mes

## 🔗 Enlaces Útiles

- [Lightsail Console](https://lightsail.aws.amazon.com/)
- [AWS CLI Docs](https://docs.aws.amazon.com/cli/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## ⚠️ Notas Importantes

1. Cambiar todas las contraseñas por defecto
2. Configurar backups automáticos
3. Monitorear uso de recursos
4. Actualizar dependencias regularmente
5. Revisar logs de seguridad
