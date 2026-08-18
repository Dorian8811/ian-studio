import Image from "next/image";
import { contacto } from "@/data/content";
import { site } from "@/data/site";
import styles from "./Contacto.module.css";

export default function Contacto() {
  return (
    <section id="contacto" className={styles.section}>
      <div className={`${styles.bgImage} desktop-only-block`}>
        <Image src={contacto.fondo.src} alt="" fill sizes="120vw" style={{ objectPosition: "50% 55%" }} />
      </div>
      <div className={`${styles.bgImage} mobile-only-block`}>
        <Image src={contacto.fondoMobile.src} alt="" fill sizes="120vw" style={{ objectPosition: "50% 50%" }} />
      </div>
      <div className={styles.scrim} />

      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>{contacto.eyebrow}</span>
          <span>{contacto.eyebrowRight}</span>
        </div>

        <h2 className={styles.heading} data-rv>
          {contacto.headingA}
          <br />
          <span className={styles.headingMuted}>{contacto.headingB}</span>
        </h2>

        <div className={styles.contactRow} data-rv>
          <div className={styles.links}>
            <a href={site.contact.whatsapp.href}>
              <span className={styles.linkLabel}>WhatsApp</span>
              <span className={styles.linkValue}>{site.contact.whatsapp.label}</span>
            </a>
            <a href={site.contact.email.href}>
              <span className={styles.linkLabel}>Correo</span>
              <span className={styles.linkValue}>{site.contact.email.label}</span>
            </a>
          </div>
          <a href={site.contact.whatsapp.href} className={styles.ctaButton}>
            {contacto.cta}
            <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)" }}>
              ↗
            </span>
          </a>
        </div>

        <p className={styles.text} data-rv>
          {contacto.texto}
        </p>

        <footer className={styles.footer}>
          <div className={styles.footerBrand}>
            <Image src="/images/logo.png" alt={site.name} width={46} height={38} />
            <div className={styles.footerWordmark}>
              <span>IAN STUDIO</span>
              <span>{site.tagline}</span>
            </div>
          </div>
          <span>
            {site.location} / {site.year}
          </span>
        </footer>
      </div>
    </section>
  );
}
