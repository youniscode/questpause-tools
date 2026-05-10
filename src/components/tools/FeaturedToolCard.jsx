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

function FeaturedToolCard({ tool }) {
  const gradient = CATEGORY_GRADIENTS[tool.category] || "from-slate-950 via-slate-900 to-slate-950/40";

  return (
    <Link
      to={tool.path}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/55 flex flex-col overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
    >
      <div className={`h-28 sm:h-32 lg:h-36 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/[0.03] rounded-full blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl sm:text-4xl transition-transform duration-300 group-hover:scale-110">
            {tool.icon || "🔧"}
          </span>
        </div>
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
          <CategoryPill category={tool.category} size="lg" />
        </div>
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white group-hover:text-amber-300 transition-colors leading-snug">
          {tool.title}
        </h3>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400 flex-1 line-clamp-2 sm:line-clamp-3">
          {tool.description}
        </p>

        {tool.tags && tool.tags.length > 0 && (
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-700/60 bg-slate-800/40 px-2 py-0.5 text-[10px] text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 sm:mt-5">
          <span className="inline-flex items-center justify-center w-full rounded-xl border border-amber-500/40 bg-amber-500/5 px-4 py-2.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-amber-400 transition-all duration-300 group-hover:bg-amber-500/15 group-hover:border-amber-400/60 min-h-[40px] sm:min-h-[42px]">
            Open Tool
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default FeaturedToolCard;
