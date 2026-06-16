export type ProductTier =
  | "WOOD"
  | "IRON"
  | "GOLD"
  | "DIAMOND"
  | "NETHERITE";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  price: number;
  comparePrice?: number | null;
  tier: ProductTier;
  featured?: boolean;
  images: string[];
  category?: {
    name: string;
    slug: string;
  };
}
