import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Claude Community - La comunidad peruana de builders con IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
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
            color: "#52525b",
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
            color: "#fafafa",
            fontSize: "80px",
            fontWeight: 700,
            margin: "0 0 28px",
            lineHeight: 1.05,
          }}
        >
          Claude Community
        </h1>
        <p
          style={{
            color: "#71717a",
            fontSize: "26px",
            margin: 0,
            lineHeight: 1.5,
            maxWidth: "800px",
          }}
        >
          Builders peruanos que construyen con Claude.
          Webinars, meetups y networking en Lima.
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
              background: "#f97316",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <span style={{ color: "#a1a1aa", fontSize: "16px" }}>claude.mayckolco.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
