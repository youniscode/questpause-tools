import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";
import {
  COMMANDS,
  generateCommand,
  hasSpaces,
  isEmpty,
} from "../../../features/tools/minecraft/whitelist-command-generator/index.js";
import CommandList from "../../../features/tools/minecraft/whitelist-command-generator/components/CommandList.jsx";

const seo = {
  title: "Minecraft Whitelist Command Generator | QUESTPAUSE Tools",
  description:
    "Generate Minecraft whitelist, op, deop, ban, pardon, and kick commands for your server console or in-game chat. Free tool by QUESTPAUSE.",
};

function MinecraftWhitelistCommandGenerator() {
  const [playerName, setPlayerName] = useState("");
  const [commandMode, setCommandMode] = useState("console");
  const [edition, setEdition] = useState("java");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const prefix = commandMode === "ingame" ? "/" : "";

  const generateFn = useCallback(
    (template) => generateCommand(template, playerName, prefix),
    [playerName, prefix]
  );

  const copyToClipboard = useCallback(async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const copyAll = useCallback(async () => {
    const commands = COMMANDS.map((cmd) => generateFn(cmd.template));
    try {
      await navigator.clipboard.writeText(commands.join("\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [generateFn]);

  const handleClear = useCallback(() => {
    setPlayerName("");
    setShowClearConfirm(false);
  }, []);

  const nameEmpty = isEmpty(playerName);
  const nameHasSpaces = hasSpaces(playerName);
  const showJavaWarning = edition === "java" && nameHasSpaces;

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Free Tool
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Minecraft Whitelist Command Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate whitelist, op, ban, and kick commands for your server.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Player Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                  placeholder="Enter Minecraft player name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  autoFocus
                />
                {showJavaWarning && (
                  <p className="text-xs text-amber-400">
                    Java edition player names cannot contain spaces. Use Bedrock
                    mode for flexible names.
                  </p>
                )}
                {!nameEmpty && playerName.length > 0 && edition === "java" && !nameHasSpaces && (
                  <p className="text-xs text-emerald-400">Name looks valid</p>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Command Mode
                </label>
                <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-700">
                  <button
                    type="button"
                    className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                      commandMode === "console"
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                    }`}
                    onClick={() => setCommandMode("console")}
                  >
                    Server Console
                  </button>
                  <button
                    type="button"
                    className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                      commandMode === "ingame"
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                    }`}
                    onClick={() => setCommandMode("ingame")}
                  >
                    In-Game (/)
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Edition
                </label>
                <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-700">
                  <button
                    type="button"
                    className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                      edition === "java"
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                    }`}
                    onClick={() => setEdition("java")}
                  >
                    Java / Standard
                  </button>
                  <button
                    type="button"
                    className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                      edition === "bedrock"
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                    }`}
                    onClick={() => setEdition("bedrock")}
                  >
                    Bedrock / Flexible Name
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-white">
                    Generated Commands
                  </h2>
                  <div className="flex items-center gap-2">
                    {!nameEmpty && (
                      <button
                        type="button"
                        onClick={copyAll}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          copiedAll
                            ? "bg-emerald-500 text-white"
                            : "bg-indigo-500 text-white hover:bg-indigo-400"
                        }`}
                      >
                        {copiedAll ? "Copied!" : "Copy All"}
                      </button>
                    )}
                    {playerName.length > 0 && (
                      <div>
                        {showClearConfirm ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-rose-400">
                              Clear name?
                            </span>
                            <button
                              type="button"
                              onClick={handleClear}
                              className="rounded-lg bg-rose-500 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-400"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowClearConfirm(false)}
                              className="rounded-lg border border-slate-600 px-2 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowClearConfirm(true)}
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-rose-500 hover:text-rose-400"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {nameEmpty ? (
                  <p className="mt-6 text-center text-sm text-slate-500">
                    Enter a player name above to generate commands
                  </p>
                ) : (
                  <CommandList
                    commands={COMMANDS}
                    generateFn={generateFn}
                    copyFn={copyToClipboard}
                    copiedIndex={copiedIndex}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              About This Tool
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              This tool helps Minecraft server administrators quickly generate common
              server commands. Instead of typing each command manually — and risking
              typos that fail silently — you enter a player name once and get every
              command you need, ready to paste into your server console or in-game chat.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              It supports whitelist, op, deop, ban, pardon, and kick commands for both
              Java Edition and Bedrock Edition. Just select the mode, choose your
              edition, and copy with one click.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Example Commands
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              For a player named <strong className="text-slate-100">Alex</strong> in
              console mode, the tool generates:
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`whitelist add Alex
whitelist remove Alex
whitelist list
whitelist reload
op Alex
deop Alex
ban Alex
pardon Alex
kick Alex`}
              </pre>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Switch to in-game mode to add a <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs">/</code>{" "}
              prefix automatically.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">How to Use</h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter the Minecraft player name you want to manage.</li>
              <li>
                Select <strong className="text-slate-100">Server Console</strong>{" "}
                if pasting into your server terminal, or{" "}
                <strong className="text-slate-100">In-Game (/)</strong> for
                Minecraft chat.
              </li>
              <li>
                Choose <strong className="text-slate-100">Java / Standard</strong>{" "}
                for Java Edition (no spaces), or{" "}
                <strong className="text-slate-100">Bedrock / Flexible Name</strong>{" "}
                if spaces are allowed.
              </li>
              <li>
                Click <strong className="text-slate-100">Copy</strong> next to any
                command, or <strong className="text-slate-100">Copy All</strong> to
                copy everything at once.
              </li>
              <li>
                Paste into your server console or in-game chat and press Enter.
              </li>
            </ol>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 divide-y divide-slate-800">
              <div className="py-4 first:pt-0">
                <h3 className="text-sm font-semibold text-white">
                  What is a Minecraft whitelist?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  A whitelist is a list of approved players allowed to join your
                  Minecraft server. Only whitelisted players can connect when the
                  whitelist is enabled.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How do I enable the whitelist on my server?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Run{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                    whitelist on
                  </code>{" "}
                  in your server console, or set{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                    white-list=true
                  </code>{" "}
                  in your{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                    server.properties
                  </code>{" "}
                  file.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Console vs in-game commands — what's the difference?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Server console commands are typed into the terminal without a
                  slash. In-game commands are typed into Minecraft chat and need
                  a forward slash (/) prefix.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can Bedrock player names have spaces?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes, Bedrock Edition allows spaces in player names. Select
                  "Bedrock / Flexible Name" mode to avoid validation
                  warnings.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Is this tool free to use?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes, completely free. No login, no sign-up, and no hidden
                  costs. Built by QUESTPAUSE.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Mistakes When Using Whitelist Commands
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Running commands in the wrong place
                </h3>
                <p className="mt-1">
                  Console commands do not need a slash. In-game commands do. Select
                  the correct mode in the generator to avoid command errors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Typing the player name incorrectly
                </h3>
                <p className="mt-1">
                  Minecraft player names are case-sensitive for some commands. Copy
                  the name exactly as it appears in-game or in the server log.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Adding spaces in Java Edition names
                </h3>
                <p className="mt-1">
                  Java Edition does not allow spaces in player names. If a command
                  is not working, check for hidden spaces or typos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Forgetting to reload the whitelist
                </h3>
                <p className="mt-1">
                  After adding a player to the whitelist, run{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">whitelist reload</code>{" "}
                  if the whitelist file was edited manually.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="minecraft-whitelist-command-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default MinecraftWhitelistCommandGenerator;
