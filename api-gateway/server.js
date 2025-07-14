require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de autenticación global (puedes afinarlo por ruta)
app.use(authMiddleware);

// Proxy a servicios Node.js internos
app.use('/api/node', createProxyMiddleware({
  target: process.env.NODE_SERVICE_URL || 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/api/node': '/api' }
}));

// Proxy a microservicio Python
app.use('/api/python', createProxyMiddleware({
  target: process.env.PYTHON_SERVICE_URL || 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: { '^/api/python': '/api' }
}));

app.get('/', (req, res) => res.send('API Gateway funcionando'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API Gateway en puerto ${PORT}`));
