/**
 * Ian Studio — generación de assets de producción.
 *
 * Toma el material aprobado desde `_design/` (que NO se publica entero) y
 * escribe únicamente lo necesario en `public/` y `app/`, con nombres
 * normalizados a minusculas-con-guiones para evitar sorpresas entre
 * Windows (case-insensitive) y Linux/Vercel (case-sensitive).
 *
 *   node scripts/build-assets.mjs
 *
 * Es idempotente: se puede ejecutar tantas veces como haga falta.
 *
 * Calidad: `public/images` guarda la FUENTE que next/image convierte a
 * AVIF/WebP en cada tamaño. El visitante nunca descarga este archivo, así
 * que aquí no se ahorra peso a costa de calidad:
 *
 *   lossless  master PNG sin pérdida → WebP lossless (píxel idéntico, ~30 %
 *             más liviano que el PNG).
 *   camera    JPEG de cámara (Canon R50, hasta 6000 px) → lado largo 3840
 *             (el `deviceSize` máximo de next/image), JPEG q95 4:4:4.
 *   copy      sin master disponible: se copian los bytes originales tal
 *             cual. Re-encodarlos solo sumaría una generación de pérdida.
 *
 * Nada de upscale artificial: un archivo de baja resolución se marca como
 * `resolucion: "baja"` en data/portfolio.js y el layout lo limita.
 *
 * Las fotos de Perfumería se añadieron ya optimizadas (1600 px desde
 * capturas de 3368×6000) y no tienen master en el Drive; no pasan por aquí.
 */

