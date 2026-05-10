import { CATEGORIES } from "../../features/tools/toolsRegistry.js";

function ToolsCategoryFilter({ activeCategory, onChange }) {
  const allCategories = ["All", ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {allCategories.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
              isActive
                ? "border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-sm shadow-amber-500/10"
                : "border-slate-700/60 bg-slate-800/30 text-slate-400 hover:border-slate-500 hover:text-slate-200"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export default ToolsCategoryFilter;
