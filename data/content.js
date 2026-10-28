/**
 * Textos y bloques de las secciones narrativas: 02 Quién soy,
 * 05 Contenido vertical y 06 Serie destacada.
 */

/** 02 — Quién soy */
export const perfil = {
  headingA: "Contenido con",
  headingItalic: "intención",
  headingB: ", no solo imágenes bonitas.",
  bloques: [
    {
      num: "01 / QUIÉN",
      text: "Creador audiovisual enfocado en fotografía, reels y contenido para negocios. Trabajo desde Costa Rica con marcas que quieren verse profesionales sin perder cercanía.",
    },
    {
      num: "02 / CÓMO",
      text: "Transformo ideas en piezas que se sienten reales: dirección, captura y edición en un mismo flujo, con una mirada cercana y auténtica.",
    },
    {
      num: "03 / PARA QUIÉN",
      text: "Restaurantes, cafeterías, tiendas y marcas que necesitan una presencia visual coherente mes a mes, no fotos aisladas.",
    },
    {
      num: "04 / DÓNDE",
      text: "Costa Rica. Producción en locación, estudio o espacios de la marca; traslados fuera de la zona acordada se cotizan aparte.",
    },
  ],
  retrato: {
    src: "/images/food-preparacion-cocina.webp",
    width: 1086,
    height: 1448,
    alt: "Manos cortando cebollín sobre una tabla, en plena preparación de cocina.",
    caption: "Cocina en proceso",
    tag: "CR",
  },
};

/** El ticker de la banda bajo el hero. */
export const tickerItems = [
  "Fotografía",
  "Reels",
  "Edición",
  "Dirección creativa",
  "Contenido mensual",
];

/**
 * Fuentes de un reel, en orden de preferencia: el navegador toma la primera
 * que puede decodificar. AV1 10 bits rinde más calidad por byte; H.264 cubre
 * los dispositivos sin decodificador AV1. Ambas las genera
 * scripts/build-videos.mjs desde los masters de cámara.
 */
const reelSources = (id) => [
  { src: `/videos/${id}.av1.mp4`, type: 'video/mp4; codecs="av01.0.08M.10, mp4a.40.2"' },
  { src: `/videos/${id}.mp4`, type: 'video/mp4; codecs="avc1.640029, mp4a.40.2"' },
];

/**
 * 05 — Contenido vertical.
 * Reels reales en 9:16 (no fotogramas recortados), intercalados por
 * disciplina. El rótulo «Reel 01…» sale de la posición, no del id.
 */
export const verticalSlides = [
  {
    id: "reel-01",
    categoria: "Gastronomía",
    duracion: "0:22",
    type: "video",
    sources: reelSources("reel-01"),
    poster: "/images/reel-01-poster.jpg",
    width: 1080,
    height: 1920,
    objectPosition: "50% 50%",
    alt: "Reel vertical de gastronomía: preparación y emplatado de albóndigas en cocina.",
  },
  {
    id: "reel-03",
    categoria: "Barbería",
    duracion: "0:17",
    type: "video",
    sources: reelSources("reel-03"),
    poster: "/images/reel-03-poster.jpg",
    width: 1080,
    height: 1920,
    objectPosition: "50% 50%",
    alt: "Reel vertical para una barbería: una anfitriona presenta el local y la atención personalizada, con subtítulos en pantalla.",
  },
  {
    id: "reel-04",
    categoria: "Eventos",
    duracion: "0:49",
    type: "video",
    sources: reelSources("reel-04"),
    poster: "/images/reel-04-poster.jpg",
    width: 1080,
    height: 1920,
    objectPosition: "50% 50%",
    alt: "Reel vertical de vida nocturna: barra, banda norteña en vivo, público bailando y celebración de aniversario en un bar.",
  },
  {
    id: "reel-02",
    categoria: "Gastronomía",
    duracion: "0:15",
    type: "video",
    sources: reelSources("reel-02"),
    poster: "/images/reel-02-poster.jpg",
    width: 1080,
    height: 1920,
    objectPosition: "50% 50%",
    alt: "Reel vertical de gastronomía: preparación de mezcla con huevo en cocina.",
  },
  {
    id: "reel-05",
    categoria: "Barbería",
    duracion: "0:23",
    type: "video",
    sources: reelSources("reel-05"),
    poster: "/images/reel-05-poster.jpg",
    width: 1080,
    height: 1920,
    objectPosition: "50% 50%",
    alt: "Reel vertical para una barbería: un barbero habla a cámara sobre los cortes más pedidos del 2026, con subtítulos.",
  },
];

export const verticalNote =
  "Cada pieza se graba y edita en 9:16 desde el guion — no es un horizontal recortado. De 15 s para un plato a casi un minuto para cubrir un evento.";

