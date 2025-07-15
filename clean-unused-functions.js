// Script para limpiar funciones no utilizadas en AdminDashboard.jsx
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'dashboards', 'AdminDashboard.jsx');

// Leer el archivo
let content = fs.readFileSync(filePath, 'utf8');

// Funciones a eliminar (que no se usan)
const functionsToRemove = [
  'generateSecurePassword',
  'validateEmail', 
  'handleConfirmUserData',
  'handleCreateUser'
];

// Remover cada función
functionsToRemove.forEach(funcName => {
  // Buscar la función y eliminarla
  const functionRegex = new RegExp(`\\s*const ${funcName} = \\([^)]*\\) => \\{[^}]*\\};?\\s*`, 'g');
  content = content.replace(functionRegex, '');
  
  // También buscar versiones con function
  const functionRegex2 = new RegExp(`\\s*function ${funcName}\\([^)]*\\) \\{[^}]*\\}\\s*`, 'g');
  content = content.replace(functionRegex2, '');
});

// Guardar el archivo limpio
fs.writeFileSync(filePath, content);

console.log('✅ Funciones no utilizadas eliminadas de AdminDashboard.jsx');
console.log('Funciones eliminadas:', functionsToRemove.join(', '));
