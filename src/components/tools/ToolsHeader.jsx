import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const TOOLS_NAV = [
  { id: "all-tools", label: "All Tools", href: "/tools" },
  { id: "minecraft", label: "Minecraft", href: "/tools#minecraft-tools" },
  { id: "discord", label: "Discord", href: "/tools#discord-tools" },
  { id: "server-admin", label: "Server Admin", href: "/tools#server-admin-tools" },
  { id: "project-zomboid", label: "Project Zomboid", href: "/tools#project-zomboid-tools" },
  { id: "valheim", label: "Valheim", href: "/tools#valheim-tools" },
  { id: "icarus", label: "ICARUS", href: "/tools#icarus-tools" },
  { id: "7-days-to-die", label: "7 Days to Die", href: "/tools#7-days-to-die-tools" },
];

function useActiveHash() {
  const location = useLocation();
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    setHash(location.hash);
  }, [location.hash]);

  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return hash;
}

function ToolsHeader() {
  const currentHash = useActiveHash();
  const location = useLocation();

  const isActive = (item) => {
    if (item.id === "all-tools") {
      return location.pathname === "/tools" && !currentHash;
    }
    return currentHash === `#${item.id}-tools`;
  };

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
                className={`transition-colors whitespace-nowrap ${
                  isActive(item)
                    ? "text-amber-400 font-semibold"
                    : "text-slate-400 hover:text-amber-400"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <nav className="md:hidden flex mt-2 gap-1 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
          {TOOLS_NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                isActive(item)
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                  : "border-slate-700/60 text-slate-400 hover:text-amber-400 hover:border-amber-500/30"
              }`}
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
