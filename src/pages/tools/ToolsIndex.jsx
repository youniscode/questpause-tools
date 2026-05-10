import { useEffect, useState, useMemo } from "react";
import ToolsHeader from "../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../components/tools/ToolsFooter.jsx";
import ToolsHero from "../../components/tools/ToolsHero.jsx";
import PopularTools from "../../components/tools/PopularTools.jsx";
import ToolCard from "../../components/tools/ToolCard.jsx";
import CategoryPill from "../../components/tools/CategoryPill.jsx";
import { setSEO } from "../../utils/seo.js";
import { toolsRegistry, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "../../features/tools/toolsRegistry.js";

const seo = {
  title: "Free Game Server Admin Tools | QUESTPAUSE Tools",
  description:
    "Free browser-based tools for Minecraft server owners, Discord communities, Project Zomboid admins, Valheim operators, and long-term survival worlds. Built by QUESTPAUSE.",
};

const POPULAR_IDS = new Set(
  toolsRegistry.filter((t) => t.isPopular).map((t) => t.id),
);

function ToolsIndex() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const liveTools = useMemo(
    () => toolsRegistry.filter((t) => t.status === "live"),
    [],
  );

  const popularTools = useMemo(
    () => liveTools.filter((t) => POPULAR_IDS.has(t.id)),
    [liveTools],
  );

  const filtered = useMemo(() => {
    let result = liveTools;

    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q),
      );
    }

    return result;
  }, [liveTools, activeCategory, search]);

  const grouped = useMemo(() => {
    const groups = {};
    for (const tool of filtered) {
      if (!groups[tool.category]) groups[tool.category] = [];
      groups[tool.category].push(tool);
    }
    return groups;
  }, [filtered]);

  const categoryHasTools = useMemo(() => {
    const cats = new Set(liveTools.map((t) => t.category));
    return cats;
  }, [liveTools]);

  const showPopular = !search && activeCategory === "All" && popularTools.length > 0;

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        <ToolsHero
          search={search}
          onSearchChange={setSearch}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {showPopular && <PopularTools tools={popularTools} />}

        {filtered.length === 0 ? (
          <section className="border-b border-slate-800/80">
            <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16 text-center">
              <p className="text-sm text-slate-500">
                No tools found. Try another keyword or category.
              </p>
            </div>
          </section>
        ) : (
          <>
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-16">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-6 sm:mb-8">
                  {activeCategory !== "All" ? `${activeCategory} Tools` : "All Tools"}
                </h2>

                {activeCategory !== "All" ? (
                  <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
                    {Object.entries(grouped).map(([category, tools]) => (
                      <div key={category}>
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                          <CategoryPill category={category} size="lg" />
                          <span className="text-xs sm:text-sm text-slate-500">
                            {tools.length} tool{tools.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {tools.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} />
                          ))}
                        </div>
                      </div>
                    ))}

                    {CATEGORIES.filter(
                      (cat) => !categoryHasTools.has(cat),
                    ).length > 0 && (
                      <div className="pt-6 sm:pt-8 border-t border-slate-800/60">
                        <h3 className="text-sm sm:text-base font-semibold text-white mb-4 sm:mb-6">
                          More Tools Coming Soon
                        </h3>
                        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {CATEGORIES.filter(
                            (cat) => !categoryHasTools.has(cat),
                          ).map((cat) => {
                            const color = CATEGORY_COLORS[cat] || "#6b7280";
                            return (
                              <div
                                key={cat}
                                className="rounded-2xl border border-slate-800/50 bg-slate-900/30 flex flex-col opacity-50 overflow-hidden"
                              >
                                <div
                                  className="h-16 sm:h-20 relative flex items-center justify-center"
                                  style={{
                                    background: `linear-gradient(135deg, ${color}15, transparent)`,
                                  }}
                                >
                                  <span className="text-xl sm:text-2xl opacity-40">
                                    {CATEGORY_ICONS[cat] || "🔧"}
                                  </span>
                                </div>
                                <div className="p-4 sm:p-5">
                                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {cat}
                                  </p>
                                  <h3 className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold text-slate-400">
                                    {cat} Tools
                                  </h3>
                                  <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Tools for {cat} server admins are in development.
                                  </p>
                                  <span className="mt-3 sm:mt-4 inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-500">
                                    Coming Soon
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* Why Use QUESTPAUSE Tools */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-16">
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Why Use QUESTPAUSE Tools
              </h2>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500">
                Built for real server admins, by real server admins.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 sm:p-6 text-center transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.171-.879-1.171-2.303 0-3.182 1.172-.879 3.07-.879 4.242 0L15 9" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white">Free</h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400">
                  All tools are free to use. No sign-up or payment required.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 sm:p-6 text-center transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white">Browser-based</h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400">
                  No installs or downloads. Just open and start using.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 sm:p-6 text-center transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white">Built for real server admins</h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400">
                  Created for game server operators, Discord communities, and long-term survival worlds.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ToolsFooter />
      </main>
    </>
  );
}

export default ToolsIndex;
