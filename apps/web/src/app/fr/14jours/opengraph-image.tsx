import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "14 JOURS. Liste PIP en Floride de ClaimSaver+";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let logoSrc: string | null = null;
  try {
    const buf = await readFile(
      join(process.cwd(), "public/images/brand/claimsaver-plus-lockup-on-dark.png"),
    );
    logoSrc = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    logoSrc = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#020617",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
        }}
      >
        <div
          style={{
            color: "#2dd4bf",
            fontSize: 148,
            fontWeight: 800,
            letterSpacing: -8,
            lineHeight: 0.9,
          }}
        >
          14 JOURS.
        </div>
        <div style={{ color: "#e2e8f0", fontSize: 36, marginTop: 24 }}>
          Liste PIP en Floride
        </div>
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoSrc}
            alt=""
            width={280}
            height={68}
            style={{ position: "absolute", right: 64, bottom: 48, objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              right: 64,
              bottom: 48,
              color: "#5eead4",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ClaimSaver+
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
