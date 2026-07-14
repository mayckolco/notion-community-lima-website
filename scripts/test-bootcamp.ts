import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

import { fetchBootcampFechas } from "../lib/notion/bootcamp";
import { getDbBootcampDatesId } from "../lib/notion/client";

const NOTION_VERSION = "2022-06-28";

async function inspectDatabase() {
  const databaseId = getDbBootcampDatesId();
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN is not set");

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
    },
  });

  console.log(`Database retrieve: ${res.status}`);
  if (!res.ok) {
    console.log(await res.text());
    return;
  }

  const db = (await res.json()) as {
    title?: Array<{ plain_text: string }>;
    properties: Record<string, { type: string; status?: { options: Array<{ name: string }> }; select?: { options: Array<{ name: string }> } }>;
  };

  console.log(`DB title: ${db.title?.[0]?.plain_text ?? "(sin título)"}`);
  console.log("Properties:");
  for (const [name, prop] of Object.entries(db.properties)) {
    console.log(`  - ${name} (${prop.type})`);
    if (prop.type === "status" && prop.status?.options) {
      console.log(`    status: ${prop.status.options.map((o) => o.name).join(", ")}`);
    }
    if (prop.type === "select" && prop.select?.options) {
      console.log(`    select: ${prop.select.options.map((o) => o.name).join(", ")}`);
    }
  }

  const queryRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ page_size: 20 }),
  });

  console.log(`\nUnfiltered query: ${queryRes.status}`);
  if (!queryRes.ok) {
    console.log(await queryRes.text());
    return;
  }

  const data = (await queryRes.json()) as {
    results: Array<{ id: string; properties: Record<string, unknown> }>;
  };

  console.log(`Rows: ${data.results.length}`);
  for (const page of data.results) {
    const p = page.properties as Record<string, {
      title?: Array<{ plain_text: string }>;
      date?: { start?: string };
      select?: { name?: string };
      status?: { name?: string };
      relation?: Array<{ id: string }>;
    }>;
    console.log({
      id: page.id,
      nombre: p["Nombre del programa"]?.title?.[0]?.plain_text,
      fecha: p["Fecha"]?.date?.start,
      modalidad: p["Modalidad"]?.select?.name,
      estado: p["Estado"]?.status?.name,
      personas: p["Persona"]?.relation?.length ?? 0,
    });
  }
}

async function checkRegistrosDb() {
  console.log("\n--- registros DB (via Persona) ---");
  const schemaRes = await fetch(`https://api.notion.com/v1/databases/${getDbBootcampDatesId()}`, {
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
    },
  });
  if (!schemaRes.ok) {
    console.log("schema fetch failed:", schemaRes.status);
    return;
  }
  const schema = (await schemaRes.json()) as {
    properties: Record<string, { relation?: { database_id?: string } }>;
  };
  const registrosId = schema.properties?.Persona?.relation?.database_id;
  console.log("Registros DB:", registrosId ?? "not found");
}

async function checkSecrets() {
  console.log("\n--- secrets ---");
  for (const key of ["EMAIL_VERIFICATION_SECRET", "CRON_SECRET"] as const) {
    const value = process.env[key];
    console.log(`${key}:`, value && value.length >= 32 ? "ok" : "MISSING");
  }
}

async function main() {
  console.log("Bootcamp dates DB:", getDbBootcampDatesId());
  await inspectDatabase();
  await checkRegistrosDb();
  await checkSecrets();

  console.log("\n--- fetchBootcampFechas ---");
  for (const modalidad of ["virtual", "presencial"] as const) {
    const fechas = await fetchBootcampFechas(modalidad);
    console.log(`${modalidad}: ${fechas.length} fechas`);
    for (const f of fechas) {
      console.log(`  · ${f.fechaLabel} (${f.modalidad}) cupos=${f.cuposDisponibles}`);
    }
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
