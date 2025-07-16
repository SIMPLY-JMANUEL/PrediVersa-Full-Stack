import React from 'react';
import styles from './AppEnfoqueEducativo.module.css';
import fondo from '../assets/img/fondo12.png';
import img2 from '../assets/img/img2.png';
import HomeButton from '../components/Button/HomeButton';

const AppEnfoqueEducativo = () => (
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
      <h1 className={styles.titleText}>App Enfoque Educativo</h1>

      <p className={styles.text}>
        PrediVersa es una plataforma web inteligente diseñada para la detección,
        predicción y gestión de riesgos psicosociales en entornos escolares,
        integrando modelos predictivos multietapa y herramientas de analítica
        avanzada. Su arquitectura opera de forma continua evaluando variables
        contextuales, conductuales y emocionales, permitiendo intervenir de
        forma oportuna en tres niveles de riesgo:
      </p>

      <div className={styles.twoColumnLayout}>
        <div className={styles.imageColumn}>
          <img
            src={img2}
            alt="Diagrama del sistema PrediVersa"
            className={styles.contentImage}
          />
        </div>

        <div className={styles.textColumn}>
          <p className={styles.phaseText}>
            <strong>Fase de sospecha (detección temprana):</strong> Se capturan
            datos estructurados y no estructurados desde encuestas, reportes
            disciplinarios, historial emocional y ambiente escolar. Mediante
            regresión logística, análisis de correlación y detección de
            anomalías, el sistema identifica desviaciones que indican riesgos
            latentes.
          </p>

          <p className={styles.phaseText}>
            <strong>Fase de riesgo inminente (predicción activa):</strong>{' '}
            Cuando los indicadores superan umbrales predefinidos por el motor de
            inferencia, se activan alertas automáticas priorizadas por nivel de
            criticidad. Se emplean modelos supervisados como Random Forest,
            árboles de decisión y SVM, entrenados con registros históricos de
            violencia escolar.
          </p>
        </div>
      </div>

      <p className={styles.phasePostText}>
        <strong>Fase post-evento (análisis y remediación):</strong> Si ocurre un
        incidente, se habilita un módulo de análisis forense educativo, que
        permite clasificar el evento, evaluar el entorno, documentar acciones y
        generar rutas de atención con seguimiento institucional. Este proceso
        usa clustering, análisis semántico y evaluación multicriterio para
        cerrar el ciclo del riesgo.
      </p>

      <p className={styles.textLeft}>
        El funcionamiento de este servicio se complementa directamente con:
      </p>

      <ul className={styles.servicesList}>
        <li>
          Capacitaciones dirigidas a fortalecer el uso institucional de la
          herramienta y la correcta lectura de los indicadores predictivos.
        </li>
        <li>
          Estudios y análisis derivados de los datos recolectados, que se
          traducen en reportes técnicos y visualizaciones únicas por
          institución.
        </li>
        <li>
          Planes de servicio escalables que permiten adoptar PrediVersa según el
          nivel de madurez digital o capacidad operativa de cada establecimiento
          educativo.
        </li>
      </ul>

      <div className={styles.buttonContainer}>
        <HomeButton size="medium" variant="primary" />
      </div>
    </section>
  </div>
);

export default AppEnfoqueEducativo;
