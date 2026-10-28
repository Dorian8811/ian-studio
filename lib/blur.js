import blurData from "@/data/blur.json";

/**
 * Placeholder borroso (LQIP) de una imagen de `public/images`: mientras la
 * foto real carga se ve su versión de 12 px en vez de una caja negra.
 * `data/blur.json` lo genera `npm run assets`. Si falta, devuelve
 * undefined y el componente cae a `placeholder="empty"`.
 */
export function blurFor(src) {
  return blurData[src];
}
