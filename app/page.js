import { Suspense } from "react";
import Nav from "@/components/layout/Nav";
import MotionRoot from "@/components/layout/MotionRoot";
import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import Perfil from "@/components/sections/Perfil";
import Especialidades from "@/components/sections/Especialidades";
import Categorias from "@/components/sections/Categorias";
import Vertical from "@/components/sections/Vertical";
import Featured from "@/components/sections/Featured";
import Edicion from "@/components/sections/Edicion";
import Servicios from "@/components/sections/Servicios";
import Planes from "@/components/sections/Planes";
import Web from "@/components/sections/Web";
import Extras from "@/components/sections/Extras";
import Contacto from "@/components/sections/Contacto";
import { site, siteUrl } from "@/data/site";

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: siteUrl,
    email: site.contact.email.label,
    telephone: `+${site.contact.whatsapp.digits}`,
    areaServed: "Costa Rica",
    image: `${siteUrl}/opengraph-image.jpg`,
  };
  return (
    <script
      type="application/ld+json"
      // Contenido fijo y controlado por el propio sitio — no hay entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <Nav />
      <MotionRoot />
      <main id="main">
        <Hero />
        <Ticker />
        <Perfil />
        <Especialidades />
        <Suspense fallback={null}>
          <Categorias />
        </Suspense>
        <Vertical />
        <Featured />
        <Edicion />
        <Servicios />
        <Planes />
        <Web />
        <Extras />
        <Contacto />
      </main>
    </>
  );
}
