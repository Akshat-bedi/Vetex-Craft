import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
};

export function StatsCard({ label, value, icon: Icon, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "border-[3px] border-[#555] bg-bg-card p-4 shadow-pixel",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-retro text-sm text-text-secondary">{label}</p>
          <p className="mt-1 font-pixel text-sm text-text-accent">{value}</p>
        </div>
        <Icon className="h-6 w-6 text-text-diamond" />
      </div>
    </div>
  );
}
