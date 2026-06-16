import Link from "next/link";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

const CATEGORY_LINKS = [
  { href: "/store?category=modpacks", label: "Modpacks" },
  { href: "/store?category=plugins", label: "Plugins" },
  { href: "/store?category=maps", label: "Maps" },
  { href: "/store?category=resource-packs", label: "Resource Packs" },
];

const SUPPORT_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "mailto:support@minecraftstore.local", label: "Contact" },
  { href: "/cart", label: "Cart" },
];

const SOCIAL_LINKS = [
  { href: "https://discord.gg/fN47Pq4VF", label: "Discord" },
  { href: "#", label: "Twitter" },
  { href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t-[3px] border-[#555] bg-bg-secondary texture-overlay texture-stone">
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-pixel text-xs text-text-accent">MC STORE</p>
            <p className="mt-3 max-w-xs font-body text-sm text-text-secondary">
              Premium Minecraft modpacks, plugins, maps, and more — built for
              players who want the block-world done right.
            </p>
          </div>

          <FooterColumn title="Quick Links" links={QUICK_LINKS} />
          <FooterColumn title="Categories" links={CATEGORY_LINKS} />
          <div className="space-y-6">
            <FooterColumn title="Support" links={SUPPORT_LINKS} />
            <FooterColumn title="Social" links={SOCIAL_LINKS} external />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t-2 border-[#555] pt-6 sm:flex-row">
          <p className="font-body text-xs text-text-secondary">
            © {new Date().getFullYear()} Minecraft Store. All rights reserved.
          </p>
          <div className="flex gap-4 font-retro text-sm text-text-secondary">
            <Link href="#" className="hover:text-text-gold">
              Terms
            </Link>
            <Link href="#" className="hover:text-text-gold">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  external,
}: {
  title: string;
  links: { href: string; label: string }[];
  external?: boolean;
}) {
  return (
    <div>
      <h3 className="font-retro text-xl text-text-gold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            {external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-text-secondary transition-colors hover:text-text-accent"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="font-body text-sm text-text-secondary transition-colors hover:text-text-accent"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
