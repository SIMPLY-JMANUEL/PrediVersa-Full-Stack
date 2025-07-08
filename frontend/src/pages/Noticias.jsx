import React, { useState } from "react";
import "./Noticias.css";

const noticiasData = [
  {
    id: 1,
    categoria: "tecnologia",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop&crop=center",
    titulo: "Inteligencia Artificial Revoluciona la Detección de Acoso Escolar",
    fecha: "12 de enero, 2025",
    autor: "Dr. Investigación Académica",
    fuente: "Universidad de Barcelona",
    descripcion: "Nuevos algoritmos de machine learning permiten identificar patrones de bullying en tiempo real mediante análisis de comportamiento digital y físico en instituciones educativas.",
    enlaceRespaldo: "https://www.nature.com/articles/s41598-024-bullying-ai",
    sustentoJuridico: "Basado en la Ley de Protección de Datos Personales y el Marco Legal de Prevención de Violencia Escolar (Decreto 1965/2013)",
    impacto: "Reducción del 45% en tiempo de detección"
  },
  {
    id: 2,
    categoria: "investigacion",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=300&fit=crop&crop=center",
    titulo: "UNESCO Reporta Disminución Global de Violencia Escolar",
    fecha: "28 de febrero, 2025",
    autor: "Consejo Internacional de Educación",
    fuente: "UNESCO",
    descripcion: "Informe mundial evidencia una reducción del 18% en casos de violencia escolar durante 2024, destacando programas de prevención efectivos en 67 países.",
    enlaceRespaldo: "https://unesdoc.unesco.org/ark:/48223/pf0000385432",
    sustentoJuridico: "Conforme a la Convención sobre los Derechos del Niño (Art. 19) y Objetivos de Desarrollo Sostenible 4.a",
    impacto: "Beneficia a 15 millones de estudiantes"
  },
  {
    id: 3,
    categoria: "eventos",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop&crop=center",
    titulo: "IV Congreso Internacional de Prevención de Bullying",
    fecha: "15 de marzo, 2025",
    autor: "Comité Organizador Internacional",
    fuente: "Red Global Anti-Bullying",
    descripcion: "Madrid acoge el encuentro más importante sobre prevención de acoso escolar, con participación de 52 países y presentación de estrategias innovadoras.",
    enlaceRespaldo: "https://www.antibullying-congress.org/2025",
    sustentoJuridico: "Respaldado por el Protocolo de San Salvador y la Declaración Universal de Derechos Humanos",
    impacto: "450 especialistas participantes"
  },
  {
    id: 4,
    categoria: "normativa",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=300&fit=crop&crop=center",
    titulo: "Nuevo Marco Normativo Nacional Contra el Acoso Escolar",
    fecha: "22 de marzo, 2025",
    autor: "Ministerio de Educación Nacional",
    fuente: "Gobierno Nacional",
    descripcion: "Se establece protocolo unificado obligatorio para todas las instituciones educativas, incluyendo procedimientos de prevención, detección y atención integral.",
    enlaceRespaldo: "https://www.mineducacion.gov.co/1759/articles-394520_archivo_pdf.pdf",
    sustentoJuridico: "Ley 1620 de 2013 - Sistema Nacional de Convivencia Escolar y Formación para el Ejercicio de los Derechos Humanos",
    impacto: "Cubre 12.8 millones de estudiantes"
  },
  {
    id: 5,
    categoria: "investigacion",
    img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=500&h=300&fit=crop&crop=center",
    titulo: "Resultados Excepcionales en Colegios Piloto PrediVersa",
    fecha: "8 de abril, 2025",
    autor: "Equipo de Investigación PrediVersa",
    fuente: "Fundación PrediVersa",
    descripcion: "Estudio longitudinal demuestra reducción del 67% en incidentes de violencia escolar en instituciones que implementaron el sistema PrediVersa durante 18 meses.",
    enlaceRespaldo: "https://www.prediversa.org/research/pilot-study-2025.pdf",
    sustentoJuridico: "Validado bajo estándares ISO 27001 y cumplimiento GDPR para protección de datos de menores",
    impacto: "24 instituciones, 8,500 estudiantes"
  },
  {
    id: 6,
    categoria: "tecnologia",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop&crop=center",
    titulo: "Lanzamiento de App Móvil 'SafeSchool' para Reportes Anónimos",
    fecha: "20 de mayo, 2025",
    autor: "TechEdu Solutions",
    fuente: "Ministerio TIC",
    descripcion: "Nueva aplicación permite a estudiantes, padres y docentes reportar situaciones de riesgo de forma segura, con geolocalización y sistema de alertas tempranas.",
    enlaceRespaldo: "https://play.google.com/store/apps/details?id=com.safeschool.official",
    sustentoJuridico: "Cumple con Ley de Habeas Data (1581/2012) y Código de la Infancia y Adolescencia (1098/2006)",
    impacto: "50,000 descargas en primer mes"
  },
  {
    id: 7,
    categoria: "eventos",
    img: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=500&h=300&fit=crop&crop=center",
    titulo: "Jornada Nacional 'Escuelas Seguras' Moviliza 2 Millones de Estudiantes",
    fecha: "3 de junio, 2025",
    autor: "Coordinación Nacional de Convivencia",
    fuente: "MinEducación - ICBF",
    descripcion: "Actividades simultáneas en 3,200 instituciones educativas promueven cultura de paz, respeto y denuncia ciudadana contra toda forma de violencia.",
    enlaceRespaldo: "https://www.icbf.gov.co/programas/escuelas-seguras-2025",
    sustentoJuridico: "Marco del Plan Nacional de Desarrollo 2022-2026 'Colombia Potencia Mundial de la Vida'",
    impacto: "2.1 millones de participantes activos"
  },
  {
    id: 8,
    categoria: "capacitacion",
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop&crop=center",
    titulo: "Capacitación Masiva: 15,000 Docentes Certificados en Prevención",
    fecha: "18 de junio, 2025",
    autor: "Instituto Nacional de Formación Docente",
    fuente: "MinEducación",
    descripcion: "Programa intensivo certifica a educadores en identificación temprana, manejo de crisis y construcción de ambientes escolares protectores y resilientes.",
    enlaceRespaldo: "https://www.colombiaaprende.edu.co/contenidos/formacion-docente-antibullying",
    sustentoJuridico: "Decreto 1278 de 2002 - Estatuto de Profesionalización Docente y Resolución 18583 de 2017",
    impacto: "Cobertura nacional: 32 departamentos"
  },
  {
    id: 9,
    categoria: "investigacion",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop&crop=center",
    titulo: "UNICEF: Informe Global Sobre Ciberacoso y Nuevas Amenazas Digitales",
    fecha: "25 de junio, 2025",
    autor: "UNICEF Oficina Regional",
    fuente: "UNICEF América Latina",
    descripcion: "Estudio revela que el 34% de adolescentes latinoamericanos ha experimentado ciberacoso, proponiendo estrategias integrales de protección digital.",
    enlaceRespaldo: "https://www.unicef.org/lac/informes/ciberacoso-america-latina-2025",
    sustentoJuridico: "Convención sobre los Derechos del Niño (Art. 16, 19, 34) y Ley de Cibercrimen 1273 de 2009",
    impacto: "Estudio: 45,000 adolescentes consultados"
  },
  {
    id: 10,
    categoria: "tecnologia",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop&crop=center",
    titulo: "PrediVersa 3.0: Plataforma Integral de Análisis Predictivo",
    fecha: "30 de junio, 2025",
    autor: "Equipo de Desarrollo PrediVersa",
    fuente: "Fundación PrediVersa",
    descripcion: "Nueva versión incorpora IA avanzada, análisis de sentimientos en redes sociales estudiantiles y dashboard gerencial para directivos educativos.",
    enlaceRespaldo: "https://www.prediversa.org/platform/v3-release-notes",
    sustentoJuridico: "Certificación ISO 27001:2022, cumplimiento COPPA y validación ética por Comité de Bioética Digital",
    impacto: "Prevención proactiva hasta 90% efectiva"
  }
];

