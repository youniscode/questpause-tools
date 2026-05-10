import { useEffect } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../components/tools/ToolsFooter.jsx";
import { setSEO } from "../../utils/seo.js";

const seo = {
  title: "Terms of Use | QUESTPAUSE Tools",
  description: "Terms of Use for QUESTPAUSE Tools. Free browser-based tools for game server admins.",
};

function TermsOfUse() {
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
              Terms of Use
            </h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: May 2026</p>

            <div className="mt-8 flex flex-col gap-6 text-sm leading-6 text-slate-400">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Acceptance of Terms
                </h2>
                <p className="mt-2">
                  By using QUESTPAUSE Tools, you agree to these terms of use. If you
                  do not agree, do not use the tools.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Free Tools
                </h2>
                <p className="mt-2">
                  All tools on this website are provided free of charge. No payment
                  is required. No user accounts are needed. No login system exists.
                </p>
                <p className="mt-2">
                  The tools run entirely in your browser. No data is sent to our
                  servers. You are responsible for how you use the generated output.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  No Warranty
                </h2>
                <p className="mt-2">
                  The tools are provided "as is" without any warranty, express or
                  implied. We make no guarantees about accuracy, reliability, or
                  availability of the tools.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Limitation of Liability
                </h2>
                <p className="mt-2">
                  QUESTPAUSE shall not be liable for any damages arising from the use
                  or inability to use these tools, including but not limited to
                  server configuration issues, gameplay disputes, or data loss.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Changes to These Terms
                </h2>
                <p className="mt-2">
                  We reserve the right to update these terms at any time. Changes
                  will be posted on this page. Continued use of the tools after
                  changes constitutes acceptance of the new terms.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Contact
                </h2>
                <p className="mt-2">
                  For questions about these terms, contact us at{" "}
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

export default TermsOfUse;
