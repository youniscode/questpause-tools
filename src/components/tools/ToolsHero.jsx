import ToolsSearch from "./ToolsSearch.jsx";
import ToolsCategoryFilter from "./ToolsCategoryFilter.jsx";

function ToolsHero({ search, onSearchChange, activeCategory, onCategoryChange }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-slate-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl hidden sm:block" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl hidden sm:block" />

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:py-16 lg:py-20 text-center">
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/80">
          QUESTPAUSE Tools
        </p>
        <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
          Free Game Server
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Admin Tools
          </span>
        </h1>
        <p className="mt-3 sm:mt-4 mx-auto max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed px-2 sm:px-0">
          Browser-based tools for Minecraft server owners, Discord communities,
          Project Zomboid admins, Valheim operators, and long-term survival worlds.
        </p>

        <div className="mt-6 sm:mt-8 mx-auto max-w-xl px-2 sm:px-0">
          <ToolsSearch value={search} onChange={onSearchChange} placeholder="Search tools..." />
        </div>

        <div className="mt-4 sm:mt-6 flex justify-center">
          <ToolsCategoryFilter
            activeCategory={activeCategory}
            onChange={onCategoryChange}
          />
        </div>
      </div>
    </section>
  );
}

export default ToolsHero;
