import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mapeo de perfiles a rutas de dashboard
  const getDashboardRoute = (rol) => {
    const profileRoutes = {
      'Administrador': '/Admin',
      'Moderador': '/Moderador', 
      'Estudiante': '/Estudiante',
      'Acudiente': '/Acudiente',
      'Docente': '/Docente'
    };
    return profileRoutes[rol] || '/dashboard';
  };

  const validateForm = () => {
    const errs = [];
    if (!username || username.trim().length < 3) {
      errs.push('El nombre de usuario debe tener al menos 3 caracteres');
    }
    if (password.length < 6) {
      errs.push('La contraseña debe tener al menos 6 caracteres');
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      console.log('Intentando login con:', { usuario: username.trim() });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          usuario: username.trim(), 
          password: password // Usando 'password' para evitar problemas de encoding
        })
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.msg || 'Error en el servidor');
      }

      if (data.success) {
        // Verificar que el usuario esté activo
        if (data.user.activo !== 'SI') {
          setErrors(['Usuario inactivo. Contacta al administrador.']);
          setLoading(false);
          return;
        }

        // Guardar información del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (rememberMe) {
          localStorage.setItem('rememberUser', username.trim());
        } else {
          localStorage.removeItem('rememberUser');
        }

        setSuccessMessage(data.message || `Bienvenido ${data.user.nombre}`);

        // Redirigir según el perfil del usuario
        setTimeout(() => {
          const dashboardRoute = getDashboardRoute(data.user.rol);
          console.log(`Redirigiendo a: ${dashboardRoute} para el rol: ${data.user.rol}`);
          navigate(dashboardRoute);
        }, 1500);

      } else {
        setErrors([data.msg || 'Error de autenticación']);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setErrors([error.message || 'Error de conexión. Verifica que el servidor esté funcionando.']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
    
    // Verificar si ya hay una sesión activa
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        const dashboardRoute = getDashboardRoute(userData.rol);
        navigate(dashboardRoute);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Animación de entrada
    const elements = document.querySelectorAll(
      '.login-title, .login-subtitle, .login-form'
    );
    elements.forEach((el, i) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'all 0.6s cubic-bezier(.4,1.4,.6,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 120);
      }
    });
  }, [navigate]);

  return (
    <main className="main-content">
      <div className="login-section">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-header">
            <h1 className="login-title">Iniciar Sesión</h1>
            <p className="login-subtitle">Accede a PrediVersa</p>
            <hr className="login-divider" />
          </div>

          {successMessage && (
            <div className="success-messages">
              <p className="success-text">{successMessage}</p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((err, i) => <p key={i} className="error-text">{err}</p>)}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                disabled={loading}
                autoComplete="username"
              />
              <span className="input-icon">
                <i className="fas fa-user"></i>
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span className="checkmark"></span>
              Recordar usuario
            </label>
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="login-footer">
            <p>¿Problemas para acceder? <a href="/help">Contacta soporte</a></p>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
