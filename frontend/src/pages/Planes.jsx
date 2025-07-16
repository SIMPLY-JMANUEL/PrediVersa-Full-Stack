import React from 'react';
import styles from './Planes.module.css';
import fondo from '../assets/img/fondo12.png';
import HomeButton from '../components/Button/HomeButton';

const Planes = () => (
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
      <h1 className={styles.titleText}>Planes y Precios</h1>

      <div className={styles.pricingContainer}>
        <div className={styles.pricingTable}>
          {/* Header */}
          <div className={styles.tableHeader}>
            <div className={styles.featureColumn}>
              <h2 className={styles.tableTitle}>
                PRICING
                <br />
                TABLE
              </h2>
            </div>
            <div className={`${styles.planColumn} ${styles.free}`}>
              <h3 className={styles.planName}>FREE</h3>
              <div className={styles.price}>$0.00</div>
              <div className={styles.period}>3 meses</div>
            </div>
            <div className={`${styles.planColumn} ${styles.basic}`}>
              <h3 className={styles.planName}>BASIC</h3>
              <div className={styles.price}>$89.000</div>
              <div className={styles.period}>por mes</div>
            </div>
            <div className={`${styles.planColumn} ${styles.standard}`}>
              <h3 className={styles.planName}>AVANZADO</h3>
              <div className={styles.price}>$229.000</div>
              <div className={styles.period}>por mes</div>
            </div>
            <div className={`${styles.planColumn} ${styles.premium}`}>
              <h3 className={styles.planName}>PREMIUM</h3>
              <div className={styles.price}>$489.000</div>
              <div className={styles.period}>por mes</div>
            </div>
          </div>

          {/* Features */}
          <div className={styles.tableBody}>
            <div className={styles.featureRow}>
              <div className={styles.featureLabel}>
                1 usuario institucional (administrador)
              </div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
            </div>

            <div className={styles.featureRow}>
              <div className={styles.featureLabel}>
                Hasta 3 encuestas digitales
              </div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
            </div>

            <div className={styles.featureRow}>
              <div className={styles.featureLabel}>Hasta 200 estudiantes</div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
            </div>

            <div className={styles.featureRow}>
              <div className={styles.featureLabel}>
                Motor de análisis predictivo
              </div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
            </div>

            <div className={styles.featureRow}>
              <div className={styles.featureLabel}>
                Alertas tempranas personalizadas
              </div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✓</div>
              <div className={styles.featureValue}>✓</div>
            </div>

            <div className={styles.featureRow}>
              <div className={styles.featureLabel}>
                Usuarios y estudiantes ilimitados
              </div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✓</div>
            </div>

            <div className={styles.featureRow}>
              <div className={styles.featureLabel}>
                Integración con sistemas académicos
              </div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✗</div>
              <div className={styles.featureValue}>✓</div>
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.tableFooter}>
            <div className={styles.featureColumn} />
            <div className={`${styles.planColumn} ${styles.free}`}>
              <button className={`${styles.buyButton} ${styles.buyFree}`}>
                EMPEZAR GRATIS
              </button>
            </div>
            <div className={`${styles.planColumn} ${styles.basic}`}>
              <button className={`${styles.buyButton} ${styles.buyBasic}`}>
                EMPEZAR
              </button>
            </div>
            <div className={`${styles.planColumn} ${styles.standard}`}>
              <button className={`${styles.buyButton} ${styles.buyStandard}`}>
                EMPEZAR
              </button>
            </div>
            <div className={`${styles.planColumn} ${styles.premium}`}>
              <button className={`${styles.buyButton} ${styles.buyPremium}`}>
                EMPEZAR
              </button>
            </div>
          </div>
        </div>

        {/* Descripción de planes */}
        <div className={styles.planDescriptions}>
          <div className={styles.planCard}>
            <h3 className={styles.cardTitle}>🟢 Plan Free</h3>
            <p className={styles.cardSubtitle}>
              Instituciones educativas piloto y exploración básica
            </p>
            <p className={styles.cardDescription}>
              Ideal para instituciones que desean conocer PrediVersa y aplicar
              un piloto limitado en su comunidad educativa. Incluye 1 usuario
              institucional, hasta 3 encuestas digitales, reportes básicos y
              soporte por correo electrónico.
            </p>
          </div>

          <div className={styles.planCard}>
            <h3 className={styles.cardTitle}>🔹 Plan Básico</h3>
            <p className={styles.cardSubtitle}>
              Instituciones pequeñas o medianas
            </p>
            <p className={styles.cardDescription}>
              Hasta 5 usuarios, 200 estudiantes, motor básico de análisis, 10
              encuestas configurables, panel de reportes institucionales y
              capacitación inicial en línea.
            </p>
          </div>

          <div className={styles.planCard}>
            <h3 className={styles.cardTitle}>🔵 Plan Avanzado</h3>
            <p className={styles.cardSubtitle}>Gestión activa del riesgo</p>
            <p className={styles.cardDescription}>
              Hasta 20 usuarios, 800 estudiantes, sistema de alertas tempranas,
              dashboard predictivo, seguimiento por perfil de riesgo y soporte
              técnico prioritario.
            </p>
          </div>

          <div className={styles.planCard}>
            <h3 className={styles.cardTitle}>🟣 Plan Premium</h3>
            <p className={styles.cardSubtitle}>
              Instituciones grandes y redes educativas
            </p>
            <p className={styles.cardDescription}>
              Usuarios y estudiantes ilimitados, integración con sistemas
              académicos, dashboards personalizables, capacitaciones exclusivas
              y consultoría especializada.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.homeButtonContainer}>
        <HomeButton />
      </div>
    </section>
  </div>
);

export default Planes;
