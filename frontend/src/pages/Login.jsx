import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import fondo from '../assets/img/fondo12.png';
import Footer from '../components/Footer';

const API_URL = process.env.REACT_APP_API_URL || '/api';

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
  const getDashboardRoute = (rol, tipoUsuario) => {
    // Super Admin tiene prioridad sobre el rol
    if (tipoUsuario === 'superadmin') {
      return '/dashboard/superadmin';
    }

    const profileRoutes = {
      admin: '/dashboard/admin',
      administrador: '/dashboard/admin',
      Administrador: '/dashboard/admin',
      ADMIN: '/dashboard/admin',
      moderador: '/dashboard/moderator',
      Moderador: '/dashboard/moderator',
      MODERADOR: '/dashboard/moderator',
      estudiante: '/dashboard/student',
      Estudiante: '/dashboard/student',
      ESTUDIANTE: '/dashboard/student',
      padre: '/dashboard/parent',
      acudiente: '/dashboard/parent',
      Acudiente: '/dashboard/parent',
      PADRE: '/dashboard/parent',
      MADRE: '/dashboard/parent',
      profesor: '/dashboard/teacher',
      docente: '/dashboard/teacher',
      Docente: '/dashboard/teacher',
      PROFESOR: '/dashboard/teacher',
    };
    return profileRoutes[rol] || '/dashboard';
  };

  const validateForm = () => {
    const errs = [];
    if (!username || username.trim().length < 3) {
      errs.push('El nombre de usuario debe tener al menos 3 caracteres');
    }

    // Para admin master, permitir contraseña más corta
    const isAdminMaster = username.trim() === 'admin@prediversa.com';
    const minPasswordLength = isAdminMaster ? 3 : 6;

    if (!password || password.length < minPasswordLength) {
      errs.push(
        `La contraseña debe tener al menos ${minPasswordLength} caracteres`
      );
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      // Intentando login con usuario

      const response = await window.fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          correo: username.trim(), // Cambiado de correoElectronico a correo para coincidir con el backend
          contraseña: password || '', // Permitir contraseña vacía para admin master
        }),
      });

      const data = await response.json();
      // Procesando respuesta del servidor
      console.log('🔍 Login response:', {
        success: data.success,
        hasToken: !!data.token,
        hasUser: !!data.user,
      });

      if (!response.ok) {
        throw new Error(data.msg || 'Error en el servidor');
      }

      // El backend devuelve directamente token y user, no data.success
      if (data.token && data.user) {
        console.log('✅ Login successful, user data:', {
          nombre: data.user.nombre,
          rol: data.user.rol,
          activo: data.user.activo,
        });

        // Verificar que el usuario esté activo (acepta 'SI', 1, true)
        if (
          !(
            data.user.activo === 'SI' ||
            data.user.activo === 1 ||
            data.user.activo === true
          )
        ) {
          console.log('❌ User inactive:', data.user.activo);
          setErrors(['Usuario inactivo. Contacta al administrador.']);
          setLoading(false);
          return;
        }

        // Guardar información del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Guardar también datos individuales para compatibilidad con componentes existentes
        const user = data.user;
        const nombreCompleto = user.Nombre_Completo || user.nombre || '';
        const nombreParts = nombreCompleto.split(' ');

        localStorage.setItem('nombre', user.nombre || nombreParts[0] || '');
        localStorage.setItem(
          'apellido',
          user.apellido || nombreParts.slice(1).join(' ') || ''
        );
        localStorage.setItem(
          'correo',
          user.correo || user.Correo || user.correoElectronico || ''
        );
        localStorage.setItem('rol', user.rol || user.Perfil || '');
        localStorage.setItem(
          'tipoDocumento',
          user.tipo_documento || user.Tipo_Documento || ''
        );
        localStorage.setItem(
          'documento',
          user.identificacion || user.Identificacion || ''
        );
        localStorage.setItem('telefono', user.telefono || user.Telefono || '');
        localStorage.setItem('edad', user.edad || user.Edad || '');
        localStorage.setItem(
          'fechaNacimiento',
          user.fecha_nacimiento || user.Fecha_Nacimiento || ''
        );
        localStorage.setItem(
          'fechaRegistro',
          user.fecha_registro || user.Fecha_Registro || new Date().toISOString()
        );

        if (rememberMe) {
          localStorage.setItem('rememberUser', username.trim());
        } else {
          localStorage.removeItem('rememberUser');
        }

        setSuccessMessage(`Bienvenido ${data.user.nombre}`);

        // Redirigir según el perfil del usuario
        window.setTimeout(() => {
          const dashboardRoute = getDashboardRoute(
            (data.user.rol || '').trim(),
            (data.user.tipo_usuario || '').trim()
          );
          console.log(
            '🚀 Redirecting to:',
            dashboardRoute,
            'for role:',
            data.user.rol,
            'tipo_usuario:',
            data.user.tipo_usuario
          );

          // Verificar que la ruta no sea la por defecto
          if (dashboardRoute === '/dashboard') {
            console.warn(
              '⚠️ Using default dashboard route, role not recognized:',
              (data.user.rol || '').trim()
            );
            setErrors([
              `Rol "${(
                data.user.rol || ''
              ).trim()}" no reconocido. Contacta al administrador.`,
            ]);
            setLoading(false);
            return;
          }

          // Redirigiendo al dashboard correspondiente
          navigate(dashboardRoute);
        }, 1500);
      } else {
        setErrors([data.msg || 'Error de autenticación']);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setErrors([
        error.message ||
          'Error de conexión. Verifica que el servidor esté funcionando.',
      ]);
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
        const dashboardRoute = getDashboardRoute(
          (userData.rol || '').trim(),
          (userData.tipo_usuario || '').trim()
        );
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
        window.setTimeout(() => {
          el.style.transition = 'all 0.6s cubic-bezier(.4,1.4,.6,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 120);
      }
    });
  }, [navigate]);

  return (
    <div
      className="login-background"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <section className="login-main-content">
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-header">
              <h1 className="login-form-title">Iniciar Sesión</h1>
              <p className="login-form-subtitle">
                Accede a PrediVersa con tus credenciales
              </p>
            </div>

            {successMessage && (
              <div className="success-messages">
                <p className="success-text">{successMessage}</p>
              </div>
            )}

            {errors.length > 0 && (
              <div className="error-messages">
                {errors.map(err => (
                  <p key={err} className="error-text">
                    {err}
                  </p>
                ))}
              </div>
            )}

            <div className="form-group">
              <label
                htmlFor="username"
                style={{
                  color: '#222',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  letterSpacing: '0.5px',
                }}
              >
                Nombre de usuario
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                  disabled={loading}
                  autoComplete="username"
                  style={{
                    background: '#fff',
                    color: '#222',
                    fontSize: '1rem',
                    fontWeight: '500',
                    border: '1.5px solid #007bff',
                    padding: '10px',
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor="password"
                style={{
                  color: '#222',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  letterSpacing: '0.5px',
                }}
              >
                Contraseña
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  style={{
                    background: '#fff',
                    color: '#222',
                    fontSize: '1rem',
                    fontWeight: '500',
                    border: '1.5px solid #007bff',
                    padding: '10px',
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                >
                  <i
                    className={`fas ${
                      showPassword ? 'fa-eye-slash' : 'fa-eye'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="form-options">
              <label
                className="checkbox-label"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: '#333',
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={loading}
                  style={{ marginRight: '8px', accentColor: '#007bff' }}
                />
                <span className="checkmark" style={{ marginRight: '8px' }} />
                <span>Recordar usuario</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className={`login-submit-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>

            <div className="login-support">
              <p>
                ¿Olvidaste tu contraseña?{' '}
                <a href="/recuperar-password">Recupérala</a>
              </p>
              <p>
                ¿Tienes algún problema? <a href="/help">Contacta a soporte</a>
              </p>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Login;
