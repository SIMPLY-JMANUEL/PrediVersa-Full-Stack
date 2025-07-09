import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { educationalOrganizationSchema } from '../components/SEO';
import './QuienesSomos.css';

function QuienesSomos() {
  const cardsRef = useRef([]);

  useEffect(() => {
    // Igualar la altura de las tarjetas misión y visión en desktop
    const equalizeCardHeights = () => {
      if (window.innerWidth > 768 && cardsRef.current.length === 2) {
        cardsRef.current.forEach(card => {
          if (card) card.style.height = 'auto';
        });

        const maxHeight = Math.max(
          ...cardsRef.current
            .filter(card => card)
            .map(card => card.offsetHeight)
        );

        cardsRef.current.forEach(card => {
          if (card) card.style.height = `${maxHeight}px`;
        });
      } else {
        // En móvil, resetear alturas
        cardsRef.current.forEach(card => {
          if (card) card.style.height = 'auto';
        });
      }
    };

    equalizeCardHeights();
    window.addEventListener('resize', equalizeCardHeights);

    return () => window.removeEventListener('resize', equalizeCardHeights);
  }, []);

  return (
    <div className="quienes-somos-page">
      <SEO
        title="Quiénes Somos - PrediVersa"
        description="Conoce la misión, visión y valores de PrediVersa. Equipo especializado en prevención de riesgos psicosociales educativos."
        keywords="quienes somos, misión, visión, PrediVersa, educación, prevención"
        canonical="https://prediversa.com/quienes-somos"
        ogTitle="Quiénes Somos - PrediVersa"
        ogDescription="Descubre el equipo y la misión de PrediVersa"
        ogUrl="https://prediversa.com/quienes-somos"
        jsonLd={educationalOrganizationSchema}
      />

      {/* Header Section */}
      <section className="qs-hero">
        <div className="container">
          <div className="qs-hero-content animate-fade-in-up">
            <h1 className="qs-main-title">Nuestra Misión y Visión</h1>
            <p className="qs-hero-subtitle">
              Principios que guían nuestro compromiso por escuelas seguras,
              inclusivas y saludables para todos los estudiantes.
            </p>
            <div className="qs-divider" />
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="qs-content">
        <div className="container">
          <div className="qs-cards-grid">
            {/* Tarjeta Misión */}
            <article
              className="qs-card mission-card animate-fade-in-left hover-lift"
              tabIndex={0}
              aria-label="Nuestra Misión"
              ref={el => (cardsRef.current[0] = el)}
            >
              <header className="qs-card-header">
                <div className="qs-icon mission-icon">
                  <i className="fas fa-bullseye" aria-hidden="true" />
                </div>
                <h2 className="qs-card-title">Nuestra Misión</h2>
              </header>

              <div className="qs-card-content">
                <p className="qs-main-text">
                  Prediversa tiene como misión{' '}
                  <strong>
                    prevenir, detectar y tratar el bullying escolar
                  </strong>{' '}
                  mediante una plataforma integral que combina tecnología
                  avanzada, expertise psicológico y metodologías educativas
                  innovadoras.
                </p>
                <p className="qs-secondary-text">
                  Trabajamos para crear ambientes escolares seguros, inclusivos
                  y saludables donde cada estudiante pueda desarrollar su máximo
                  potencial sin temor al acoso o la discriminación.
                </p>
                <blockquote className="qs-quote">
                  <i
                    className="fas fa-quote-left quote-icon"
                    aria-hidden="true"
                  />
                  "Cada estudiante merece un entorno educativo libre de
                  violencia y lleno de oportunidades para crecer."
                </blockquote>
              </div>
            </article>

            {/* Tarjeta Visión */}
            <article
              className="qs-card vision-card animate-fade-in-right hover-lift"
              tabIndex={0}
              aria-label="Nuestra Visión"
              ref={el => (cardsRef.current[1] = el)}
            >
              <header className="qs-card-header">
                <div className="qs-icon vision-icon">
                  <i className="fas fa-eye" aria-hidden="true" />
                </div>
                <h2 className="qs-card-title">Nuestra Visión</h2>
              </header>

              <div className="qs-card-content">
                <p className="qs-main-text">
                  Ser la <strong>plataforma líder en Latinoamérica</strong> para
                  la prevención y tratamiento del bullying escolar, reconocida
                  por su impacto positivo en la transformación de las dinámicas
                  escolares.
                </p>
                <p className="qs-secondary-text">
                  Aspiramos a un futuro donde todas las instituciones educativas
                  cuenten con herramientas efectivas para crear comunidades
                  escolares basadas en el respeto, la empatía y la colaboración.
                </p>
                <blockquote className="qs-quote">
                  <i
                    className="fas fa-quote-left quote-icon"
                    aria-hidden="true"
                  />
                  "Visualizamos escuelas donde la diversidad se celebra y cada
                  voz es escuchada y valorada."
                </blockquote>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="qs-navigation">
        <div className="container">
          <div className="qs-nav-content animate-fade-in-up">
            <Link to="/" className="qs-back-btn hover-glow">
              <i className="fas fa-arrow-left" aria-hidden="true" />
              Regresar al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default QuienesSomos;
