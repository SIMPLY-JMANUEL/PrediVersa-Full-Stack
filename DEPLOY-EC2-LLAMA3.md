# 🚀 Desplegar Backend con Llama 3 en EC2

## 📋 Datos de tu Instancia EC2

```
ID Instancia:  i-0ff6f6cbbd1cf8789
DNS Público:   ec2-54-164-169-100.compute-1.amazonaws.com
Usuario:       ubuntu
Región:        us-east-1 (North Virginia)
Archivo Clave: PrediVersa.pem
```

---

## ⚡ PASO 1: Conectarse a EC2 (2 min)

### Desde PowerShell (Windows):

```powershell
# Ubicar tu archivo PrediVersa.pem
cd C:\Users\ANDREY\Documents\GitHub\PrediVersa-Full-Stack

# Si PrediVersa.pem está en otra ubicación, cámbiala
# Conectarse a EC2
ssh -i "PrediVersa.pem" ubuntu@ec2-54-164-169-100.compute-1.amazonaws.com
```

**Nota:** Si da error de permisos en Windows, usa Git Bash o WSL.

### Alternativa con Git Bash:
```bash
# Establecer permisos correctos
chmod 400 PrediVersa.pem

# Conectarse
ssh -i "PrediVersa.pem" ubuntu@ec2-54-164-169-100.compute-1.amazonaws.com
```

---

## ⚙️ PASO 2: Instalar Node.js en EC2 (5 min)

Una vez conectado a la EC2, ejecuta:

```bash
# Actualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version  # Debe mostrar v18.x.x
npm --version   # Debe mostrar 9.x.x o superior

# Instalar Git si no está
sudo apt install -y git
```

---

## 📂 PASO 3: Clonar Repositorio (3 min)

```bash
# Ir al directorio home
cd ~

# Clonar tu repositorio
git clone https://github.com/tu_usuario/PrediVersa-Full-Stack.git

# O si ya tienes el código localmente, usa SCP:
# Desde tu PC (PowerShell):
# scp -i "PrediVersa.pem" -r ./backend ubuntu@ec2-54-164-169-100.compute-1.amazonaws.com:~/

# Entrar a la carpeta backend
cd PrediVersa-Full-Stack/backend
```

---

## 🔐 PASO 4: Configurar Variables de Entorno (5 min)

### Opción A: Usar IAM Role (Recomendado - Sin credenciales)

```bash
# Si tu EC2 tiene IAM Role con permisos de Bedrock, NO necesitas credenciales
# Verifica si tiene IAM role:
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Si muestra un nombre de rol, estás listo!
# Crea .env solo con la región:
cat > .env << 'EOF'
PORT=5003
AWS_REGION=us-east-1
CHATBOT_ENABLED=true
CHATBOT_MODEL=llama3_70b

# Base de datos (si aplica)
DB_HOST=tu-base-de-datos.us-east-1.rds.amazonaws.com
DB_DATABASE=PrediVersa
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=tu_password

# JWT Secret
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
EOF
```

### Opción B: Usar Access Keys (Manual)

```bash
# Crear archivo .env
nano .env

# Pegar esto y editar con tus credenciales:
PORT=5003
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJal...
CHATBOT_ENABLED=true
CHATBOT_MODEL=llama3_70b

# JWT Secret
JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# Base de datos
DB_HOST=tu-base-de-datos.us-east-1.rds.amazonaws.com
DB_DATABASE=PrediVersa
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=tu_password

# Guardar: Ctrl+O, Enter, Ctrl+X
```

**Para obtener Access Keys:**
```
1. AWS Console → IAM → Users
2. Tu usuario → Security credentials
3. Create access key → Command Line Interface (CLI)
4. Copiar Access Key ID y Secret Access Key
```

---

## 📦 PASO 5: Instalar Dependencias (3 min)

```bash
# Asegúrate de estar en ~/PrediVersa-Full-Stack/backend
cd ~/PrediVersa-Full-Stack/backend

# Instalar todas las dependencias
npm install

# Verificar que se instalaron las dependencias AWS
npm list @aws-sdk/client-bedrock-runtime
npm list uuid
```

---

## 🔥 PASO 6: Abrir Puerto 5003 en Security Group (5 min)

**Desde AWS Console:**

```
1. EC2 → Instancias → i-0ff6f6cbbd1cf8789
2. Tab "Security" → Security groups
3. Click en el Security Group ID
4. Tab "Inbound rules" → Edit inbound rules
5. Add rule:
   - Type: Custom TCP
   - Port range: 5003
   - Source: 0.0.0.0/0 (o tu IP específica)
   - Description: Backend PrediVersa
6. Save rules
```

---

## 🚀 PASO 7: Ejecutar Backend (2 min)

### Opción A: Ejecución directa (para pruebas)

```bash
cd ~/PrediVersa-Full-Stack/backend
npm start
```

**Output esperado:**
```
🚀 Iniciando backend PrediVersa...
🚀 Puerto configurado: 5003
🔐 JWT_SECRET cargado: ✅ SÍ
🤖 Chatbot routes loaded
✅ Server running on port 5003
```

### Opción B: Ejecutar con PM2 (recomendado para producción)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar aplicación con PM2
cd ~/PrediVersa-Full-Stack/backend
pm2 start server.js --name "prediversa-backend"

# Configurar PM2 para auto-inicio
pm2 startup
pm2 save

# Ver logs
pm2 logs prediversa-backend

