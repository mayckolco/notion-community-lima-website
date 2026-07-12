import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export const alt = "Claude Perú · La comunidad de builders con IA en Perú";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F5F1EB",
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
              color: "#D97757",
              fontSize: "14px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "0 0 24px",
            }}
          >
            COMUNIDAD DE IA EN PERÚ
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
            Claude Perú
          </h1>
          <p
            style={{
              color: "#6B6560",
              fontSize: "26px",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Aprende, construye y crece con Claude.
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
            background: "#09090b",
            boxShadow: "0 24px 60px rgba(43, 38, 34, 0.18)",
            color: "#D97E63",
            fontSize: "180px",
            lineHeight: 1,
          }}
        >
          ✳
        </div>
      </div>
    ),
    { ...size }
  );
}
