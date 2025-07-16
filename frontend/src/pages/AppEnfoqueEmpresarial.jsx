import React from 'react';
import styles from './AppEnfoqueEmpresarial.module.css';
import fondo from '../assets/img/fondo12.png';
import img20 from '../assets/img/img20.png';
import HomeButton from '../components/Button/HomeButton';

const AppEnfoqueEmpresarial = () => (
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
        <h1 className={styles.titleText}>
          App Enfoque Empresarial{' '}
          <span className={styles.subtitle}>(En desarrollo)</span>
        </h1>
      </div>

      <p className={styles.phaseText}>
        Este módulo amplía la lógica de PrediVersa al ámbito organizacional, con
        foco en entornos laborales y salud mental ocupacional. Está diseñado
        para predecir y gestionar riesgos como burnout, acoso laboral y
        deterioro del clima laboral, a través de tres etapas:
      </p>

      <div className={styles.twoColumnLayout}>
        <div className={styles.imageColumn}>
          <img
            src={img20}
            alt="App Enfoque Empresarial"
            className={styles.contentImage}
          />
        </div>
        <div className={styles.textColumn}>
          <ul className={styles.servicesList}>
            <li>
              <strong>Sospecha de riesgo laboral:</strong> Análisis de
              percepción, ausentismo, productividad y encuestas internas para
              identificar indicadores de tensión emocional.
            </li>
            <li>
              <strong>Riesgo confirmado:</strong> Activación de alertas a RRHH
              con recomendaciones preventivas y trazabilidad de casos.
            </li>
            <li>
              <strong>Evento ocurrido:</strong> Documentación de situaciones y
              generación de rutas de atención institucional y acompañamiento
              técnico.
            </li>
          </ul>
        </div>
      </div>

      <p className={styles.phaseText}>
        Cumple con los principios de inteligencia artificial ética, seguridad de
        la información y regulaciones como la Ley 1581 de protección de datos.
      </p>

      <p className={styles.textLeft}>
        Este módulo se articulará con los servicios de:
      </p>
      <ul className={styles.servicesList}>
        <li>
          <strong>Capacitaciones empresariales,</strong> para formar a los
          equipos en identificación y prevención de riesgos psicosociales
          laborales.
        </li>
        <li>
          <strong>Planes Premium,</strong> que permitirán a las organizaciones
          integrar PrediVersa con sus sistemas internos de gestión del talento
          humano.
        </li>
      </ul>

      <p className={styles.phasePostText}>
        A futuro, este enfoque se expandirá hacia un sistema de inteligencia
        organizacional capaz de anticipar crisis internas, medir el impacto
        emocional de decisiones administrativas, e incluso correlacionar
        factores de riesgo con la productividad, rotación y clima
        organizacional, convirtiendo la data en estrategia para el bienestar
        laboral sostenible.
      </p>

      <div className={styles.buttonContainer}>
        <HomeButton size="medium" variant="primary" />
      </div>
    </section>
  </div>
);

export default AppEnfoqueEmpresarial;
