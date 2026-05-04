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
          alignItems: "center",
          justifyContent: "center",
          background: "#0F172A",
          borderRadius: 36,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 40 40" fill="none">
          <path
            d="M15.5 12 L24 20 L15.5 28"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="29.5" cy="20" r="1.7" fill="#10B981" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
