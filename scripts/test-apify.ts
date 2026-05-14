import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

import { scrapeLinkedInProfile } from "../lib/linkedin/apify";
import { mapLinkedInToForm } from "../lib/linkedin/map-to-form";

const url = process.argv[2] ?? "https://www.linkedin.com/in/mayckolco/";

async function main() {
  console.log(`\nTesting Apify LinkedIn scraper...`);
  console.log(`URL: ${url}`);
  console.log(`Token: ${process.env.APIFY_TOKEN?.slice(0, 12)}...`);
  console.log(`Actor: ${process.env.APIFY_LINKEDIN_ACTOR ?? "2SyF0bVxmgGr8IVCZ"}\n`);

  const start = Date.now();

  const profile = await scrapeLinkedInProfile(url);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  if (!profile) {
    console.log(`❌ No se encontró el perfil (${elapsed}s)`);
    process.exit(1);
  }

  console.log(`✅ Perfil obtenido en ${elapsed}s\n`);
  console.log("--- Raw profile ---");
  console.log("Nombre:    ", profile.fullName);
  console.log("Headline:  ", profile.headline);
  console.log("Biografía: ", profile.summary?.slice(0, 120) + (profile.summary && profile.summary.length > 120 ? "..." : ""));
  console.log("Foto:      ", profile.profilePicture ? "✅ URL obtenida" : "❌ Sin foto");
  console.log("Skills:    ", profile.skills.slice(0, 8).join(", "));

  console.log("\n--- Form prefill ---");
  const prefill = mapLinkedInToForm(profile);
  console.log("nombre:      ", prefill.nombre);
  console.log("titulo:      ", prefill.titulo);
  console.log("descripcion: ", prefill.descripcion?.slice(0, 80) + "...");
  console.log("herramientas:", prefill.herramientas);
  console.log("photoUrl:    ", prefill.photoUrl ? "✅" : "❌");
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message ?? err);
  process.exit(1);
});
