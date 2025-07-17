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
              <div className={styles.contactIcon}>📧</div>
              <div className={styles.contactDetails}>
                <h3>Email</h3>
                <p>contacto@prediversa.com</p>
                <p>soporte@prediversa.com</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📱</div>
              <div className={styles.contactDetails}>
                <h3>Teléfono</h3>
                <p>+57 (1) 234-5678</p>
                <p>+57 300 123 4567</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon} />
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
                  📨 Enviar Mensaje
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
