/**
 * Fuente única de verdad para los datos de contacto e identidad del sitio.
 * Todo dato aquí está verificado. Lo que todavía no existe queda vacío y los
 * componentes lo omiten en vez de inventarlo o dejar un enlace roto.
 */

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

/** URL pública sin barra final. En desarrollo cae a localhost. */
let parsedUrl = "http://localhost:3000";
try {
  if (RAW_SITE_URL && RAW_SITE_URL.includes("http")) {
    parsedUrl = RAW_SITE_URL.replace(/["'\\]/g, "");
  } else if (RAW_SITE_URL) {
    parsedUrl = "https://" + RAW_SITE_URL.replace(/["'\\]/g, "");
  }
} catch (e) {}

export const siteUrl = parsedUrl.replace(/\/+$/, "");

/** true cuando NEXT_PUBLIC_SITE_URL está configurada de verdad. */
export const hasPublicUrl = Boolean(RAW_SITE_URL);

/** Usuario de Instagram. Vacío hasta que se confirme el real. */
const instagramUser = (process.env.NEXT_PUBLIC_INSTAGRAM || "").replace(/^@/, "").trim();

const whatsappNumber = "+506 8980-8289";
const whatsappDigits = "50689808289";
const email = "ianstudiocr@gmail.com";

export const site = {
  name: "Ian Studio",
  author: "Ian Solís",
  tagline: "Fotografía · Video · Contenido",
  location: "Costa Rica",
  year: 2026,
  yearRoman: "MMXXVI",

  title: "Ian Studio — Fotografía, video y contenido en Costa Rica",
  shortTitle: "Ian Studio",
  description:
    "Fotografía, video vertical y contenido mensual para negocios y marcas personales en Costa Rica. Gastronomía, espacios y automotriz.",

  contact: {
    whatsapp: {
      label: whatsappNumber,
      href: `https://wa.me/${whatsappDigits}`,
      digits: whatsappDigits,
    },
    email: {
      label: email,
      href: `mailto:${email}`,
    },
    /** null mientras no exista usuario confirmado: el enlace no se pinta. */
    instagram: instagramUser
      ? { label: `@${instagramUser}`, href: `https://instagram.com/${instagramUser}` }
      : null,
  },

  /** Enlaces de la navegación principal, en orden narrativo. */
  nav: [
    { href: "#perfil", label: "Quién soy" },
    { href: "#especialidades", label: "Especialidades" },
    { href: "#categorias", label: "Categorías" },
    { href: "#vertical", label: "Vertical" },
    { href: "#suburban", label: "Automotriz" },
    { href: "#planes", label: "Planes" },
  ],
};

export default site;
