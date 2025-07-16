import React from 'react';
import styles from './DiseñodeExperiencia.module.css';
import fondo from '../assets/img/fondo12.png';
import harold from '../assets/img/harold.png';
import HomeButton from '../components/Button/HomeButton';

const DiseñodeExperiencia = () => (
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
      <h1 className={styles.titleText}>DISEÑO DE EXPERIENCIA</h1>

      <div className={styles.titleSection}>
        <h2 className={styles.subtitle}>ING. HAROLD SALCEDO</h2>
      </div>

      <div className={styles.twoColumnLayout}>
        <div className={styles.imageColumn}>
          <img
            src={harold}
            alt="Imagen de Harold Salcedo"
            className={styles.contentImage}
          />
        </div>

        <div className={styles.textColumn}>
          <h3 className={styles.sectionTitle}>Rol y responsabilidades:</h3>
          <p className={styles.phaseText}>
            Desarrolla la interfaz y la experiencia de usuario de PrediVersa con
            un enfoque centrado en accesibilidad, claridad y empatía. Define
            flujos de navegación, jerarquías visuales y prototipos interactivos,
            asegurando que los usuarios (docentes, orientadores, rectores y
            administrativos) puedan utilizar la plataforma de manera intuitiva.
            También diseña los dashboards institucionales, adaptados a distintos
            niveles de análisis, usando principios de diseño inclusivo. Colabora
            con backend para garantizar la coherencia visual y funcional de toda
            la plataforma.
          </p>

          <h3 className={styles.sectionTitle}>Especialización:</h3>
          <ul className={styles.list}>
            <li>UX Research y accesibilidad (WCAG 2.1)</li>
            <li>Diseño emocional y pedagógico</li>
            <li>Arquitectura de información responsiva</li>
            <li>Diseño de dashboards analíticos</li>
            <li>
              Adaptación de interfaces por perfil de usuario (educativo y
              empresarial)
            </li>
          </ul>

          <h3 className={styles.sectionTitle}>Herramientas utilizadas:</h3>
          <ul className={styles.list}>
            <li>Figma (prototipado y diseño visual)</li>
            <li>Adobe Illustrator y Photoshop (recursos gráficos)</li>
            <li>React + CSS Modules (implementación modular)</li>
            <li>Chart.js y D3.js (visualización interactiva de datos)</li>
            <li>Postman e Insomnia (pruebas de integración visual-backend)</li>
          </ul>

          <blockquote className={styles.quote}>
            "Diseñamos experiencias que inspiran confianza y acción desde la
            primera mirada."
          </blockquote>
        </div>
      </div>

      <HomeButton />
    </section>
  </div>
);

export default DiseñodeExperiencia;
