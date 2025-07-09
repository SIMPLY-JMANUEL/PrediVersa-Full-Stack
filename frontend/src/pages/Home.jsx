import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Cta from '../components/Cta';
import Indicadores from '../components/Indicadores';
import Testimonios from '../components/Testimonios';
import Faq from '../components/Faq';
import Cierre from '../components/Cierre';
import SEO from '../components/SEO';
import { organizationSchema } from '../components/SEO';

function Home() {
  return (
    <div className="home">
      <SEO
        title="PrediVersa - Plataforma Educativa de Prevención"
        description="Plataforma educativa integral para diversidad e inclusión. Prevención inteligente de bullying y violencia escolar."
        keywords="educación, diversidad, inclusión, prevención bullying, violencia escolar"
        canonical="https://prediversa.com/"
        ogTitle="PrediVersa - Transformando la Educación"
        ogDescription="Plataforma líder en prevención de riesgos psicosociales en el ámbito educativo"
        ogImage="/logo512.png"
        ogUrl="https://prediversa.com/"
        jsonLd={organizationSchema}
      />
      <Hero />
      <Features />
      <Cta />
      <Indicadores />
      <Testimonios />
      <Faq />
      <Cierre />
    </div>
  );
}

export default Home;
