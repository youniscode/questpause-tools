import ToolCard from "./ToolCard.jsx";
import { toolsRegistry } from "../../features/tools/toolsRegistry.js";

function RelatedTools({ currentToolId, limit }) {
  const tool = toolsRegistry.find((t) => t.id === currentToolId);
  if (!tool) return null;

  const related = tool.relatedToolIds
    ? toolsRegistry.filter(
        (t) => tool.relatedToolIds.includes(t.id) && t.status === "live",
      )
    : [];

  const displayed = limit ? related.slice(0, limit) : related;

  if (displayed.length === 0) return null;

  return (
    <section className="border-b border-slate-800/80">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold text-white mb-8">Related Tools</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayed.map((rt) => (
            <ToolCard key={rt.id} tool={rt} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedTools;
