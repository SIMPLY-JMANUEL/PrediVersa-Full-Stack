import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';

function ButtonShowcase() {
  return (
    <section className="container" style={{ padding: '3rem 1.5rem', background: 'var(--color-fondo)' }}>
      <div className="text-center mb-4">
        <h2 style={{ color: 'var(--color-azul-oscuro)', marginBottom: '1rem' }}>
          Sistema de Botones Prediversa
        </h2>
        <p style={{ color: 'var(--color-texto)', marginBottom: '2rem' }}>
          Demostración del sistema unificado de botones implementado
        </p>
      </div>

      {/* Botones Principales */}
      <div className="mb-4">
        <h3 style={{ color: 'var(--color-azul-oscuro)', marginBottom: '1rem' }}>Botones Principales</h3>
        <div className="btn-group mb-3">
          <button className="btn-inicio">
            <i className="fas fa-play-circle"></i>
            Botón Inicio
          </button>
          <button className="btn-regresar">
            <i className="fas fa-arrow-left"></i>
            Botón Regresar
          </button>
          <button className="btn-login">
            <i className="fas fa-sign-in-alt"></i>
            Botón Login
          </button>
        </div>
      </div>

      {/* Botones con Links */}
      <div className="mb-4">
        <h3 style={{ color: 'var(--color-azul-oscuro)', marginBottom: '1rem' }}>Enlaces como Botones</h3>
        <div className="btn-group mb-3">
          <Link to="/" className="btn-inicio">
            <i className="fas fa-home"></i>
            Ir al Inicio
          </Link>
          <Link to="/contacto" className="btn-regresar">
            <i className="fas fa-envelope"></i>
            Contactar
          </Link>
          <Link to="/login" className="btn-login">
            <i className="fas fa-user"></i>
            Iniciar Sesión
          </Link>
        </div>
      </div>

      {/* Tamaños de Botones */}
      <div className="mb-4">
        <h3 style={{ color: 'var(--color-azul-oscuro)', marginBottom: '1rem' }}>Tamaños de Botones</h3>
        <div className="btn-group mb-3">
          <button className="btn-inicio btn-sm">Pequeño</button>
          <button className="btn-inicio">Normal</button>
          <button className="btn-inicio btn-lg">Grande</button>
        </div>
      </div>

      {/* Estados de Botones */}
      <div className="mb-4">
        <h3 style={{ color: 'var(--color-azul-oscuro)', marginBottom: '1rem' }}>Estados de Botones</h3>
        <div className="btn-group mb-3">
          <button className="btn-inicio">Normal</button>
          <button className="btn-inicio loading">Cargando</button>
          <button className="btn-inicio" disabled>Deshabilitado</button>
        </div>
      </div>

      {/* Información de Colores */}
      <div className="mb-4">
        <h3 style={{ color: 'var(--color-azul-oscuro)', marginBottom: '1rem' }}>Paleta de Colores</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-azul-claro)', color: 'white', borderRadius: 'var(--border-radius)' }}>
            <strong>Azul Claro</strong><br />
            #4AB2E3
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-azul-oscuro)', color: 'white', borderRadius: 'var(--border-radius)' }}>
            <strong>Azul Oscuro</strong><br />
            #0E1C2C
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-hover-azul)', color: 'white', borderRadius: 'var(--border-radius)' }}>
            <strong>Hover Azul</strong><br />
            #379acb
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde-suave)', borderRadius: 'var(--border-radius)' }}>
            <strong>Fondo</strong><br />
            #f7f9fb
          </div>
        </div>
      </div>

      {/* Ejemplo de Uso */}
      <div className="text-center mt-4">
        <p style={{ color: 'var(--color-texto)', fontSize: '0.9rem', fontStyle: 'italic' }}>
          Este sistema de botones está disponible en toda la aplicación y se actualiza automáticamente 
          cuando cambies las variables CSS en <code>:root</code>.
        </p>
      </div>
    </section>
  );
}

export default ButtonShowcase;