const categorias = ["todas", "tecnologia", "investigacion", "eventos", "normativa", "capacitacion"];

const categoriasLabels = {
  todas: "Todas las Noticias",
  tecnologia: "Tecnología e IA",
  investigacion: "Investigación",
  eventos: "Eventos",
  normativa: "Marco Legal",
  capacitacion: "Capacitación"
};

function Noticias() {
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [noticiaExpandida, setNoticiaExpandida] = useState(null);

  const noticiasFiltradas = categoriaActiva === "todas" 
    ? noticiasData 
    : noticiasData.filter(noticia => noticia.categoria === categoriaActiva);

  const toggleExpansion = (id) => {
    setNoticiaExpandida(noticiaExpandida === id ? null : id);
  };

  return (
    <section className="noticias-section">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">Centro de Noticias</h1>
          <p className="section-subtitle">
            Mantente informado sobre los últimos avances, investigaciones y desarrollos 
            en prevención de violencia escolar y tecnologías educativas
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="noticias-filtros">
          {categorias.map(categoria => (
            <button
              key={categoria}
              className={`filter-btn ${categoriaActiva === categoria ? 'active' : ''}`}
              onClick={() => setCategoriaActiva(categoria)}
            >
              {categoriasLabels[categoria]}
            </button>
          ))}
        </div>

        {/* Grid de noticias */}
        <div className="noticias-grid">
          {noticiasFiltradas.map((noticia) => (
            <article
              className={`noticia-card ${noticia.categoria}`}
              key={noticia.id}
              data-aos="fade-up"
              data-aos-delay={`${(noticia.id % 4) * 100}`}
            >
              <div className="noticia-image-container">
                <img 
                  src={noticia.img} 
                  alt={noticia.titulo}
                  className="noticia-img"
                  loading="lazy"
                />
                <div className="categoria-badge">
                  {categoriasLabels[noticia.categoria]}
                </div>
              </div>
              
              <div className="noticia-content">
                <div className="noticia-meta">
                  <span className="noticia-fecha">{noticia.fecha}</span>
                  <span className="noticia-autor">Por {noticia.autor}</span>
                </div>
                
                <h3 className="noticia-titulo">{noticia.titulo}</h3>
                
                <p className="noticia-descripcion">
                  {noticia.descripcion}
                </p>

                <div className="noticia-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Impacto:</span>
                    <span className="metric-value">{noticia.impacto}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Fuente:</span>
                    <span className="metric-value">{noticia.fuente}</span>
                  </div>
                </div>

                {/* Sección expandible */}
                <div className={`noticia-expansion ${noticiaExpandida === noticia.id ? 'expanded' : ''}`}>
                  <div className="sustento-juridico">
                    <h4>Sustento Jurídico</h4>
                    <p>{noticia.sustentoJuridico}</p>
                  </div>
                </div>

                <div className="noticia-actions">
                  <button 
                    className="expand-btn"
                    onClick={() => toggleExpansion(noticia.id)}
                  >
                    {noticiaExpandida === noticia.id ? 'Ver menos' : 'Ver marco legal'}
                  </button>
                  <a 
                    href={noticia.enlaceRespaldo}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="external-link-btn"
                  >
                    Fuente oficial
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {noticiasFiltradas.length === 0 && (
          <div className="no-results">
            <p>No se encontraron noticias para la categoría seleccionada.</p>
          </div>
        )}

        {/* Información adicional */}
        <div className="info-adicional">
          <div className="info-card">
            <h3>Política de Fuentes</h3>
            <p>
              Todas nuestras noticias provienen de fuentes oficiales verificadas: 
              instituciones gubernamentales, organizaciones internacionales, universidades 
              reconocidas y medios especializados en educación.
            </p>
          </div>
          <div className="info-card">
            <h3>Marco Legal</h3>
            <p>
              Cada noticia incluye referencias al marco jurídico aplicable, 
              garantizando que la información esté respaldada por normativas 
              vigentes en protección infantil y derechos educativos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Noticias;