"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/public/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "https://discord.gg/fN47Pq4VF", label: "Discord", external: true },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b-[3px] border-[#555] bg-bg-primary/85 shadow-pixel backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="truncate font-pixel text-[9px] text-text-accent sm:text-xs">
              MC STORE
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                external={"external" in link}
                active={
                  !("external" in link) &&
                  (link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href))
                }
              />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${itemCount} items`}
              className="pixel-hover relative border-2 border-black bg-bg-card p-2 text-text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center border-2 border-black bg-accent-green px-1 font-retro text-xs text-black">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="pixel-hover border-2 border-black bg-bg-stone p-2 md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 top-[53px] z-40 bg-black/50 md:hidden"
              aria-label="Close menu overlay"
              onClick={() => setMobileOpen(false)}
            />
            <nav
              id="mobile-nav"
              className="animate-slide-down relative z-50 border-t-[3px] border-[#555] bg-bg-secondary px-4 py-3 md:hidden"
              aria-label="Mobile"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <NavLink
                      href={link.href}
                      label={link.label}
                      external={"external" in link}
                      active={
                        !("external" in link) &&
                        (link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href))
                      }
                      onClick={() => setMobileOpen(false)}
                      block
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </header>

      <CartDrawer />
    </>
  );
}

function NavLink({
  href,
  label,
  active,
  external,
  onClick,
  block,
}: {
  href: string;
  label: string;
  active: boolean;
  external?: boolean;
  onClick?: () => void;
  block?: boolean;
}) {
  const className = cn(
    "relative font-retro text-xl px-3 py-2 transition-colors",
    block && "block w-full border-b border-[#555] last:border-b-0",
    active
      ? "text-text-accent"
      : "text-text-primary hover:text-text-gold",
  );

  const indicator = active && (
    <span
      className="absolute bottom-0 left-3 right-3 h-1 bg-accent-green"
      aria-hidden
    />
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {label}
        {indicator}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {label}
      {indicator}
    </Link>
  );
}
