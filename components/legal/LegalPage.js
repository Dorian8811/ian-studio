import Image from "next/image";
import Link from "next/link";
import { actualizado, legalLinks } from "@/data/legal";
import { site } from "@/data/site";
import styles from "./LegalPage.module.css";

const pad = (n) => String(n).padStart(2, "0");

/** app/opengraph-image.jpg, 1200×630 (scripts/build-assets.mjs). */
const OG_IMAGE = { url: "/opengraph-image.jpg", width: 1200, height: 630, type: "image/jpeg" };

/**
 * Metadata de cada página legal. El layout raíz fija canonical "/" y un
 * openGraph de la portada; Next reemplaza esos objetos enteros (no los
 * fusiona), así que aquí van completos para no heredar la URL del inicio.
 * Al redefinir openGraph también se pierde la imagen por archivo de la
 * raíz, por eso se declara a mano.
 */
export function legalMetadata(doc) {
  return {
    title: doc.metaTitle,
    description: doc.metaDescription,
    alternates: { canonical: doc.slug },
    openGraph: {
      type: "website",
      locale: "es_CR",
      url: doc.slug,
      siteName: site.shortTitle,
      title: `${doc.metaTitle} — ${site.shortTitle}`,
      description: doc.metaDescription,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.metaTitle} — ${site.shortTitle}`,
      description: doc.metaDescription,
      images: [OG_IMAGE.url],
    },
  };
}

/**
 * Plantilla de /privacidad y /terminos. Página de lectura: sin la
 * navegación por anclas de la landing (que aquí no tendría a dónde ir),
 * solo marca y vuelta al inicio. El contenido viene de `data/legal.js`.
 */
export default function LegalPage({ doc }) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link href="/" className={styles.brand}>
            <Image src="/images/logo.png" alt="" width={94} height={77} loading="eager" />
            <span className={styles.wordmark}>IAN STUDIO</span>
          </Link>
          <Link href="/" className={styles.back}>
            Volver al inicio
          </Link>
        </div>
      </header>

      <main id="main" className={styles.main}>
        <span className={styles.eyebrow}>{doc.eyebrow}</span>
        <h1 className={styles.heading}>
          {doc.headingA} <span className={styles.headingItalic}>{doc.headingItalic}</span>
        </h1>
        <p className={styles.updated}>
          Última actualización: <time dateTime={actualizado.iso}>{actualizado.label}</time>
        </p>
        <p className={styles.intro}>{doc.intro}</p>

        {doc.secciones.map((s, i) => (
          <section key={s.titulo} className={styles.section} aria-labelledby={`s-${i + 1}`}>
            <h2 id={`s-${i + 1}`} className={styles.sectionTitle}>
              <span className={styles.num}>{pad(i + 1)}</span>
              {s.titulo}
            </h2>
            {s.parrafos?.map((p) => (
              <p key={p} className={styles.text}>
                {p}
              </p>
            ))}
            {s.lista && (
              <ul className={styles.list}>
                {s.lista.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {s.contacto && (
              <ul className={styles.contact}>
                <li>
                  <span className={styles.contactLabel}>Correo</span>
                  <a href={site.contact.email.href}>{site.contact.email.label}</a>
                </li>
                <li>
                  <span className={styles.contactLabel}>WhatsApp</span>
                  <a href={site.contact.whatsapp.href}>{site.contact.whatsapp.label}</a>
                </li>
                {site.contact.instagram && (
                  <li>
                    <span className={styles.contactLabel}>Instagram</span>
                    <a href={site.contact.instagram.href} target="_blank" rel="noopener noreferrer">
                      {site.contact.instagram.label}
                    </a>
                  </li>
                )}
              </ul>
            )}
          </section>
        ))}

        <footer className={styles.footer}>
          <nav aria-label="Legal" className={styles.footerLinks}>
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} aria-current={l.href === doc.slug ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
            <Link href="/">Inicio</Link>
          </nav>
          <span>
            © {site.year} {site.name} · {site.location}
          </span>
        </footer>
      </main>
    </>
  );
}
