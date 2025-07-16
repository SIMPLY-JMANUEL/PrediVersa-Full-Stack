import React from 'react';
import styles from './Objetivos.module.css';
import fondo from '../assets/img/fondo12.png';
import objetivosImg from '../assets/img/objetivos.png';
import generalesImg from '../assets/img/generales.png';
import HomeButton from '../components/Button/HomeButton';

const Objetivos = () => (
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
        <h1 className={styles.titleText}>Objetivos</h1>
      </div>

      <div className={styles.twoSectionLayout}>
        {/* Sección Objetivo General */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>OBJETIVO GENERAL</h2>
          <div className={styles.sectionContent}>
            <div className={styles.textContainer}>
              <p className={styles.sectionText}>
                Diseñar, desarrollar e implementar un sistema web predictivo que
                permita a las instituciones educativas anticipar, intervenir y
                gestionar situaciones de riesgo psicosocial con respaldo técnico
                y analítico.
              </p>
              <p className={styles.sectionText}>
                Como segundo foco, adaptar gradualmente el sistema a escenarios
                empresariales que deseen fortalecer su gestión del riesgo
                laboral y salud emocional.
              </p>
            </div>
            <div className={styles.imageContainer}>
              <img
                src={objetivosImg}
                alt="Objetivo General PrediVersa"
                className={styles.sectionImage}
              />
            </div>
          </div>
        </div>

        {/* Sección Objetivos Específicos */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>OBJETIVOS ESPECÍFICOS</h2>
          <div className={styles.sectionContent}>
            <div className={styles.textContainer}>
              <ul className={styles.objectivesList}>
                <li>
                  Integrar datos contextuales, socioemocionales y disciplinarios
                  en un motor de inferencia predictiva escolar, y establecer un
                  marco replicable para el entorno laboral.
                </li>
                <li>
                  Generar alertas automáticas y recomendaciones de intervención
                  ajustadas a distintos perfiles de riesgo.
                </li>
                <li>
                  Capacitar a los equipos institucionales (educativos y
                  corporativos) en el uso y aplicación de la herramienta.
                </li>
                <li>
                  Desarrollar visualizaciones, informes e indicadores para
                  apoyar procesos de decisión en tiempo real.
                </li>
                <li>
                  Validar el modelo predictivo a través de pruebas piloto en
                  instituciones educativas y pruebas exploratorias en entornos
                  empresariales de alto impacto social.
                </li>
              </ul>
            </div>
            <div className={styles.imageContainer}>
              <img
                src={generalesImg}
                alt="Objetivos Específicos PrediVersa"
                className={styles.sectionImage}
              />
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

export default Objetivos;
