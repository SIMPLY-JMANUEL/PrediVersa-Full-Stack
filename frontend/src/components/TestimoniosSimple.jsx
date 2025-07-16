import React from 'react';

const TestimoniosSimple = () => {
  const testimoniosData = [
    {
      id: 1,
      nombre: 'Dr. Ana María Rodríguez',
      cargo: 'Rectora',
      institucion: 'Colegio San Patricio',
      avatar:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      testimonio:
        'PrediVersa transformó completamente nuestra capacidad para prevenir situaciones de riesgo.',
      estadistica: '85%',
      etiqueta: 'Reducción de incidentes',
      rating: 5,
    },
    {
      id: 2,
      nombre: 'Ing. Carlos Mendoza',
      cargo: 'Director de RR.HH.',
      institucion: 'Corporación Empresarial XYZ',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      testimonio:
        'Los resultados han sido extraordinarios. El clima laboral mejoró notablemente.',
      estadistica: '92%',
      etiqueta: 'Mejora en clima laboral',
      rating: 5,
    },
  ];

  const estilosInline = {
    section: {
      padding: '5rem 2rem',
      background:
        'linear-gradient(135deg, rgba(12, 27, 50, 0.95) 0%, rgba(66, 192, 249, 0.15) 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem',
    },
    title: {
      fontSize: '3rem',
      marginBottom: '1rem',
      color: '#42c0f9',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    card: {
      background: 'rgba(66, 192, 249, 0.15)',
      border: '2px solid #42c0f9',
      borderRadius: '20px',
      padding: '2rem',
      textAlign: 'center',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
    },
    stat: {
      marginBottom: '1.5rem',
      padding: '1rem',
      background: 'rgba(66, 192, 249, 0.2)',
      borderRadius: '10px',
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#42c0f9',
      display: 'block',
    },
    statLabel: {
      fontSize: '0.8rem',
      color: '#42c0f9',
      textTransform: 'uppercase',
    },
    content: {
      flex: 1,
      margin: '1rem 0',
    },
    text: {
      fontStyle: 'italic',
      lineHeight: '1.6',
    },
    author: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      margin: '1rem 0',
    },
    avatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: '2px solid #42c0f9',
      objectFit: 'cover',
    },
    authorInfo: {
      textAlign: 'left',
      flex: 1,
    },
    authorName: {
      fontWeight: 'bold',
      marginBottom: '0.25rem',
    },
    authorRole: {
      color: '#42c0f9',
      fontSize: '0.9rem',
    },
    rating: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.25rem',
    },
    star: {
      color: '#fbbf24',
      fontSize: '1.2rem',
    },
    debug: {
      background: 'rgba(255, 0, 0, 0.1)',
      border: '2px solid red',
      padding: '1rem',
      margin: '2rem 0',
      borderRadius: '10px',
      textAlign: 'center',
    },
  };

  return (
    <section style={estilosInline.section}>
      <div style={estilosInline.container}>
        <div style={estilosInline.debug}>
          <h2>🚨 DEBUG: TESTIMONIOS SIMPLE</h2>
          <p>
            Si ves este mensaje, el componente React se está renderizando
            correctamente.
          </p>
        </div>

        <div style={estilosInline.header}>
          <h2 style={estilosInline.title}>Lo Que Dicen Nuestros Clientes</h2>
          <p>Testimonios Reales de Transformación</p>
        </div>

        <div style={estilosInline.grid}>
          {testimoniosData.map(testimonio => (
            <article key={testimonio.id} style={estilosInline.card}>
              <div style={estilosInline.stat}>
                <span style={estilosInline.statNumber}>
                  {testimonio.estadistica}
                </span>
                <span style={estilosInline.statLabel}>
                  {testimonio.etiqueta}
                </span>
              </div>

              <div style={estilosInline.content}>
                <p style={estilosInline.text}>{testimonio.testimonio}</p>
              </div>

              <div style={estilosInline.author}>
                <img
                  src={testimonio.avatar}
                  alt={testimonio.nombre}
                  style={estilosInline.avatar}
                />
                <div style={estilosInline.authorInfo}>
                  <div style={estilosInline.authorName}>
                    {testimonio.nombre}
                  </div>
                  <div style={estilosInline.authorRole}>{testimonio.cargo}</div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {testimonio.institucion}
                  </div>
                </div>
              </div>

              <div style={estilosInline.rating}>
                {Array.from({ length: testimonio.rating }, (_, i) => (
                  <span key={i} style={estilosInline.star}>
                    ★
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoniosSimple;
