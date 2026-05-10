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

      {toolId && <RelatedTools currentToolId={toolId} />}

      <ToolsFooter />
    </main>
  );
}

export default ToolPageLayout;
