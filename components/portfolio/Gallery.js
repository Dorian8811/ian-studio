"use client";

import Image from "next/image";
import { layoutGallery } from "@/lib/gallery-layout";
import styles from "./Gallery.module.css";

export default function Gallery({ pieces, onOpen, panelId }) {
  if (pieces.length === 0) {
    return (
      <div id={panelId} role="tabpanel" className={styles.empty}>
        Nuevas piezas próximamente en esta categoría.
      </div>
    );
  }

  const cells = layoutGallery(pieces);

  return (
    <div id={panelId} role="tabpanel" className={styles.grid}>
      {cells.map((cell, i) => {
        const { piece } = cell;
        return (
          <div
            key={piece.id}
            className={`${styles.cell} span-${cell.span} ${cell.lowRes ? styles.lowRes : ""}`}
          >
            <button type="button" className={styles.figure} onClick={() => onOpen(i)}>
              <div className={styles.frame} style={{ aspectRatio: cell.aspect }}>
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  fill
                  sizes={cell.span >= 12 ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
                  quality={90}
                />
                <div className={styles.scrim} />
                <span className={styles.number}>{cell.number}</span>
              </div>
              <div className={styles.caption}>
                <span className={styles.title}>{piece.titulo}</span>
                <span className={styles.meta}>
                  {piece.detalle} · {piece.anio}
                </span>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
