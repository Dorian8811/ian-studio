/**
 * Composición editorial determinista para la galería del portafolio.
 *
 * Cada fotografía se muestra en su proporción real — nada de recortes ni
 * zoom forzado a una caja fija. La primera pieza (y luego cada seis) rompe
 * a un protagonista a todo el ancho; el resto fluye en columnas tipo
 * masonry que el propio navegador balancea por altura, así que el ritmo
 * "armonioso" sale de la composición real de las fotos, no de una regla
 * de recorte. Determinista: función pura de (índice, pieza), nada de
 * Math.random().
 */
const HERO_EVERY = 6;

export function layoutGallery(pieces) {
  return pieces.map((piece, i) => {
    return {
      piece,
      index: i,
      number: String(i + 1).padStart(2, "0"),
      hero: false,
      scaleClass: "",
      lowRes: piece.resolucion === "baja",
    };
  });
}