/**
 * 06 — Serie destacada: «Metal en movimiento».
 * Ensayo narrativo propio, independiente de la galería de la categoría
 * Automotriz del portafolio. Las dos experiencias conviven.
 */
export const featured = {
  eyebrow: "06 — Serie destacada",
  eyebrowRight: "Fotografía automotriz",
  backdrop: "AUTOMOTRIZ",
  headingA: "Metal",
  headingItalic: "en movimiento",
  keywords: ["Velocidad", "Precisión", "Detalle", "Movimiento"],
  texto:
    "Cobertura de encuentros y sesiones automotrices: luz dura, crops cerrados y control de reflejos. El proyecto donde el detalle mecánico manda sobre la composición.",
  textoMobile:
    "Luz dura, crops cerrados y control de reflejos. El detalle mecánico manda sobre la composición.",
  ficha: [
    { k: "Rol", v: "Foto · edición" },
    { k: "Locación", v: "Costa Rica" },
    { k: "Año", v: "2026" },
  ],
  /**
   * Riel horizontal: anchos y crops de la maqueta. Solo piezas de alta
   * resolución — el riel mide 520 px de alto, y un archivo de 384×512 se
   * vería ampliado más del doble en pantallas retina.
   */
  rail: [
    {
      pieceId: "auto-porsche-gt3rs",
      caption: "01 / Pit lane",
      width: 820,
      objectPosition: "50% 52%",
      scale: 1,
    },
    {
      pieceId: "auto-shelby-gt500",
      caption: "02 / Crop extremo",
      width: 340,
      objectPosition: "50% 40%",
      scale: 1.8,
      scaleOrigin: "50% 38%",
    },
    {
      pieceId: "auto-amg-black-series",
      caption: "03 / Frontal",
      width: 640,
      objectPosition: "50% 48%",
      scale: 1,
    },
    {
      pieceId: "auto-bmw-m4-csl",
      caption: "04 / Parrilla",
      width: 600,
      objectPosition: "50% 50%",
      scale: 1,
    },
    {
      pieceId: "auto-mclaren-675lt",
      caption: "05 / Faro",
      width: 392,
      objectPosition: "62% 58%",
      scale: 1,
    },
  ],
};

/** 07 — Edición: comparador antes / después. */
export const edicion = {
  headingA: "La edición es",
  headingItalic: "la mitad",
  headingB: " del trabajo.",
  texto:
    "Corrección de color, limpieza de escena y control de luz. Arrastra el control para comparar el archivo original con la entrega final.",
  ficha: [
    { k: "Color", v: "Cálido / neutro" },
    { k: "Entrega", v: "7 días hábiles" },
    { k: "Ajustes", v: "1 ronda incluida" },
  ],
  antes: "espacio-bano-antes",
  despues: "espacio-bano-despues",
};

/** 12 — Contacto. */
export const contacto = {
  eyebrow: "12 — Hablemos",
  eyebrowRight: "Disponible para 2026",
  headingA: "Tu próxima idea",
  headingB: "puede empezar aquí.",
  texto:
    "Disponible para fotografía, video y contenido mensual para negocios y marcas. Siguiente paso: confirmar plan, fecha y productos.",
  cta: "Crear algo juntos",
  fondo: {
    src: "/images/auto-porsche-gt3rs.webp",
    width: 1448,
    height: 1086,
  },
  fondoMobile: {
    src: "/images/auto-shelby-gt500.webp",
    width: 1086,
    height: 1448,
  },
};

/** 01 — Hero. */
export const hero = {
  eyebrow: "Fotografía · video · contenido",
  index: "01 / Portafolio",
  headingA: "Imágenes",
  headingItalic: "que hablan",
  texto:
    "Fotografía, video vertical y contenido mensual para negocios y marcas personales. Historias reales, imágenes cuidadas.",
  textoMobile:
    "Fotografía, video vertical y contenido mensual. Gastronomía, automotriz, producto y eventos.",
  ctaPrimario: { label: "Ver el trabajo", href: "#categorias" },
  ctaPrimarioMobile: { label: "Ver proyectos", href: "#categorias" },
  ctaSecundario: { label: "Trabajemos juntos", href: "#contacto" },
  disciplinas: ["Gastronomía", "Automotriz", "Perfumería", "Eventos"],
  disciplinasMobile: ["Fotografía", "Video", "Contenido"],
  imagen: {
    src: "/images/auto-mclaren-675lt.webp",
    width: 1086,
    height: 1448,
    alt: "McLaren 675LT en una sesión automotriz en Costa Rica: frontal, faro y splitter de fibra de carbono.",
    objectPosition: "52% 50%",
    objectPositionMobile: "52% 45%",
  },
  imagenSecundaria: {
    src: "/images/food-preparacion-cocina.webp",
    width: 1086,
    height: 1448,
    alt: "Manos cortando cebollín durante una preparación de cocina.",
  },
  caption: "Sesión automotriz · Costa Rica",
};
