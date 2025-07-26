// Autenticación simple usando sqlcmd directo
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const getUserByCredentials = async (identifier, password) => {
  try {
    console.log(`🔍 Buscando usuario: ${identifier} con contraseña: ${password}`);
    
    const query = `
      SELECT 
        Id_Usuario as id,
        Nombre_Completo as nombre,
        Correo as correo,
        Usuario as usuario,
        Perfil as rol,
        Activo as activo,
        Telefono as telefono
      FROM usuarios 
      WHERE (Correo = '${identifier}' OR Usuario = '${identifier}') 
        AND Contrasena = '${password}'
        AND Activo = 1
    `;

    const command = `sqlcmd -S localhost -E -d PrediVersa -Q "${query}" -h -1 -s "," -W`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.error('❌ Error en sqlcmd:', stderr);
      throw new Error(stderr);
    }

    const lines = stdout.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      console.log('❌ No se encontró usuario');
      return null;
    }

    // Parse primera línea de datos (saltamos header si existe)
    const dataLine = lines.find(line => !line.includes('id,nombre,correo') && line.includes(','));
    if (!dataLine) {
      console.log('❌ No se encontraron datos válidos');
      return null;
    }

    const [id, nombre, correo, usuario, rol, activo, telefono] = dataLine.split(',').map(s => s.trim());
    
    const user = {
      id: parseInt(id),
      nombre,
      correo,
      usuario,
      rol,
      activo: parseInt(activo),
      telefono
    };

    console.log('✅ Usuario encontrado:', user);
    return user;

  } catch (error) {
    console.error('❌ Error en getUserByCredentials:', error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const query = `
      SELECT 
        Id_Usuario as id,
        Nombre_Completo as nombre,
        Correo as correo,
        Usuario as usuario,
        Perfil as rol,
        Activo as activo
      FROM usuarios
      ORDER BY Id_Usuario
    `;

    const command = `sqlcmd -S localhost -E -d PrediVersa -Q "${query}" -h -1 -s "," -W`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      throw new Error(stderr);
    }

    const lines = stdout.trim().split('\n').filter(line => line.trim());
    const users = [];

    for (const line of lines) {
      if (line.includes(',') && !line.includes('id,nombre,correo')) {
        const [id, nombre, correo, usuario, rol, activo] = line.split(',').map(s => s.trim());
        users.push({
          id: parseInt(id),
          nombre,
          correo,
          usuario,
          rol,
          activo: parseInt(activo)
        });
      }
    }

    return users;

  } catch (error) {
    console.error('❌ Error en getAllUsers:', error);
    throw error;
  }
};

module.exports = {
  getUserByCredentials,
  getAllUsers
};
