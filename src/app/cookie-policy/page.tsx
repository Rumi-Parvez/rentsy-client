import type { Metadata } from "next";
import { LegalLayout, LegalSection, PublicPage } from "../components/public/PublicPage";

export const metadata: Metadata = {
  title: "Cookie Policy — rEntsy",
  description:
    "How rEntsy uses cookies and local storage to keep you signed in and remember your preferences.",
};

export default function CookiePolicyPage() {
  return (
    <PublicPage
      eyebrow="Legal"
      title="Cookie"
      highlight="Policy"
      description="This policy explains the cookies and browser storage rEntsy uses, and how you can control them."
    >
      <LegalLayout updated="21 November 2026">
        <LegalSection title="1. What cookies are">
          <p>
            Cookies are small text files stored by your browser. They allow a
            website to remember information between requests, such as whether
            you are signed in or which theme you prefer.
          </p>
        </LegalSection>

        <LegalSection title="2. Cookies we use">
          <p>rEntsy uses the following categories:</p>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-2.5 font-bold">Category</th>
                  <th className="px-4 py-2.5 font-bold">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="px-4 py-2.5 font-semibold">Essential</td>
                  <td className="px-4 py-2.5">
                    Authentication and session security. Required for sign-in
                    and private dashboard routes.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold">Preferences</td>
                  <td className="px-4 py-2.5">
                    Remembering your light/dark theme and dashboard sidebar
                    state.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold">Security</td>
                  <td className="px-4 py-2.5">
                    Protecting requests against unauthorized access and abuse.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection title="3. Local storage">
          <p>
            We use browser local storage for the theme preference and small
            interface settings. These values stay on your device and are not
            sent to our servers with every request.
          </p>
        </LegalSection>

        <LegalSection title="4. Third-party cookies">
          <p>
            Signing in with Google may set cookies from that provider as part of
            the OAuth flow. Our payment provider may also set cookies during
            checkout to process payments securely. Their own policies apply to
            those cookies.
          </p>
        </LegalSection>

        <LegalSection title="5. Managing cookies">
          <p>
            You can clear or block cookies in your browser settings. Blocking
            essential cookies will prevent you from signing in and using private
            dashboard routes. Clearing local storage may reset your theme
            preference.
          </p>
        </LegalSection>

        <LegalSection title="6. Changes">
          <p>
            If we introduce new cookie categories, we will update this page and
            request consent where required by law.
          </p>
        </LegalSection>

        <LegalSection title="7. Contact">
          <p>
            Questions about cookies can be sent to{" "}
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
