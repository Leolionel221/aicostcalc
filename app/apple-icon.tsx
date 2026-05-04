import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#2563EB",
          borderRadius: 40,
          padding: "36px 36px",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", width: 108, height: 16, borderRadius: 8, background: "#10B981" }} />
        <div style={{ display: "flex", width: 76, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.85)" }} />
        <div style={{ display: "flex", width: 50, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.5)" }} />
      </div>
    ),
    { ...size },
  );
}
