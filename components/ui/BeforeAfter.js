"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import styles from "./BeforeAfter.module.css";

/**
 * Comparador antes/después: arrastre directo (pointer capture), touch,
 * y control por teclado (flechas, Home/End) sobre el handle accesible.
 */
export default function BeforeAfter({ before, after, initial = 50, labels = { before: "Antes", after: "Después" } }) {
  const [value, setValue] = useState(initial);
  const frameRef = useRef(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setValue(pct);
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setValue((v) => Math.max(2, v - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setValue((v) => Math.min(98, v + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setValue(2);
    } else if (e.key === "End") {
      e.preventDefault();
      setValue(98);
    }
  };

  return (
    <div
      ref={frameRef}
      className={styles.frame}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 640px, 100vw" />
      <div className={styles.before} style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 640px, 100vw" />
      </div>

      <div className={styles.handle} style={{ left: `${value}%` }}>
        <div
          className={styles.knob}
          role="slider"
          tabIndex={0}
          aria-label="Comparar antes y después"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(value)}
          onKeyDown={onKeyDown}
        >
          <span>‹</span>
          <span>›</span>
        </div>
      </div>

      <span className={`${styles.label} ${styles.labelBefore}`}>{labels.before}</span>
      <span className={`${styles.label} ${styles.labelAfter}`}>{labels.after}</span>
    </div>
  );
}
