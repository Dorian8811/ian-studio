/** 09 — Planes mensuales. Precios en USD, vigentes julio 2026. */

export const plansMeta = {
  moneda: "USD",
  vigencia: "Precios en USD · Julio 2026",
};

export const plans = [
  {
    id: "basico",
    num: "01",
    name: "Básico",
    price: 175,
    priceLabel: "$175",
    period: "USD / mes",
    recommended: false,
    features: [
      "1 sesión mensual de hasta 2 horas",
      "12 fotografías editadas",
      "3 reels verticales",
      "8 piezas para historias",
      "Plan básico de ideas",
      "1 escenario o ubicación",
    ],
    cta: "Reservar básico",
  },
  {
    id: "avanzado",
    num: "02",
    name: "Avanzado",
    price: 295,
    priceLabel: "$295",
    period: "USD / mes",
    recommended: true,
    features: [
      "1 sesión mensual de hasta 3 horas",
      "24 fotografías editadas",
      "6 reels verticales",
      "12 piezas para historias",
      "Calendario mensual de contenido",
      "Retoque avanzado en 5 fotografías",
    ],
    cta: "Reservar avanzado",
  },
  {
    id: "profesional",
    num: "03",
    name: "Profesional",
    nameShort: "Pro",
    price: 450,
    priceLabel: "$450",
    period: "USD / mes",
    recommended: false,
    features: [
      "2 sesiones mensuales de hasta 3 horas",
      "40 fotografías editadas",
      "10 reels verticales",
      "20 piezas para historias",
      "Dirección creativa y calendario",
      "Retoque avanzado + entrega prioritaria",
    ],
    cta: "Reservar profesional",
  },
];

/** Tabla comparativa: una fila por alcance, una columna por plan. */
export const comparisonRows = [
  { k: "Precio mensual", a: "$175", b: "$295", c: "$450" },
  { k: "Sesiones", a: "1 × 2 h", b: "1 × 3 h", c: "2 × 3 h" },
  { k: "Fotografías editadas", a: "12", b: "24", c: "40" },
  { k: "Reels verticales", a: "3", b: "6", c: "10" },
  { k: "Piezas para historias", a: "8", b: "12", c: "20" },
  { k: "Escenarios", a: "1", b: "Hasta 2", c: "Hasta 3" },
  { k: "Planificación", a: "Ideas básicas", b: "Calendario", c: "Dirección + calendario" },
  { k: "Retoque avanzado", a: "2 fotos", b: "5 fotos", c: "10 fotos" },
];

export default plans;
