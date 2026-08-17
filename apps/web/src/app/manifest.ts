import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClaimSaver+",
    short_name: "ClaimSaver+",
    description: "Florida PIP guided claim platform",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d9488",
  };
}
