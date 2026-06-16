import type { ProductTier } from "@/types/product";

export const TIER_STYLES: Record<
  ProductTier,
  { label: string; bg: string; border: string; text: string }
> = {
  WOOD: {
    label: "Wood",
    bg: "#8B6914",
    border: "#5c4510",
    text: "#fff",
  },
  IRON: {
    label: "Iron",
    bg: "#AAAAAA",
    border: "#666666",
    text: "#000",
  },
  GOLD: {
    label: "Gold",
    bg: "#FFD700",
    border: "#b37700",
    text: "#000",
  },
  DIAMOND: {
    label: "Diamond",
    bg: "#5DE6E6",
    border: "#2a9a9a",
    text: "#000",
  },
  NETHERITE: {
    label: "Netherite",
    bg: "#9C7DBF",
    border: "#5a3d7a",
    text: "#fff",
  },
};

export function getTierStyle(tier: ProductTier) {
  return TIER_STYLES[tier] ?? TIER_STYLES.WOOD;
}
