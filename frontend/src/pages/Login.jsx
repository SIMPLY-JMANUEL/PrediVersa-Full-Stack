import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errs = [];
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errs.push('Correo electrónico inválido');
    }
    if (password.length < 6) {
      errs.push('La contraseña debe tener al menos 6 caracteres');
    }
    setErrors(errs);
    return errs.length === 0;
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contraseña: password })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('nombre', result.user.nombre);
        localStorage.setItem('rol', result.user.rol);
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        setSuccessMessage(`¡Bienvenido/a, ${result.user.nombre}!`);
        setTimeout(() => {
          navigate(`/dashboard/${result.user.rol}`);
        }, 1000);
      } else {
        setErrors([result.msg || 'Error en el inicio de sesión']);
      }
    } catch (err) {
      setErrors(['No se pudo conectar con el servidor']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
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
  }, []);

  return (
    <main className="main-content">
      <div className="login-section">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-header">
            <h1 className="login-title">Iniciar Sesión</h1>
            <p className="login-subtitle">Accede a tu cuenta</p>
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
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@prediversa.com"
                required
                disabled={loading}
              />
              <span className="input-icon">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <span className="input-icon">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>

          <div className="form-group">
            <div className="login-checkbox-row">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Recordarme</label>
            </div>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="login-links">
            <a href="/forgot" className="link">¿Olvidaste tu contraseña?</a>
            <span className="divider">|</span>
            <a href="/register" className="link">Crear cuenta nueva</a>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;