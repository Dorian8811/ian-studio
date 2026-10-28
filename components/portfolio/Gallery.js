"use client";

import Image from "next/image";
import { layoutGallery } from "@/lib/gallery-layout";
import { blurFor } from "@/lib/blur";
import styles from "./Gallery.module.css";

/**
 * `animate` escalona la entrada de las piezas (se pasa al cambiar de
 * categoría; la carga inicial no anima). El orden de la cascada es el de
 * la composición, con el retraso topado para que las últimas piezas no
 * esperen de más.
 */
export default function Gallery({ pieces, onOpen, panelId, tabId, animate = false }) {
  if (pieces.length === 0) {
    return (
      <div id={panelId} role="tabpanel" aria-labelledby={tabId} className={styles.empty}>
        Nuevas piezas próximamente en esta categoría.
      </div>
    );
  }

  const cells = layoutGallery(pieces);

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      className={`${styles.masonry} ${animate ? styles.animate : ""}`}
    >
      {cells.map((cell, i) => {
        const { piece } = cell;
        const blur = blurFor(piece.src);
        return (
          <div
            key={piece.id}
            className={`${styles.cell} ${cell.hero ? styles.hero : ""} ${cell.lowRes ? styles.lowRes : ""} ${cell.scaleClass ? styles[cell.scaleClass] : ""} ${piece.orientacion === "vertical" ? styles.vertical : ""}`}
            style={{ "--i": Math.min(i, 8) }}
          >
            <button type="button" className={styles.figure} onClick={() => onOpen(i)}>
              <div className={styles.frame}>
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  width={piece.width}
                  height={piece.height}
                  sizes={
                    cell.scaleClass === "hero"
                      ? "100vw"
                      : cell.scaleClass === "hero-center"
                        ? "(min-width: 1024px) 85vw, 100vw"
                        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  }
                  quality={90}
                  placeholder={blur ? "blur" : "empty"}
                  blurDataURL={blur}
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
