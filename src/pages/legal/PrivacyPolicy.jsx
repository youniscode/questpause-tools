import { useEffect } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../components/tools/ToolsFooter.jsx";
import { setSEO } from "../../utils/seo.js";

const seo = {
  title: "Privacy Policy | QUESTPAUSE Tools",
  description: "Privacy Policy for QUESTPAUSE Tools. No login, no data collection, no user accounts.",
};

function PrivacyPolicy() {
  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: May 2026</p>

            <div className="mt-8 flex flex-col gap-6 text-sm leading-6 text-slate-400">
              <div>
                <h2 className="text-lg font-semibold text-white">Summary</h2>
                <p className="mt-2">
                  QUESTPAUSE Tools are free browser-based utilities. The tools run
                  entirely in your browser. No user accounts, no login, and no
                  payment processing is involved.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  What data do we collect?
                </h2>
                <p className="mt-2">
                  The tools themselves do not collect, store, or transmit any
                  personal data. All processing happens locally in your browser.
                </p>
                <p className="mt-2">
                  This website may use standard web analytics and advertising
                  services in the future to support the free tools. At that point,
                  non-personal usage data (such as page views, browser type, and
                  general location) may be collected by third-party services.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Cookies</h2>
                <p className="mt-2">
                  This website does not currently set any cookies. If analytics or
                  advertising are added in the future, third-party services may set
                  cookies for functionality and measurement. You will be informed
                  of any changes.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Data sharing
                </h2>
                <p className="mt-2">
                  We do not sell, trade, or share your personal data with third
                  parties. Any future analytics or advertising services will be
                  subject to their own privacy policies.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">Contact</h2>
                <p className="mt-2">
                  If you have questions about this privacy policy, contact us at{" "}
                  <a
                    href="mailto:contact@jonascode.com"
                    className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                  >
                    contact@jonascode.com
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-8">
            <Link
              to="/tools"
              className="text-sm text-slate-500 hover:text-indigo-400 transition"
            >
              &larr; Back to tools
            </Link>
          </div>
        </section>

        <ToolsFooter />
      </main>
    </>
  );
}

export default PrivacyPolicy;
