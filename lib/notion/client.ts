import { Client } from "@notionhq/client";

let _client: Client | null = null;

export function getNotionClient(): Client {
  if (_client) return _client;

  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN is not set");

  _client = new Client({ auth: token });
  return _client;
}

export function getDbSlotsId(): string {
  const id = process.env.DB_SLOTS_ID ?? process.env.DB_SESSIONS_ID;
  if (!id) throw new Error("DB_SLOTS_ID or DB_SESSIONS_ID env var is required");
  return id;
}

export function getDbSpeakersId(): string {
  const id = process.env.DB_SPEAKERS_ID;
  if (!id) throw new Error("DB_SPEAKERS_ID env var is required");
  return id;
}

export function getDbBootcampDatesId(): string {
  const id = process.env.DB_BOOTCAMP_DATES_ID;
  if (!id) throw new Error("DB_BOOTCAMP_DATES_ID env var is required");
  return id;
}

export function getDbBootcampRegistrosId(): string {
  const id = process.env.DB_BOOTCAMP_REGISTROS_ID;
  if (!id) throw new Error("DB_BOOTCAMP_REGISTROS_ID env var is required");
  return id;
}
