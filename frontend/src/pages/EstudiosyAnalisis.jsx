import React from 'react';
import styles from './EstudiosyAnalisis.module.css';
import fondo from '../assets/img/fondo12.png';
import img3 from '../assets/img/img3.png';
import img11 from '../assets/img/img11.png';
import img17 from '../assets/img/img17.png';
import HomeButton from '../components/Button/HomeButton';

const EstudiosyAnalisis = () => (
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
        <h1 className={styles.titleText}>Estudios y Análisis</h1>
      </div>

      <p className={styles.phaseText}>
        PrediVersa ofrece un sistema de generación de informes institucionales,
        analíticos y de apoyo a la toma de decisiones, incluyendo:
      </p>

      <div className={styles.twoColumnLayout}>
        <div className={styles.imageColumn}>
          <img
            src={img3}
            alt="Estudios y análisis profesionales"
            className={styles.contentImage}
          />
        </div>
        <div className={styles.textColumn}>
          <ul className={styles.servicesList}>
            <li>
              Diagnósticos de clima escolar, cultura organizacional y niveles de
              riesgo.
            </li>
            <li>
              Estudios cuantitativos y cualitativos con análisis inferencial,
              descriptivo y multivariado.
            </li>
            <li>
              Estadísticas agregadas con valor estratégico para entidades
              públicas, educativas y ONG.
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.twoColumnLayout}>
        <div className={styles.textColumn}>
          <p className={styles.phaseText}>
            Los informes cumplen con estándares metodológicos internacionales y
            se entregan en formatos interpretables por comités técnicos,
            administrativos y de gobernanza.
          </p>
        </div>
        <div className={styles.imageColumn}>
          <img
            src={img11}
            alt="Estándares metodológicos"
            className={styles.contentImage}
          />
        </div>
      </div>

      <div className={styles.twoColumnLayout}>
        <div className={styles.imageColumn}>
          <img
            src={img17}
            alt="Retroalimentación de servicios"
            className={styles.contentImage}
          />
        </div>
        <div className={styles.textColumn}>
          <p className={styles.textLeft}>
            Estos estudios son retroalimentados por:
          </p>
          <ul className={styles.servicesList}>
            <li>
              <strong>La App Enfoque Educativo</strong> y su motor de
              recolección de datos.
            </li>
            <li>
              <strong>Las Capacitaciones,</strong> que fortalecen el análisis e
              interpretación institucional de los resultados.
            </li>
            <li>
              <strong>Los Planes Premium,</strong> que incluyen asesoría directa
              en el diseño y aplicación de estos estudios para la toma de
              decisiones de alto nivel.
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <HomeButton size="medium" variant="primary" />
      </div>
    </section>
  </div>
);

export default EstudiosyAnalisis;
