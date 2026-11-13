import {
  type WallpaperFunc,
  type WallpaperMenuItem,
} from "components/system/Desktop/Wallpapers/types";
import { type WallpaperFit } from "contexts/session/types";

export const bgPositionSize: Record<WallpaperFit, string> = {
  center: "center center",
  fill: "center center / cover",
  fit: "center center / contain",
  stretch: "center center / 100% 100%",
  tile: "50% 50%",
};

export const WALLPAPER_PATHS: Record<
  string,
  () => Promise<{ default: WallpaperFunc; libs?: string[] }>
> = {
  COASTAL_LANDSCAPE: () =>
    import("components/system/Desktop/Wallpapers/ShaderToy/CoastalLandscape"),
  GALAXY: () => import("components/system/Desktop/Wallpapers/Galaxy"),
  HEXELLS: () => import("components/system/Desktop/Wallpapers/hexells"),
  MATRIX: () => import("components/system/Desktop/Wallpapers/Matrix"),
  VANTA: () => import("components/system/Desktop/Wallpapers/vantaWaves"),
};

export const WALLPAPER_WORKERS: Record<string, () => Worker> = {
  COASTAL_LANDSCAPE: (): Worker =>
    new Worker(
      new URL(
        "components/system/Desktop/Wallpapers/ShaderToy/CoastalLandscape/wallpaper.worker",
        import.meta.url
      ),
      { name: "Wallpaper (Coastal Landscape)" }
    ),
  GALAXY: (): Worker =>
    new Worker(
      new URL(
        "components/system/Desktop/Wallpapers/Galaxy/wallpaper.worker",
        import.meta.url
      ),
      { name: "Wallpaper (Galaxy)" }
    ),
  HEXELLS: (): Worker =>
    new Worker(
      new URL(
        "components/system/Desktop/Wallpapers/hexells/wallpaper.worker",
        import.meta.url
      ),
      { name: "Wallpaper (Hexells)" }
    ),
  VANTA: (): Worker =>
    new Worker(
      new URL(
        "components/system/Desktop/Wallpapers/vantaWaves/wallpaper.worker",
        import.meta.url
      ),
      { name: "Wallpaper (Vanta Waves)" }
    ),
};

export const WALLPAPER_WORKER_NAMES = Object.keys(WALLPAPER_WORKERS);

export const REDUCED_MOTION_PERCENT = 0.1;

export const WALLPAPER_MENU: WallpaperMenuItem[] = [
  // --- Curated Infinite Looping GIFs ---
  {
    hasAlt: false,
    id: "/Users/Public/Wallpapers/Fish Pond.mp4",
    name: "Fish Pond",
  },
  {
    hasAlt: false,
    id: "/Users/Public/Wallpapers/Flowing Diamond.mp4",
    name: "Flowing Diamond",
  },
  {
    hasAlt: false,
    id: "/Users/Public/Wallpapers/Running Away.gif",
    name: "Running Away",
  },
  {
    hasAlt: false,
    id: "/Users/Public/Wallpapers/Zooming Monitor.gif",
    name: "Zooming Monitor",
  },

  // --- Cinematic Live Video Wallpapers ---
  {
    hasAlt: false,
    id: "/Users/Public/Wallpapers/Darth Vader Night Rain.mp4",
    name: "Darth Vader (Rain)",
  },
  {
    hasAlt: false,
    id: "/Users/Public/Wallpapers/Revan Kotor.mp4",
    name: "Darth Revan (KotOR)",
  },
  {
    hasAlt: false,
    id: "/Users/Public/Wallpapers/Darth Vader Ascends.mp4",
    name: "Darth Vader Ascends",
  },
  {
    hasAlt: false,
    id: "/Users/Public/Wallpapers/Millennium Falcon.mp4",
    name: "Millennium Falcon",
  },

  // --- Tech & Shader Wallpapers ---
  { id: "GALAXY", name: "Milky Way Galaxy" },
  { id: "MATRIX 3D", name: "Matrix Code (3D)" },
  { id: "MATRIX 2D", name: "Matrix Code (2D)" },
  { id: "VANTA", name: "Vanta Waves" },
  { hasAlt: false, id: "HEXELLS", name: "Hexells" },
  { hasAlt: false, id: "COASTAL_LANDSCAPE", name: "Coastal Landscape" },
];

export const BASE_CANVAS_SELECTOR = ":scope > canvas:not(#desktop-fly)";
export const BASE_VIDEO_SELECTOR = ":scope > video";
export const PRELOAD_ID = "preloadWallpaper";
export const MAX_RETRIES = 5;
