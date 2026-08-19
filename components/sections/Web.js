"use client";

import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Web.module.css";

export default function Web() {
  useReveal();
  return (
    <section id="web" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>10 — Diseño Web</span>
          <span>Presencia Digital</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.textContent} data-rv>
            <h2 className={styles.heading}>
              Presencia <br />
              <span className={styles.italic}>digital a la medida.</span>
            </h2>
            <p className={styles.bodyText}>
              No solo imágenes. Diseñamos y desarrollamos páginas web fluidas, rápidas y optimizadas. 
              Creamos experiencias digitales de alta gama que convierten tu portafolio y contenido en una herramienta 
              de ventas profesional.
            </p>
            <div className={styles.tags}>
              <span className={styles.tag}>Diseño UX/UI</span>
              <span className={styles.tag}>Desarrollo Web</span>
              <span className={styles.tag}>Portafolios</span>
              <span className={styles.tag}>Catálogos</span>
            </div>
          </div>

          <div className={styles.imageWrap} data-rv>
            <Image
              src="/images/food-preparacion-cocina.jpg"
              alt="Construcción digital y desarrollo web"
              fill
              className={styles.image}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
