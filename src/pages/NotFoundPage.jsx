import { useEffect } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../components/tools/ToolsFooter.jsx";
import { setSEO } from "../utils/seo.js";

const seo = {
  title: "Tool not found | QUESTPAUSE Tools",
  description:
    "Browse all free QUESTPAUSE Tools for game server admins and Discord communities.",
};

const POPULAR_TOOLS = [
  {
    title: "Minecraft server.properties Generator",
    path: "/tools/minecraft-server-properties-generator",
    color: "#10b981",
  },
  {
    title: "Project Zomboid Server Settings Helper",
    path: "/tools/project-zomboid-server-settings-helper",
    color: "#e11d48",
  },
  {
    title: "Valheim Admin Command Helper",
    path: "/tools/valheim-admin-command-helper",
    color: "#f59e0b",
  },
];

function NotFoundPage() {
  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ToolsHeader />

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-20 sm:py-28 text-center">
          <span className="text-7xl sm:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
            404
          </span>
          <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-white">
            Tool not found
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-md mx-auto">
            This tool may have moved, been renamed, or does not exist.
          </p>
          <Link
            to="/tools"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
          >
            Browse all tools
          </Link>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
          <h2 className="text-lg sm:text-xl font-semibold text-white text-center">
            Popular Tools
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {POPULAR_TOOLS.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-3 text-sm text-slate-300 transition-all duration-200 hover:border-amber-500/30 hover:text-amber-300"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: tool.color }}
                />
                {tool.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ToolsFooter />
    </main>
  );
}

export default NotFoundPage;
