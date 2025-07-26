import React, { useState } from 'react';
import styles from './Contacto.module.css';
import fondo from '../assets/img/fondo12.png';
import HomeButton from '../components/Button/HomeButton';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    institucion: '',
    cargo: '',
    mensaje: '',
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí se implementaría el envío del formulario
    console.log('Datos del formulario:', formData);
    alert(
      '¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.'
    );
    // Reset form
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      institucion: '',
      cargo: '',
      mensaje: '',
    });
  };

  return (
    <div
      className={styles.background}
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <section className={styles.mainContent}>
        <div className={styles.titleSection}>
          <h1 className={styles.titleText}>Contacto PrediVersa</h1>
          <p className={styles.subtitleText}>
            ¿Interesado en implementar PrediVersa en tu institución educativa?
            Contáctanos y descubre cómo podemos ayudarte a crear ambientes
            escolares más seguros.
          </p>
        </div>

        <div className={styles.contactLayout}>
          {/* Información de contacto */}
          <div className={styles.contactInfo}>
            <h2 className={styles.sectionTitle}>Información de Contacto</h2>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                    fill="#3498db"
                  />
                </svg>
              </div>
              <div className={styles.contactDetails}>
                <h3>Email</h3>
                <p>contacto@prediversa.com</p>
                <p>soporte@prediversa.com</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
                    fill="#3498db"
                  />
                </svg>
              </div>
              <div className={styles.contactDetails}>
                <h3>Teléfono</h3>
                <p>+57 (1) 234-5678</p>
                <p>+57 300 123 4567</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V9C15 10.66 13.66 12 12 12S9 10.66 9 12V9L3 7V9C3 11.81 4.35 14.31 6.55 15.93L12 20.5L17.45 15.93C19.65 14.31 21 11.81 21 9Z"
                    fill="#3498db"
                  />
                </svg>
              </div>
              <div className={styles.contactDetails}>
                <h3>Horario de Atención</h3>
                <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                <p>Sábados: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className={styles.contactForm}>
            <h2 className={styles.sectionTitle}>Envíanos un Mensaje</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre Completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="cargo">Cargo</label>
                  <select
                    id="cargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona tu cargo</option>
                    <option value="rector">Rector/a</option>
                    <option value="coordinador">Coordinador/a</option>
                    <option value="profesor">Profesor/a</option>
                    <option value="psicologo">Psicólogo/a</option>
                    <option value="padre">Padre de familia</option>
                    <option value="estudiante">Estudiante</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="institucion">Institución Educativa</label>
                <input
                  type="text"
                  id="institucion"
                  name="institucion"
                  value={formData.institucion}
                  onChange={handleChange}
                  placeholder="Nombre de tu institución"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensaje">Mensaje *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Cuéntanos sobre tu interés en PrediVersa, preguntas específicas, o cómo podemos ayudarte..."
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: '8px' }}
                  >
                    <path
                      d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                      fill="white"
                    />
                  </svg>
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <HomeButton size="medium" variant="primary" />
        </div>
      </section>
    </div>
  );
};

export default Contacto;
