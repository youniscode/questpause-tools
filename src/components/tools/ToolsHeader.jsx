import { Link } from "react-router-dom";

const TOOLS_NAV = [
  { id: "all-tools", label: "All Tools", href: "/tools" },
  { id: "minecraft", label: "Minecraft", href: "/tools#minecraft-tools" },
  { id: "discord", label: "Discord", href: "/tools#discord-tools" },
  { id: "server-admin", label: "Server Admin", href: "/tools#server-admin-tools" },
  { id: "project-zomboid", label: "Project Zomboid", href: "/tools#project-zomboid-tools" },
  { id: "valheim", label: "Valheim", href: "/tools#valheim-tools" },
];

function ToolsHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/80 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/tools"
            className="flex items-center gap-2 font-bold tracking-tight shrink-0"
          >
            <span className="text-base sm:text-lg text-white whitespace-nowrap">
              QUESTPAUSE{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Tools
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm">
            {TOOLS_NAV.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-slate-400 hover:text-amber-400 transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="https://jonascode.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-amber-500/50 hover:text-amber-400 transition-all shrink-0"
          >
            &larr; <span className="hidden sm:inline">Main Site</span>
            <span className="sm:hidden">Home</span>
          </a>
        </div>

        <nav className="md:hidden flex mt-2 gap-1 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
          {TOOLS_NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="shrink-0 rounded-lg border border-slate-700/60 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default ToolsHeader;
