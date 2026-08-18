"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories, DEFAULT_CATEGORY } from "@/data/categories";
import { curatedSelection, piecesByCategory } from "@/data/portfolio";
import CategoryFilter from "@/components/portfolio/CategoryFilter";
import Gallery from "@/components/portfolio/Gallery";
import Lightbox from "@/components/portfolio/Lightbox";
import styles from "./Categorias.module.css";

const visibleCategories = categories.filter((c) => c.visible);
const visibleSlugs = new Set(visibleCategories.map((c) => c.slug));

function resolveSlug(param) {
  if (param && visibleSlugs.has(param)) return param;
  return DEFAULT_CATEGORY;
}

function piecesFor(slug) {
  if (slug === "todo") return curatedSelection();
  return piecesByCategory(slug);
}

export default function Categorias() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // La categoría activa se deriva directamente de la URL — sin estado
  // duplicado que pueda desincronizarse en back/forward.
  const active = resolveSlug(searchParams.get("categoria"));

  // El lightbox recuerda para qué categoría se abrió. Si `active` cambia
  // (chip, back/forward) deja de coincidir y el lightbox se cierra solo,
  // como estado derivado — sin efectos ni refs durante el render.
  const [lightbox, setLightbox] = useState({ category: null, index: -1 });
  const isLightboxOpen = lightbox.category === active && lightbox.index >= 0;

  const selectCategory = useCallback(
    (slug) => {
      if (slug === active) return;
      const qs = slug === DEFAULT_CATEGORY ? "" : `?categoria=${slug}`;
      router.push(`${pathname}${qs}`, { scroll: false });
    },
    [active, pathname, router]
  );

  const activeCategory = useMemo(
    () => visibleCategories.find((c) => c.slug === active) || visibleCategories[0],
    [active]
  );

  const pieces = useMemo(() => piecesFor(active), [active]);

  const openLightbox = useCallback((i) => setLightbox({ category: active, index: i }), [active]);
  const closeLightbox = useCallback(() => setLightbox({ category: null, index: -1 }), []);
  const nextLightbox = useCallback(
    () => setLightbox((s) => ({ ...s, index: (s.index + 1) % pieces.length })),
    [pieces.length]
  );
  const prevLightbox = useCallback(
    () => setLightbox((s) => ({ ...s, index: (s.index - 1 + pieces.length) % pieces.length })),
    [pieces.length]
  );

  return (
    <section id="categorias" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.eyebrowRow} data-rv>
          <span>04 — Categorías</span>
          <span>{activeCategory.nombreCorto}</span>
        </div>

        <div className={styles.headRow} data-rv>
          <h2 className={styles.heading}>
            El trabajo,
            <br />
            <span className={styles.headingItalic}>por categoría</span>
          </h2>
          <p className={styles.subtext}>
            Sin nombres de marca: cada categoría agrupa las piezas por tipo de trabajo y abre su
            propia galería.
          </p>
        </div>

        <CategoryFilter categories={visibleCategories} active={active} onSelect={selectCategory} />

        <Gallery pieces={pieces} onOpen={openLightbox} panelId={`panel-${active}`} />
      </div>

      {isLightboxOpen && (
        <Lightbox
          items={pieces}
          index={lightbox.index}
          categoryLabel={activeCategory.nombre}
          onClose={closeLightbox}
          onNext={nextLightbox}
          onPrev={prevLightbox}
        />
      )}
    </section>
  );
}
