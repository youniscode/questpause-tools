import { useState, useCallback, useEffect, useMemo } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";
import {
  VALHEIM_COMMANDS,
  COMMAND_CATEGORIES,
  filterValheimCommands,
} from "../../../features/tools/valheim/admin-command-helper/index.js";

const seo = {
  title: "Valheim Admin Command Helper | QUESTPAUSE Tools",
  description:
    "Find and copy useful Valheim admin commands for server moderation, teleporting, debug mode, spawning items, map tools, events, and world management.",
};

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";

const selectClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400";

const requirementColor = {
  "Server admin": "border-blue-400/30 text-blue-300",
  Console: "border-amber-400/30 text-amber-300",
  "Devcommands required": "border-purple-400/30 text-purple-300",
  "Single-player / admin use": "border-slate-500/30 text-slate-400",
};

function ValheimAdminCommandHelper() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedCmd, setCopiedCmd] = useState("");
  const [copiedBuilder, setCopiedBuilder] = useState("");
  const [builderTab, setBuilderTab] = useState("moderation");

  // Builder state
  const [playerName, setPlayerName] = useState("");
  const [modAction, setModAction] = useState("kick");
  const [spawnItem, setSpawnItem] = useState("");
  const [spawnAmount, setSpawnAmount] = useState("");
  const [spawnLevel, setSpawnLevel] = useState("");
  const [teleX, setTeleX] = useState("");
  const [teleY, setTeleY] = useState("");
  const [teleZ, setTeleZ] = useState("");

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const filtered = useMemo(
    () => filterValheimCommands(VALHEIM_COMMANDS, { search, category: activeCategory }),
    [search, activeCategory],
  );

  const handleCopy = useCallback(async (text, label) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCmd(label);
      setTimeout(() => setCopiedCmd(""), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const handleCopyBuilder = useCallback(async (text, label) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBuilder(label);
      setTimeout(() => setCopiedBuilder(""), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const builderCommands = useMemo(() => {
    const parts = [];
    if (builderTab === "moderation" && playerName.trim()) {
      parts.push(`${modAction} ${playerName.trim()}`);
    }
    if (builderTab === "spawn" && spawnItem.trim()) {
      const cmd = ["spawn", spawnItem.trim()];
      if (spawnAmount.trim()) cmd.push(spawnAmount.trim());
      if (spawnLevel.trim()) cmd.push(spawnLevel.trim());
      parts.push(cmd.join(" "));
    }
    if (builderTab === "teleport") {
      if (teleX.trim() && teleZ.trim()) {
        if (teleY.trim()) {
          parts.push(`teleport ${teleX.trim()} ${teleY.trim()} ${teleZ.trim()}`);
        } else {
          parts.push(`goto ${teleX.trim()} ${teleZ.trim()}`);
        }
      }
    }
    return parts;
  }, [builderTab, playerName, modAction, spawnItem, spawnAmount, spawnLevel, teleX, teleY, teleZ]);

  const clearBuilder = useCallback(() => {
    setPlayerName("");
    setModAction("kick");
    setSpawnItem("");
    setSpawnAmount("");
    setSpawnLevel("");
    setTeleX("");
    setTeleY("");
    setTeleZ("");
    setCopiedBuilder("");
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setActiveCategory("All");
    setCopiedCmd("");
  }, []);

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        {/* Hero */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Valheim
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Valheim Admin Command Helper
            </h1>
            <p className="mt-3 text-base text-slate-400">
              Search, understand, and copy useful Valheim admin, moderation,
              debug, teleport, map, and spawn commands.
            </p>
          </div>
        </section>

        {/* Search + Filter */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search commands by name, category, or keyword..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    activeCategory === "All"
                      ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                      : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  }`}
                >
                  All Commands
                </button>
                {COMMAND_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      activeCategory === cat
                        ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                        : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {search && (
                <button
                  onClick={clearAll}
                  className="self-start text-xs text-slate-500 hover:text-indigo-400 transition"
                >
                  &larr; Clear search
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Command Cards */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            {filtered.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No commands found. Try another keyword or category.
              </p>
            ) : (
              <>
                <p className="mb-6 text-xs text-slate-500">
                  Showing {filtered.length} command{filtered.length !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-col gap-4">
                  {filtered.map((cmd) => (
                    <div
                      key={cmd.name}
                      className="rounded-xl border border-slate-800 bg-slate-900/55 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-white font-mono">
                              {cmd.name}
                            </h3>
                            <span
                              className={`rounded border px-2 py-0.5 text-xs font-medium ${
                                requirementColor[cmd.requirement] ||
                                "border-slate-500/30 text-slate-400"
                              }`}
                            >
                              {cmd.requirement}
                            </span>
                          </div>
                          <p className="text-xs text-indigo-300/80 font-mono mb-1.5">
                            {cmd.syntax}
                          </p>
                          <p className="text-sm leading-6 text-slate-400">
                            {cmd.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(cmd.name, cmd.name)}
                          className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-indigo-400 hover:text-indigo-300 transition"
                        >
                          {copiedCmd === cmd.name ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Copy All Filtered */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      const text = filtered.map((c) => c.name).join("\n");
                      handleCopy(text, "__all__");
                    }}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-400 hover:border-indigo-400 hover:text-indigo-300 transition"
                  >
                    {copiedCmd === "__all__"
                      ? "Copied!"
                      : "Copy All Filtered Commands"}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Command Builder */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white mb-4">
              Command Builder
            </h2>

            {/* Builder Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: "moderation", label: "Player Moderation" },
                { id: "spawn", label: "Spawn Item" },
                { id: "teleport", label: "Teleport / Goto" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setBuilderTab(tab.id);
                    setCopiedBuilder("");
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    builderTab === tab.id
                      ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                      : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Builder Content */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-5">
              {builderTab === "moderation" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                      Player Name / Steam ID / IP
                    </label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="e.g. PlayerName or 765611..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                      Action
                    </label>
                    <select
                      value={modAction}
                      onChange={(e) => setModAction(e.target.value)}
                      className={selectClass}
                    >
                      <option value="kick">kick</option>
                      <option value="ban">ban</option>
                      <option value="unban">unban</option>
                    </select>
                  </div>
                </div>
              )}

              {builderTab === "spawn" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                      Item Prefab Name
                    </label>
                    <input
                      type="text"
                      value={spawnItem}
                      onChange={(e) => setSpawnItem(e.target.value)}
                      placeholder="e.g. SwordBlackmetal"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={spawnAmount}
                        onChange={(e) => setSpawnAmount(e.target.value)}
                        placeholder="1"
                        min="1"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                        Level{" "}
                        <span className="text-slate-500">(optional)</span>
                      </label>
                      <input
                        type="number"
                        value={spawnLevel}
                        onChange={(e) => setSpawnLevel(e.target.value)}
                        placeholder="1"
                        min="1"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {builderTab === "teleport" && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                        X
                      </label>
                      <input
                        type="text"
                        value={teleX}
                        onChange={(e) => setTeleX(e.target.value)}
                        placeholder="X"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                        Y{" "}
                        <span className="text-slate-500">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={teleY}
                        onChange={(e) => setTeleY(e.target.value)}
                        placeholder="Y"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                        Z
                      </label>
                      <input
                        type="text"
                        value={teleZ}
                        onChange={(e) => setTeleZ(e.target.value)}
                        placeholder="Z"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    With only X and Z, uses{" "}
                    <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-indigo-300">
                      goto
                    </code>
                    . With X, Y, and Z, uses{" "}
                    <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-indigo-300">
                      teleport
                    </code>
                    .
                  </p>
                </div>
              )}

              {/* Builder output */}
              {builderCommands.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Generated Command
                    </label>
                    <button
                      onClick={() =>
                        handleCopyBuilder(builderCommands.join("\n"), "builder")
                      }
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                    >
                      {copiedBuilder === "builder"
                        ? "Copied!"
                        : "Copy Command"}
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                      {builderCommands.join("\n")}
                    </pre>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={clearBuilder}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-400 hover:border-rose-400 hover:text-rose-300 transition"
                >
                  Clear Builder
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Note */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
              <p className="text-sm leading-6 text-amber-200">
                <strong className="text-amber-100">Important:</strong> Some
                commands can affect saves, player characters, world state, or
                server balance. Test carefully and avoid using destructive
                commands on live community servers without backups. Command
                availability depends on Valheim version, server permissions,
                admin status, and whether devcommands are enabled.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Valheim Admin Command Helper
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Use the <strong className="text-slate-100">search bar</strong>{" "}
                to find commands by name, keyword, or description.
              </li>
              <li>
                Click a <strong className="text-slate-100">category filter</strong>{" "}
                to browse commands by type (Server Admin, Player Moderation,
                World/Map, etc.).
              </li>
              <li>
                Each command card shows the command name, syntax, description,
                and requirement label.
              </li>
              <li>
                Click <strong className="text-slate-100">Copy</strong> on any
                command to copy its name to your clipboard.
              </li>
              <li>
                Use the <strong className="text-slate-100">Command Builder</strong>{" "}
                to generate moderation, spawn, or teleport commands with custom
                parameters.
              </li>
              <li>
                Enable <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">devcommands</code>{" "}
                in the F5 console before using most debug, spawn, or teleport
                commands.
              </li>
            </ol>
          </div>
        </section>

        {/* Common Commands Explained */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Valheim Admin Commands Explained
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Server Admin Commands
                </h3>
                <p className="mt-1">
                  Use <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">save</code>{" "}
                  to force a world save before restarting. Use{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">ping</code>{" "}
                  to check if the server is responsive.{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">info</code>{" "}
                  shows version and world details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Player Moderation Commands
                </h3>
                <p className="mt-1">
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">kick</code>{" "}
                  removes a player temporarily.{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">ban</code>{" "}
                  prevents re-entry.{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">unban</code>{" "}
                  reverses a ban. Use{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">banned</code>{" "}
                  to view the ban list. You can target players by name, IP
                  address, or Steam ID.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Debug and Build Commands
                </h3>
                <p className="mt-1">
                  First enable{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">devcommands</code>{" "}
                  in the F5 console. Then you can use{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">god</code>{" "}
                  for invulnerability,{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">fly</code>{" "}
                  for flight,{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">nocost</code>{" "}
                  for free building, and{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">debugmode</code>{" "}
                  to unlock additional features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Valheim Server Admins
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Always save before using destructive commands
                </h3>
                <p className="mt-1">
                  Run <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">save</code>{" "}
                  before using commands like{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">killall</code>,{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">removedrops</code>,{" "}
                  or <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">resetcharaecter</code>{" "}
                  to avoid losing progress.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Devcommands must be enabled first
                </h3>
                <p className="mt-1">
                  Many commands require{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">devcommands</code>{" "}
                  to be enabled. Open the F5 console and type devcommands before
                  using debug, spawn, or teleport commands.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Exploremap cannot be undone
                </h3>
                <p className="mt-1">
                  The <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">exploremap</code>{" "}
                  command reveals the entire map for all players permanently.
                  Only use this if you are sure you want to remove the fog of
                  war.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Command availability varies by server
                </h3>
                <p className="mt-1">
                  Some commands may be disabled by server configuration or
                  mods. If a command does not work, check server permissions,
                  admin status, and whether devcommands are enabled.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 divide-y divide-slate-800">
              <div className="py-4 first:pt-0">
                <h3 className="text-sm font-semibold text-white">
                  How do I open the Valheim console?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Press <strong className="text-slate-200">F5</strong> in-game
                  to open the console. Type commands and press Enter. On some
                  servers, you may need to be an admin for commands to work.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Why are some commands not working?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Most debug and spawn commands require{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">devcommands</code>{" "}
                  enabled first. Server admin commands require you to be an
                  admin on the server. Some servers also disable certain
                  commands.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How do I enable devcommands?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Open the console (F5) and type{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">devcommands</code>{" "}
                  then press Enter. You should see a confirmation message.
                  Type it again to disable devcommands.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use these commands on any Valheim server?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  It depends on the server settings. On your own server or
                  single-player world, all commands are available. On community
                  servers, commands may be restricted to admins or disabled
                  entirely.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is the difference between goto and teleport?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">goto [x] [z]</code>{" "}
                  teleports you to a position on the X/Z plane at ground level.
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">{" "}
                    teleport [x] [y] [z]
                  </code>{" "}
                  teleports you to an exact position including elevation.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Is this tool free?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes, completely free. No login, no sign-up, and no hidden
                  costs. Built by QUESTPAUSE.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="valheim-admin-command-helper" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ValheimAdminCommandHelper;
