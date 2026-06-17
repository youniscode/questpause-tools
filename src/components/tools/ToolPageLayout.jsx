import { Link } from "react-router-dom";
import ToolBreadcrumbs from "./ToolBreadcrumbs.jsx";
import RelatedTools from "./RelatedTools.jsx";
import ToolsFooter from "./ToolsFooter.jsx";
import ToolsHeader from "./ToolsHeader.jsx";

function ToolPageLayout({
  eyebrow,
  title,
  description,
  toolId,
  category,
  children,
  seoContent,
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ToolsHeader />

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
          <ToolBreadcrumbs category={category} toolName={title} />
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-base text-slate-400">{description}</p>
          )}
        </div>
      </section>

      {children}

      {seoContent}

      {/* Small CTA after each tool */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10 text-center">
          <p className="text-sm font-semibold text-white">
            Want this configured for your own server?
          </p>
          <p className="mt-1 text-xs text-slate-400">
            I can help you set up a clean Discord/community structure, status channels, support flow, and admin handover.
          </p>
          <Link
            to="/services/game-server-admin"
            className="mt-3 inline-flex items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-colors"
          >
            Request setup help
          </Link>
        </div>
      </section>

      {toolId && <RelatedTools currentToolId={toolId} />}

      <ToolsFooter />
    </main>
  );
}

export default ToolPageLayout;
