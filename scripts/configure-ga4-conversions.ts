/**
 * Configura eventos de conversión en GA4 via Admin API.
 *
 * Requiere:
 *   GA4_PROPERTY_ID=545530988
 *   GA4_SERVICE_ACCOUNT_PATH=.secrets/ga4-service-account.json
 *
 * Uso:
 *   pnpm ga4:setup               # crear conversiones faltantes
 *   pnpm ga4:setup --check       # solo listar estado (sin cambios)
 *   pnpm ga4:setup --consolidate # eliminar data streams duplicados (un solo G- ID)
 */
import { createSign } from "crypto";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { config } from "dotenv";
import { GA_EVENTS } from "../lib/seo/analytics";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

const PROPERTY_ID = process.env.GA4_PROPERTY_ID ?? "545530988";
const CREDENTIALS_PATH =
  process.env.GA4_SERVICE_ACCOUNT_PATH ??
  path.resolve(process.cwd(), ".secrets/ga4-service-account.json");

const ADMIN_SCOPE = "https://www.googleapis.com/auth/analytics.edit";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const ADMIN_BASE = "https://analyticsadmin.googleapis.com/v1beta";

/** Dominios de producción que envían al mismo measurement ID. */
const PRODUCTION_DOMAINS = ["notion.mayckolco.com", "notion.ialabs.tech"] as const;

/** Conversiones principales del sitio (+ extras del formulario speaker). */
const CONVERSION_EVENTS = [
  GA_EVENTS.clickWhatsapp,
  GA_EVENTS.joinCommunity,
  GA_EVENTS.preReservaPrograma,
  GA_EVENTS.newsletterSubscribe,
  GA_EVENTS.applySpeaker,
  GA_EVENTS.registerEvent,
  "submit_application",
] as const;

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function loadCredentials(): ServiceAccount {
  if (!existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      `No se encontró el JSON de la service account en:\n  ${CREDENTIALS_PATH}\n\n` +
        "Coloca el archivo descargado de Google Cloud ahí, o define GA4_SERVICE_ACCOUNT_PATH."
    );
  }
  const raw = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf8")) as ServiceAccount;
  if (!raw.client_email || !raw.private_key) {
    throw new Error("El JSON no parece una service account válida (faltan client_email o private_key).");
  }
  return raw;
}

async function getAccessToken(creds: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: creds.client_email,
      scope: ADMIN_SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = base64url(signer.sign(creds.private_key));
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(`OAuth falló: ${data.error ?? res.status} — ${data.error_description ?? "sin detalle"}`);
  }
  return data.access_token;
}

async function adminFetch<T>(
  token: string,
  pathname: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${ADMIN_BASE}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const err = body as { error?: { message?: string; status?: string } };
    throw new Error(
      `Admin API ${init?.method ?? "GET"} ${pathname} → ${res.status}: ${err.error?.message ?? text.slice(0, 300)}`
    );
  }
  return body as T;
}

type ConversionEvent = { name?: string; eventName?: string; custom?: boolean };
type ListResponse = { conversionEvents?: ConversionEvent[]; nextPageToken?: string };

