import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClaimSaver+",
    short_name: "ClaimSaver+",
    description: "File a Florida PIP claim yourself — self-help no-fault software",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d9488",
    icons: [
      { src: "/images/brand/claimsaver-plus-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/brand/claimsaver-plus-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
