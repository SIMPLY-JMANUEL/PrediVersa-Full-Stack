import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Cta from "../components/Cta";
import Indicadores from "../components/Indicadores";
import Testimonios from "../components/Testimonios";
import Faq from "../components/Faq";
import Cierre from "../components/Cierre";

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Cta />
      <Indicadores />
      <Testimonios />
      <Faq />
      <Cierre />
    </>
  );
}

export default Home;