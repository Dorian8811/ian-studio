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
 */

import { mkdir, readdir, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const DESIGN_IMG = path.join(ROOT, "_design", "img");
const UPLOADS = path.join(ROOT, "_design", "uploads");
const OUT_IMG = path.join(ROOT, "public", "images");
const OUT_APP = path.join(ROOT, "app");

/** Fotografías aprobadas: origen en la maqueta -> nombre de producción. */
const PHOTOS = [
  // Automotriz
  { from: "auto-1.jpg", to: "auto-porsche-gt3rs.jpg" },
  { from: "auto-2.jpg", to: "auto-shelby-gt500.jpg" },
  { from: "auto-3.jpg", to: "auto-mclaren-675lt.jpg" },
  { from: "suburban-1.jpg", to: "auto-amg-black-series.jpg" },
  { from: "suburban-2.jpg", to: "auto-bmw-m4-csl.jpg" },
  { from: "suburban-3.jpg", to: "auto-ferrari-sf90.jpg" },
  { from: "suburban-4.jpg", to: "auto-amg-gt-rojo.jpg" },
  // Gastronomía
  { from: "food-1.jpg", to: "food-spaghetti-albondigas.jpg" },
  { from: "food-2.jpg", to: "food-preparacion-cocina.jpg" },
  { from: "food-3.jpg", to: "food-bandeja-carne-mechada.jpg" },
  { from: "food-5.jpg", to: "food-lasana-vino.jpg" },
  // Espacios
  { from: "edit-before.jpg", to: "espacio-bano-antes.jpg" },
  { from: "edit-after.jpg", to: "espacio-bano-despues.jpg" },
  // Detrás de cámara
  { from: "services-a.jpg", to: "bts-camara-gimbal.jpg" },
];

/** El logo se usa en cabecera y pie, siempre sobre negro. */
const LOGO_SRC = path.join(DESIGN_IMG, "logo.png");

/** Master cuadrado 1254x1254 del logo, fuente de los iconos. */
const ICON_SRC = path.join(UPLOADS, "pasted-1787022154039-0.png");

/** Original de alta resolución de la gastronomía destacada (3974x4968). */
async function findFoodMaster() {
  const dir = path.join(UPLOADS, "Imagenes Ian pagina");
  if (!existsSync(dir)) return null;
  const files = await readdir(dir);
  const hit = files.find(
    (f) => /^IMG\s*4\s+GASTRONOMICO\.jpe?g$/i.test(f.trim()) || /^IMG\s+4\s{2}GASTRONOMICO\.jpg$/i.test(f)
  );
  return hit ? path.join(dir, hit) : null;
}

const log = (...a) => console.log("  ", ...a);

async function main() {
  await mkdir(OUT_IMG, { recursive: true });

  // ---------------------------------------------------------------- fotos
  console.log("\nFotografías → public/images");
  for (const { from, to } of PHOTOS) {
    const src = path.join(DESIGN_IMG, from);
    if (!existsSync(src)) {
      log(`! falta ${from} — se omite`);
      continue;
    }
    const dst = path.join(OUT_IMG, to);
    // Se re-encodan sin reescalar: mismo píxel, JPEG progresivo optimizado.
    // Nada de upscale artificial (los originales de baja resolución se
    // mantienen tal cual y el layout los limita).
    const meta = await sharp(src).metadata();
    await sharp(src)
      .jpeg({ quality: 92, progressive: true, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(dst);
    log(`${from} → ${to}  (${meta.width}×${meta.height})`);
  }

  // Gastronomía destacada desde el master de 3974×4968.
  const master = await findFoodMaster();
  const foodOut = path.join(OUT_IMG, "food-albondigas-plato.jpg");
  if (master) {
    const meta = await sharp(master).metadata();
    await sharp(master)
      .resize({ width: 2000, withoutEnlargement: true })
      .jpeg({ quality: 90, progressive: true, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(foodOut);
    const out = await sharp(foodOut).metadata();
    log(`master gastronomía (${meta.width}×${meta.height}) → food-albondigas-plato.jpg (${out.width}×${out.height})`);
  } else {
    const fallback = path.join(DESIGN_IMG, "food-4.jpg");
    if (existsSync(fallback)) {
      await sharp(fallback).jpeg({ quality: 92, progressive: true, mozjpeg: true }).toFile(foodOut);
      log("master no encontrado — se usa food-4.jpg de la maqueta");
    }
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

  // ------------------------------------------------------------ open graph
  // Crop horizontal fuerte del McLaren 675LT: frontal, faro y splitter de
  // carbono. El original vertical NO se sobrescribe.
  console.log("\nOpen Graph");
  const ogSrc = path.join(DESIGN_IMG, "auto-3.jpg");
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
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(path.join(OUT_APP, "opengraph-image.jpg"));
  log(`app/opengraph-image.jpg 1200×630 (banda ${ogMeta.width}×${bandH} desde y=${bandTop})`);

  // ------------------------------------------------------- inventario JSON
  const files = (await readdir(OUT_IMG)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
  const inventory = [];
  for (const f of files) {
    const m = await sharp(path.join(OUT_IMG, f)).metadata();
    inventory.push({ file: f, width: m.width, height: m.height });
  }
  await writeFile(path.join(ROOT, "scripts", "image-inventory.json"), JSON.stringify(inventory, null, 2) + "\n", "utf8");

  console.log("\nInventario:");
  for (const i of inventory) console.log(`   ${i.file.padEnd(34)} ${i.width}×${i.height}`);
  console.log("\nListo.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
