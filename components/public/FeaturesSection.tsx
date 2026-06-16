import type { CSSProperties } from "react";
import { RefreshCw, Shield, Zap, MessageCircle } from "lucide-react";
import { TextureSection } from "@/components/public/TextureSection";
import { cn } from "@/lib/utils";

const FEATURE_GLOW = "rgba(85, 255, 85, 0.35)" as const;

const FEATURES = [
  {
    icon: Shield,
    title: "Premium Quality",
    description:
      "Every package is tested and tuned for performance before it hits the store.",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description:
      "Digital downloads and setup files delivered to your inbox within hours.",
  },
  {
    icon: MessageCircle,
    title: "Discord Support",
    description:
      "Get help from real humans on our Discord — install guides, configs, and more.",
  },
  {
    icon: RefreshCw,
    title: "Regular Updates",
    description:
      "Modpacks and plugins receive updates so your server stays current.",
  },
];

export function FeaturesSection() {
  return (
    <TextureSection texture="dirt" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-pixel text-xs text-text-gold sm:text-sm">
          WHY CHOOSE US
        </h2>
        <p className="mt-1 font-retro text-lg text-text-secondary">
          Built for server owners and players who expect more
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  "pixel-hover-card border-[3px] border-[#555] bg-bg-card p-5 shadow-pixel",
                  "hover:border-accent-diamond",
                )}
                style={{ "--glow-color": FEATURE_GLOW } as CSSProperties}
              >
                <div className="mb-3 inline-flex border-2 border-black bg-bg-grass p-2">
                  <Icon className="h-6 w-6 text-text-primary" />
                </div>
                <h3 className="font-retro text-xl text-text-gold">
                  {feature.title}
                </h3>
                <p className="mt-2 font-body text-sm text-text-secondary">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </TextureSection>
  );
}
