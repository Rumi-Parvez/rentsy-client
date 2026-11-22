"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "What is rEntsy?",
    answer:
      "rEntsy is an equipment rental and booking marketplace where customers can discover and rent different types of equipment from available owners.",
  },
  {
    question: "How can I rent equipment?",
    answer:
      "Browse the available equipment, open the equipment details page, select your preferred rental option, and continue with the booking and payment process.",
  },
  {
    question: "What types of equipment are available?",
    answer:
      "rEntsy supports different categories such as construction equipment, photography equipment, vehicles, agriculture equipment, electronics, and event equipment.",
  },
  {
    question: "Can equipment owners list their equipment?",
    answer:
      "Yes. Equipment owners can add their equipment, provide rental information, and manage their listings through their account.",
  },
  {
    question: "Is online payment available?",
    answer:
      "Yes. rEntsy supports online payment through the integrated payment system. You can complete the payment during the booking process.",
  },
  {
    question: "How can I manage my bookings?",
    answer:
      "After signing in, you can access your bookings from your dashboard and view the current status of your rental bookings.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative overflow-hidden bg-white py-10 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-[0.2em] text-[#6e13f9] dark:text-[#a66cff]">
            FAQ
          </span>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Frequently Asked{" "}
            <span className="text-[#6e13f9] dark:text-[#a66cff]">
              Questions
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
            Everything you need to know about renting and booking equipment
            with rEntsy.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={faq.question}
                  layout
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? "border-[#6e13f9]/40 bg-[#6e13f9]/5 dark:border-[#6e13f9]/50 dark:bg-[#6e13f9]/10"
                      : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  >
                    <span
                      className={`text-sm font-bold sm:text-base ${
                        isOpen
                          ? "text-[#6e13f9] dark:text-[#a66cff]"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {faq.question}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{
                        duration: 0.25,
                        ease: "easeInOut",
                      }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isOpen
                          ? "bg-[#6e13f9] text-white"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          height: {
                            duration: 0.35,
                            ease: [0.4, 0, 0.2, 1],
                          },
                          opacity: {
                            duration: 0.2,
                          },
                        }}
                      >
                        <div className="px-5 pb-5 sm:px-6">
                          <div className="h-px bg-[#6e13f9]/10 dark:bg-[#6e13f9]/20" />

                          <p className="pt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}