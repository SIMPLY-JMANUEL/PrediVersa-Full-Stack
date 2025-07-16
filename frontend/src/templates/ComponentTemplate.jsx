/**
 * ===== PATRÓN ESTÁNDAR PARA COMPONENTES PREDIVERSA =====
 * Estructura JSX unificada que todos los componentes deben seguir
 */

// IMPORTACIONES ESTÁNDAR
import React from 'react';
import './ComponentName.css';

// ESTRUCTURA JSX ESTÁNDAR
const ComponentName = () => {
  return (
    <section className="section-standard bg-primary" id="component-name">
      {/* FONDO OPCIONAL */}
      <div
        className="bg-image"
        style={{ backgroundImage: 'url("../assets/img/fondo1.png")' }}
      />
      <div className="bg-overlay" />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="container-standard">
        {/* HEADER DE SECCIÓN */}
        <div className="section-header">
          <h2 className="title-standard">Título Principal</h2>
          <p className="subtitle-standard">Subtítulo descriptivo</p>
          <p className="description-standard">
            Descripción detallada del componente que explica su propósito y
            valor.
          </p>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="section-content">
          <div className="grid-standard grid-3">
            {/* ITEMS DEL GRID */}
            <div className="content-item fade-in">
              <h3>Item 1</h3>
              <p>Contenido del item</p>
            </div>
            <div className="content-item fade-in">
              <h3>Item 2</h3>
              <p>Contenido del item</p>
            </div>
            <div className="content-item fade-in">
              <h3>Item 3</h3>
              <p>Contenido del item</p>
            </div>
          </div>
        </div>

        {/* ACCIONES OPCIONALES */}
        <div className="section-actions text-center mt-3">
          <button className="btn-standard btn-primary">Acción Principal</button>
        </div>
      </div>
    </section>
  );
};

export default ComponentName;

/**
 * ===== CLASES CSS ESTÁNDAR PARA ESTE PATRÓN =====
 *
 * ESTRUCTURA:
 * .section-standard     -> Sección principal
 * .container-standard   -> Contenedor con max-width 1200px
 * .section-header       -> Header con títulos
 * .section-content      -> Contenido principal
 * .section-actions      -> Botones/acciones
 *
 * TÍTULOS:
 * .title-standard       -> Título principal (h2)
 * .subtitle-standard    -> Subtítulo (p)
 * .description-standard -> Descripción (p)
 *
 * LAYOUT:
 * .grid-standard        -> Grid base
 * .grid-2/.grid-3/.grid-4 -> Variaciones de columnas
 *
 * FONDOS:
 * .bg-primary/.bg-secondary/.bg-white/.bg-gradient
 * .bg-image/.bg-overlay -> Para fondos con imagen
 *
 * BOTONES:
 * .btn-standard .btn-primary -> Botón principal
 *
 * ANIMACIONES:
 * .fade-in/.slide-up    -> Animaciones de entrada
 *
 * RESPONSIVE:
 * - Mobile: ≤768px (1 columna)
 * - Tablet: 768px-1024px (2 columnas)
 * - Desktop: ≥1024px (columnas completas)
 */
