import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
          padding: "6px 6px",
          gap: 2,
        }}
      >
        <div style={{ display: "flex", width: 20, height: 3, borderRadius: 1.5, background: "#10B981" }} />
        <div style={{ display: "flex", width: 14, height: 3, borderRadius: 1.5, background: "rgba(255,255,255,0.85)" }} />
        <div style={{ display: "flex", width: 9, height: 3, borderRadius: 1.5, background: "rgba(255,255,255,0.5)" }} />
      </div>
    ),
    { ...size },
  );
}
