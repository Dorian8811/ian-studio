"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { featured } from "@/data/content";
import { getPiece } from "@/data/portfolio";
import styles from "./Featured.module.css";

export default function Featured() {
  const searchParams = useSearchParams();
  const cat = searchParams?.get("categoria");
  
  if (cat === "gastronomia") {
    return null;
  }

  return (
    <section id="suburban" className={styles.section}>


      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>{featured.eyebrow}</span>
          <span>{featured.eyebrowRight}</span>
        </div>

        <div className={styles.headRow} data-rv>
          <h2 className={styles.heading}>
            {featured.headingA}
            <br />
            <span className={styles.headingItalic}>{featured.headingItalic}</span>
          </h2>
          <div className={styles.keywords}>
            {featured.keywords.map((k) => (
              <span key={k}>{k}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.railWrap}>
        <div className={styles.rail}>
          {featured.rail.map((r) => {
            const piece = getPiece(r.pieceId);
            return (
              <figure key={r.pieceId} className={styles.railItem} style={{ aspectRatio: `${r.width} / 520` }}>
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  fill
                  sizes={`${r.width}px`}
                  style={{
                    objectPosition: r.objectPosition,
                    transform: r.scale !== 1 ? `scale(${r.scale})` : undefined,
                    transformOrigin: r.scaleOrigin || "50% 50%",
                  }}
                />
                <figcaption className={styles.railCaption}>{r.caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText} data-rv>
          <span className="mobile-only">{featured.textoMobile}</span>
          <span className="desktop-only">{featured.texto}</span>
        </p>
        <div className={styles.factList} data-rv>
          {featured.ficha.map((f) => (
            <div key={f.k} className={styles.factRow}>
              <span>{f.k}</span>
              <span>{f.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
