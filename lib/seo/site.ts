import { PRODUCTION_SITE_URL } from "@/lib/base-url";

export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? PRODUCTION_SITE_URL;

export const SITE_NAME = "Notion Community Lima";

export const SITE_DESCRIPTION =
  "La comunidad de Notion en Lima. Aprende, conecta y construye en Notion con meetups, recursos y miembros que dominan el sistema.";

export const OG_IMAGE_PATH = "/opengraph-image";
