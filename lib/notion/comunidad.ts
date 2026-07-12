import { getDbComunidadId } from "./client";
import { resolveCommunityRole, type CommunityRole } from "@/lib/config/community-roles";
import { countPublishedProyectosByMember } from "./proyectos";

const NOTION_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

export interface ComunidadMember {
  id: string;
  nombre: string;
  email: string | null;
  ciudad: string | null;
  pais: string | null;
  rol: string | null;
  empresa: string | null;
  latitud: number;
  longitud: number;
  linkedin: string | null;
  github: string | null;
  proyectosPublicados: number;
}

export interface ComunidadMemberRecord {
  id: string;
  nombre: string;
  email: string;
  pais: string | null;
  ciudad: string | null;
  rol: string | null;
  empresa: string | null;
  linkedin: string | null;
  estado: string | null;
  tipo: CommunityRole;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

function getTitleText(props: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = (props[key] as { title?: Array<{ plain_text?: string }> })?.title?.[0]
      ?.plain_text;
    if (value) return value;
  }
  return "";
}

function getRichText(props: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = (props[key] as { rich_text?: Array<{ plain_text?: string }> })?.rich_text?.[0]
      ?.plain_text;
    if (value) return value;
  }
  return null;
}

function getNumber(props: Record<string, unknown>, ...keys: string[]): number | null {
  for (const key of keys) {
    const value = (props[key] as { number?: number | null })?.number;
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

const CIUDAD_COORDS: Record<string, [number, number]> = {
  lima: [-77.0428, -12.0464],
  arequipa: [-71.5375, -16.409],
  cusco: [-71.9675, -13.5319],
  trujillo: [-79.0288, -8.1116],
  chiclayo: [-79.8389, -6.7714],
  piura: [-80.6328, -5.1945],
  iquitos: [-73.2538, -3.7491],
  huancayo: [-75.211, -12.0651],
  tacna: [-70.2533, -18.0066],
  cajamarca: [-78.5139, -7.1617],
  pucallpa: [-74.5539, -8.3791],
  bogota: [-74.0721, 4.711],
  medellin: [-75.5636, 6.2442],
  santiago: [-70.6693, -33.4489],
  "buenos aires": [-58.3816, -34.6037],
  "ciudad de mexico": [-99.1332, 19.4326],
  mexico: [-99.1332, 19.4326],
};

function normalizeCityKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizePaisInput(pais: string): string {
  const trimmed = pais.trim();
  if (normalizeCityKey(trimmed) === "peru") return "Perú";
  return trimmed;
}

function hashOffset(id: string): [number, number] {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const jitter = 0.035;
  return [
    ((hash % 100) / 100 - 0.5) * jitter,
    (((hash / 100) % 100) / 100 - 0.5) * jitter,
  ];
}

function resolveCoordinates(
  id: string,
  ciudad: string | null,
  latitud: number | null,
  longitud: number | null
): [number, number] | null {
  if (latitud !== null && longitud !== null) {
    return [longitud, latitud];
  }

  if (!ciudad) return null;

  const coords = CIUDAD_COORDS[normalizeCityKey(ciudad)];
  if (!coords) return null;

  const [dx, dy] = hashOffset(id);
  return [coords[0] + dx, coords[1] + dy];
}

function getSelectText(props: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = (props[key] as { select?: { name?: string } | null })?.select?.name;
    if (value) return value;
  }
  return null;
}

function getStatusName(props: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = (props[key] as { status?: { name?: string } })?.status?.name;
    if (value) return value;
  }
  return null;
}

function getEmail(props: Record<string, unknown>): string | null {
  const emailProp = props["Email"] as { email?: string | null } | undefined;
  if (emailProp?.email) return emailProp.email.toLowerCase();
  return getRichText(props, "Email");
}

function getPais(props: Record<string, unknown>): string | null {
  return getRichText(props, "Pais", "País") ?? getSelectText(props, "Pais", "País");
}

function getMemberTipo(props: Record<string, unknown>): string | null {
  return getSelectText(props, "Tipo", "Rol sistema") ?? getRichText(props, "Tipo");
}

function parseComunidadRecord(page: Record<string, unknown>): ComunidadMemberRecord | null {
  const props = page.properties as Record<string, unknown>;
  const nombre = getTitleText(props, "Nombre");
  const email = getEmail(props);
  if (!nombre) return null;

  const emailValue = email ?? "";

  return {
    id: page.id as string,
    nombre,
    email: emailValue,
    pais: getPais(props),
    ciudad:
      getRichText(props, "Ciudad") ??
      getSelectText(props, "Ciudad"),
    rol: getRichText(props, "Rol"),
    empresa: getRichText(props, "Empresa"),
    linkedin: (props["LinkedIn"] as { url?: string | null })?.url ?? null,
    estado: getStatusName(props, "Estado", "Status"),
    tipo: resolveCommunityRole(emailValue, getMemberTipo(props)),
  };
}

