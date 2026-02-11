import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title =
    url.searchParams.get("title") ||
    "The AI-Powered Code Editor for Productive Teams";
  const description = url.searchParams.get("description") || "";

  const [fontData, logoData] = await Promise.all([
    readFile(join(process.cwd(), "fonts/CursorGothic-Regular.ttf")),
    readFile(join(process.cwd(), "public/icon-192.png")),
  ]);

  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  const hasDescription = description.length > 0;
  const titleSize = hasDescription ? 56 : 64;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#09090b",
        fontFamily: "CursorGothic",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-300px",
          right: "-100px",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 40%, transparent 70%)",
          display: "flex",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "-400px",
          left: "-200px",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,200,255,0.025) 0%, transparent 60%)",
          display: "flex",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 70%, transparent 100%)",
          display: "flex",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.12) 80%, transparent 100%)",
          display: "flex",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.01) 0%, transparent 50%, rgba(255,255,255,0.008) 100%)",
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          padding: "56px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: Satori ImageResponse only supports img */}
          <img alt="Pointer Logo" height={36} src={logoBase64} width={36} />
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "rgba(255,255,255,0.9)",
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
              fontSize: titleSize,
              fontWeight: 400,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>
          {hasDescription && (
            <div
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.5,
                letterSpacing: "0.01em",
                maxWidth: "780px",
                display: "flex",
              }}
            >
              {description.length > 140
                ? `${description.slice(0, 137)}...`
                : description}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.03em",
            }}
          >
            pointer.dev
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "CursorGothic",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
