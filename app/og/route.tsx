import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Pointer";

  const fontData = await readFile(
    join(process.cwd(), "fonts/CursorGothic-Bold.woff2")
  );

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: "CursorGothic",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          padding: "80px",
          background: "rgba(255, 255, 255, 0.9)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            textAlign: "center",
            color: "black",
            lineHeight: 1.1,
            letterSpacing: "-0.05em",
          }}
        >
          {title}
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
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
