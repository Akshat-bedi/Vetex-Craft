import { FaqAccordion } from "@/components/public/FaqAccordion";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "FAQ | Minecraft Store",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
  });

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category]!.push(faq);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-pixel text-sm text-text-accent sm:text-base">
        FREQUENTLY ASKED QUESTIONS
      </h1>
      <p className="mt-2 font-retro text-xl text-text-secondary">
        Everything you need to know before you buy
      </p>

      {Object.entries(grouped).map(([category, categoryFaqs]) => (
        <div key={category} className="mt-10">
          <h2 className="mb-4 font-retro text-2xl text-text-gold">{category}</h2>
          <FaqAccordion faqs={categoryFaqs} showHeader={false} />
        </div>
      ))}

      {faqs.length === 0 && (
        <p className="mt-8 font-retro text-xl text-text-secondary">
          No FAQs yet. Check back soon!
        </p>
      )}
    </div>
  );
}
