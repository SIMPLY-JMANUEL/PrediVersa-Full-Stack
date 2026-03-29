# Migración de Base de Datos a AWS RDS

## Opción 1: RDS MySQL (Recomendado - Más económico)

### Costos aproximados:
- **db.t3.micro** (1 vCPU, 1 GB RAM): ~$15/mes
- **db.t4g.micro** (2 vCPU, 1 GB RAM): ~$12/mes (ARM - más barato)
- **Almacenamiento**: $0.115/GB-mes (20 GB = ~$2.30/mes)
- **Total estimado**: ~$14-17/mes

### Paso 1: Crear base de datos RDS MySQL

```bash
aws rds create-db-instance \
  --db-instance-identifier prediversa-db \
  --db-instance-class db.t4g.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username admin \
  --master-user-password "TuPasswordSeguro123!" \
  --allocated-storage 20 \
  --storage-type gp3 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --publicly-accessible \
  --backup-retention-period 7 \
  --region us-east-1 \
  --db-name PrediVersa
```

### Paso 2: Configurar grupo de seguridad

```bash
# Obtener el grupo de seguridad por defecto
aws ec2 describe-security-groups --region us-east-1 --filters "Name=group-name,Values=default"

# Agregar regla para MySQL (puerto 3306)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 3306 \
  --cidr 0.0.0.0/0 \
  --region us-east-1
```

## Opción 2: RDS SQL Server (Más caro - Compatible directo)

### Costos aproximados:
- **db.t3.small** (2 vCPU, 2 GB RAM): ~$100/mes
- **SQL Server Express**: ~$50/mes (limitado a 10 GB)
- **Total estimado**: ~$50-100/mes

### Crear RDS SQL Server Express

```bash
aws rds create-db-instance \
  --db-instance-identifier prediversa-sqlserver \
  --db-instance-class db.t3.small \
  --engine sqlserver-ex \
  --engine-version 15.00.4335.1.v1 \
  --master-username admin \
  --master-user-password "TuPasswordSeguro123!" \
  --allocated-storage 20 \
  --publicly-accessible \
  --region us-east-1
```

## Paso 3: Convertir datos de SQL Server a MySQL

### Instalar herramientas
```bash
npm install -g mysql
```

### Script de conversión (crear archivo: convert-sqlserver-to-mysql.js)

```javascript
const fs = require('fs');
const path = require('path');

// Leer archivo de usuarios exportado
const usuariosData = fs.readFileSync('usuarios-export.csv', 'utf-8');
const lines = usuariosData.split('\n').filter(line => line.trim());

// Crear script SQL para MySQL
let mysqlScript = `
CREATE DATABASE IF NOT EXISTS PrediVersa;
USE PrediVersa;

-- Tabla Usuarios
CREATE TABLE Usuarios (
  IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
  Usuario VARCHAR(50) NOT NULL UNIQUE,
  Contrasena VARCHAR(255) NOT NULL,
  Rol VARCHAR(20) NOT NULL,
  Nombre VARCHAR(100),
  Apellido VARCHAR(100),
  Email VARCHAR(100),
  Telefono VARCHAR(20),
  Activo VARCHAR(2) DEFAULT 'Si',
  FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario (Usuario),
  INDEX idx_rol (Rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar datos
`;

// Convertir datos (ajustar según estructura real)
lines.forEach((line, index) => {
  if (index > 0) { // Saltar encabezado
    const fields = line.split(',');
    if (fields.length >= 3) {
      mysqlScript += `INSERT INTO Usuarios (Usuario, Contrasena, Rol, Nombre, Apellido, Email, Activo) VALUES (${fields.map(f => `'${f.trim()}'`).join(', ')});\n`;
    }
  }
});

fs.writeFileSync('migrate-to-mysql.sql', mysqlScript);
console.log('Script de migración creado: migrate-to-mysql.sql');
```

## Paso 4: Esperar a que RDS esté disponible

```bash
# Verificar estado
aws rds describe-db-instances \
  --db-instance-identifier prediversa-db \
  --region us-east-1 \
  --query 'DBInstances[0].[DBInstanceStatus,Endpoint.Address,Endpoint.Port]' \
  --output table
```

## Paso 5: Obtener endpoint de conexión

```bash
aws rds describe-db-instances \
  --db-instance-identifier prediversa-db \
  --region us-east-1 \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

## Paso 6: Actualizar backend/.env

```env
# AWS RDS Configuration
DB_HOST=prediversa-db.xxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=PrediVersa
DB_USER=admin
DB_PASSWORD=TuPasswordSeguro123!
DB_DIALECT=mysql

# O para SQL Server
DB_HOST=prediversa-sqlserver.xxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=1433
DB_NAME=PrediVersa
DB_USER=admin
DB_PASSWORD=TuPasswordSeguro123!
DB_DIALECT=mssql
```

## Paso 7: Instalar dependencias MySQL en backend

```bash
cd backend
npm install mysql2 sequelize
```

## Paso 8: Actualizar backend/config/database.js para MySQL

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

## Paso 9: Importar datos a RDS

```bash
# Para MySQL
mysql -h prediversa-db.xxxxxx.us-east-1.rds.amazonaws.com -u admin -p PrediVersa < migrate-to-mysql.sql

# O usar cliente MySQL Workbench / DBeaver
```

## Paso 10: Probar conexión desde backend

```bash
cd backend
node -e "const pool = require('./config/database'); pool.query('SELECT 1+1 AS result').then(([rows]) => { console.log('Conexión exitosa:', rows); process.exit(0); }).catch(err => { console.error('Error:', err); process.exit(1); });"
```

## Recomendación

**Usar MySQL en RDS** porque:
- ✅ Costo mensual mucho menor ($14-17 vs $50-100)
- ✅ Mejor rendimiento en capa gratuita
- ✅ Más fácil de escalar
- ✅ Compatible con tu stack actual (solo cambiar queries)
- ✅ Gran comunidad y soporte

Solo necesitarás ajustar algunas queries SQL Server específicas a sintaxis MySQL.
