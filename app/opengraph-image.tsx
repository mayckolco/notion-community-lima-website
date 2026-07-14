import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export const alt = "Notion Community Lima · La comunidad de Notion en Perú";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FBFAF7",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 88px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "700px",
          }}
        >
          <p
            style={{
              color: "#1E1EB4",
              fontSize: "14px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "0 0 24px",
            }}
          >
            COMUNIDAD DE NOTION EN LIMA
          </p>
          <h1
            style={{
              color: "#2B2622",
              fontSize: "72px",
              fontWeight: 700,
              margin: "0 0 28px",
              lineHeight: 1.05,
            }}
          >
            Notion Community Lima
          </h1>
          <p
            style={{
              color: "#6B6560",
              fontSize: "26px",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Aprende, conecta y construye con Notion.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "280px",
            height: "280px",
            borderRadius: "32px",
            background: "#1E1EB4",
            boxShadow: "0 24px 60px rgba(30, 30, 180, 0.25)",
            color: "#FBFAF7",
            fontSize: "140px",
            lineHeight: 1,
          }}
        >
          N
        </div>
      </div>
    ),
    { ...size }
  );
}
