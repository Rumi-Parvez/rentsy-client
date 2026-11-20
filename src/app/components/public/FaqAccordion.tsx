"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
  group?: string;
};

export function FaqAccordion({
  items,
  defaultOpen = 0,
}: {
  items: FaqItem[];
  defaultOpen?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={`${item.group || "faq"}-${item.question}`}
            className={`overflow-hidden rounded-2xl border bg-white transition dark:bg-slate-900 ${
              isOpen
                ? "border-[#6e13f9]/40 shadow-md dark:border-[#a66cff]/40"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {item.question}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                  isOpen
                    ? "rotate-180 bg-[#6e13f9] text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
