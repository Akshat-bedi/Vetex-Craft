import "dotenv/config";
import bcrypt from "bcryptjs";
import { defaultCategories } from "@/data/categories";
import { defaultFaqs } from "@/data/faqs";
import { prisma } from "@/lib/db";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@minecraftstore.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { password: passwordHash, role: "ADMIN" },
    create: {
      email: ADMIN_EMAIL,
      password: passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin user: ${ADMIN_EMAIL}`);

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Minecraft Store",
      tagline: "Premium packages for your block world",
      currency: "USD",
      contactEmail: "support@minecraftstore.local",
      discordLink: "https://discord.gg/example",
      manualPaymentInstructions:
        "Send payment via PayPal to payments@minecraftstore.local. Include your order ID in the payment note. Orders are processed within 24 hours after payment confirmation.",
      defaultDeliveryInstructions:
        "Check your email and Discord DMs for delivery details within 24 hours.",
      metaTitle: "Minecraft Store — Modpacks, Plugins & Maps",
      metaDescription:
        "Premium Minecraft modpacks, plugins, maps, and resource packs with instant delivery.",
    },
  });
  console.log("Site settings created.");

  const categoryMap = new Map<string, string>();

  for (const category of defaultCategories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        displayOrder: category.displayOrder,
      },
      create: category,
    });
    categoryMap.set(category.slug, record.id);
  }
  console.log(`Categories: ${defaultCategories.length}`);

  const modpacksId = categoryMap.get("modpacks")!;
  const pluginsId = categoryMap.get("plugins")!;
  const mapsId = categoryMap.get("maps")!;

  const sampleProducts = [
    {
      name: "Skyblock Essentials Modpack",
      slug: "skyblock-essentials-modpack",
      shortDescription:
        "Everything you need for a polished Skyblock server — quests, economy, and QoL mods.",
      longDescription:
        "## Skyblock Essentials\n\nA curated modpack with **120+ mods** tuned for performance and Skyblock gameplay.\n\n- Custom quest lines\n- Balanced economy\n- One-click install guide",
      images: ["/textures/grass.png"],
      price: 29.99,
      comparePrice: 39.99,
      tier: "GOLD" as const,
      tags: ["bundle", "sale", "skyblock"],
      whatsIncluded: [
        "Modpack zip (Forge 1.20.1)",
        "Server config files",
        "Setup documentation",
        "30-day Discord support",
      ],
      stock: -1,
      featured: true,
      status: "PUBLISHED" as const,
      categoryId: modpacksId,
      deliveryInstructions:
        "Download link sent to your email. Join our Discord for install help.",
    },
    {
      name: "Economy+ Plugin Bundle",
      slug: "economy-plus-plugin-bundle",
      shortDescription:
        "Auction house, shops, jobs, and taxes — a complete economy suite for Paper servers.",
      longDescription:
        "## Economy+ Bundle\n\nFive premium plugins that work together out of the box.\n\nCompatible with **Paper 1.20+**.",
      images: ["/textures/stone.png"],
      price: 19.99,
      comparePrice: null,
      tier: "IRON" as const,
      tags: ["plugins", "economy"],
      whatsIncluded: [
        "5 Paper plugins (JAR files)",
        "config.yml presets",
        "Permission setup guide",
      ],
      stock: -1,
      featured: true,
      status: "PUBLISHED" as const,
      categoryId: pluginsId,
      deliveryInstructions: "Plugin files delivered via email within 1 hour.",
    },
    {
      name: "Lost Temple Adventure Map",
      slug: "lost-temple-adventure-map",
      shortDescription:
        "4–6 hour adventure map with puzzles, custom mobs, and a boss fight finale.",
      longDescription:
        "## Lost Temple\n\nExplore ancient ruins, solve redstone puzzles, and defeat the Guardian.\n\n- Singleplayer & co-op (2–4 players)\n- No mods required (vanilla 1.20.1)",
      images: ["/textures/dirt.png"],
      price: 12.99,
      comparePrice: 15.99,
      tier: "DIAMOND" as const,
      tags: ["maps", "adventure", "new"],
      whatsIncluded: [
        "World download (ZIP)",
        "Resource pack (optional)",
        "Walkthrough hints PDF",
      ],
      stock: 50,
      featured: false,
      status: "PUBLISHED" as const,
      categoryId: mapsId,
      deliveryInstructions:
        "World download link in your order confirmation email.",
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`Products: ${sampleProducts.length}`);

  const banners = [
    {
      title: "BUILD YOUR WORLD",
      subtitle: "Premium modpacks, plugins & maps — instant delivery",
      imageUrl: "/textures/grass.png",
      ctaText: "Shop Now",
      ctaLink: "/store",
      displayOrder: 0,
    },
    {
      title: "SUMMER SALE",
      subtitle: "Use code CRAFT20 for 20% off select bundles",
      imageUrl: "/textures/dirt.png",
      ctaText: "View Deals",
      ctaLink: "/store",
      displayOrder: 1,
    },
  ];

  for (const banner of banners) {
    const existing = await prisma.banner.findFirst({
      where: { title: banner.title },
    });
    if (existing) {
      await prisma.banner.update({ where: { id: existing.id }, data: banner });
    } else {
      await prisma.banner.create({ data: banner });
    }
  }
  console.log(`Banners: ${banners.length}`);

  const testimonials = [
    {
      username: "SteveMiner42",
      review:
        "Best Skyblock pack I've used. Setup guide was clear and support on Discord was fast.",
      rating: 5,
    },
    {
      username: "CraftQueen",
      review:
        "Economy plugins worked perfectly on our Paper server. Worth every emerald.",
      rating: 5,
    },
    {
      username: "RedstoneRex",
      review:
        "Lost Temple map was epic — our community finished it in one weekend!",
      rating: 4,
    },
  ];

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { username: testimonial.username },
    });
    if (existing) {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: testimonial,
      });
    } else {
      await prisma.testimonial.create({ data: testimonial });
    }
  }
  console.log(`Testimonials: ${testimonials.length}`);

  for (const faq of defaultFaqs) {
    const existing = await prisma.faq.findFirst({
      where: { question: faq.question },
    });
    if (existing) {
      await prisma.faq.update({ where: { id: existing.id }, data: faq });
    } else {
      await prisma.faq.create({ data: faq });
    }
  }
  console.log(`FAQs: ${defaultFaqs.length}`);

  await prisma.coupon.upsert({
    where: { code: "CRAFT20" },
    update: {},
    create: {
      code: "CRAFT20",
      type: "PERCENTAGE",
      value: 20,
      minOrderValue: 10,
      usageLimit: 100,
      active: true,
    },
  });
  console.log("Coupon: CRAFT20");

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
