import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Geometry from the Figma "pointer-og" frame. The icon PNG has transparent
// side padding, so the 16px flex gap renders as the spec's 36px optical gap.
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_BACKGROUND = "#13120D";
const MARK_SIZE = 164;
const WORDMARK_SIZE = 125.91;
const WORDMARK_TRACKING = "-0.03em";
const WORDMARK_INNER_TRACKING = "-0.06em";
const LOCKUP_GAP = 16;

export async function GET() {
  const [fontData, logoData] = await Promise.all([
    readFile(join(process.cwd(), "fonts/CursorGothic-Regular.ttf")),
    readFile(join(process.cwd(), "public/icon-512.png")),
  ]);

  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        backgroundColor: OG_BACKGROUND,
        display: "flex",
        gap: `${LOCKUP_GAP}px`,
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: Satori ImageResponse only supports img */}
      <img
        alt="Pointer Logo"
        height={MARK_SIZE}
        src={logoBase64}
        width={MARK_SIZE}
      />
      <div
        style={{
          color: "white",
          display: "flex",
          fontFamily: "CursorGothic",
          fontSize: WORDMARK_SIZE,
          fontWeight: 400,
          letterSpacing: WORDMARK_TRACKING,
        }}
      >
        <span>P</span>
        <span style={{ letterSpacing: WORDMARK_INNER_TRACKING }}>OIN</span>
        <span>TER</span>
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
      height: OG_HEIGHT,
      width: OG_WIDTH,
    }
  );
}
