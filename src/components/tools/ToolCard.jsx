import { Link } from "react-router-dom";
import CategoryPill from "./CategoryPill.jsx";

const CATEGORY_GRADIENTS = {
  Minecraft: "from-emerald-950 via-emerald-900 to-emerald-950/40",
  Discord: "from-indigo-950 via-violet-900 to-indigo-950/40",
  "Server Admin": "from-sky-950 via-blue-900 to-sky-950/40",
  "Project Zomboid": "from-rose-950 via-red-900 to-rose-950/40",
  Valheim: "from-amber-950 via-orange-900 to-amber-950/40",
  ICARUS: "from-cyan-950 via-teal-900 to-cyan-950/40",
  "7 Days to Die": "from-orange-950 via-red-900 to-orange-950/40",
};

function ToolCard({ tool }) {
  const isLive = tool.status === "live";
  const gradient = CATEGORY_GRADIENTS[tool.category] || "from-slate-950 via-slate-900 to-slate-950/40";

  if (!isLive) {
    return (
      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 flex flex-col opacity-50 overflow-hidden">
        <div className={`h-24 sm:h-28 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl opacity-30">{tool.icon || "🔧"}</span>
          </div>
        </div>
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          <CategoryPill category={tool.category} />
          <h3 className="mt-2 sm:mt-3 text-sm sm:text-base font-semibold text-slate-400">{tool.title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 flex-1">{tool.description}</p>
          <span className="mt-3 sm:mt-4 inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-500">
            Coming Soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={tool.path}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/55 flex flex-col overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5"
    >
      <div className={`h-24 sm:h-28 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/[0.03] rounded-full blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110">
            {tool.icon || "🔧"}
          </span>
        </div>
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
          <CategoryPill category={tool.category} />
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-amber-300 transition-colors leading-snug">
          {tool.title}
        </h3>
        <p className="mt-1.5 text-xs leading-5 text-slate-400 flex-1 line-clamp-2">
          {tool.description}
        </p>

        {tool.tags && tool.tags.length > 0 && (
          <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5">
            {tool.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 text-[10px] text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-800/60">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors min-h-[32px]">
            Open Tool
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ToolCard;
