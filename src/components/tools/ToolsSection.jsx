import ToolCard from "./ToolCard.jsx";

function ToolsSection({ title, id, tools }) {
  if (!tools || tools.length === 0) return null;

  return (
    <section id={id} className="border-b border-slate-800/80">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <h2 className="text-xl font-semibold text-white mb-8">{title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ToolsSection;
