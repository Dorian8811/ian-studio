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
    <div id={panelId} role="tabpanel" className={styles.masonry}>
      {cells.map((cell, i) => {
        const { piece } = cell;
        return (
          <div
            key={piece.id}
            className={`${styles.cell} ${cell.hero ? styles.hero : ""} ${cell.lowRes ? styles.lowRes : ""}`}
          >
            <button type="button" className={styles.figure} onClick={() => onOpen(i)}>
              <div className={styles.frame}>
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  width={piece.width}
                  height={piece.height}
                  sizes={
                    cell.hero
                      ? "100vw"
                      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  }
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
