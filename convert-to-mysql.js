const fs = require('fs');

// Leer archivo de datos exportados
const data = fs.readFileSync('usuarios-data.txt', 'utf-8');
const lines = data.split('\n').filter(line => line.trim() && !line.startsWith('---'));

// Eliminar encabezado y línea de separación
const dataLines = lines.slice(2);

// Crear archivo SQL con inserts
let sql = '-- Datos de Usuarios\n\n';

dataLines.forEach(line => {
  const fields = line.split('|').map(f => f.trim());
  
  if (fields.length >= 19) {
    const [
      id, nombreCompleto, tipoDoc, identificacion, telefono, correo, direccion,
      usuario, fechaNac, edad, sexo, eps, perfil, condEsp, descCondEsp,
      contrasena, contactoEmerg, numContactoEmerg, activo
    ] = fields;
    
    // Escapar comillas simples
    const escape = (str) => str ? str.replace(/'/g, "''").replace(/NULL/g, '') : '';
    
    // Formatear fecha
    let fecha = fechaNac === 'NULL' || !fechaNac ? 'NULL' : `'${fechaNac}'`;
    
    sql += `INSERT INTO Usuarios (
      Id_Usuario, Nombre_Completo, Tipo_Documento, Identificacion, Telefono, 
      Correo, Direccion, Usuario, Fecha_Nacimiento, Edad, Sexo, EPS, Perfil, 
      Condicion_Especial, Descripcion_Condicion_Especial, Contrasena, 
      Contacto_Emergencia, Numero_Contacto_Emergencia, Activo
    ) VALUES (
      ${id}, 
      '${escape(nombreCompleto)}', 
      '${escape(tipoDoc)}', 
      '${escape(identificacion)}', 
      ${telefono && telefono !== 'NULL' ? `'${escape(telefono)}'` : 'NULL'}, 
      ${correo && correo !== 'NULL' ? `'${escape(correo)}'` : 'NULL'}, 
      ${direccion && direccion !== 'NULL' ? `'${escape(direccion)}'` : 'NULL'}, 
      '${escape(usuario)}', 
      ${fecha}, 
      ${edad && edad !== 'NULL' ? edad : 'NULL'}, 
      ${sexo && sexo !== 'NULL' ? `'${escape(sexo)}'` : 'NULL'}, 
      ${eps && eps !== 'NULL' ? `'${escape(eps)}'` : 'NULL'}, 
      '${escape(perfil)}', 
      ${condEsp && condEsp !== 'NULL' ? `'${escape(condEsp)}'` : 'NULL'}, 
      ${descCondEsp && descCondEsp !== 'NULL' ? `'${escape(descCondEsp)}'` : 'NULL'}, 
      '${escape(contrasena)}', 
      ${contactoEmerg && contactoEmerg !== 'NULL' ? `'${escape(contactoEmerg)}'` : 'NULL'}, 
      ${numContactoEmerg && numContactoEmerg !== 'NULL' ? `'${escape(numContactoEmerg)}'` : 'NULL'}, 
      '${activo}'
    );\n\n`;
  }
});

fs.writeFileSync('migrate-data-mysql.sql', sql);
console.log('✅ Archivo generado: migrate-data-mysql.sql');
console.log(`📊 Total usuarios: ${dataLines.length}`);
