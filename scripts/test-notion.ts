import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

import { getNotionClient, DB_SLOTS_ID, DB_SPEAKERS_ID } from "../lib/notion/client";
import { listSlots } from "../lib/notion/slots";

async function main() {
  console.log("Testing Notion connection...\n");

  const notion = getNotionClient();

  // 1. Test token
  const me = await notion.users.me({});
  console.log(`Connected as: ${me.name ?? "Unknown"} (${me.type})`);

  // 2. Test Speaker Slots DB
  console.log(`\nQuerying Speaker Slots (${DB_SLOTS_ID})...`);
  const slotsDb = await notion.databases.retrieve({ database_id: DB_SLOTS_ID });
  console.log(`  DB: "${(slotsDb as { title?: Array<{ plain_text: string }> }).title?.[0]?.plain_text}"`);

  const slots = await listSlots();
  console.log(`  Found ${slots.length} upcoming slots:`);
  for (const s of slots) {
    console.log(`  · ${s.fecha.slice(0, 10)} — ${s.estado}`);
  }

  // 3. Test Speakers DB
  console.log(`\nQuerying Speakers DB (${DB_SPEAKERS_ID})...`);
  const speakersDb = await notion.databases.retrieve({ database_id: DB_SPEAKERS_ID });
  console.log(
    `  DB: "${(speakersDb as { title?: Array<{ plain_text: string }> }).title?.[0]?.plain_text}"`
  );

  console.log("\n✅ All checks passed!");
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message ?? err);
  process.exit(1);
});
