import { PRODUCTION_SITE_URL } from "@/lib/base-url";

export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? PRODUCTION_SITE_URL;

export const SITE_NAME = "Claude Perú";

export const SITE_DESCRIPTION =
  "La comunidad peruana de builders que construyen con Claude. Webinars semanales, meetups en Lima y recursos en español.";

export const OG_IMAGE_PATH = "/opengraph-image";
