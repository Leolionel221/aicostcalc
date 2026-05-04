import { ImageResponse } from "next/og";

export const alt = "AI API Cost Calculator — Compare LLM Pricing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          padding: "80px",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top: brand mark + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 13,
              background: "#0F172A",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
              <path
                d="M12 15.5 L20 24 L28 15.5"
                stroke="white"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="29.5" r="1.7" fill="#10B981" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: -0.5,
            }}
          >
            AI Cost Calc
          </div>
        </div>

        {/* Middle: headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            marginTop: 80,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2.5,
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            Calculate AI API costs in seconds.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Compare 10+ models from OpenAI, Anthropic, Google, DeepSeek, xAI & Mistral.
          </div>
        </div>

        {/* Bottom: highlight chips */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: "auto",
            fontSize: 22,
          }}
        >
          {["Caching savings", "Batch API", "Monthly forecast", "Free + open"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "12px 20px",
                  borderRadius: 9999,
                  border: "2px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {label}
              </div>
            ),
          )}
        </div>

        {/* Site URL */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 80,
            right: 80,
            fontSize: 20,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          aicostcalc.net
        </div>
      </div>
    ),
    { ...size },
  );
}
