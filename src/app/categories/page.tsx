import type { Metadata } from "next";
import { CtaPanel, PublicPage, SectionTitle } from "../components/public/PublicPage";
import CategoriesBrowser from "../components/public/CategoriesBrowser";

export const metadata: Metadata = {
  title: "Equipment Categories — rEntsy",
  description:
    "Browse every equipment category on rEntsy, from construction and vehicles to photography and events.",
};

export default function CategoriesPage() {
  return (
    <PublicPage
      eyebrow="Categories"
      title="Find equipment by"
      highlight="category."
      description="Six curated categories covering construction, photography, transport, agriculture, electronics and events. Every listing is reviewed before it appears."
    >
      <section>
        <SectionTitle
          title="All categories"
          description="Counts update automatically as approved equipment is added to the marketplace."
        />
        <div className="mt-6">
          <CategoriesBrowser />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Verified listings",
            text: "Admins review equipment before it becomes bookable.",
          },
          {
            title: "Flexible billing",
            text: "Choose hourly, daily, weekly or monthly rentals.",
          },
          {
            title: "Local availability",
            text: "Filter by location to find equipment near your site.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {item.title}
            </h2>
            <p className="mt-1.5 text-xs leading-6 text-slate-600 dark:text-slate-400">
              {item.text}
            </p>
          </div>
        ))}
      </section>

      <CtaPanel
        title="Can't find the category you need?"
        description="Tell us what you are looking for and we will help you find an owner or add the category."
        primaryHref="/contact"
        primaryLabel="Request equipment"
        secondaryHref="/equipment"
        secondaryLabel="Browse all equipment"
      />
    </PublicPage>
  );
}
