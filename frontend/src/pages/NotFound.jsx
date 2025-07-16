import React from 'react';
import HomeButton from '../components/Button/HomeButton';

function NotFound() {
  return (
    <section className="notfound-section">
      <div className="container text-center">
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <div className="mt-3">
          <HomeButton label="Regresar al Inicio" />
        </div>
      </div>
    </section>
  );
}

export default NotFound;
