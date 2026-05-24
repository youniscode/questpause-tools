import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";
import {
  SERVER_TYPES,
  RULE_STRICTNESS,
  RULE_TOGGLES,
  generateRules,
  CopyButton,
  ToggleOption,
} from "../../../features/tools/minecraft/server-rules-generator/index.js";

const seo = {
  title: "Minecraft Server Rules Generator | QUESTPAUSE Tools",
  description:
    "Generate clear Minecraft server rules for SMP, whitelist, PvE, and community survival servers. Free Minecraft rules template tool by QUESTPAUSE.",
};

function MinecraftServerRulesGenerator() {
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState("smp");
  const [strictness, setStrictness] = useState("balanced");
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(RULE_TOGGLES.map((t) => [t.id, true]))
  );
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const handleToggle = useCallback((id) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleGenerate = useCallback(() => {
    const selected = RULE_TOGGLES.filter((t) => toggles[t.id]).map((t) => t.id);
    const useDiscord = toggles["use-discord"];
    const rules = generateRules(serverName, serverType, strictness, selected, useDiscord);
    setOutput(rules);
  }, [serverName, serverType, strictness, toggles]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [output]);

  const handleClear = useCallback(() => {
    setServerName("");
    setServerType("smp");
    setStrictness("balanced");
    setToggles(Object.fromEntries(RULE_TOGGLES.map((t) => [t.id, true])));
    setOutput("");
    setCopied(false);
  }, []);

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
              Minecraft Server Rules Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear server rules for your Minecraft community.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">
              {/* Server Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Server Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                  placeholder="Enter your Minecraft server name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Server Type */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Server Type
                </label>
                <select
                  value={serverType}
                  onChange={(e) => setServerType(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                >
                  {SERVER_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Strictness */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Rule Strictness
                </label>
                <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-700">
                  {RULE_STRICTNESS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                        strictness === s.id
                          ? "bg-indigo-500 text-white"
                          : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                      }`}
                      onClick={() => setStrictness(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Rules to Include
                </label>
                <div className="mt-2 space-y-3">
                  {RULE_TOGGLES.map((t) => (
                    <ToggleOption
                      key={t.id}
                      id={t.id}
                      label={t.label}
                      checked={toggles[t.id]}
                      onChange={handleToggle}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Generate Rules
                </button>
                {output && (
                  <CopyButton onClick={handleCopy} copied={copied} />
                )}
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-rose-500 hover:text-rose-400"
                >
                  Clear
                </button>
              </div>

              {/* Output */}
              {output && (
                <div className="mt-6">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                      {output}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Minecraft Server Rules Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your Minecraft server name.</li>
              <li>
                Select the type of server you run (SMP, whitelist, PvE, etc.).
              </li>
              <li>
                Choose a rule strictness level that fits your community culture.
              </li>
              <li>
                Toggle the rules you want to include in your server rules post.
              </li>
              <li>
                Click <strong className="text-slate-100">Generate Rules</strong>{" "}
                to preview your rules text.
              </li>
              <li>
                Click <strong className="text-slate-100">Copy Rules</strong> to
                copy and paste into your Discord or server info page.
              </li>
            </ol>
          </div>
        </section>

        {/* Why Clear Server Rules Matter */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Why Clear Server Rules Matter
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Clear, written server rules help prevent misunderstandings, reduce
              admin workload, and create a fair environment for all players. When
              everyone knows what is expected, staff spend less time resolving
              disputes and more time building the community.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              A well-defined rules page also sets the tone for your server &mdash; whether
              it is a relaxed survival world or a strictly moderated whitelist
              community. Players appreciate knowing the boundaries ahead of time.
            </p>
          </div>
        </section>

        {/* Example Section */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Example Minecraft Server Rules
            </h2>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`My SMP - Server Rules

Welcome to My SMP! This is a Small Survival SMP community.

Please follow the rules below. Breaking them may result in warnings or temporary suspension.

Please follow these rules:

1. No griefing
2. No stealing
3. No cheating or hacked clients
4. Respect claims and bases
5. Keep chat respectful

Thanks for helping keep the server fun for everyone.
Join our Discord for announcements, support, and community.`}
              </pre>
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
                  Can I customize the generated rules?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Toggle individual rules on or off. Change the server type
                  and strictness to adjust the tone. You can also edit the output
                  after copying.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What server types are supported?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Small Survival SMP, Whitelist Survival Server, Chill PvE
                  Server, Community Building Server, and Family-Friendly Server.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is the difference between relaxed and strict rules?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Relaxed rules use a friendly, gentle tone. Strict rules are
                  firm and clearly state consequences. Balanced rules sit in the
                  middle with standard enforcement language.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use these rules for a Discord server too?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. The generated rules work well for Discord #rules channels,
                  server info pages, and in-game rule boards. Toggle the Discord
                  announcements option to add a Discord-specific note.
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

        {/* Common Mistakes */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Mistakes When Writing Server Rules
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Making rules too vague
                </h3>
                <p className="mt-1">
                  Rules like &ldquo;be nice&rdquo; leave too much room for interpretation. Use
                  specific, concrete rules that players can clearly follow.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Not defining consequences
                </h3>
                <p className="mt-1">
                  Players need to know what happens when a rule is broken. Mention
                  warnings, temporary bans, or permanent removal so expectations are
                  clear.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Hiding rules in hard-to-find places
                </h3>
                <p className="mt-1">
                  Post your rules where every player can easily find them &mdash; a Discord
                  channel, server info page, or in-game rule board. The more visible
                  they are, the fewer rule violations you will see.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Too many rules at once
                </h3>
                <p className="mt-1">
                  Start with the most important rules and keep the list short. Too
                  many rules overwhelm new players and make enforcement harder.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="minecraft-server-rules-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default MinecraftServerRulesGenerator;
