import React from "react";
import { Link } from "react-router-dom";
import "./Equipo.css";

function Equipo() {
  const teamMembers = [
    {
      id: 1,
      name: "Andrey Luna",
      title: "Analista de Datos Senior",
      specialty: "Machine Learning & Analytics",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop&crop=face&auto=format&q=80",
      bio: "Experto en minería de datos, estadística avanzada y modelos predictivos de última generación. Lidera el desarrollo de algoritmos de inteligencia artificial para la detección temprana de patrones de riesgo en entornos educativos y empresariales.",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "R", "Estadística", "Big Data"],
      experience: [
        "5+ años en análisis predictivo y ciencia de datos",
        "Especialista en algoritmos de detección de anomalías",
        "Experiencia en procesamiento de grandes volúmenes de datos",
        "Certificado en Google Cloud Machine Learning",
        "Publicaciones en revistas científicas de IA"
      ],
      contact: {
        email: "andrey.luna@prediversa.com",
        linkedin: "https://linkedin.com/in/andreyluna",
        github: "https://github.com/andreyluna"
      }
    },
    {
      id: 2,
      name: "Harold Salcedo",
      title: "Arquitecto de Software Full Stack",
      specialty: "Desarrollo Web & Mobile",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face&auto=format&q=80",
      bio: "Ingeniero de software con amplia experiencia en arquitectura de sistemas escalables. Responsable del diseño e implementación de la plataforma PrediVersa, incluyendo APIs robustas, interfaces de usuario intuitivas y aplicaciones móviles multiplataforma.",
      skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB", "Docker", "React Native", "GraphQL"],
      experience: [
        "7+ años en desarrollo full stack y arquitectura de software",
        "Experto en metodologías ágiles y DevOps",
        "Especialista en diseño de APIs RESTful y GraphQL",
        "Certificado AWS Solutions Architect",
        "Líder técnico en proyectos de transformación digital"
      ],
      contact: {
        email: "harold.salcedo@prediversa.com",
        linkedin: "https://linkedin.com/in/haroldsalcedo",
        github: "https://github.com/haroldsalcedo"
      }
    },
    {
      id: 3,
      name: "J. Manuel Calvo",
      title: "Director de Ciberseguridad y Análisis Forense",
      specialty: "Ingeniería de Sistemas & Seguridad Digital",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop&crop=face&auto=format&q=80",
      bio: "Ingeniero de sistemas especializado en ciberseguridad, investigación criminal digital y análisis forense. Experto en delitos informáticos, pornografía infantil y análisis de enlaces (link analysis). Lidera la seguridad de la plataforma PrediVersa y el desarrollo de protocolos de protección de datos sensibles en entornos educativos.",
      skills: ["Ciberseguridad", "Análisis Forense Digital", "Investigación Criminal", "Delitos Informáticos", "Link Analysis", "Desarrollo de Software", "Protección de Menores", "Seguridad de Datos"],
      experience: [
        "12+ años en ingeniería de sistemas y ciberseguridad",
        "Especialista certificado en investigación de delitos informáticos",
        "Experto en análisis forense digital y recuperación de evidencias",
        "Consultor en casos de pornografía infantil y explotación online",
        "Desarrollador de sistemas de seguridad para protección de menores",
        "Certificado en análisis de enlaces y redes criminales",
        "Colaborador con fuerzas del orden en cibercrímenes"
      ],
      contact: {
        email: "manuel.calvo@prediversa.com",
        linkedin: "https://linkedin.com/in/manuelcalvo-cybersec",
        github: "https://github.com/manuelcalvo-forensics"
      }
    }
  ];

  return (
    <div className="equipo-page">
      {/* Hero Section */}
      <section className="equipo-hero">
        <div className="container">
          <div className="equipo-hero-content animate-fade-in-up">
            <h1 className="equipo-main-title">Conoce a Nuestro Equipo</h1>
            <p className="equipo-hero-subtitle">
              Profesionales especializados unidos por la misión de transformar la educación a través de la prevención inteligente del bullying escolar
            </p>
            <div className="equipo-divider"></div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="equipo-content">
        <div className="container">
          <div className="equipo-content-container">
            <div className="equipo-grid">
              {teamMembers.map((member, index) => (
                <article key={member.id} className="equipo-member-card animate-stagger hover-lift">
                  <div className="equipo-image-container">
                    <img
                      src={member.image}
                      alt={`${member.name} - ${member.title}`}
                      className="equipo-member-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/800x800/e2e8f0/64748b?text=" + encodeURIComponent(member.name);
                      }}
                    />
                    <div className="equipo-image-overlay">
                      <div className="equipo-member-role-badge">
                        {member.specialty}
                      </div>
                    </div>
                  </div>
                  
                  <div className="equipo-member-content">
                    <header className="equipo-member-header">
                      <h2 className="equipo-member-name">{member.name}</h2>
                      <h3 className="equipo-member-title">{member.title}</h3>
                      <p className="equipo-member-specialty">{member.specialty}</p>
                    </header>
                    
                    <p className="equipo-member-bio">{member.bio}</p>
                    
                    <div className="equipo-member-details">
                      <div className="equipo-skills-section">
                        <h4 className="equipo-section-title">Especialidades</h4>
                        <div className="equipo-skills-list">
                          {member.skills.map((skill, idx) => (
                            <span key={idx} className="equipo-skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="equipo-skills-section">
                        <h4 className="equipo-section-title">Experiencia</h4>
                        <ul className="equipo-experience-list">
                          {member.experience.map((exp, idx) => (
                            <li key={idx}>{exp}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="equipo-contact-section">
                        <h4 className="equipo-section-title">Contacto</h4>
                        <div className="equipo-contact-links">
                          <a 
                            href={`mailto:${member.contact.email}`}
                            className="equipo-contact-link"
                            title={`Enviar email a ${member.name}`}
                          >
                            <i className="fas fa-envelope" aria-hidden="true"></i>
                          </a>
                          {member.contact.linkedin && (
                            <a 
                              href={member.contact.linkedin}
                              className="equipo-contact-link"
                              title={`LinkedIn de ${member.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                            </a>
                          )}
                          {member.contact.github && (
                            <a 
                              href={member.contact.github}
                              className="equipo-contact-link"
                              title={`GitHub de ${member.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-github" aria-hidden="true"></i>
                            </a>
                          )}
                          {member.contact.orcid && (
                            <a 
                              href={member.contact.orcid}
                              className="equipo-contact-link"
                              title={`ORCID de ${member.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-orcid" aria-hidden="true"></i>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="equipo-navigation">
        <div className="container">
          <div className="equipo-nav-content animate-fade-in-up">
            <Link to="/" className="equipo-back-btn hover-glow">
              <i className="fas fa-arrow-left" aria-hidden="true"></i>
              Regresar al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Equipo;
