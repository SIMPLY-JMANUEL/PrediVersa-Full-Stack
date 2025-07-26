import React, { useState } from 'react';
import styles from './Noticias.module.css';
import fondo from '../assets/img/fondo12.png';
import HomeButton from '../components/Button/HomeButton';

const Noticias = () => {
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const noticias = [
    {
      id: 1,
      categoria: 'violencia',
      titulo: 'Violencia intrafamiliar y abuso sexual en Colombia',
      descripcion:
        'Según el ICBF, para 2024 hubo 78.124 denuncias de violencia infantil, de las cuales 40.026 correspondieron a menores de 6–12 años, y 11.000 casos incluyeron abuso sexual.',
      fuente: 'ICBF, Procuraduría General',
      fecha: '2024',
      icono: 'shield',
    },
    {
      id: 2,
      categoria: 'urbana',
      titulo: 'Maltrato infantil en grandes ciudades',
      descripcion:
        'La Procuraduría reportó 11.195 casos de violencia contra menores entre enero y abril de 2024: 5.889 por abuso sexual y 2.754 por violencia intrafamiliar.',
      fuente: 'Procuraduría General de la Nación',
      fecha: '2024',
      icono: 'city',
    },
    {
      id: 3,
      categoria: 'conflicto',
      titulo: 'Reclutamiento por grupos armados',
      descripcion:
        'En 2024, la COALICO reportó 44.784 menores afectados por el conflicto armado en 31 departamentos. Hubo 127 casos de reclutamiento en 22 departamentos.',
      fuente: 'COALICO, UNICEF',
      fecha: '2024',
      icono: 'warning',
    },
    {
      id: 4,
      categoria: 'conflicto',
      titulo: 'Niños soldado en Colombia',
      descripcion:
        'Un informe de junio de 2025 revela 541 menores reclutados, con 273 pertenecientes al pueblo Nasa. La ONU documentó 658 casos entre 2022 – 2024.',
      fuente: 'El País, ONU',
      fecha: '2025',
      icono: 'alert',
    },
    {
      id: 5,
      categoria: 'escolar',
      titulo: 'Violencia vs. permanencia escolar',
      descripcion:
        'Para 2025, UNICEF indica que los entornos escolares violentos aumentan el ausentismo y deterioran la salud mental de los estudiantes.',
      fuente: 'UNICEF',
      fecha: '2025',
      icono: 'school',
    },
    {
      id: 6,
      categoria: 'general',
      titulo: 'Violencia contra la infancia como "pandemia latente"',
      descripcion:
        'Más de la mitad de los niños colombianos enfrentan pobreza y múltiples formas de violencia (física, sexual, conflicto armado).',
      fuente: 'El País',
      fecha: '2024',
      icono: 'health',
    },
    {
      id: 7,
      categoria: 'digital',
      titulo: 'Reclutamiento a través de redes sociales',
      descripcion:
        'Grupos armados usan TikTok para captar menores: 146 cuentas fueron detectadas y 140 casos reportados entre enero y abril de 2025.',
      fuente: 'El País',
      fecha: '2025',
      icono: 'digital',
    },
    {
      id: 8,
      categoria: 'legal',
      titulo: 'Violencia sexual e impunidad en Colombia',
      descripcion:
        'El País resalta la necesidad de pasar de penas más duras a una prevención efectiva. En 2024 se reportaron 375 homicidios y 11.871 posibles abusos sexuales.',
      fuente: 'El País',
      fecha: '2024',
      icono: 'justice',
    },
  ];

  const normativas = [
    {
      titulo: 'Ley 1620 de 2013',
      descripcion:
        'Establece el Sistema Nacional de Convivencia Escolar, con rutas de atención, prevención y sanción de la violencia escolar.',
      fuente: 'Ministerio de Educación',
    },
    {
      titulo: 'Decreto 1965 de 2013',
      descripcion:
        'Reglamenta la ley 1620, define protocolos de convivencia y establece responsabilidades institucionales.',
      fuente: 'Ministerio de Educación',
    },
    {
      titulo: 'Código de Infancia y Adolescencia – Ley 1098 de 2006',
      descripcion:
        'Reconoce derechos de protección integral y obliga a la sociedad a prevenir violencias sexuales y físicas.',
      fuente: 'ICBF',
    },
  ];

  const getIcon = iconType => {
    const iconMap = {
      shield: (
        <path
          d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 21C7.59 20.14 5 16.13 5 11V6.3L12 3.19L19 6.3V11C19 16.13 16.41 20.14 12 21Z"
          fill="#3498db"
        />
      ),
      city: (
        <path
          d="M15 11V5L12 2L9 5V7H7V21H17V11H15ZM11 19H9V17H11V19ZM11 15H9V13H11V15ZM11 11H9V9H11V11ZM13 19H11V17H13V19ZM13 15H11V13H13V15ZM13 11H11V9H13V11ZM13 7H11V5H13V7Z"
          fill="#3498db"
        />
      ),
      warning: (
        <path
          d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
          fill="#e74c3c"
        />
      ),
      alert: (
        <path
          d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 22C6.48 22 2 17.52 2 12S6.48 2 12 2S22 6.48 22 12S17.52 22 12 22ZM12 20C16.42 20 20 16.42 20 12S16.42 4 12 4S4 7.58 4 12S7.58 20 12 20Z"
          fill="#e74c3c"
        />
      ),
      school: (
        <path
          d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18ZM12 3L1 9L12 15L21 10.09V17H23V9L12 3Z"
          fill="#3498db"
        />
      ),
      health: (
        <path
          d="M19 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H5C3.9 8 3 8.9 3 10V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V10C21 8.9 20.1 8 19 8ZM9 6C9 4.34 10.34 3 12 3S15 4.34 15 6V8H9V6Z"
          fill="#e67e22"
        />
      ),
      digital: (
        <path
          d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
          fill="#9b59b6"
        />
      ),
      justice: (
        <path
          d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM11 16V8H9V11H7V13H9V16H11ZM13 16H15V13H13V16ZM15 11V8H13V11H15Z"
          fill="#34495e"
        />
      ),
    };

    return iconMap[iconType] || iconMap.shield;
  };

  const filteredNoticias =
    selectedCategory === 'todas'
      ? noticias
      : noticias.filter(noticia => noticia.categoria === selectedCategory);

  return (
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
          <h1 className={styles.titleText}>Noticias Relevantes</h1>
          <p className={styles.subtitleText}>
            Información actualizada sobre violencia infantil y escolar en
            Colombia. Datos estadísticos, normatividad vigente y análisis de la
            situación actual para promover ambientes escolares más seguros.
          </p>
        </div>

        {/* Filtros */}
        <div className={styles.filterSection}>
          <h2 className={styles.sectionTitle}>Categorías</h2>
          <div className={styles.filterButtons}>
            {[
              { key: 'todas', label: 'Todas las noticias' },
              { key: 'violencia', label: 'Violencia Intrafamiliar' },
              { key: 'escolar', label: 'Violencia Escolar' },
              { key: 'conflicto', label: 'Conflicto Armado' },
              { key: 'digital', label: 'Riesgos Digitales' },
              { key: 'legal', label: 'Marco Legal' },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedCategory(filter.key)}
                className={`${styles.filterButton} ${
                  selectedCategory === filter.key ? styles.active : ''
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de noticias */}
        <div className={styles.newsGrid}>
          {filteredNoticias.map(noticia => (
            <article key={noticia.id} className={styles.newsCard}>
              <div className={styles.newsIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  {getIcon(noticia.icono)}
                </svg>
              </div>
              <div className={styles.newsContent}>
                <h3 className={styles.newsTitle}>{noticia.titulo}</h3>
                <p className={styles.newsDescription}>{noticia.descripcion}</p>
                <div className={styles.newsFooter}>
                  <span className={styles.newsSource}>{noticia.fuente}</span>
                  <span className={styles.newsDate}>{noticia.fecha}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Normatividad */}
        <div className={styles.legalSection}>
          <h2 className={styles.sectionTitle}>
            📚 Normatividad Vigente en Colombia
          </h2>
          <div className={styles.legalGrid}>
            {normativas.map(norma => (
              <div key={norma.titulo} className={styles.legalCard}>
                <h3 className={styles.legalTitle}>{norma.titulo}</h3>
                <p className={styles.legalDescription}>{norma.descripcion}</p>
                <span className={styles.legalSource}>{norma.fuente}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>📌 En resumen</h2>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <h3>Situación Regional</h3>
              <p>
                En Antioquia y otras regiones, violencia intrafamiliar y
                reclutamiento de menores es crítico.
              </p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Panorama Nacional</h3>
              <p>
                A nivel nacional, cifras de abuso, homicidio y ciberacoso son
                alarmantes.
              </p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Contexto Internacional</h3>
              <p>
                La violencia infantil en zonas de conflicto ha subido un 25% en
                2024.
              </p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Marco Legal</h3>
              <p>
                La normatividad colombiana ofrece herramientas legales para
                prevención y atención con enfoque sistémico.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <HomeButton size="medium" variant="primary" />
        </div>
      </section>
    </div>
  );
};

export default Noticias;
