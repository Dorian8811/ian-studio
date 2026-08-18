/**
 * Arquitectura completa de las seis categorías del portafolio.
 *
 * La visibilidad pública es un dato, no una decisión de componente: para
 * publicar una categoría basta con poner `visible: true` (y que tenga
 * `minPiezas` fotografías reales). Nada más hay que tocar.
 *
 * Estado de lanzamiento — agosto 2026:
 *   todo        visible   selección curada entre disciplinas
 *   gastronomia visible   5 piezas
 *   automotriz  visible   7 piezas
 *   espacios    oculta    solo existen el antes y el después del mismo baño;
 *                         como galería independiente sería contenido
 *                         duplicado. Vive en la sección 07 — Edición.
 *   detras      oculta    1 sola fotografía
 *   contenido   oculta    todavía no hay material propio en 9:16
 */

/** Mínimo de piezas reales para que una categoría pueda mostrarse. */
export const MIN_PIEZAS = 3;

export const categories = [
  {
    id: "todo",
    slug: "todo",
    nombre: "Todo",
    nombreCorto: "Todo",
    descripcion: "Una edición cruzada entre disciplinas.",
    metadato: "Selección del estudio",
    visible: true,
    /** `todo` no es una categoría real: agrega la selección curada. */
    agregada: true,
    portada: null,
  },
  {
    id: "gastronomia",
    slug: "gastronomia",
    nombre: "Gastronomía",
    nombreCorto: "Gastronomía",
    descripcion: "Plato, mesa y detalle",
    metadato: "Plato, mesa y detalle",
    visible: true,
    agregada: false,
    portada: "food-albondigas-plato",
  },
  {
    id: "automotriz",
    slug: "automotriz",
    nombre: "Automotriz",
    nombreCorto: "Automotriz",
    descripcion: "Detalle y movimiento",
    metadato: "Detalle y movimiento",
    visible: true,
    agregada: false,
    portada: "auto-porsche-gt3rs",
  },
  {
    id: "espacios",
    slug: "espacios",
    nombre: "Espacios",
    nombreCorto: "Espacios",
    descripcion: "Ambientes y locales",
    metadato: "Ambientes y locales",
    visible: false,
    agregada: false,
    portada: "espacio-bano-despues",
  },
  {
    id: "detras",
    slug: "detras-de-camara",
    nombre: "Detrás de cámara",
    nombreCorto: "Detrás",
    descripcion: "Proceso, equipo y set",
    metadato: "Proceso, equipo y set",
    visible: false,
    agregada: false,
    portada: "bts-camara-gimbal",
  },
  {
    id: "contenido",
    slug: "contenido",
    nombre: "Contenido mensual",
    nombreCorto: "Contenido",
    descripcion: "Set completo del mes",
    metadato: "Set completo del mes",
    visible: false,
    agregada: false,
    portada: null,
  },
];

export const DEFAULT_CATEGORY = "todo";

export default categories;
