import { Package, Headphones, Star, Users } from "lucide-react";
import { TextureSection } from "@/components/public/TextureSection";

type StatsBarProps = {
  productCount: number;
};

const STATS = [
  { icon: Users, label: "500+ Happy Players" },
  { icon: Package, label: "Products", dynamic: "products" as const },
  { icon: Headphones, label: "24hr Support" },
  { icon: Star, label: "4.9★ Rating" },
];

export function StatsBar({ productCount }: StatsBarProps) {
  return (
    <TextureSection
      texture="stone"
      className="border-b-[3px] border-[#555] bg-bg-secondary py-6"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-4 sm:px-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const label =
            stat.dynamic === "products"
              ? `${productCount}+ Products`
              : stat.label;

          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 border-[3px] border-[#555] bg-bg-card px-4 py-3 shadow-pixel"
            >
              <Icon className="h-6 w-6 shrink-0 text-text-accent" />
              <span className="font-retro text-base text-text-primary sm:text-lg">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </TextureSection>
  );
}
