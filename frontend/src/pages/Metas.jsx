import React from 'react';
import styles from './Metas.module.css';
import fondo from '../assets/img/fondo12.png';
import HomeButton from '../components/Button/HomeButton';

const Metas = () => (
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
        <h1 className={styles.titleText}>Metas</h1>
      </div>

      <p className={styles.phaseText}>
        Incluyen proyección empresarial en tres fases:
      </p>

      <div className={styles.phasesContainer}>
        {/* Corto Plazo */}
        <div className={styles.phaseSection}>
          <h3 className={styles.phaseTitle}>Corto Plazo (0-6 meses)</h3>
          <ul className={styles.servicesList}>
            <li>
              Implementación del sistema en al menos 5 instituciones educativas.
            </li>
            <li>
              Ejecución de capacitaciones iniciales y validación de instrumentos
              predictivos.
            </li>
          </ul>
        </div>

        {/* Mediano Plazo */}
        <div className={styles.phaseSection}>
          <h3 className={styles.phaseTitle}>Mediano Plazo (6-18 meses)</h3>
          <ul className={styles.servicesList}>
            <li>
              Escalamiento a 20 instituciones con modelos entrenados por
              contexto.
            </li>
            <li>
              Incorporación de rutas de atención personalizadas y seguimiento
              automatizado.
            </li>
          </ul>
        </div>

        {/* Largo Plazo */}
        <div className={styles.phaseSection}>
          <h3 className={styles.phaseTitle}>Largo Plazo (18-36 meses)</h3>
          <ul className={styles.servicesList}>
            <li>
              Presencia nacional en instituciones educativas oficiales y
              privadas.
            </li>
            <li>
              Inicio de implementación piloto en entornos empresariales para
              validar el modelo predictivo laboral.
            </li>
            <li>
              Desarrollo de línea de investigación educativa con datos
              anonimizados.
            </li>
            <li>
              Expansión del enfoque empresarial hacia bienestar organizacional
              predictivo.
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

export default Metas;
