"use client";

import { cn } from "@/lib/utils";

export type CategoryOption = {
  slug: string;
  name: string;
};

type CategoryFilterProps = {
  categories: CategoryOption[];
  selected: string | null;
  onChange: (slug: string | null) => void;
  className?: string;
};

export function CategoryFilter({
  categories,
  selected,
  onChange,
  className,
}: CategoryFilterProps) {
  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="tablist"
      aria-label="Filter by category"
    >
      <CategoryPill
        label="All"
        active={selected === null}
        variant="stone"
        onClick={() => onChange(null)}
      />
      {categories.map((category, index) => (
        <CategoryPill
          key={category.slug}
          label={category.name}
          active={selected === category.slug}
          variant={index % 2 === 0 ? "dirt" : "stone"}
          onClick={() => onChange(category.slug)}
        />
      ))}
    </div>
  );
}

function CategoryPill({
  label,
  active,
  variant,
  onClick,
}: {
  label: string;
  active: boolean;
  variant: "dirt" | "stone";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "border-2 border-black px-4 py-2 font-retro text-lg transition-colors",
        active
          ? "bg-accent-green text-black"
          : variant === "dirt"
            ? "bg-bg-dirt text-text-primary hover:brightness-110"
            : "bg-bg-stone text-text-primary hover:brightness-110",
      )}
    >
      {label}
    </button>
  );
}