function parseComunidadPage(page: Record<string, unknown>): ComunidadMember | null {
  const props = page.properties as Record<string, unknown>;

  const nombre = getTitleText(props, "Nombre");
  if (!nombre) return null;

  const estado = getStatusName(props, "Estado", "Status");
  if (estado && estado !== "Publicado") return null;

  const ciudad =
    getRichText(props, "Ciudad") ??
    getSelectText(props, "Ciudad");

  const coords = resolveCoordinates(
    page.id as string,
    ciudad,
    getNumber(props, "Latitud"),
    getNumber(props, "Longitud")
  );

  if (!coords) return null;

  return {
    id: page.id as string,
    nombre,
    email: getEmail(props),
    ciudad,
    pais: getPais(props),
    rol: getRichText(props, "Rol"),
    empresa: getRichText(props, "Empresa"),
    longitud: coords[0],
    latitud: coords[1],
    linkedin: (props["LinkedIn"] as { url?: string | null })?.url ?? null,
    github: (props["GitHub"] as { url?: string | null })?.url ?? null,
    proyectosPublicados: 0,
  };
}

async function fetchComunidadPages(
  filter: Record<string, unknown>
): Promise<Array<Record<string, unknown>> | null> {
  const databaseId = getDbComunidadId();
  const allResults: Array<Record<string, unknown>> = [];
  let cursor: string | undefined;

  do {
    const res = await fetch(`${NOTION_BASE}/databases/${databaseId}/query`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        filter,
        page_size: 100,
        start_cursor: cursor,
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as {
      results: Array<Record<string, unknown>>;
      has_more: boolean;
      next_cursor: string | null;
    };

    allResults.push(...data.results);
    cursor = data.has_more && data.next_cursor ? data.next_cursor : undefined;
  } while (cursor);

  return allResults;
}

export async function listComunidadMembers(): Promise<ComunidadMember[]> {
  try {
    const fromStatus = await fetchComunidadPages({
      property: "Estado",
      status: { equals: "Publicado" },
    });

    if (fromStatus !== null) {
      return fromStatus
        .map(parseComunidadPage)
        .filter((member): member is ComunidadMember => member !== null);
    }

    const fromLegacyStatus = await fetchComunidadPages({
      property: "Status",
      status: { equals: "Publicado" },
    });

    if (fromLegacyStatus !== null) {
      return fromLegacyStatus
        .map(parseComunidadPage)
        .filter((member): member is ComunidadMember => member !== null);
    }

    const allPages = await fetchComunidadPages({});
    if (allPages !== null) {
      return allPages
        .map(parseComunidadPage)
        .filter((member): member is ComunidadMember => member !== null);
    }

    console.error("[listComunidadMembers] Could not query comunidad database");
    return [];
  } catch (err) {
    console.error("[listComunidadMembers] failed:", err);
    return [];
  }
}

export async function listComunidadMembersWithProyectos(): Promise<ComunidadMember[]> {
  const [members, proyectoCounts] = await Promise.all([
    listComunidadMembers(),
    countPublishedProyectosByMember().catch(() => new Map<string, number>()),
  ]);

  return members.map((member) => ({
    ...member,
    proyectosPublicados: proyectoCounts.get(member.id) ?? 0,
  }));
}

export async function findMemberByEmail(email: string): Promise<string | null> {
  const normalized = email.toLowerCase().trim();

  const fromEmail = await fetchComunidadPages({
    property: "Email",
    email: { equals: normalized },
  });

  if (fromEmail !== null) {
    const first = fromEmail[0];
    return first ? (first.id as string) : null;
  }

  const allPages = await fetchComunidadPages({});
  if (!allPages) return null;

  const match = allPages
    .map(parseComunidadRecord)
    .find((record) => record?.email === normalized);

  return match?.id ?? null;
}

export async function getMemberById(memberId: string): Promise<ComunidadMemberRecord | null> {
  const res = await fetch(`${NOTION_BASE}/pages/${memberId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) return null;
  const page = (await res.json()) as Record<string, unknown>;
  return parseComunidadRecord(page);
}

function buildMemberProperties(
  input: {
    nombre: string;
    email: string;
    pais?: string;
    ciudad: string;
    rol?: string;
    empresa?: string;
    linkedin?: string;
    tipo?: CommunityRole;
  },
  estado?: string
): Record<string, unknown> {
  const today = new Date().toISOString().split("T")[0];
  const properties: Record<string, unknown> = {
    Nombre: { title: [{ text: { content: input.nombre } }] },
    Ciudad: { rich_text: [{ text: { content: input.ciudad } }] },
    "Fecha de inscripción": { date: { start: today } },
  };

  if (input.email) {
    properties.Email = { email: input.email };
  }
  if (input.pais) {
    properties.Pais = { select: { name: normalizePaisInput(input.pais) } };
  }
  if (input.rol) {
    properties.Rol = { rich_text: [{ text: { content: input.rol } }] };
  }
  if (input.empresa) {
    properties.Empresa = { rich_text: [{ text: { content: input.empresa } }] };
  }
  if (input.linkedin) {
    properties.LinkedIn = { url: input.linkedin };
  }
  if (input.tipo) {
    properties.Tipo = { select: { name: input.tipo === "admin" ? "Admin" : "Miembros" } };
  }
  if (estado) {
    properties.Estado = { status: { name: estado } };
  }

  return properties;
}

export async function listAllComunidadMembers(): Promise<ComunidadMemberRecord[]> {
  const allPages = await fetchComunidadPages({});
  if (!allPages) return [];
  return allPages
    .map(parseComunidadRecord)
    .filter((member): member is ComunidadMemberRecord => member !== null);
}

export async function updateMemberEstado(memberId: string, estado: string): Promise<boolean> {
  const res = await fetch(`${NOTION_BASE}/pages/${memberId}`, {
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

export async function updateMemberAdmin(
  memberId: string,
  input: {
    nombre: string;
    email: string;
    pais?: string;
    ciudad: string;
    rol?: string;
    empresa?: string;
    linkedin?: string;
    estado?: string;
    tipo?: CommunityRole;
  }
): Promise<boolean> {
  const properties = buildMemberProperties(
    {
      nombre: input.nombre,
      email: input.email.toLowerCase().trim(),
      pais: input.pais,
      ciudad: input.ciudad,
      rol: input.rol,
      empresa: input.empresa,
      linkedin: input.linkedin,
      tipo: input.tipo,
    },
    input.estado
  );

  const res = await fetch(`${NOTION_BASE}/pages/${memberId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ properties }),
  });
  return res.ok;
}

