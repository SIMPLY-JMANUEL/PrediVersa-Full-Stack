import React from 'react';
import styles from './DesarrolloBackend.module.css';
import fondo from '../assets/img/fondo12.png';
import andrey from '../assets/img/andrey.png';
import HomeButton from '../components/Button/HomeButton';

const DesarrolloBackend = () => (
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
      <h1 className={styles.titleText}>DESARROLLO BACKEND</h1>

      <div className={styles.titleSection}>
        <h2 className={styles.subtitle}>ING. ANDREY LUNA</h2>
      </div>

      <div className={styles.twoColumnLayout}>
        <div className={styles.imageColumn}>
          <img
            src={andrey}
            alt="Imagen de Andrey Luna"
            className={styles.contentImage}
          />
        </div>

        <div className={styles.textColumn}>
          <h3 className={styles.sectionTitle}>Rol y responsabilidades:</h3>
          <p className={styles.phaseText}>
            Construye el corazón funcional de PrediVersa, diseñando y
            manteniendo toda la lógica del sistema: captura de datos, reducción
            de modelos predictivos, gestión de usuarios, generación de alertas y
            respuestas institucionales. Implementa APIs RESTful seguras,
            escalables y eficientes, garantizando el flujo continuo entre
            frontend, base de datos y microservicios de IA. Asegura la
            integridad de la información, la trazabilidad de eventos y el
            cumplimiento de estándares de seguridad y privacidad.
          </p>

          <h3 className={styles.sectionTitle}>Especialización:</h3>
          <ul className={styles.list}>
            <li>Arquitectura de microservicios</li>
            <li>Modelos de predicción con Python</li>
            <li>Seguridad y cifrado (JWT, roles, sesiones)</li>
            <li>APIs RESTful robustas y escalables</li>
            <li>Persistencia relacional y modelado de datos</li>
          </ul>

          <h3 className={styles.sectionTitle}>Herramientas utilizadas:</h3>
          <ul className={styles.list}>
            <li>Node.js + Express (lógica de negocio y APIs)</li>
            <li>PostgreSQL (almacenamiento y consultas optimizadas)</li>
            <li>Python + scikit-learn/pandas (motor predictivo)</li>
            <li>Docker (contenedores y despliegue)</li>
            <li>Jest, Supertest (testing automatizado)</li>
            <li>API Gateway (orquestación de microservicios)</li>
            <li>Git + GitHub (control de versiones)</li>
          </ul>

          <blockquote className={styles.quote}>
            "Transformamos datos en decisiones que cuidan vidas."
          </blockquote>
        </div>
      </div>

      <HomeButton />
    </section>
  </div>
);

export default DesarrolloBackend;
