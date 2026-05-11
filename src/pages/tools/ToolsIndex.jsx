import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../components/tools/ToolsFooter.jsx";
import ToolsHero from "../../components/tools/ToolsHero.jsx";
import PopularTools from "../../components/tools/PopularTools.jsx";
import ToolCard from "../../components/tools/ToolCard.jsx";
import CategoryPill from "../../components/tools/CategoryPill.jsx";
import ScrollToHash from "../../components/ScrollToHash.jsx";
import { setSEO } from "../../utils/seo.js";
import { toolsRegistry, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from "../../features/tools/toolsRegistry.js";

const seo = {
  title: "Free Game Server Admin Tools | QUESTPAUSE Tools",
  description:
    "Free browser-based tools for Minecraft server owners, Discord communities, Project Zomboid admins, Valheim operators, and long-term survival server communities.",
};

const POPULAR_IDS = new Set(
  toolsRegistry.filter((t) => t.isPopular).map((t) => t.id),
);

const toSectionId = (cat) => cat.toLowerCase().replace(/\s+/g, "-") + "-tools";

const gridCols = (count) => {
  if (count === 1) return "grid-cols-1 sm:grid-cols-1 max-w-sm";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
};

const CATEGORY_DESCRIPTIONS = {
  Minecraft: "Server management tools for Minecraft survival servers, whitelist communities, PvE realms, and SMP worlds.",
  Discord: "Communication tools for gaming communities, including announcement and notification generators.",
  "Server Admin": "General server operations tools for maintenance notices, restart warnings, and downtime updates.",
  "Project Zomboid": "Configuration tools for Project Zomboid dedicated servers, mod lists, and servertest.ini settings.",
  Valheim: "Administration tools for Valheim co-op realms, modded servers, progression control, and Viking communities.",
  ICARUS: "Rules and server management tools for ICARUS co-op survival worlds, persistent prospects, and long-term outpost communities.",
  "7 Days to Die": "Server rules, configuration, and community management tools for 7 Days to Die PvE, PvP, and apocalypse servers.",
};

const POPULAR_USE_CASES = [
  { label: "Generate Minecraft server rules", path: "/tools/minecraft-server-rules-generator" },
  { label: "Create Discord announcements", path: "/tools/discord-announcement-generator" },
  { label: "Format Project Zomboid server mod lists", path: "/tools/project-zomboid-mod-list-formatter" },
  { label: "Prepare Valheim server rules", path: "/tools/valheim-server-rules-generator" },
  { label: "Write maintenance and restart messages", path: "/tools/server-maintenance-message-generator" },
  { label: "Manage long-term survival communities", path: "/tools" },
];

const FAQ_ITEMS = [
  {
    q: "Are QUESTPAUSE Tools free?",
    a: "Yes, all tools are completely free. No payment, no sign-up, and no hidden costs.",
  },
  {
    q: "Do I need an account?",
    a: "No accounts or login required. Every tool runs entirely in your browser with nothing to install.",
  },
  {
    q: "Do the tools work in the browser?",
    a: "Yes. All processing happens locally on your device. You can use every tool directly in your browser without downloads or server-side processing.",
  },
  {
    q: "Can I use these tools for my own game server?",
    a: "Absolutely. Every tool is designed for real server admins. Generate rules, format config files, create announcements, and manage your community.",
  },
  {
    q: "Are these tools official game tools?",
    a: "No. QUESTPAUSE Tools is an independent fan-made project. We are not affiliated with Mojang, Microsoft, Discord, The Indie Stone, Iron Gate, Coffee Stain, or any game publisher.",
  },
];

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

  const latestTools = useMemo(
    () => [...liveTools].reverse().slice(0, 3),
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
        <ScrollToHash />

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
              <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 lg:py-14">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-5 sm:mb-6">
                  {activeCategory !== "All" ? `${activeCategory} Tools` : "All Tools"}
                </h2>

                {activeCategory !== "All" ? (
                  <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
                    {Object.entries(grouped).map(([category, tools]) => (
                      <div key={category} id={toSectionId(category)} className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-1">
                          <CategoryPill category={category} size="lg" />
                          <span className="text-xs sm:text-sm text-slate-500">
                            {tools.length} tool{tools.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {CATEGORY_DESCRIPTIONS[category] && (
                          <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 ml-0.5">
                            {CATEGORY_DESCRIPTIONS[category]}
                          </p>
                        )}
                        <div className={`grid gap-4 sm:gap-5 ${gridCols(tools.length)}`}>
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
                                    {CATEGORY_ICONS[cat] || "\u{1F527}"}
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

            {/* What is QUESTPAUSE Tools */}
            {activeCategory === "All" && !search && (
              <section className="border-b border-slate-800/80">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-14">
                  <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      What is QUESTPAUSE Tools?
                    </h2>
                    <p className="mt-3 text-sm leading-6 sm:text-base sm:leading-7 text-slate-400">
                      QUESTPAUSE Tools is a free browser-based toolkit for game server admins,
                      Discord community owners, and long-term survival server operators.
                      Generate rules, format config files, create announcements, and manage
                      your community &mdash; all without installing anything.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Popular Use Cases */}
            {activeCategory === "All" && !search && (
              <section className="border-b border-slate-800/80">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-14">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-5 sm:mb-6 text-center">
                    Popular Use Cases
                  </h2>
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                    {POPULAR_USE_CASES.map((uc) => (
                      <Link
                        key={uc.path + uc.label}
                        to={uc.path}
                        className="rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-3 text-sm text-slate-300 hover:border-amber-500/30 hover:text-amber-300 transition-all duration-200"
                      >
                        {uc.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Latest Tools */}
            {activeCategory === "All" && !search && (
              <section className="border-b border-slate-800/80">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-14">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-5 sm:mb-6">
                    Latest Tools
                  </h2>
                  <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-4xl">
                    {latestTools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* FAQ */}
            {activeCategory === "All" && !search && (
              <section className="border-b border-slate-800/80">
                <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 lg:py-14">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-5 sm:mb-6 text-center">
                    Frequently Asked Questions
                  </h2>
                  <div className="divide-y divide-slate-800">
                    {FAQ_ITEMS.map((item) => (
                      <div key={item.q} className="py-4 first:pt-0 last:pb-0">
                        <h3 className="text-sm font-semibold text-white">
                          {item.q}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-400">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Why Use */}
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
          </>
        )}

        {/* Disclaimer */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
            <p className="text-[10px] sm:text-xs leading-5 text-slate-600 text-center">
              QUESTPAUSE Tools is an independent fan-made tools project and is not affiliated
              with Mojang, Microsoft, Discord, The Indie Stone, Iron Gate, Coffee Stain, or
              other game publishers referenced on this site.
            </p>
          </div>
        </section>

        <ToolsFooter />
      </main>
    </>
  );
}

export default ToolsIndex;
