const { spawn } = require('child_process');

// Función para ejecutar consultas SQL usando sqlcmd directamente
const executeSqlCmd = query => {
  return new Promise((resolve, reject) => {
    const sqlcmd = spawn('sqlcmd', [
      '-S',
      'localhost',
      '-E', // Windows Authentication
      '-d',
      'PrediVersa',
      '-Q',
      query,
      '-h',
      '-1', // No headers
      '-s',
      '|', // Separador de columnas
    ]);

    let output = '';
    let error = '';

    sqlcmd.stdout.on('data', data => {
      output += data.toString();
    });

    sqlcmd.stderr.on('data', data => {
      error += data.toString();
    });

    sqlcmd.on('close', code => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`sqlcmd error: ${error}`));
      }
    });
  });
};

// Función para buscar usuario por credenciales usando sqlcmd
const getUserByCredentialsDirect = async (identifier, password) => {
  try {
    const query = `
      SELECT 
        Id_Usuario,
        Nombre_Completo,
        Correo,
        Usuario,
        Perfil,
        Activo,
        Telefono,
        Edad,
        Fecha_Nacimiento,
        Tipo_Documento,
        Identificacion
      FROM usuarios 
      WHERE (Correo = '${identifier}' OR Usuario = '${identifier}') 
        AND Contrasena = '${password}'
        AND Activo = 1
    `;

    const result = await executeSqlCmd(query);

    if (!result || result.trim() === '') {
      return null;
    }

    // Parsear resultado
    const lines = result.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      return null;
    }

    const userData = lines[0].split('|');

    if (userData.length >= 11) {
      return {
        id: parseInt(userData[0]) || 0,
        nombre: (userData[1] || '').trim(),
        correo: (userData[2] || '').trim(),
        usuario: (userData[3] || '').trim(),
        rol: (userData[4] || '').trim(),
        activo: parseInt(userData[5]) || 0,
        telefono: (userData[6] || '').trim(),
        edad: parseInt(userData[7]) || 0,
        fechaNacimiento: (userData[8] || '').trim(),
        tipoDocumento: (userData[9] || '').trim(),
        identificacion: (userData[10] || '').trim(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error en getUserByCredentialsDirect:', error);
    return null;
  }
};

// Función para obtener todos los usuarios usando sqlcmd
const getAllUsersDirect = async () => {
  try {
    const query = `
      SELECT 
        Id_Usuario,
        Nombre_Completo,
        Correo,
        Usuario,
        Perfil,
        Activo,
        Telefono,
        Edad,
        Fecha_Nacimiento
      FROM usuarios 
      ORDER BY Id_Usuario
    `;

    const result = await executeSqlCmd(query);

    if (!result || result.trim() === '') {
      return [];
    }

    // Parsear resultados
    const lines = result.split('\n').filter(line => line.trim() !== '');
    const users = [];

    for (const line of lines) {
      const userData = line.split('|');
      if (userData.length >= 9) {
        users.push({
          id: parseInt(userData[0]) || 0,
          nombre: (userData[1] || '').trim(),
          correo: (userData[2] || '').trim(),
          usuario: (userData[3] || '').trim(),
          rol: (userData[4] || '').trim(),
          activo: parseInt(userData[5]) || 0,
          telefono: (userData[6] || '').trim(),
          edad: parseInt(userData[7]) || 0,
          fechaNacimiento: (userData[8] || '').trim(),
        });
      }
    }

    return users;
  } catch (error) {
    console.error('Error en getAllUsersDirect:', error);
    return [];
  }
};

module.exports = {
  getUserByCredentialsDirect,
  getAllUsersDirect,
  executeSqlCmd,
};
