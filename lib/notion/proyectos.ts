import { getDbProyectosId } from "./client";

const NOTION_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

export interface ComunidadProyecto {
  id: string;
  nombre: string;
  descripcion: string;
  stack: string[];
  url: string | null;
  github: string | null;
  autor: string;
  email: string | null;
  memberId: string | null;
  estado: string | null;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

function getTitle(props: Record<string, unknown>): string {
  return (
    (props["Nombre"] as { title?: Array<{ plain_text?: string }> })?.title?.[0]
      ?.plain_text ?? ""
  );
}

function getRichText(props: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = (props[key] as { rich_text?: Array<{ plain_text?: string }> })
      ?.rich_text?.[0]?.plain_text;
    if (value) return value;
  }
  return null;
}

function getMultiSelect(props: Record<string, unknown>, key: string): string[] {
  return (
    (props[key] as { multi_select?: Array<{ name?: string }> })?.multi_select
      ?.map((item) => item.name ?? "")
      .filter(Boolean) ?? []
  );
}

function getRelationIds(props: Record<string, unknown>, key: string): string[] {
  return (
    (props[key] as { relation?: Array<{ id: string }> })?.relation?.map((item) => item.id) ??
    []
  );
}

function getRollupEmail(props: Record<string, unknown>, key: string): string | null {
  const rollup = (props[key] as {
    rollup?: {
      type?: string;
      array?: Array<{ type?: string; email?: string | null }>;
    };
  })?.rollup;

  if (!rollup?.array) return null;

  for (const item of rollup.array) {
    if (item.type === "email" && item.email) {
      return item.email.toLowerCase();
    }
  }

  return null;
}

function getStatus(props: Record<string, unknown>): string | null {
  return (
    (props["Estado"] as { status?: { name?: string } })?.status?.name ??
    (props["Status"] as { status?: { name?: string } })?.status?.name ??
    null
  );
}

function parseProyectoPage(page: Record<string, unknown>): ComunidadProyecto | null {
  const props = page.properties as Record<string, unknown>;
  const nombre = getTitle(props);
  if (!nombre) return null;

  const autorRelationIds = getRelationIds(props, "Autor");
  const memberId =
    autorRelationIds[0] ?? getRichText(props, "Miembro ID") ?? null;

  return {
    id: page.id as string,
    nombre,
    descripcion:
      getRichText(props, "Descripcion", "Descripción") ?? "",
    stack: getMultiSelect(props, "Stack"),
    url: (props["URL"] as { url?: string | null })?.url ?? null,
    github: (props["GitHub"] as { url?: string | null })?.url ?? null,
    autor: getRichText(props, "Autor") ?? "",
    email:
      (props["Email"] as { email?: string | null })?.email?.toLowerCase() ??
      getRollupEmail(props, "Email"),
    memberId,
    estado: getStatus(props),
  };
}

async function queryProyectos(
  filter?: Record<string, unknown>
): Promise<ComunidadProyecto[]> {
  const databaseId = getDbProyectosId();
  if (!databaseId) return [];

  const allResults: Array<Record<string, unknown>> = [];
  let cursor: string | undefined;

  do {
    const res = await fetch(`${NOTION_BASE}/databases/${databaseId}/query`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        ...(filter ? { filter } : {}),
        page_size: 100,
        start_cursor: cursor,
      }),
    });

    if (!res.ok) return [];

    const data = (await res.json()) as {
      results: Array<Record<string, unknown>>;
      has_more: boolean;
      next_cursor: string | null;
    };

    allResults.push(...data.results);
    cursor = data.has_more && data.next_cursor ? data.next_cursor : undefined;
  } while (cursor);

  return allResults
    .map(parseProyectoPage)
    .filter((proyecto): proyecto is ComunidadProyecto => proyecto !== null);
}

export function isProyectosDbConfigured(): boolean {
  return !!getDbProyectosId();
}

export async function listPublishedProyectos(): Promise<ComunidadProyecto[]> {
  return queryProyectos({
    property: "Estado",
    status: { equals: "Publicado" },
  });
}

export async function listProyectosByMember(memberId: string): Promise<ComunidadProyecto[]> {
  const fromRelation = await queryProyectos({
    property: "Autor",
    relation: { contains: memberId },
  });

  if (fromRelation.length > 0) return fromRelation;

  const all = await queryProyectos();
  return all.filter((p) => p.memberId === memberId);
}

export async function listAllProyectos(): Promise<ComunidadProyecto[]> {
  return queryProyectos();
}

export async function createProyecto(input: {
  nombre: string;
  descripcion: string;
  stack: string[];
  url?: string;
  github?: string;
  autor: string;
  email: string;
  memberId: string;
}): Promise<string | null> {
  const databaseId = getDbProyectosId();
  if (!databaseId) return null;

  const properties: Record<string, unknown> = {
    Nombre: { title: [{ text: { content: input.nombre } }] },
    Descripcion: { rich_text: [{ text: { content: input.descripcion } }] },
    Stack: { multi_select: input.stack.map((name) => ({ name })) },
    Autor: { relation: [{ id: input.memberId }] },
    Estado: { status: { name: "Idea" } },
  };

  if (input.url) properties.URL = { url: input.url };
  if (input.github) properties.GitHub = { url: input.github };

  const res = await fetch(`${NOTION_BASE}/pages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!res.ok) {
    console.error("[createProyecto] failed:", res.status, await res.text());
    return null;
  }

  const page = (await res.json()) as { id?: string };
  return page.id ?? null;
}

export async function updateProyectoEstado(
  proyectoId: string,
  estado: string
): Promise<boolean> {
  const res = await fetch(`${NOTION_BASE}/pages/${proyectoId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      properties: {
        Estado: { status: { name: estado } },
      },
    }),
  });
  return res.ok;
}
