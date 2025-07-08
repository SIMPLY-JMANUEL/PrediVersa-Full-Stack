import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="notfound-section">
      <div className="container text-center">
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <div className="mt-3">
          <Link to="/" className="btn-regresar">
            <i className="fas fa-home"></i>
            Regresar al Inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;