import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function parseYoutubeVideoId(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id || null;
    }

    if (
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2] ?? null;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] ?? null;
      }

      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
}

export function isYoutubeUrl(url: string): boolean {
  return parseYoutubeVideoId(url) !== null;
}

export function getYoutubeWatchUrl(url: string): string | null {
  const id = parseYoutubeVideoId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

export function getYoutubeThumbnailUrl(url: string): string | null {
  const id = parseYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

const PRODUCT_MEDIA_FALLBACK = "/textures/stone.png";

export function resolveProductMedia(source?: string | null) {
  if (!source) {
    return {
      thumbnailSrc: PRODUCT_MEDIA_FALLBACK,
      cartImageSrc: PRODUCT_MEDIA_FALLBACK,
      youtubeUrl: null as string | null,
    };
  }

  const youtubeUrl = getYoutubeWatchUrl(source);
  const youtubeThumbnail = getYoutubeThumbnailUrl(source);

  if (youtubeUrl && youtubeThumbnail) {
    return {
      thumbnailSrc: youtubeThumbnail,
      cartImageSrc: youtubeThumbnail,
      youtubeUrl,
    };
  }

  return {
    thumbnailSrc: source,
    cartImageSrc: source,
    youtubeUrl: null as string | null,
  };
}
