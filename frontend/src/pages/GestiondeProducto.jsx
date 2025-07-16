import React from 'react';
import styles from './GestiondeProducto.module.css';
import fondo from '../assets/img/fondo12.png';
import jmanuel from '../assets/img/jmanuel.png';
import HomeButton from '../components/Button/HomeButton';

const GestiondeProducto = () => (
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
      <h1 className={styles.titleText}>Gestión de Producto</h1>

      <div className={styles.titleSection}>
        <h2 className={styles.subtitle}>ING. JOSE MANUEL CALVO USMA</h2>
      </div>

      <div className={styles.twoColumnLayout}>
        <div className={styles.imageColumn}>
          <img
            src={jmanuel}
            alt="Imagen de Jose Manuel Calvo Usma"
            className={styles.contentImage}
          />
        </div>

        <div className={styles.textColumn}>
          <h3 className={styles.sectionTitle}>Rol y responsabilidades:</h3>
          <p className={styles.phaseText}>
            Lidera la estrategia de desarrollo funcional de PrediVersa,
            alineando la visión institucional con el diseño del producto. Se
            encarga de la traducción de las necesidades de las comunidades
            educativas en funcionalidades claras y priorizadas, gestionando todo
            el ciclo de vida del producto. Coordina con los equipos de diseño y
            desarrollo, y asegura que cada módulo cumpla estándares pedagógicos,
            normativos y tecnológicos. Además, monitorea la evolución del
            sistema en función del impacto social, tanto en el entorno escolar
            como en su proyección al ámbito empresarial.
          </p>

          <h3 className={styles.sectionTitle}>Especialización:</h3>
          <ul className={styles.list}>
            <li>Product Management para soluciones EdTech</li>
            <li>Gestión ágil de proyectos (Scrum/Kanban)</li>
            <li>Transformación digital institucional</li>
            <li>Coordinación de roadmap funcional y validación con usuarios</li>
            <li>Diseño de estrategias escalables y con base normativa</li>
          </ul>

          <h3 className={styles.sectionTitle}>Herramientas utilizadas:</h3>
          <ul className={styles.list}>
            <li>Jira, Trello (gestión de tareas)</li>
            <li>Notion (documentación funcional)</li>
            <li>Google Workspace (comunicación y validación)</li>
            <li>
              Figma y Miro (estructuración funcional y validación de flujo)
            </li>
            <li>
              GitHub Projects (seguimiento técnico y control de versiones)
            </li>
          </ul>

          <blockquote className={styles.quote}>
            "Conectamos ideas con soluciones que transforman instituciones."
          </blockquote>
        </div>
      </div>

      <HomeButton />
    </section>
  </div>
);

export default GestiondeProducto;
