import { useEffect } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../components/tools/ToolsFooter.jsx";
import { setSEO } from "../utils/seo.js";

const seo = {
  title: "Contact QUESTPAUSE Tools",
  description:
    "Report bugs, suggest new tools, or send feedback about QUESTPAUSE Tools.",
};

function ContactPage() {
  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ToolsHeader />

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Contact QUESTPAUSE Tools</h1>

          <div className="mt-8 flex flex-col gap-6 text-sm leading-6 text-slate-400">
            <p>
              Have a bug to report, a tool suggestion, or general feedback? We would love to
              hear from you.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-5 text-center">
              <p className="text-slate-500">Contact method coming soon.</p>
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
            &larr; Browse all tools
          </Link>
        </div>
      </section>

      <ToolsFooter />
    </main>
  );
}

export default ContactPage;
