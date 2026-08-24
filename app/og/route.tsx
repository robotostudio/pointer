import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Not the schema's 220-char ceiling — this is what fits the OG canvas.
const OG_TITLE_LIMIT = 100;
const OG_DESCRIPTION_LIMIT = 140;
const ELLIPSIS = "...";

const truncate = (value: string, limit: number) =>
  value.length > limit
    ? `${value.slice(0, limit - ELLIPSIS.length)}${ELLIPSIS}`
    : value;

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Both params are attacker-controlled on a public unauthenticated route.
  const title = truncate(
    url.searchParams.get("title") ||
      "The AI-Powered Code Editor for Productive Teams",
    OG_TITLE_LIMIT
  );
  const description = url.searchParams.get("description") || "";

  const [fontData, logoData] = await Promise.all([
    readFile(join(process.cwd(), "fonts/CursorGothic-Regular.ttf")),
    readFile(join(process.cwd(), "public/icon-192.png")),
  ]);

  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  const hasDescription = description.length > 0;
  const titleSize = hasDescription ? 56 : 64;
  const truncatedDescription = truncate(description, OG_DESCRIPTION_LIMIT);

  return new ImageResponse(
    <div
      style={{
        backgroundColor: "#09090b",
        display: "flex",
        flexDirection: "column",
        fontFamily: "CursorGothic",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 40%, transparent 70%)",
          borderRadius: "50%",
          display: "flex",
          height: "900px",
          position: "absolute",
          right: "-100px",
          top: "-300px",
          width: "900px",
        }}
      />

      <div
        style={{
          background:
            "radial-gradient(circle, rgba(180,200,255,0.025) 0%, transparent 60%)",
          borderRadius: "50%",
          bottom: "-400px",
          display: "flex",
          height: "800px",
          left: "-200px",
          position: "absolute",
          width: "800px",
        }}
      />

      <div
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 70%, transparent 100%)",
          display: "flex",
          height: "1px",
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />

      <div
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.12) 80%, transparent 100%)",
          bottom: 0,
          display: "flex",
          height: "2px",
          left: 0,
          position: "absolute",
          right: 0,
        }}
      />

      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.01) 0%, transparent 50%, rgba(255,255,255,0.008) 100%)",
          display: "flex",
          inset: 0,
          position: "absolute",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "56px 80px",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "14px",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: Satori ImageResponse only supports img */}
          <img alt="Pointer Logo" height={36} src={logoBase64} width={36} />
          <div
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 20,
              fontWeight: 400,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
            }}
          >
            Pointer
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: hasDescription ? "20px" : "0",
            maxWidth: "950px",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: titleSize,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          {hasDescription ? (
            <div
              style={{
                color: "rgba(255,255,255,0.45)",
                display: "flex",
                fontSize: 22,
                fontWeight: 400,
                letterSpacing: "0.01em",
                lineHeight: 1.5,
                maxWidth: "780px",
              }}
            >
              {truncatedDescription}
            </div>
          ) : null}
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 17,
              letterSpacing: "0.03em",
            }}
          >
            pointer.dev
          </div>
        </div>
      </div>
    </div>,
    {
      fonts: [
        {
          data: fontData,
          name: "CursorGothic",
          style: "normal",
          weight: 400,
        },
      ],
      height: 630,
      width: 1200,
    }
  );
}
