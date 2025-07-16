import React from 'react';
import styles from './MisionyVision.module.css';
import fondo from '../assets/img/fondo12.png';
import misionImg from '../assets/img/mision.png';
import visionImg from '../assets/img/vision.png';
import HomeButton from '../components/Button/HomeButton';

const MisionyVision = () => (
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
        <h1 className={styles.titleText}>Misión y Visión</h1>
      </div>

      <div className={styles.twoSectionLayout}>
        {/* Sección Misión */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>MISIÓN</h2>
          <div className={styles.sectionContent}>
            <div className={styles.imageContainer}>
              <img
                src={misionImg}
                alt="Misión PrediVersa"
                className={styles.sectionImage}
              />
            </div>
            <div className={styles.textContainer}>
              <p className={styles.sectionText}>
                Desarrollar soluciones tecnológicas predictivas centradas en la
                prevención de riesgos psicosociales en contextos escolares,
                mediante inteligencia artificial, ciencia de datos y
                visualización de información, contribuyendo al fortalecimiento
                de comunidades educativas seguras, empáticas y resilientes. De
                forma progresiva, ampliar este impacto hacia entornos laborales
                que busquen promover el bienestar organizacional y prevenir el
                deterioro emocional en sus equipos de trabajo.
              </p>
            </div>
          </div>
        </div>

        {/* Sección Visión */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>VISIÓN</h2>
          <div className={styles.sectionContent}>
            <div className={styles.imageContainer}>
              <img
                src={visionImg}
                alt="Visión PrediVersa"
                className={styles.sectionImage}
              />
            </div>
            <div className={styles.textContainer}>
              <p className={styles.sectionText}>
                Ser reconocidos como la plataforma de referencia en Colombia y
                Latinoamérica en prevención predictiva de la violencia escolar,
                transformando la gestión institucional educativa con tecnología
                basada en evidencia.
              </p>
              <p className={styles.sectionText}>
                A mediano plazo, proyectarnos como solución emergente para la
                identificación temprana de riesgos psicosociales en entornos
                empresariales comprometidos con el bienestar humano y la cultura
                organizacional saludable.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <HomeButton size="medium" variant="primary" />
      </div>
    </section>
  </div>
);

export default MisionyVision;
