import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Contacto.css";

function Contacto() {
  const [form, setForm] = useState({ 
    nombre: "", 
    correo: "", 
    telefono: "",
    empresa: "",
    mensaje: "" 
  });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const formRef = useRef(null);

  // Auto-focus en el primer campo al cargar
  useEffect(() => {
    const firstInput = formRef.current?.querySelector('input[name="nombre"]');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const validarCampo = useCallback((nombre, valor) => {
    let error = "";
    
    switch (nombre) {
      case "nombre":
        if (!valor.trim()) {
          error = "El nombre es requerido";
        } else if (valor.length < 2) {
          error = "El nombre debe tener al menos 2 caracteres";
        }
        break;
      case "correo":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!valor) {
          error = "El correo es requerido";
        } else if (!emailRegex.test(valor)) {
          error = "Ingresa un correo válido";
        }
        break;
      case "telefono":
        if (valor && !/^\+?[\d\s\-()]{10,}$/.test(valor)) {
          error = "Ingresa un teléfono válido";
        }
        break;
      case "mensaje":
        if (!valor.trim()) {
          error = "El mensaje es requerido";
        } else if (valor.length < 10) {
          error = "El mensaje debe tener al menos 10 caracteres";
        }
        break;
      default:
        // No validation needed for unknown fields
        break;
    }
    
    return error;
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTocados(prev => ({ ...prev, [name]: true }));
    
    // Validar en tiempo real solo si el campo ya fue tocado
    if (tocados[name] || value.length > 0) {
      const error = validarCampo(name, value);
      setErrores(prev => ({ ...prev, [name]: error }));
    }
  }, [validarCampo, tocados]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTocados(prev => ({ ...prev, [name]: true }));
    
    // Validar al perder el foco
    const error = validarCampo(name, value);
    setErrores(prev => ({ ...prev, [name]: error }));
  }, [validarCampo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const nuevosErrores = {};
    Object.keys(form).forEach(campo => {
      const error = validarCampo(campo, form[campo]);
      if (error) {
        nuevosErrores[campo] = error;
      }
    });
    
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setTocados(Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      
      // Focus en el primer campo con error
      const firstErrorField = Object.keys(nuevosErrores)[0];
      const firstErrorInput = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
      if (firstErrorInput) {
        firstErrorInput.focus();
      }
      return;
    }
    
    setEnviando(true);
    
    try {
      // Simular envío de formulario (aquí integrarías tu API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEnviado(true);
      setForm({ nombre: "", correo: "", telefono: "", empresa: "", mensaje: "" });
      setErrores({});
      setTocados({});
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setEnviado(false), 5000);
    } catch (error) {
      console.error("Error al enviar:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="contacto-section">
      <div className="container contacto-container">
        {/* Información de contacto */}
        <div className="contacto-info fade-in">
          <h2 className="contacto-titulo">Contáctanos</h2>
          <p className="contacto-descripcion">
            ¿Tienes dudas, sugerencias o quieres conocer más sobre PrediVersa? Completa el formulario y te responderemos lo antes posible.
          </p>
          <ul className="contacto-datos">
            <li><i className="fas fa-envelope"></i> prediversa@gmail.com</li>
            <li><i className="fas fa-phone"></i> +57 300 000 0000</li>
            <li><i className="fas fa-map-marker-alt"></i> Colombia</li>
          </ul>
          <div className="contacto-redes">
            <button type="button" title="Facebook" className="red-social" onClick={() => window.open('https://facebook.com', '_blank')}><i className="fab fa-facebook-f"></i></button>
            <button type="button" title="Twitter" className="red-social" onClick={() => window.open('https://twitter.com', '_blank')}><i className="fab fa-twitter"></i></button>
            <button type="button" title="Instagram" className="red-social" onClick={() => window.open('https://instagram.com', '_blank')}><i className="fab fa-instagram"></i></button>
          </div>
        </div>
        {/* Formulario de contacto */}
        <form className="contacto-form fade-in" onSubmit={handleSubmit} ref={formRef} noValidate>
          <h3 className="contacto-form-titulo">Envíanos un mensaje</h3>
          
          {enviado && (
            <div className="alert alert-success animate-fade-in-up" role="alert" aria-live="polite">
              <i className="fas fa-check-circle" aria-hidden="true"></i>
              ¡Mensaje enviado correctamente! Te contactaremos pronto.
            </div>
          )}
          
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="nombre" className="sr-only">Nombre completo</label>
              <span className="input-icon" aria-hidden="true"><i className="fas fa-user"></i></span>
              <input
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Tu nombre completo *"
                required
                value={form.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errores.nombre ? 'error' : ''}
                aria-invalid={errores.nombre ? 'true' : 'false'}
                aria-describedby={errores.nombre ? 'error-nombre' : undefined}
                autoComplete="name"
              />
              {errores.nombre && (
                <span id="error-nombre" className="error-text" role="alert" aria-live="polite">
                  {errores.nombre}
                </span>
              )}
            </div>
            
            <div className="input-group">
              <label htmlFor="correo" className="sr-only">Correo electrónico</label>
              <span className="input-icon" aria-hidden="true"><i className="fas fa-envelope"></i></span>
              <input
                id="correo"
                type="email"
                name="correo"
                placeholder="Tu correo electrónico *"
                required
                value={form.correo}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errores.correo ? 'error' : ''}
                aria-invalid={errores.correo ? 'true' : 'false'}
                aria-describedby={errores.correo ? 'error-correo' : undefined}
                autoComplete="email"
              />
              {errores.correo && (
                <span id="error-correo" className="error-text" role="alert" aria-live="polite">
                  {errores.correo}
                </span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="telefono" className="sr-only">Teléfono</label>
              <span className="input-icon" aria-hidden="true"><i className="fas fa-phone"></i></span>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                placeholder="Tu teléfono (opcional)"
                value={form.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errores.telefono ? 'error' : ''}
                aria-invalid={errores.telefono ? 'true' : 'false'}
                aria-describedby={errores.telefono ? 'error-telefono' : undefined}
                autoComplete="tel"
              />
              {errores.telefono && (
                <span id="error-telefono" className="error-text" role="alert" aria-live="polite">
                  {errores.telefono}
                </span>
              )}
            </div>
            
            <div className="input-group">
              <label htmlFor="empresa" className="sr-only">Empresa o institución</label>
              <span className="input-icon" aria-hidden="true"><i className="fas fa-building"></i></span>
              <input
                id="empresa"
                type="text"
                name="empresa"
                placeholder="Tu empresa/institución (opcional)"
                value={form.empresa}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="organization"
              />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="mensaje" className="sr-only">Mensaje o consulta</label>
            <span className="input-icon" aria-hidden="true"><i className="fas fa-comment"></i></span>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="6"
              placeholder="Cuéntanos sobre tu proyecto o consulta *"
              required
              value={form.mensaje}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errores.mensaje ? 'error' : ''}
              aria-invalid={errores.mensaje ? 'true' : 'false'}
              aria-describedby={errores.mensaje ? 'error-mensaje' : undefined}
            ></textarea>
            {errores.mensaje && (
              <span id="error-mensaje" className="error-text" role="alert" aria-live="polite">
                {errores.mensaje}
              </span>
            )}
          </div>
          
          <button 
            type="submit" 
            className={`btn-inicio btn-contacto ${enviando ? 'loading' : ''}`}
            disabled={enviando}
            aria-describedby="form-note"
          >
            {enviando ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                <span aria-live="polite">Enviando...</span>
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane" aria-hidden="true"></i>
                Enviar mensaje
              </>
            )}
          </button>
          
          <p id="form-note" className="form-note">
            * Campos obligatorios. Respetamos tu privacidad y no compartimos tu información.
          </p>
        </form>
      </div>
      <div className="back-home-wrapper" style={{ marginTop: "2.5rem" }}>
        <Link to="/" className="btn btn-secondary back-home-btn">
          ← Regresar al inicio
        </Link>
      </div>
    </section>
  );
}

export default Contacto;