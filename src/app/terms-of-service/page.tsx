import type { Metadata } from "next";
import { LegalLayout, LegalSection, PublicPage } from "../components/public/PublicPage";

export const metadata: Metadata = {
  title: "Terms of Service — rEntsy",
  description:
    "The terms that govern your use of the rEntsy equipment rental marketplace.",
};

export default function TermsOfServicePage() {
  return (
    <PublicPage
      eyebrow="Legal"
      title="Terms of"
      highlight="Service"
      description="These terms govern your access to and use of the rEntsy marketplace for customers, equipment owners and administrators."
    >
      <LegalLayout updated="21 November 2026">
        <LegalSection title="1. Accepting these terms">
          <p>
            By creating an account or using rEntsy, you agree to these terms. If
            you do not agree, please do not use the platform. You must be able to
            enter into a binding rental agreement to use the marketplace.
          </p>
        </LegalSection>

        <LegalSection title="2. Accounts and roles">
          <p>
            Accounts are available in three roles: customer, owner and admin.
            You are responsible for the accuracy of your account information and
            for keeping your password secure. You must not share your account or
            attempt to access another user&apos;s dashboard.
          </p>
          <p>
            Role changes are reviewed by administrators. Creating an account
            does not guarantee approval of a listing or access to owner tools.
          </p>
        </LegalSection>

        <LegalSection title="3. Equipment listings">
          <p>
            Owners are responsible for the accuracy of their listings, including
            condition, quantity, location, pricing and rental terms. Equipment
            must be legally owned or authorized for rental and safe for its
            intended use.
          </p>
          <p>
            New listings start as pending and are reviewed by an admin. We may
            reject or remove listings that are incomplete, misleading, unsafe or
            prohibited.
          </p>
        </LegalSection>

        <LegalSection title="4. Bookings and payments">
          <p>
            A booking request is an offer to rent equipment for the selected
            dates and quantity. The rental is confirmed when the owner accepts
            it. Totals are calculated from the listing rate, rental duration and
            quantity shown at checkout.
          </p>
          <p>
            Payments are processed through our payment provider. You agree to
            pay the displayed total and any applicable taxes. Refunds are
            reviewed according to the owner&apos;s rental terms and the timing of
            cancellation.
          </p>
        </LegalSection>

        <LegalSection title="5. Renter responsibilities">
          <p>
            Renters must use equipment safely and lawfully, follow the
            owner&apos;s instructions, return equipment by the agreed end date
            and in the condition received, and provide accurate delivery and
            contact information.
          </p>
        </LegalSection>

        <LegalSection title="6. Owner responsibilities">
          <p>
            Owners must respond to rental requests promptly, provide equipment
            that matches the listing, disclose material conditions or
            restrictions, and mark bookings accurately as confirmed, ongoing or
            completed.
          </p>
        </LegalSection>

        <LegalSection title="7. Prohibited conduct">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Posting false, unsafe or stolen equipment.</li>
            <li>Circumventing platform fees or payment processing.</li>
            <li>Harassing, threatening or discriminating against other users.</li>
            <li>Attempting to break authentication or access private data.</li>
            <li>Using the platform for unlawful activity.</li>
          </ul>
        </LegalSection>

        <LegalSection title="8. Disputes between users">
          <p>
            Rental agreements are between the customer and the owner. rEntsy
            provides the marketplace, booking records and support, but is not a
            party to the rental itself. We may assist with disputes using the
            records available to us.
          </p>
        </LegalSection>

        <LegalSection title="9. Limitation of liability">
          <p>
            To the extent permitted by law, rEntsy is not liable for indirect or
            consequential losses, equipment failures, or acts of users outside
            the platform. Nothing in these terms limits rights that cannot be
            limited by law.
          </p>
        </LegalSection>

        <LegalSection title="10. Changes and termination">
          <p>
            We may update these terms and will post the new version with a
            revised date. We may suspend or terminate accounts that violate
            these terms or create risk for other users. You may stop using the
            platform at any time.
          </p>
        </LegalSection>

        <LegalSection title="11. Contact">
          <p>
            Questions about these terms can be sent to{" "}
            <a
              href="mailto:help@rentsy.com"
              className="font-semibold text-[#6e13f9] hover:underline dark:text-[#a66cff]"
            >
              help@rentsy.com
            </a>
            .
          </p>
        </LegalSection>
      </LegalLayout>
    </PublicPage>
  );
}
