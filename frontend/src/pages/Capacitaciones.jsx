import React from 'react';
import styles from './Capacitaciones.module.css';
import fondo from '../assets/img/fondo12.png';
import img18 from '../assets/img/img18.png';
import img14 from '../assets/img/img14.png';
import HomeButton from '../components/Button/HomeButton';

const Capacitaciones = () => (
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
        <h1 className={styles.titleText}>Capacitaciones</h1>
      </div>

      <p className={styles.phaseText}>
        PrediVersa desarrolla programas de formación profesional orientados a
        fortalecer las competencias institucionales en gestión del riesgo
        psicosocial:
      </p>

      <div className={styles.twoColumnLayout}>
        <div className={styles.imageColumn}>
          <img
            src={img18}
            alt="Capacitaciones profesionales"
            className={styles.contentImage}
          />
        </div>
        <div className={styles.textColumn}>
          <ul className={styles.servicesList}>
            <li>
              Módulos de cultura institucional, resolución de conflictos,
              convivencia escolar y salud mental.
            </li>
            <li>
              Talleres de prevención del acoso escolar, ciberacoso y violencia
              de género, adaptados al contexto colombiano.
            </li>
            <li>
              Capacitación técnica en uso de la plataforma, lectura de alertas
              predictivas y diseño de rutas de intervención.
            </li>
          </ul>
        </div>
      </div>

      <p className={styles.phaseText}>
        El contenido es desarrollado por profesionales en psicología, derecho,
        pedagogía, IA y estadística, garantizando relevancia y rigor técnico.
      </p>

      <div className={styles.twoColumnLayout}>
        <div className={styles.textColumn}>
          <p className={styles.textLeft}>
            Este servicio está directamente vinculado a:
          </p>
          <ul className={styles.servicesList}>
            <li>
              <strong>App Enfoque Educativo y Empresarial,</strong> brindando
              autonomía institucional para actuar ante alertas del sistema.
            </li>
            <li>
              <strong>Planes de servicio,</strong> que escalan según el tipo y
              profundidad de la capacitación requerida.
            </li>
          </ul>
        </div>
        <div className={styles.imageColumn}>
          <img
            src={img14}
            alt="Vinculación con servicios"
            className={styles.contentImage}
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <HomeButton size="medium" variant="primary" />
      </div>
    </section>
  </div>
);

export default Capacitaciones;
