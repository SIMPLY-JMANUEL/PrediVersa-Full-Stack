import React from 'react';
import './Testimonios.css';

const testimonios = [
  {
    id: 1,
    nombre: 'Dr. Ana María Rodríguez',
    cargo: 'Rectora',
    testimonio:
      'PrediVersa transformó nuestra capacidad para prevenir riesgos. Redujimos incidentes en un 85%.',
    estadistica: '85%',
  },
  {
    id: 2,
    nombre: 'Ing. Carlos Mendoza',
    cargo: 'Director RRHH',
    testimonio:
      'Implementamos PrediVersa en 5 sedes. El clima laboral mejoró notablemente.',
    estadistica: '92%',
  },
  {
    id: 3,
    nombre: 'Psic. Laura Jiménez',
    cargo: 'Coord. Bienestar',
    testimonio:
      'Las herramientas analíticas nos permiten intervenir preventivamente.',
    estadistica: '90%',
  },
  {
    id: 4,
    nombre: 'Lic. Patricia Hernández',
    cargo: 'Coord. Académica',
    testimonio:
      'Creamos un ambiente más inclusivo para estudiantes internacionales.',
    estadistica: '78%',
  },
];

function Testimonios() {
  return (
    <section className="testimonios">
      <div className="container">
        <div className="section-header">
          <h2>Lo Que Dicen Nuestros Clientes</h2>
          <p className="subtitle">Testimonios Reales de Transformación</p>
        </div>
        <div className="grid">
          {testimonios.map(testimonio => (
            <div key={testimonio.id} className="card">
              <div className="stat">{testimonio.estadistica}</div>
              <p>{testimonio.testimonio}</p>
              <div className="author">
                <strong>{testimonio.nombre}</strong>
                <span>{testimonio.cargo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonios;
