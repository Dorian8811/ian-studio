import Image from "next/image";
import { perfil } from "@/data/content";
import { site } from "@/data/site";
import styles from "./Perfil.module.css";

export default function Perfil() {
  return (
    <section id="perfil" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>02 — Quién soy</span>
          <span>{site.author}</span>
        </div>

        <div className={styles.grid}>
          <div>
            <h2 className={styles.heading} data-rv>
              {perfil.headingA} <span className={styles.headingItalic}>{perfil.headingItalic}</span>
              {perfil.headingB}
            </h2>

            <div className={styles.blocks}>
              {perfil.bloques.map((b) => (
                <div key={b.num} data-rv>
                  <div className={styles.blockNum}>{b.num}</div>
                  <p className={styles.blockText}>{b.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.portrait} data-par="0.06" data-rv>
            <div className={styles.portraitFrame}>
              <Image
                src={perfil.retrato.src}
                alt={perfil.retrato.alt}
                fill
                sizes="(min-width: 1024px) 380px, 100vw"
              />
            </div>
            <div className={styles.portraitCaption}>
              <span>{perfil.retrato.caption}</span>
              <span>{perfil.retrato.tag}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
