"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export function FaqAccordion({
  faqs,
  limit,
  showViewAll = false,
  showHeader = true,
}: {
  faqs: FaqItem[];
  limit?: number;
  showViewAll?: boolean;
  showHeader?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const displayed = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section className={showHeader ? "py-12" : ""}>
      <div className={showHeader ? "mx-auto max-w-3xl px-4 sm:px-6" : ""}>
        {showHeader && (
          <>
            <h2 className="font-pixel text-xs text-text-gold sm:text-sm">FAQ</h2>
            <p className="mt-1 font-retro text-lg text-text-secondary">
              Common questions answered
            </p>
          </>
        )}
        <ul className={cn("space-y-2", showHeader && "mt-6")}>
          {displayed.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <li
                key={faq.id}
                className="border-[3px] border-[#555] shadow-pixel"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 bg-bg-dirt px-4 py-3 text-left font-retro text-lg text-text-primary hover:brightness-110"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="border-t-2 border-black bg-bg-card px-4 py-3 font-body text-sm text-text-secondary">
                    {faq.answer}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {showViewAll && faqs.length > (limit ?? 0) && (
          <p className="mt-4 text-center">
            <Link
              href="/faq"
              className="font-retro text-xl text-text-accent hover:underline"
            >
              View all FAQs →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
