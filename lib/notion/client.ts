import { Client } from "@notionhq/client";

let _client: Client | null = null;

export function getNotionClient(): Client {
  if (_client) return _client;

  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN is not set");

  _client = new Client({ auth: token });
  return _client;
}

export const DB_SLOTS_ID = process.env.DB_SLOTS_ID ?? "848e18913aa845048723cf4c158ee5a5";
export const DB_SPEAKERS_ID = process.env.DB_SPEAKERS_ID ?? "c0ab88424420478482abb29790b1a872";
