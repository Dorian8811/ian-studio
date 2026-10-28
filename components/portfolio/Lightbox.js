"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { blurFor } from "@/lib/blur";
import styles from "./Lightbox.module.css";

const SIZES = "90vw";
const QUALITY = 92;

/**
 * Visor fullscreen. `items` recibe piezas con { src, width, height, alt,
 * titulo, detalle, anio, resolucion }. Las de resolucion:'baja' nunca se
 * amplían a pantalla completa — quedan contenidas y centradas.
 *
 * Cada foto entra desde el lado hacia el que se avanza (siguiente: desde la
 * derecha; anterior: desde la izquierda), y la anterior y la siguiente se
 * precargan con el mismo `sizes`/`quality`, así el cambio es inmediato.
 */
export default function Lightbox({ items, index, categoryLabel, onClose, onNext, onPrev }) {
  const overlayRef = useRef(null);
  const touchStartX = useRef(null);
  // 1 = hacia adelante, -1 = hacia atrás, 0 = apertura.
  const [direction, setDirection] = useState(0);

  useScrollLock(true);
  useFocusTrap(overlayRef, true);

  const goNext = () => {
    setDirection(1);
    onNext();
  };
  const goPrev = () => {
    setDirection(-1);
    onPrev();
  };

  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") {
        setDirection(1);
        onNext();
      } else if (e.key === "ArrowLeft") {
        setDirection(-1);
        onPrev();
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [onClose, onNext, onPrev]);

  if (index < 0 || !items[index]) return null;
  const piece = items[index];
  const lowRes = piece.resolucion === "baja";
  const blur = blurFor(piece.src);

  const neighbors =
    items.length > 1
      ? [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]]
      : [];

  const onPointerDown = (e) => {
    if (!e.isPrimary) return;
    touchStartX.current = e.clientX;
  };

  const onPointerUp = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 42) return;
    if (dx < 0) goNext();
    else goPrev();
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
      onPointerCancel={() => {
        touchStartX.current = null;
      }}
    >
      <div className={styles.topBar}>
        <span className={styles.category}>{categoryLabel}</span>
        <span className={styles.counter} aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar visor">
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className={styles.stage}>
        {items.length > 1 && (
          <button
            type="button"
            className={`${styles.navBtn} ${styles.prev}`}
            onClick={goPrev}
            aria-label="Foto anterior"
          >
            <Icon name="chevron-left" size={20} />
          </button>
        )}

        <div
          key={piece.id}
          className={`${styles.frame} ${lowRes ? styles.lowRes : ""}`}
          data-direction={direction}
        >
          <Image
            src={piece.src}
            alt={piece.alt}
            fill
            sizes={SIZES}
            quality={QUALITY}
            loading="eager"
            placeholder={blur ? "blur" : "empty"}
            blurDataURL={blur}
          />
        </div>

        {items.length > 1 && (
          <button
            type="button"
            className={`${styles.navBtn} ${styles.next}`}
            onClick={goNext}
            aria-label="Foto siguiente"
          >
            <Icon name="chevron-right" size={20} />
          </button>
        )}
      </div>

      {/* Precarga de vecinas: mismo src/sizes/quality que al mostrarlas. */}
      <div className={styles.preload} aria-hidden="true">
        {neighbors.map((n) => (
          <Image key={n.id} src={n.src} alt="" width={n.width} height={n.height} sizes={SIZES} quality={QUALITY} loading="eager" />
        ))}
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