export async function createCommunityMember(input: {
  nombre: string;
  email: string;
  pais: string;
  ciudad: string;
  rol?: string;
  empresa?: string;
  linkedin?: string;
}): Promise<string | null> {
  const databaseId = getDbComunidadId();
  const normalizedEmail = input.email.toLowerCase().trim();

  const createWithEstado = async (estado?: string) => {
    const res = await fetch(`${NOTION_BASE}/pages`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: buildMemberProperties(
          { ...input, email: normalizedEmail, tipo: "miembro" },
          estado
        ),
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error("[createCommunityMember] Notion error:", res.status, errBody);
      return null;
    }
    const page = (await res.json()) as { id?: string };
    return page.id ?? null;
  };

  const withPendiente = await createWithEstado("Pendiente");
  if (withPendiente) return withPendiente;

  return createWithEstado();
}

export async function updateCommunityMember(
  memberId: string,
  input: {
    nombre: string;
    email: string;
    pais?: string;
    ciudad: string;
    rol?: string;
    empresa?: string;
    linkedin?: string;
  }
): Promise<boolean> {
  const res = await fetch(`${NOTION_BASE}/pages/${memberId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      properties: buildMemberProperties({
        ...input,
        email: input.email.toLowerCase().trim(),
      }),
    }),
  });
  return res.ok;
}

export async function publishCommunityMember(memberId: string): Promise<boolean> {
  const res = await fetch(`${NOTION_BASE}/pages/${memberId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      properties: {
        Estado: { status: { name: "Publicado" } },
      },
    }),
  });
  return res.ok;
}

export function comunidadMembersToGeoJSON(
  members: ComunidadMember[]
): GeoJSON.FeatureCollection<GeoJSON.Point, {
  id: string;
  ciudad: string;
  count: number;
}> {
  const byCity = new Map<
    string,
    { ciudad: string; count: number; longitud: number; latitud: number }
  >();

  for (const member of members) {
    const displayCity = member.ciudad?.trim() || "Sin ciudad";
    const cityKey = normalizeCityKey(displayCity);

    const existing = byCity.get(cityKey);
    if (existing) {
      existing.count += 1;
      continue;
    }

    byCity.set(cityKey, {
      ciudad: displayCity,
      count: 1,
      longitud: member.longitud,
      latitud: member.latitud,
    });
  }

  return {
    type: "FeatureCollection",
    features: Array.from(byCity.entries()).map(([cityKey, city]) => ({
      type: "Feature",
      properties: {
        id: cityKey,
        ciudad: city.ciudad,
        count: city.count,
      },
      geometry: {
        type: "Point",
        coordinates: [city.longitud, city.latitud],
      },
    })),
  };
}
