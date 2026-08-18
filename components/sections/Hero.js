import Image from "next/image";
import { hero } from "@/data/content";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.media}>
        <div className={styles.driftWrap}>
          <Image
            src={hero.imagen.src}
            alt={hero.imagen.alt}
            fill
            sizes="(min-width: 1024px) 51vw, 100vw"
            style={{ objectPosition: hero.imagen.objectPosition }}
            priority
            fetchPriority="high"
          />
        </div>
        <div className={styles.scrimH} />
        <div className={styles.secondary}>
          <Image
            src={hero.imagenSecundaria.src}
            alt={hero.imagenSecundaria.alt}
            fill
            sizes="140px"
          />
        </div>
        <div className={styles.caption} data-rv>
          <span className={styles.captionLine} />
          {hero.caption}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrowRow} data-rv>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            {hero.eyebrow}
          </span>
          <span className={styles.index}>{hero.index}</span>
        </div>

        <h1 className={styles.heading}>
          <span data-rv>{hero.headingA}</span>
          <span className={styles.headingItalic} data-rv>
            {hero.headingItalic}
          </span>
        </h1>

        <p className={styles.text} data-rv>
          <span className="mobile-only">{hero.textoMobile}</span>
          <span className="desktop-only">{hero.texto}</span>
        </p>

        <div className={styles.ctas} data-rv>
          <a href={hero.ctaPrimario.href} className={styles.ctaPrimary}>
            <span className="mobile-only">{hero.ctaPrimarioMobile.label}</span>
            <span className="desktop-only">{hero.ctaPrimario.label}</span>
            <span className="desktop-only" aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
              ↓
            </span>
          </a>
          <a href={hero.ctaSecundario.href} className={styles.ctaSecondary}>
            {hero.ctaSecundario.label}
          </a>
        </div>

        <div className={styles.footRow} data-rv>
          <div className={styles.disciplines}>
            <span className="desktop-only-inline">
              {hero.disciplinas.map((d) => (
                <span key={d} style={{ marginRight: 26 }}>
                  {d}
                </span>
              ))}
            </span>
            <span className="mobile-only-inline">
              {hero.disciplinasMobile.map((d) => (
                <span key={d} style={{ marginRight: 14 }}>
                  {d}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cue} aria-hidden="true" />
    </section>
  );
}
