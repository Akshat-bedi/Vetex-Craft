"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderOpen,
  Ticket,
  Image,
  MessageSquare,
  HelpCircle,
  Settings,
  Plus,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/products/new", label: "Add Product", icon: Plus, indent: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r-[3px] border-[#555] bg-bg-secondary">
      <div className="border-b-[3px] border-[#555] p-4">
        <Link href="/admin" className="font-pixel text-[10px] text-text-accent">
          MC ADMIN
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 font-retro text-lg transition-colors",
                item.indent && "ml-3 text-base",
                active
                  ? "bg-accent-green text-black"
                  : "text-text-primary hover:bg-bg-card",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t-[3px] border-[#555] p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 font-retro text-lg text-text-diamond hover:text-text-accent"
        >
          <ExternalLink className="h-4 w-4" />
          View Store
        </Link>
      </div>
    </aside>
  );
}
