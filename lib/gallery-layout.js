/**
 * Composición editorial determinista para la galería del portafolio.
 *
 * Ciclo de 5 posiciones: protagonista a sangre completa, luego un par
 * asimétrico 7/5, luego el mismo par invertido (5/7) para variar el
 * ritmo. Las piezas de baja resolución nunca ocupan un slot protagonista
 * — se degradan siempre al slot angosto ("five"), sin importar su
 * posición en el ciclo. Todo es función pura de (índice, pieza): nada de
 * Math.random().
 */
const CYCLE = ["hero", "seven", "five", "five", "seven"];

const SLOT = {
  hero: { span: 12, aspect: "2.15 / 1" },
  seven: { span: 7, aspect: null },
  five: { span: 5, aspect: null },
};

export function layoutGallery(pieces) {
  return pieces.map((piece, i) => {
    let type = CYCLE[i % CYCLE.length];
    if (piece.resolucion === "baja" && type === "hero") type = "five";
    if (piece.resolucion === "baja") type = "five";

    const slot = SLOT[type];
    const aspect = slot.aspect || (piece.orientacion === "vertical" ? "4 / 5" : "4 / 3");

    return {
      piece,
      index: i,
      number: String(i + 1).padStart(2, "0"),
      type,
      span: slot.span,
      aspect,
      lowRes: piece.resolucion === "baja",
    };
  });
}
