"use client";

import { useState } from "react";
import Image from "next/image";
import { specialties } from "@/data/specialties";
import styles from "./Especialidades.module.css";

export default function Especialidades() {
  const [active, setActive] = useState(0);
  const current = specialties[active];

  return (
    <section id="especialidades" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>03 — Especialidades</span>
          <span>Cuatro disciplinas, un mismo flujo</span>
        </div>

        {/* Desktop: lista + imagen sticky con crossfade */}
        <div className={styles.desktopGrid}>
          <div>
            {specialties.map((s, i) => (
              <button
                key={s.num}
                type="button"
                className={`${styles.row} ${active === i ? styles.active : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-current={active === i ? "true" : undefined}
              >
                <span className={styles.rowNum}>{s.num}</span>
                <span className={styles.rowName}>{s.name}</span>
                <span className={styles.rowDesc}>{s.desc}</span>
              </button>
            ))}
          </div>

          <div className={styles.stickyMedia}>
            {specialties.map((s, i) => (
              <div key={s.num} className={`${styles.stickyImg} ${active === i ? styles.active : ""}`}>
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 0px"
                  style={{ objectFit: "cover", objectPosition: s.objectPosition }}
                />
              </div>
            ))}
            <div className={styles.stickyLabel}>
              <span>{current.name}</span>
              <span>{current.num}</span>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: pares foto + título, sin hover */}
        <div className={styles.mobileList}>
          {specialties.map((s) => (
            <div key={s.num} className={styles.mobileItem} data-rv>
              <div className={styles.mobileFrame}>
                <Image src={s.image} alt={s.alt} fill sizes="100vw" style={{ objectPosition: s.objectPosition }} />
                <div className={styles.mobileLabel}>
                  <span className={styles.mobileNum}>{s.num}</span>
                  <span className={styles.mobileName}>{s.name}</span>
                </div>
              </div>
              <p className={styles.mobileDesc}>{s.descMobile}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
