// Controlador de perfil

// Simulación de base de datos en memoria
const profiles = {};

exports.getProfile = (req, res) => {
  const userId = req.user.id;
  res.json(profiles[userId] || {});
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { theme, language, phone, address } = req.body;
  let photo = profiles[userId]?.photo || '';
  if (req.file) {
    photo = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  }
  profiles[userId] = {
    theme: theme || 'light',
    language: language || 'es',
    phone: phone || '',
    address: address || '',
    photo,
  };
  res.json(profiles[userId]);
};