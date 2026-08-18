"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import styles from "./Lightbox.module.css";

/**
 * Visor fullscreen. `items` recibe piezas con { src, width, height, alt,
 * titulo, detalle, anio, resolucion }. Las de resolucion:'baja' nunca se
 * amplían a pantalla completa — quedan contenidas y centradas.
 */
export default function Lightbox({ items, index, categoryLabel, onClose, onNext, onPrev }) {
  const overlayRef = useRef(null);
  const touchStartX = useRef(null);

  useScrollLock(true);
  useFocusTrap(overlayRef, true);

  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [onClose, onNext, onPrev]);

  if (index < 0 || !items[index]) return null;
  const piece = items[index];
  const lowRes = piece.resolucion === "baja";

  const onPointerDown = (e) => {
    touchStartX.current = e.clientX;
  };

  const onPointerUp = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 42) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${piece.titulo} — visor de imagen ${index + 1} de ${items.length}`}
      tabIndex={-1}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className={styles.topBar}>
        <span className={styles.category}>{categoryLabel}</span>
        <span className={styles.counter}>
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar visor">
          ✕
        </button>
      </div>

      <div className={styles.stage}>
        {items.length > 1 && (
          <button
            type="button"
            className={`${styles.navBtn} ${styles.prev}`}
            onClick={onPrev}
            aria-label="Foto anterior"
          >
            ‹
          </button>
        )}

        <div className={`${styles.frame} ${lowRes ? styles.lowRes : ""}`}>
          <Image
            src={piece.src}
            alt={piece.alt}
            fill
            sizes="90vw"
            quality={92}
            priority
          />
        </div>

        {items.length > 1 && (
          <button
            type="button"
            className={`${styles.navBtn} ${styles.next}`}
            onClick={onNext}
            aria-label="Foto siguiente"
          >
            ›
          </button>
        )}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.meta}>{piece.titulo}</div>
        <div className={styles.metaSub}>
          {piece.detalle} · {piece.ubicacion} · {piece.anio}
        </div>
      </div>
    </div>
  );
}
