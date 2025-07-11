const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/test-login', (req, res) => {
  console.log('Body recibido:', req.body);
  console.log('Headers:', req.headers);
  
  const { usuario, correo, contraseña } = req.body;
  
  console.log('usuario:', usuario);
  console.log('correo:', correo); 
  console.log('contraseña:', contraseña);
  
  res.json({
    message: 'Test exitoso',
    body: req.body,
    hasUsuario: !!usuario,
    hasCorreo: !!correo,
    hasContraseña: !!contraseña
  });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Servidor de prueba ejecutándose en puerto ${PORT}`);
});
