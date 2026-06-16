import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-accent-gold text-black",
  PROCESSING: "bg-text-diamond text-black",
  DELIVERED: "bg-accent-green text-black",
  CANCELLED: "bg-accent-red text-white",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block border-2 border-black px-3 py-1 font-retro text-sm uppercase",
        STATUS_STYLES[status] ?? "bg-bg-stone text-text-primary",
      )}
    >
      {status}
    </span>
  );
}
