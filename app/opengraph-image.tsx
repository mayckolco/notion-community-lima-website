import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
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
            maxWidth: "800px",
          }}
        >
          Aprende, construye y crece con Claude.
          Webinars, recursos y networking en Lima.
        </p>
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "#D97757",
              borderRadius: "6px",
            }}
          />
          <span style={{ color: "#6B6560", fontSize: "16px" }}>claude.mayckolco.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
