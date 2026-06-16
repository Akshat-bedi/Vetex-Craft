import { CategoriesShowcase } from "@/components/public/CategoriesShowcase";
import { DiscordCta } from "@/components/public/DiscordCta";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { FeaturedSection } from "@/components/public/FeaturedSection";
import { FeaturesSection } from "@/components/public/FeaturesSection";
import { HeroBanner } from "@/components/public/HeroBanner";
import { StatsBar } from "@/components/public/StatsBar";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { getCategoriesWithCounts, getSiteSettings } from "@/lib/data";
import { prisma } from "@/lib/db";
import { toProductCard } from "@/lib/product";

export default async function HomePage() {
  const [products, categories, settings, banners, testimonials, faqs] =
    await Promise.all([
      prisma.product.findMany({
        where: { status: "PUBLISHED" },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      getCategoriesWithCounts(),
      getSiteSettings(),
      prisma.banner.findMany({
        where: { active: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.faq.findMany({ orderBy: { displayOrder: "asc" } }),
    ]);

  const productCards = products.map(toProductCard);
  const currency = settings?.currency ?? "USD";

  return (
    <>
      <HeroBanner banners={banners} />
      <StatsBar productCount={products.length} />
      <FeaturedSection products={productCards} currency={currency} />
      <CategoriesShowcase
        categories={categories.map((category) => ({
          slug: category.slug,
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl,
          productCount: category._count.products,
        }))}
      />
      <FeaturesSection />
      <TestimonialsSection testimonials={testimonials} />
      <section className="texture-overlay texture-dirt py-12">
        <FaqAccordion faqs={faqs} limit={5} showViewAll />
      </section>
      <DiscordCta discordLink={settings?.discordLink} />
    </>
  );
}
