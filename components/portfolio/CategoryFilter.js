"use client";

import styles from "./CategoryFilter.module.css";

export default function CategoryFilter({ categories, active, onSelect }) {
  const onKeyDown = (e, i) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = categories[(i + dir + categories.length) % categories.length];
    onSelect(next.slug);
    requestAnimationFrame(() => {
      document.getElementById(`tab-${next.slug}`)?.focus();
    });
  };

  return (
    <div className={styles.list} role="tablist" aria-label="Filtrar por categoría">
      {categories.map((cat, i) => (
        <button
          key={cat.slug}
          id={`tab-${cat.slug}`}
          type="button"
          role="tab"
          aria-selected={active === cat.slug}
          aria-controls={`panel-${cat.slug}`}
          tabIndex={active === cat.slug ? 0 : -1}
          className={styles.chip}
          onClick={() => onSelect(cat.slug)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {cat.nombreCorto}
        </button>
      ))}
    </div>
  );
}