import { mkdir, readdir, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const DESIGN_IMG = path.join(ROOT, "_design", "img");
const UPLOADS = path.join(ROOT, "_design", "uploads");
/** Masters del Drive de Ian (carpeta compartida, ver README). */
const DRIVE = path.join(UPLOADS, "drive");
const OUT_IMG = path.join(ROOT, "public", "images");
const OUT_APP = path.join(ROOT, "app");

const MAX_EDGE = 3840;

const drive = (f) => path.join(DRIVE, f);
const design = (f) => path.join(DESIGN_IMG, f);

/** Fotografías aprobadas: origen -> nombre de producción y modo. */
const PHOTOS = [
  // Automotriz
  { from: drive("img-1-automotriz.png"), to: "auto-porsche-gt3rs.webp", mode: "lossless" },
  { from: drive("img-2-automotriz.png"), to: "auto-shelby-gt500.webp", mode: "lossless" },
  { from: drive("img-3-automotriz.png"), to: "auto-mclaren-675lt.webp", mode: "lossless" },
  { from: design("suburban-1.jpg"), to: "auto-amg-black-series.jpg", mode: "copy" },
  { from: design("suburban-2.jpg"), to: "auto-bmw-m4-csl.jpg", mode: "copy" },
  { from: design("suburban-3.jpg"), to: "auto-ferrari-sf90.jpg", mode: "copy" },
  { from: design("suburban-4.jpg"), to: "auto-amg-gt-rojo.jpg", mode: "copy" },
  // Gastronomía
  { from: drive("img-1-gastronomico.png"), to: "food-spaghetti-albondigas.webp", mode: "lossless" },
  { from: drive("img-2-gastronomico.png"), to: "food-preparacion-cocina.webp", mode: "lossless" },
  { from: drive("img-3-gastronomico.png"), to: "food-bandeja-carne-mechada.webp", mode: "lossless" },
  { from: drive("img-4-gastronomico.jpg"), to: "food-albondigas-plato.jpg", mode: "camera" },
  { from: drive("img-5-gastronomia.png"), to: "food-lasana-vino.webp", mode: "lossless" },
  // Eventos
  { from: drive("img-6322.jpg"), to: "eventos-escenario-humo.jpg", mode: "camera" },
  { from: drive("img-6324.jpg"), to: "eventos-escenario-rojo.jpg", mode: "camera" },
  { from: drive("img-6326.png"), to: "eventos-guitarra-acustica.webp", mode: "lossless" },
  // Espacios
  { from: design("edit-before.jpg"), to: "espacio-bano-antes.jpg", mode: "copy" },
  { from: design("edit-after.jpg"), to: "espacio-bano-despues.jpg", mode: "copy" },
  // Detrás de cámara
  { from: design("services-a.jpg"), to: "bts-camara-gimbal.jpg", mode: "copy" },
];

/** El logo se usa en cabecera y pie, siempre sobre negro. */
const LOGO_SRC = path.join(DESIGN_IMG, "logo.png");

/** Master cuadrado 1254x1254 del logo, fuente de los iconos. */
const ICON_SRC = path.join(UPLOADS, "pasted-1787022154039-0.png");

/** McLaren 675LT sin pérdida: fuente del crop de Open Graph. */
const OG_SRC = drive("img-3-automotriz.png");

const log = (...a) => console.log("  ", ...a);

async function writePhoto({ from, to, mode }) {
  const dst = path.join(OUT_IMG, to);

  if (mode === "copy") {
    await copyFile(from, dst);
    return;
  }

  // `.rotate()` aplica la orientación EXIF antes de soltar la metadata.
  const img = sharp(from).rotate();

  if (mode === "lossless") {
    await img.webp({ lossless: true, effort: 6 }).toFile(dst);
    return;
  }

  // camera
  await img
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true, kernel: "lanczos3" })
    .jpeg({ quality: 95, progressive: true, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(dst);
}

const FAVICON_SIZES = [16, 32, 48];

/**
 * favicon.ico con PNG embebidos (formato ICO admitido desde Windows Vista y
 * por todos los navegadores). Navegadores y buscadores piden /favicon.ico
 * aunque exista icon.png. A 16–48 px el margen negro del master se come el
 * monograma, así que se recorta al contenido y se deja un margen de ~10 %.
 */
async function writeFavicon(from, to) {
  const trimmed = await sharp(from).trim({ background: "#000000", threshold: 24 }).toBuffer({ resolveWithObject: true });
  const side = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 1.2);
  const square = await sharp(trimmed.data)
    .resize(side, side, { fit: "contain", background: "#000000" })
    .png()
    .toBuffer();

  // Cada PNG embebido tiene que ser RGBA: el lector de ICO (el de Next
  // incluido) rechaza PNG RGB, y el master sobre negro no trae canal alfa.
  const images = await Promise.all(
    FAVICON_SIZES.map((s) => sharp(square).resize(s, s).ensureAlpha().png({ compressionLevel: 9 }).toBuffer()),
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // 1 = icono
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const entries = images.map((png, i) => {
    const s = FAVICON_SIZES[i];
    const e = Buffer.alloc(16);
    e.writeUInt8(s, 0); // ancho
    e.writeUInt8(s, 1); // alto
    e.writeUInt8(0, 2); // sin paleta
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits por píxel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });

  await writeFile(to, Buffer.concat([header, ...entries, ...images]));
}

async function main() {
  await mkdir(OUT_IMG, { recursive: true });

  // ---------------------------------------------------------------- fotos
  console.log("\nFotografías → public/images");
  for (const photo of PHOTOS) {
    if (!existsSync(photo.from)) {
      log(`! falta ${path.relative(ROOT, photo.from)} — se omite ${photo.to}`);
      continue;
    }
    await writePhoto(photo);
    const src = await sharp(photo.from).metadata();
    const out = await sharp(path.join(OUT_IMG, photo.to)).metadata();
    log(`${photo.mode.padEnd(8)} ${path.basename(photo.from)} (${src.width}×${src.height}) → ${photo.to} (${out.width}×${out.height})`);
  }

  // ----------------------------------------------------------------- logo
  console.log("\nLogo");
  await sharp(LOGO_SRC).png({ compressionLevel: 9 }).toFile(path.join(OUT_IMG, "logo.png"));
  log("logo.png (transparente, solo sobre negro)");

  // ---------------------------------------------------------------- iconos
  console.log("\nIconos");
  const iconSource = existsSync(ICON_SRC) ? ICON_SRC : LOGO_SRC;
  await sharp(iconSource).resize(512, 512, { fit: "cover" }).png({ compressionLevel: 9 }).toFile(path.join(OUT_APP, "icon.png"));
  log("app/icon.png 512×512");
  await sharp(iconSource).resize(180, 180, { fit: "cover" }).png({ compressionLevel: 9 }).toFile(path.join(OUT_APP, "apple-icon.png"));
  log("app/apple-icon.png 180×180");
  await writeFavicon(iconSource, path.join(OUT_APP, "favicon.ico"));
  log(`app/favicon.ico ${FAVICON_SIZES.join("/")} px`);

  // ------------------------------------------------------------ open graph
  // Crop horizontal fuerte del McLaren 675LT: frontal, faro y splitter de
  // carbono. El original vertical NO se sobrescribe.
  console.log("\nOpen Graph");
  const ogSrc = existsSync(OG_SRC) ? OG_SRC : design("auto-3.jpg");
  const ogMeta = await sharp(ogSrc).metadata();
  const bandH = Math.round(ogMeta.width / (1200 / 630)); // banda con el ratio de OG
  const bandTop = Math.min(Math.max(0, 660), ogMeta.height - bandH);

  const scrim = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
       <defs>
         <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
           <stop offset="0%"   stop-color="#000" stop-opacity="0.92"/>
           <stop offset="38%"  stop-color="#000" stop-opacity="0.45"/>
           <stop offset="72%"  stop-color="#000" stop-opacity="0"/>
         </linearGradient>
         <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
           <stop offset="0%"   stop-color="#000" stop-opacity="0.55"/>
           <stop offset="46%"  stop-color="#000" stop-opacity="0"/>
         </linearGradient>
       </defs>
       <rect width="1200" height="630" fill="url(#g)"/>
       <rect width="1200" height="630" fill="url(#s)"/>
       <rect x="0" y="628" width="1200" height="2" fill="#3b5bd4"/>
     </svg>`
  );

  const logoBadge = await sharp(LOGO_SRC).resize({ height: 96 }).png().toBuffer();

  await sharp(ogSrc)
    .extract({ left: 0, top: bandTop, width: ogMeta.width, height: bandH })
    .resize(1200, 630, { fit: "cover", kernel: "lanczos3" })
    .composite([
      { input: scrim, top: 0, left: 0 },
      { input: logoBadge, top: 630 - 96 - 56, left: 64 },
    ])
    .jpeg({ quality: 92, progressive: true, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(OUT_APP, "opengraph-image.jpg"));
  log(`app/opengraph-image.jpg 1200×630 (banda ${ogMeta.width}×${bandH} desde y=${bandTop})`);

  // ------------------------------------------------------- inventario JSON
  const files = (await readdir(OUT_IMG)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  const inventory = [];
  for (const f of files) {
    const m = await sharp(path.join(OUT_IMG, f)).metadata();
    inventory.push({ file: f, width: m.width, height: m.height });
  }
  await writeFile(path.join(ROOT, "scripts", "image-inventory.json"), JSON.stringify(inventory, null, 2) + "\n", "utf8");

  // -------------------------------------------------- placeholders (LQIP)
  // 12 px de ancho en WebP: ~150 bytes por foto. next/image lo amplía con
  // desenfoque mientras carga la imagen real. El logo no lo necesita.
  const blur = {};
  for (const f of files) {
    if (f === "logo.png") continue;
    const buf = await sharp(path.join(OUT_IMG, f)).resize({ width: 12 }).webp({ quality: 40 }).toBuffer();
    blur[`/images/${f}`] = `data:image/webp;base64,${buf.toString("base64")}`;
  }
  await writeFile(path.join(ROOT, "data", "blur.json"), JSON.stringify(blur, null, 2) + "\n", "utf8");
  console.log(`\nPlaceholders: data/blur.json (${Object.keys(blur).length} imágenes)`);

  console.log("\nInventario:");
  for (const i of inventory) console.log(`   ${i.file.padEnd(36)} ${i.width}×${i.height}`);
  console.log("\nListo.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
