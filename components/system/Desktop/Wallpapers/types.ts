import { type GalaxyConfig } from "components/system/Desktop/Wallpapers/Galaxy/config";
import type MatrixConfig from "components/system/Desktop/Wallpapers/Matrix/config";
import { type VantaWavesConfig } from "components/system/Desktop/Wallpapers/vantaWaves/types";
import { type Size } from "components/system/Window/RndWindow/useResizable";
import { type WallpaperFit } from "contexts/session/types";

declare global {
  interface Window {
    DEBUG_DISABLE_WALLPAPER?: boolean;
    WallpaperDestroy?: () => void;
  }
}

export type WallpaperConfig =
  | Partial<GalaxyConfig>
  | Partial<typeof MatrixConfig>
  | Partial<VantaWavesConfig>;

export type WallpaperFunc = (
  el: HTMLElement | null,
  config?: WallpaperConfig,
  fallback?: () => void
) => Promise<void> | void;

export type OffscreenRenderProps = {
  canvas: OffscreenCanvas;
  clockSize?: Size;
  config?: Partial<GalaxyConfig> | VantaWavesConfig;
  devicePixelRatio: number;
};

export type WallpaperMenuItem = {
  hasAlt?: boolean;
  id: string;
  name?: string;
  requiresWebGPU?: boolean;
};

export type WallpaperMessage = { message: string; type: string };

type WallpaperData = {
  fallbackBackground: string;
  newWallpaperFit: WallpaperFit;
  updateTimeout: number;
  wallpaperUrl: string;
};

export type WallpaperHandler = (props: {
  isAlt: boolean;
  signal: AbortSignal;
}) => Promise<WallpaperData> | WallpaperData;

export type ApodResponse = {
  hdurl?: string;
};

export type ArtInstituteOfChicagoResponse = {
  data: {
    image_id: string;
    thumbnail: { height: number; width: number } | null;
  }[];
};

export type MetMuseumSearchResponse = {
  objectIDs: null | number[];
  total: number;
};

export type MetMuseumObjectResponse = {
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall: string;
};
