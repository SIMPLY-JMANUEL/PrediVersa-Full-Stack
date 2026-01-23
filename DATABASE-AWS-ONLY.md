# 🌍 PrediVersa - AWS RDS MySQL

## Configuración de Base de Datos

PrediVersa ahora usa **exclusivamente AWS RDS MySQL** para almacenamiento de datos en la nube.

---

## 🗄️ Base de Datos

### AWS RDS MySQL
- **Tipo**: MySQL 8.0.44
- **Instancia**: db.t4g.micro (1 vCPU, 1 GB RAM)
- **Almacenamiento**: 20 GB gp3
- **Región**: us-east-1 (Virginia del Norte)

### Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
# Base de datos AWS RDS MySQL
DB_HOST=tu-base-de-datos.us-east-1.rds.amazonaws.com
DB_DATABASE=PrediVersa
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=tu_contraseña_segura
```

---

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales de AWS RDS
```

### 3. Probar Conexión

```bash
node test-rds-connection.js
```

### 4. Iniciar Servidor

```bash
npm start
```

El servidor iniciará en `http://localhost:5003`

---

## 📦 Dependencias Principales

- **express**: Framework web
- **mysql2**: Driver MySQL para Node.js
- **bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **helmet**: Seguridad HTTP
- **cors**: Cross-Origin Resource Sharing

---

## 🔧 Estructura de Archivos

```
backend/
├── config/
│   ├── database.js          # Configuración principal (AWS RDS)
│   └── database-mysql.js    # Implementación MySQL
├── models/
│   └── UserMySQL.js         # Modelo de usuario
├── routes/
│   ├── auth.js              # Autenticación
│   ├── admin.js             # Rutas administrativas
│   ├── student.js           # Rutas de estudiantes
│   ├── teacher.js           # Rutas de profesores
│   └── parent.js            # Rutas de padres
├── middlewares/
│   └── auth.js              # Middleware de autenticación
├── db-adapter.js            # Adaptador de base de datos
└── server.js                # Servidor principal
```

---

## 💰 Costos AWS (Estimado)

- **RDS MySQL db.t4g.micro**: ~$12/mes
- **Almacenamiento (20 GB)**: ~$2.30/mes
- **Transferencia de datos**: 100 GB gratis/mes
- **Total**: ~$14-15 USD/mes

---

## 🔐 Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Autenticación JWT
- ✅ Helmet para seguridad HTTP
- ✅ Rate limiting en endpoints de API
- ✅ CORS configurado
- ✅ Base de datos en VPC privada de AWS

---

## 📝 Notas

- La base de datos es accesible desde cualquier dispositivo con internet
- Asegúrate de tener las credenciales correctas en `.env`
- Nunca subas el archivo `.env` a GitHub
- Los datos están respaldados automáticamente por AWS

---

## 🆘 Solución de Problemas

### Error de conexión
```bash
# Verificar que las credenciales sean correctas
node test-rds-connection.js

# Verificar que el grupo de seguridad de AWS permita tu IP
```

### Puerto 5003 en uso
```bash
# Cambiar el puerto en .env
PORT=5004
```

---

## 📚 Documentación Adicional

- [AWS RDS MySQL](https://aws.amazon.com/rds/mysql/)
- [Node.js MySQL2](https://github.com/sidorares/node-mysql2)
- [Express.js](https://expressjs.com/)
