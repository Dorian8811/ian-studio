"use client";

import { useState } from "react";
import Image from "next/image";
import { services, serviceNote } from "@/data/services";
import styles from "./Servicios.module.css";

export default function Servicios() {
  const [open, setOpen] = useState(0);

  return (
    <section id="servicios" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>08 — Servicios</span>
          <span>Una presencia visual coherente</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.mediaCol} data-rv>
            <div className={styles.mediaFrame}>
              {services.map((s, i) => (
                <div key={s.num} className={`${styles.mediaImg} ${open === i ? styles.active : ""}`}>
                  <Image src={s.image} alt={s.alt} fill sizes="(min-width: 1024px) 40vw, 0px" />
                </div>
              ))}
            </div>
            <p className={styles.mediaNote}>{serviceNote}</p>
          </div>

          <div>
            {services.map((s, i) => {
              const isOpen = open === i;
              return (
                <div key={s.num} className={`${styles.row} ${isOpen ? styles.open : ""}`} data-rv>
                  <button
                    type="button"
                    className={styles.rowHead}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`svc-panel-${s.num}`}
                  >
                    <span className={styles.rowNum}>{s.num}</span>
                    <h3 className={styles.rowName}>{s.name}</h3>
                    <span className={styles.rowPlus} aria-hidden="true">
                      +
                    </span>
                  </button>
                  <div id={`svc-panel-${s.num}`} className={styles.panel}>
                    <p className={styles.panelText}>{s.desc}</p>
                    <div className={styles.tags}>
                      {s.tags.map((t) => (
                        <span key={t} className={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className={styles.mobilePreview}>
                      <Image src={s.image} alt={s.alt} fill sizes="100vw" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
