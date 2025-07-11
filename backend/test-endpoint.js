const fetch = require('node-fetch');

async function testUserCreationEndpoint() {
  console.log('🧪 Probando endpoint de creación de usuario...');
  
  try {
    // Datos de prueba similares a los que enviaría el frontend
    const userData = {
      usuario: 'testuser2',
      numeroDocumento: '87654321',
      tipoDocumento: 'Cédula de Ciudadanía',
      nombres: 'Juan',
      apellidos: 'Pérez',
      correoElectronico: 'juan.perez@test.com',
      telefono: '3001234567',
      fechaNacimiento: '1990-05-15',
      genero: 'Masculino',
      institucion: 'Universidad Test',
      cargo: 'Estudiante',
      nivelEducativo: 'Universitario',
      numeroContactoEmergencia: '3009876543',
      condicionEspecial: 'Ninguna',
      descripcionCondicion: '',
      contrasena: 'test12345'
    };

    console.log('📤 Enviando datos:', JSON.stringify(userData, null, 2));

    const response = await fetch('http://localhost:5001/api/profile/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token' // Solo para la prueba
      },
      body: JSON.stringify(userData)
    });

    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('📝 Response Body:', responseText);

    if (response.ok) {
      console.log('✅ Usuario creado exitosamente');
    } else {
      console.log('❌ Error en la creación');
    }

  } catch (error) {
    console.error('💥 Error en la prueba:', error.message);
  }
}

testUserCreationEndpoint();
