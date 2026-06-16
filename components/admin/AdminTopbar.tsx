"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/orders": "Orders",
  "/admin/categories": "Categories",
  "/admin/coupons": "Coupons",
  "/admin/banners": "Banners",
  "/admin/testimonials": "Testimonials",
  "/admin/faqs": "FAQs",
  "/admin/settings": "Settings",
};

function getTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/admin/products/")) return "Edit Product";
  if (pathname.startsWith("/admin/orders/")) return "Order Detail";
  return "Admin";
}

type AdminTopbarProps = {
  email: string;
};

export function AdminTopbar({ email }: AdminTopbarProps) {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="flex h-14 items-center justify-between border-b-[3px] border-[#555] bg-bg-card px-6 shadow-pixel">
      <h1 className="font-pixel text-[10px] text-text-gold sm:text-xs">
        {title.toUpperCase()}
      </h1>
      <div className="flex items-center gap-4">
        <span className="hidden font-retro text-lg text-text-secondary sm:inline">
          {email}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-retro text-sm"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
        >
          <LogOut className="mr-1 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