async function listConversionEvents(token: string): Promise<ConversionEvent[]> {
  const items: ConversionEvent[] = [];
  let pageToken: string | undefined;

  do {
    const query = new URLSearchParams({ pageSize: "200" });
    if (pageToken) query.set("pageToken", pageToken);
    const data = await adminFetch<ListResponse>(
      token,
      `/properties/${PROPERTY_ID}/conversionEvents?${query}`
    );
    items.push(...(data.conversionEvents ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return items;
}

async function createConversionEvent(token: string, eventName: string): Promise<void> {
  await adminFetch(token, `/properties/${PROPERTY_ID}/conversionEvents`, {
    method: "POST",
    body: JSON.stringify({
      eventName,
      countingMethod: "ONCE_PER_EVENT",
    }),
  });
}

type DataStream = {
  name?: string;
  displayName?: string;
  type?: string;
  webStreamData?: { defaultUri?: string; measurementId?: string };
};

async function listDataStreams(token: string): Promise<DataStream[]> {
  const data = await adminFetch<{ dataStreams?: DataStream[] }>(
    token,
    `/properties/${PROPERTY_ID}/dataStreams`
  );
  return data.dataStreams ?? [];
}

async function deleteDataStream(token: string, streamName: string): Promise<void> {
  await adminFetch(token, `/${streamName}`, { method: "DELETE" });
}

async function consolidateDataStreams(
  token: string,
  primaryMeasurementId: string
): Promise<void> {
  const streams = await listDataStreams(token);
  const primary = streams.filter(
    (s) => s.webStreamData?.measurementId === primaryMeasurementId
  );
  const duplicates = streams.filter(
    (s) => s.webStreamData?.measurementId && s.webStreamData.measurementId !== primaryMeasurementId
  );

  if (primary.length === 0) {
    throw new Error(
      `No existe un data stream con ${primaryMeasurementId}. Crea uno antes de consolidar.`
    );
  }

  if (primary.length > 1) {
    console.warn(
      `\n⚠️  Hay ${primary.length} streams con ${primaryMeasurementId}. Revisa manualmente en GA4 Admin.`
    );
  }

  console.log(`\n🌐 Dominios de producción (un solo measurement ID):`);
  for (const domain of PRODUCTION_DOMAINS) {
    console.log(`  · ${domain} → ${primaryMeasurementId}`);
  }

  if (duplicates.length === 0) {
    console.log("\n✅ No hay data streams duplicados para eliminar.");
    return;
  }

  console.log(`\n🗑️  Eliminando ${duplicates.length} data stream(s) duplicado(s)...`);
  for (const stream of duplicates) {
    const id = stream.webStreamData?.measurementId ?? "sin ID";
    const uri = stream.webStreamData?.defaultUri ?? "—";
    if (!stream.name) {
      console.error(`  ❌ ${stream.displayName ?? "Web"} (${id}): falta resource name`);
      continue;
    }
    try {
      await deleteDataStream(token, stream.name);
      console.log(`  ✅ ${stream.displayName ?? "Web"} → ${uri} (${id})`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ ${stream.displayName ?? "Web"} (${id}): ${msg}`);
    }
  }
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const consolidateStreams = process.argv.includes("--consolidate");
  const creds = loadCredentials();
  const token = await getAccessToken(creds);

  console.log(`\n🔑 Autenticado como: ${creds.client_email}`);
  console.log(`📊 Propiedad GA4: ${PROPERTY_ID}\n`);

  // Verificar propiedad y data streams
  const property = await adminFetch<{ displayName?: string; name?: string }>(
    token,
    `/properties/${PROPERTY_ID}`
  );
  console.log(`✅ Propiedad encontrada: ${property.displayName ?? property.name}`);

  const streams = await listDataStreams(token);

  console.log("\n📡 Data streams:");
  for (const stream of streams) {
    const web = stream.webStreamData;
    console.log(
      `  · ${stream.displayName ?? "Web"} → ${web?.defaultUri ?? "—"} (${web?.measurementId ?? "sin ID"})`
    );
  }

  const expectedMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-1D2VSCG9LR";
  const hasMatchingStream = streams.some(
    (s) => s.webStreamData?.measurementId === expectedMeasurementId
  );
  if (hasMatchingStream) {
    console.log(`\n✅ Measurement ID ${expectedMeasurementId} coincide con un data stream.`);
    console.log(`   Dominios: ${PRODUCTION_DOMAINS.join(", ")}`);
  } else {
    console.warn(
      `\n⚠️  No se encontró el data stream con ${expectedMeasurementId}. Revisa la propiedad correcta.`
    );
  }

  if (consolidateStreams) {
    await consolidateDataStreams(token, expectedMeasurementId);
    const after = await listDataStreams(token);
    console.log(`\n📡 Data streams finales (${after.length}):`);
    for (const stream of after) {
      const web = stream.webStreamData;
      console.log(
        `  · ${stream.displayName ?? "Web"} → ${web?.defaultUri ?? "—"} (${web?.measurementId ?? "sin ID"})`
      );
    }
  }

  const existing = await listConversionEvents(token);
  const existingNames = new Set(
    existing
      .map((e) => e.eventName ?? e.name?.split("/").pop())
      .filter((name): name is string => Boolean(name))
  );

  console.log(`\n🎯 Conversiones actuales (${existingNames.size}):`);
  for (const name of Array.from(existingNames).sort()) {
    console.log(`  · ${name}`);
  }

  const missing = CONVERSION_EVENTS.filter((e) => !existingNames.has(e));
  console.log(`\n📋 Conversiones objetivo del sitio (${CONVERSION_EVENTS.length}):`);
  for (const event of CONVERSION_EVENTS) {
    const status = existingNames.has(event) ? "✅" : "⬜";
    console.log(`  ${status} ${event}`);
  }

  if (checkOnly || consolidateStreams) {
    console.log(
      consolidateStreams
        ? "\nModo --consolidate: streams duplicados procesados."
        : "\nModo --check: no se crearon conversiones."
    );
    return;
  }

  if (missing.length === 0) {
    console.log("\n✅ Todas las conversiones ya están configuradas.");
    return;
  }

  console.log(`\n➕ Creando ${missing.length} conversión(es) faltante(s)...`);
  for (const eventName of missing) {
    try {
      await createConversionEvent(token, eventName);
      console.log(`  ✅ ${eventName}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("ALREADY_EXISTS") || msg.includes("already exists")) {
        console.log(`  ↪ ${eventName} (ya existía)`);
      } else {
        console.error(`  ❌ ${eventName}: ${msg}`);
      }
    }
  }

  const final = await listConversionEvents(token);
  console.log(`\n✅ Listo. Total conversiones en GA4: ${final.length}`);
}

main().catch((err: unknown) => {
  console.error("\n❌", err instanceof Error ? err.message : err);
  process.exit(1);
});
