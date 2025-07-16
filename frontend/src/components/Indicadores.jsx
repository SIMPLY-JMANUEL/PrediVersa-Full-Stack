import React, { useState, useEffect, useCallback } from 'react';
import {
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaGraduationCap,
} from 'react-icons/fa';
import './Indicadores.css';

const indicadoresData = [
  {
    id: 'reduccion',
    icon: FaShieldAlt,
    numero: '95%',
    titulo: 'Reducción de Incidentes',
    descripcion: 'Disminución comprobada en situaciones de riesgo',
    color: '#10b981',
    delay: 0,
  },
  {
    id: 'instituciones',
    icon: FaGraduationCap,
    numero: '200+',
    titulo: 'Instituciones Protegidas',
    descripcion: 'Colegios y empresas que confían en PrediVersa',
    color: '#42c0f9',
    delay: 100,
  },
  {
    id: 'estudiantes',
    icon: FaUsers,
    numero: '50K+',
    titulo: 'Estudiantes Protegidos',
    descripcion: 'Jóvenes beneficiados por nuestra tecnología',
    color: '#169cd8',
    delay: 200,
  },
  {
    id: 'deteccion',
    icon: FaChartLine,
    numero: '24h',
    titulo: 'Detección Temprana',
    descripcion: 'Tiempo promedio de identificación de riesgos',
    color: '#0c1b32',
    delay: 300,
  },
];

function Indicadores() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState({});

  const animateCounter = useCallback((id, start, end, suffix) => {
    const duration = 2000;
    const increment = end / (duration / 16);
    let current = start;

    const timer = window.setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        window.clearInterval(timer);
      }
      setAnimatedNumbers(prev => ({
        ...prev,
        [id]: Math.floor(current) + suffix,
      }));
    }, 16);
  }, []);

  const animateNumbers = useCallback(() => {
    indicadoresData.forEach(indicador => {
      window.setTimeout(() => {
        if (indicador.numero.includes('%')) {
          const targetNumber = parseInt(indicador.numero, 10);
          animateCounter(indicador.id, 0, targetNumber, '%');
        } else if (indicador.numero.includes('K+')) {
          const targetNumber = parseInt(indicador.numero, 10);
          animateCounter(indicador.id, 0, targetNumber, 'K+');
        } else if (indicador.numero.includes('+')) {
          const targetNumber = parseInt(indicador.numero, 10);
          animateCounter(indicador.id, 0, targetNumber, '+');
        } else {
          setAnimatedNumbers(prev => ({
            ...prev,
            [indicador.id]: indicador.numero,
          }));
        }
      }, indicador.delay);
    });
  }, [animateCounter]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animar números cuando se hacen visibles
          animateNumbers();
        }
      },
      { threshold: 0.3 }
    );

    const section = document.querySelector('.indicadores-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [animateNumbers]);

  return (
    <section className="indicadores-section" id="indicadores">
      <div className="indicadores-container">
        <div className="indicadores-header">
          <h2 className="indicadores-title">
            Resultados que <span className="title-accent">Transforman</span>
          </h2>
          <p className="indicadores-subtitle">
            Números reales que demuestran el impacto de PrediVersa en la
            prevención
          </p>
        </div>

        <div className={`indicadores-grid ${isVisible ? 'animate-in' : ''}`}>
          {indicadoresData.map(indicador => {
            const IconComponent = indicador.icon;
            return (
              <div
                key={indicador.id}
                className="indicador-card"
                style={{
                  '--delay': `${indicador.delay}ms`,
                  '--color': indicador.color,
                }}
              >
                <div className="indicador-icon">
                  <IconComponent />
                </div>
                <div className="indicador-content">
                  <div className="indicador-numero">
                    {animatedNumbers[indicador.id] || '0'}
                  </div>
                  <h3 className="indicador-titulo">{indicador.titulo}</h3>
                  <p className="indicador-descripcion">
                    {indicador.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Indicadores;
