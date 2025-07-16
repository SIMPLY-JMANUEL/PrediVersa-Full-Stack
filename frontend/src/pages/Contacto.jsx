import React from 'react';
import styles from './Contacto.module.css';
import fondo from '../assets/img/fondo12.png';

const Contacto = () => (
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
      <h1 className={styles.title}>Contacto</h1>
      <p className={styles.text}>Contenido en construcción...</p>
    </section>
  </div>
);

export default Contacto;
