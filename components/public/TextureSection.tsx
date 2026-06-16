import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type TextureVariant =
  | "dirt"
  | "grass"
  | "stone"
  | "wood"
  | "nether"
  | "none";

type TextureSectionProps = {
  children: ReactNode;
  texture?: TextureVariant;
  className?: string;
  as?: "section" | "div";
  id?: string;
};

export function TextureSection({
  children,
  texture = "stone",
  className,
  as: Tag = "section",
  id,
}: TextureSectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        texture !== "none" && "texture-overlay",
        texture === "dirt" && "texture-dirt",
        texture === "grass" && "texture-grass",
        texture === "stone" && "texture-stone",
        texture === "wood" && "texture-wood",
        texture === "nether" && "texture-nether",
        className,
      )}
    >
      <div className="relative z-[1]">{children}</div>
    </Tag>
  );
}