# Ver estado
pm2 status
```

**Comandos útiles PM2:**
```bash
pm2 stop prediversa-backend      # Detener
pm2 restart prediversa-backend   # Reiniciar
pm2 logs prediversa-backend      # Ver logs
pm2 monit                        # Monitor en tiempo real
```

---

## 🧪 PASO 8: Probar Conexión (3 min)

### Desde la EC2:

```bash
# Test health check
curl http://localhost:5003/api/chatbot/health

# Debe responder:
# {"success":true,"msg":"AWS Bedrock conectado",...}
```

### Desde tu PC:

```powershell
# Probar desde Windows
curl http://ec2-54-164-169-100.compute-1.amazonaws.com:5003/api/chatbot/health

# O desde navegador:
# http://ec2-54-164-169-100.compute-1.amazonaws.com:5003/api/chatbot/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "msg": "AWS Bedrock conectado",
  "data": {
    "connected": true,
    "model": "Llama 3",
    "provider": "AWS Bedrock"
  }
}
```

---

## 🎨 PASO 9: Configurar Frontend (5 min)

Actualiza la URL del backend en tu frontend local:

**En tu PC, edita:** `frontend/.env`

```bash
REACT_APP_API_URL=http://ec2-54-164-169-100.compute-1.amazonaws.com:5003/api
```

O si usas variables en código:

**`frontend/src/services/apiService.js`:**
```javascript
const API_BASE_URL = 'http://ec2-54-164-169-100.compute-1.amazonaws.com:5003/api';
```

Reinicia el frontend:
```bash
cd frontend
npm start
```

---

## ✅ PASO 10: Verificación Final

### Checklist:

- [ ] ✅ Backend ejecutando en EC2 (puerto 5003)
- [ ] ✅ Security Group permite tráfico en puerto 5003
- [ ] ✅ Health check responde correctamente
- [ ] ✅ Frontend conectado a la EC2
- [ ] ✅ PM2 configurado (si usas producción)

### Prueba completa:

```bash
# En tu PC, ejecuta el script de pruebas
# Pero primero edita la URL:
```

**Edita `test-llama3-chatbot.js`:**
```javascript
const API_BASE_URL = 'http://ec2-54-164-169-100.compute-1.amazonaws.com:5003/api';
```

Luego ejecuta:
```bash
node test-llama3-chatbot.js
```

---

## 🔒 Seguridad Adicional (Recomendado)

### 1. Configurar HTTPS con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Configurar dominio (si tienes uno)
# Ejemplo: api.prediversa.com → EC2 IP
```

### 2. Restringir acceso por IP

```bash
# En Security Group, cambiar:
# Source: 0.0.0.0/0  →  Tu IP específica
```

### 3. Configurar Firewall UFW

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 5003/tcp  # Backend
sudo ufw enable
sudo ufw status
```

---

## 🛠️ Troubleshooting

### Problema: "Connection refused"
```bash
# Verificar que el backend está ejecutando
pm2 status

# Verificar puerto abierto
netstat -tulpn | grep 5003

# Verificar Security Group en AWS Console
```

### Problema: "AWS credentials not found"
```bash
# Verificar variables de entorno
cat .env

# Verificar IAM role (si aplica)
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

### Problema: "Cannot find module"
```bash
# Reinstalar dependencias
cd ~/PrediVersa-Full-Stack/backend
rm -rf node_modules package-lock.json
npm install
```

### Ver logs en tiempo real:
```bash
# Con PM2
pm2 logs prediversa-backend --lines 100

# O directamente
tail -f ~/PrediVersa-Full-Stack/backend/logs/app.log
```

---

## 📊 Monitoreo

### Ver uso de recursos:

```bash
# CPU y RAM
htop

# O
top

# Espacio en disco
df -h

# Logs de PM2
pm2 monit
```

---

## 🔄 Actualizar Código

Para actualizar después de cambios:

```bash
# Conectarse a EC2
ssh -i "PrediVersa.pem" ubuntu@ec2-54-164-169-100.compute-1.amazonaws.com

# Ir al directorio
cd ~/PrediVersa-Full-Stack

# Actualizar código
git pull origin main

# Reinstalar dependencias si cambiaron
cd backend
npm install

# Reiniciar con PM2
pm2 restart prediversa-backend
```

---

## 💰 Optimización de Costos

### Para detener la EC2 cuando no la uses:

**Desde AWS Console:**
```
EC2 → Instancias → i-0ff6f6cbbd1cf8789
→ Estado de la instancia → Detener instancia
```

**O desde CLI:**
```bash
aws ec2 stop-instances --instance-ids i-0ff6f6cbbd1cf8789
```

**Para reiniiciar:**
```bash
aws ec2 start-instances --instance-ids i-0ff6f6cbbd1cf8789
```

---

## 📞 Comandos Rápidos de Referencia

```bash
# Conectarse
ssh -i "PrediVersa.pem" ubuntu@ec2-54-164-169-100.compute-1.amazonaws.com

# Ver logs
pm2 logs prediversa-backend

# Reiniciar backend
pm2 restart prediversa-backend

# Ver estado
pm2 status

# Detener backend
pm2 stop prediversa-backend

# Iniciar backend
pm2 start prediversa-backend
```

---

## ✅ Estado del Despliegue

Una vez completado:

```
✅ Backend ejecutando en EC2 (puerto 5003)
✅ Llama 3 conectado via AWS Bedrock
✅ PM2 gestionando el proceso
✅ Logs disponibles en tiempo real
✅ Frontend puede conectarse desde cualquier lugar
✅ LISTO PARA PRODUCCIÓN
```

---

**Siguiente:** Probar el chatbot desde tu aplicación frontend

**URL Backend:** `http://ec2-54-164-169-100.compute-1.amazonaws.com:5003`

**Última actualización:** 31 de enero de 2026
