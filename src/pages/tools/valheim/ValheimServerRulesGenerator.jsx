import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Valheim Server Rules Generator | QUESTPAUSE Tools",
  description:
    "Generate clear Valheim server rules for co-op realms, modded servers, shared boss progression, community builds, wards, portals, and long-term Viking worlds.",
};

const SERVER_TYPES = [
  { id: "long-term-coop", label: "Long-Term Co-op Realm" },
  { id: "modded", label: "Modded Valheim Server" },
  { id: "vanilla", label: "Vanilla Valheim Server" },
  { id: "community-building", label: "Community Building Server" },
  { id: "progression-controlled", label: "Progression-Controlled Server" },
  { id: "private-friends", label: "Private Friends Server" },
  { id: "public-whitelist", label: "Public Whitelist Server" },
];

const RULE_STYLES = [
  { id: "relaxed", label: "Relaxed" },
  { id: "balanced", label: "Balanced" },
  { id: "strict", label: "Strict" },
  { id: "roleplay", label: "Roleplay-friendly" },
  { id: "community-first", label: "Community-first" },
];

const PROGRESSION_STYLES = [
  { id: "free", label: "Free progression" },
  { id: "shared-boss", label: "Shared boss progression" },
  { id: "admin-controlled", label: "Admin-controlled progression" },
  { id: "no-rushing", label: "No rushing bosses" },
  { id: "group-vote", label: "Group-vote progression" },
];

const TOGGLE_OPTIONS = [
  { id: "no-griefing", label: "No griefing" },
  { id: "no-stealing", label: "No stealing" },
  { id: "respect-bases", label: "Respect player bases" },
  { id: "respect-wards", label: "Respect wards and claims" },
  { id: "no-boss-rushing", label: "No boss rushing" },
  { id: "ask-before-boss", label: "Ask before triggering bosses" },
  { id: "no-cheating", label: "No cheating or devcommands" },
  { id: "no-exploiting-mods", label: "No exploiting mods" },
  { id: "keep-portals-organized", label: "Keep portals organized" },
  { id: "no-destroy-public", label: "Do not destroy public builds" },
  { id: "respect-community-projects", label: "Respect community projects" },
  { id: "keep-chat-respectful", label: "Keep chat respectful" },
  { id: "report-bugs", label: "Report bugs or exploits" },
  { id: "use-discord", label: "Use Discord for announcements" },
  { id: "admin-decisions-final", label: "Admin decisions are final" },
];

const TOGGLE_CATEGORIES = {
  "General Rules": ["no-griefing", "no-stealing"],
  "Building & Base Rules": ["respect-bases", "respect-wards", "keep-portals-organized", "no-destroy-public", "respect-community-projects"],
  "Progression Rules": ["no-boss-rushing", "ask-before-boss"],
  "Cheating & Exploits": ["no-cheating", "no-exploiting-mods"],
  "Community Behavior": ["keep-chat-respectful", "report-bugs", "use-discord", "admin-decisions-final"],
};

const TOGGLE_LABELS = Object.fromEntries(TOGGLE_OPTIONS.map((t) => [t.id, t.label]));

const STYLE_INTROS = {
  relaxed: "We want everyone to enjoy the Viking life together. Please keep these friendly guidelines in mind:",
  balanced: "Please follow the rules below to keep the server fair and fun for everyone:",
  strict: "The following rules are strictly enforced. Violations will result in immediate action:",
  roleplay: "To preserve our shared story and Viking world, please follow these roleplay guidelines:",
  "community-first": "Our community is built on mutual respect. Please help us maintain a positive environment by following these rules:",
};

const STYLE_FOOTERS = {
  relaxed: "Thanks for being part of our Valheim community! Sk\u00e5l!",
  balanced: "Thanks for helping keep the server fun for everyone. Play fair, respect others, and enjoy the Viking journey.",
  strict: "Zero tolerance. All rules are enforced at admin discretion. Play fair or find another server.",
  roleplay: "Thank you for respecting the world and story we are building together. Your actions shape the saga.",
  "community-first": "Together we build something great. Thank you for being a respectful member of our community.",
};

const PROGRESSION_DESCRIPTIONS = {
  free: "Players may progress through biomes and bosses at their own pace. There are no restrictions on boss kills or exploration order.",
  "shared-boss": "Boss progression is shared with the group. All players should agree before summoning and killing bosses to ensure no one misses out on trophies and progression rewards.",
  "admin-controlled": "Boss fights and biome progression are controlled by the admin team. Players must request boss events through the appropriate channels.",
  "no-rushing": "Do not rush through biomes or kill bosses without the group. Allow newer or less advanced players time to prepare and experience each biome together.",
  "group-vote": "Major progression decisions including boss fights and new biome access are decided by group vote. Majority rules.",
};

function getActiveToggleIds(toggles) {
  return Object.entries(toggles).filter(([, v]) => v).map(([k]) => k);
}

function generateFull(serverName, serverType, ruleStyle, progressionStyle, toggles, discordChannel, modpackInstructions, progressionNote, extraNote) {
  const name = serverName.trim() || "our Valheim server";
  const typeLabel = SERVER_TYPES.find((t) => t.id === serverType)?.label || "Valheim server";
  const activeToggleIds = getActiveToggleIds(toggles);
  const intro = STYLE_INTROS[ruleStyle] || STYLE_INTROS.balanced;
  const footer = STYLE_FOOTERS[ruleStyle] || STYLE_FOOTERS.balanced;
  const progDesc = PROGRESSION_DESCRIPTIONS[progressionStyle] || "";

  const lines = [
    `${name} - Server Rules`,
    "",
    `Welcome to ${name}! This is a ${typeLabel} Valheim community.`,
    "",
    intro,
    "",
  ];

  // Rules by category
  for (const [category, ruleIds] of Object.entries(TOGGLE_CATEGORIES)) {
    const matched = ruleIds.filter((id) => activeToggleIds.includes(id));
    if (matched.length === 0) continue;
    lines.push(`=== ${category} ===`);
    matched.forEach((id, i) => {
      lines.push(`${i + 1}. ${TOGGLE_LABELS[id] || id}`);
    });
    lines.push("");
  }

  // Progression rules
  lines.push("=== Progression ===");
  if (progDesc) {
    lines.push(progDesc);
    lines.push("");
  } else {
    lines.push("No specific progression rules set.");
    lines.push("");
  }

  if (discordChannel.trim()) {
    lines.push(`Join our Discord channel: ${discordChannel.trim()}`);
    lines.push("");
  }
  if (modpackInstructions.trim()) {
    lines.push(`Modpack: ${modpackInstructions.trim()}`);
    lines.push("");
  }
  if (progressionNote.trim()) {
    lines.push(`Progression Note: ${progressionNote.trim()}`);
    lines.push("");
  }
  if (extraNote.trim()) {
    lines.push(`Note: ${extraNote.trim()}`);
    lines.push("");
  }

  lines.push(footer);

  return lines.join("\n");
}

function generateShort(serverName, serverType, progressionStyle, toggles, discordChannel) {
  const name = serverName.trim() || "our Valheim server";
  const typeLabel = SERVER_TYPES.find((t) => t.id === serverType)?.label || "Valheim server";
  const activeToggleIds = getActiveToggleIds(toggles);
  const progLabel = PROGRESSION_STYLES.find((p) => p.id === progressionStyle)?.label || "Free progression";

  const lines = [
    `${name} - Rules`,
    `${typeLabel} | Progression: ${progLabel}`,
    "",
  ];

  activeToggleIds.forEach((id, i) => {
    lines.push(`${i + 1}. ${TOGGLE_LABELS[id] || id}`);
  });

  if (discordChannel.trim()) {
    lines.push("", `Discord: ${discordChannel.trim()}`);
  }

  return lines.join("\n");
}

function generateChecklist(serverName, toggles) {
  const name = serverName.trim() || "our Valheim server";
  const activeToggleIds = getActiveToggleIds(toggles);

  const lines = [
    `${name} - Rules Checklist`,
    "",
  ];

  activeToggleIds.forEach((id) => {
    lines.push(`\u2610 ${TOGGLE_LABELS[id] || id}`);
  });

  return lines.join("\n");
}

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";

function ValheimServerRulesGenerator() {
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState("long-term-coop");
  const [ruleStyle, setRuleStyle] = useState("balanced");
  const [progressionStyle, setProgressionStyle] = useState("free");
  const [toggles, setToggles] = useState(() => Object.fromEntries(TOGGLE_OPTIONS.map((t) => [t.id, true])));
  const [discordChannel, setDiscordChannel] = useState("");
  const [modpackInstructions, setModpackInstructions] = useState("");
  const [progressionNote, setProgressionNote] = useState("");
  const [extraNote, setExtraNote] = useState("");

  const [output, setOutput] = useState({ full: "", short: "", checklist: "" });
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const handleToggle = useCallback((id) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleGenerate = useCallback(() => {
    const full = generateFull(serverName, serverType, ruleStyle, progressionStyle, toggles, discordChannel, modpackInstructions, progressionNote, extraNote);
    const short = generateShort(serverName, serverType, progressionStyle, toggles, discordChannel);
    const checklist = generateChecklist(serverName, toggles);
    setOutput({ full, short, checklist });
    setCopied("");
  }, [serverName, serverType, ruleStyle, progressionStyle, toggles, discordChannel, modpackInstructions, progressionNote, extraNote]);

  const handleCopy = useCallback(async (text, label) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const handleClear = useCallback(() => {
    setServerName("");
    setServerType("long-term-coop");
    setRuleStyle("balanced");
    setProgressionStyle("free");
    setToggles(Object.fromEntries(TOGGLE_OPTIONS.map((t) => [t.id, true])));
    setDiscordChannel("");
    setModpackInstructions("");
    setProgressionNote("");
    setExtraNote("");
    setOutput({ full: "", short: "", checklist: "" });
    setCopied("");
  }, []);

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        {/* Hero */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Valheim
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Valheim Server Rules Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear rules for co-op survival servers, modded realms,
              progression-controlled worlds, and long-term Viking communities.
            </p>
          </div>
        </section>

        {/* Tool */}
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
                  className={inputClass}
                  placeholder="Enter your Valheim server name..."
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
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Rule Style */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Rule Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {RULE_STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        ruleStyle === s.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setRuleStyle(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progression Style */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Progression Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROGRESSION_STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        progressionStyle === s.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setProgressionStyle(s.id)}
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
                  {TOGGLE_OPTIONS.map((t) => (
                    <label key={t.id} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={toggles[t.id]}
                        onChange={() => handleToggle(t.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-slate-200 transition">
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Fields */}
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Optional Details
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Discord channel name (optional)"
                  value={discordChannel}
                  onChange={(e) => setDiscordChannel(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Modpack instructions (optional)"
                  value={modpackInstructions}
                  onChange={(e) => setModpackInstructions(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Progression note (optional)"
                  value={progressionNote}
                  onChange={(e) => setProgressionNote(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Extra server note (optional)"
                  value={extraNote}
                  onChange={(e) => setExtraNote(e.target.value)}
                />
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
                {output.full && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.full, "full")}
                      disabled={copied === "full"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "full"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "bg-indigo-500 text-white hover:bg-indigo-400"
                      }`}
                    >
                      {copied === "full" ? "Copied!" : "Copy Rules"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.short, "short")}
                      disabled={copied === "short"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "short"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "short" ? "Copied!" : "Copy Short Version"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.checklist, "checklist")}
                      disabled={copied === "checklist"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "checklist"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                      }`}
                    >
                      {copied === "checklist" ? "Copied!" : "Copy Discord Version"}
                    </button>
                  </>
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
              {output.full && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Full Rules Post
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.full}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Short Discord Version
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.short}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Simple Checklist
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.checklist}
                      </pre>
                    </div>
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
              How to Use This Valheim Server Rules Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your Valheim server name (or leave blank to use &ldquo;our Valheim server&rdquo;).</li>
              <li>Select the type of server you run &mdash; co-op realm, modded, vanilla, community, or whitelist.</li>
              <li>Choose a rule style that matches your community culture.</li>
              <li>Pick a progression style to define how boss fights and biome access work.</li>
              <li>Toggle the rules you want to include in your server rules.</li>
              <li>Add optional details like Discord channel, modpack info, or a custom note.</li>
              <li>Click <strong className="text-slate-100">Generate Rules</strong> to preview all three versions.</li>
              <li>Use the copy buttons to grab the full post, a short Discord version, or a simple checklist.</li>
            </ol>
          </div>
        </section>

        {/* Common Valheim Server Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Valheim Server Rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Most Valheim servers share a core set of rules that keep the world fun and fair for everyone.
              Anti-griefing and anti-stealing rules are the most common, followed by base respect and
              ward protection. Community servers often add rules about boss progression, portal organization,
              and respect for public builds.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              The right rules depend on your server type &mdash; a private friends server needs fewer rules
              than a public whitelist community. Start with the essentials and add more as your community grows.
            </p>
          </div>
        </section>

        {/* Shared Boss Progression Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Shared Boss Progression Rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              One of the most important decisions for a Valheim server is how boss progression works.
              On shared-progression servers, all players should agree before summoning a boss so no one
              misses the rewards, trophies, and biome unlocks. Some servers use admin-controlled progression
              where boss fights are scheduled events, while others let players progress freely.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Clear progression rules prevent frustration when some players advance faster than others.
              They also help maintain a balanced experience for new players joining an established world.
            </p>
          </div>
        </section>

        {/* Wards, Bases, and Community Build Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Wards, Bases, and Community Build Rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Ward protection is a core mechanic in Valheim that allows players to claim their builds.
              Respecting wards means not building inside protected areas, not damaging claimed structures,
              and not using exploits to bypass ward restrictions. Community builds &mdash; shared farms,
              public ports, meeting halls &mdash; should be clearly marked so everyone knows what is
              public and what is private.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Portal organization is another common rule on community servers. Well-organized portals
              with clear signs or naming conventions help players navigate the world and reduce clutter
              around key structures.
            </p>
          </div>
        </section>

        {/* Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Long-Term Valheim Servers
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Start simple, expand as needed
                </h3>
                <p className="mt-1">
                  New servers do not need a long rulebook. Start with the essential rules and add
                  more as issues arise. Players appreciate concise, clear rules they can actually remember.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Make rules visible and accessible
                </h3>
                <p className="mt-1">
                  Post your rules in a Discord channel, on a server info page, and in an in-game sign
                  board near the spawn point. The easier they are to find, the fewer violations you will see.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Define progression expectations early
                </h3>
                <p className="mt-1">
                  Progression rules should be clear from day one. If your server uses shared or
                  admin-controlled progression, explain how it works before players start investing
                  time and effort.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Consistency builds trust
                </h3>
                <p className="mt-1">
                  Enforce rules consistently for all players. Favoritism or selective enforcement
                  destroys community trust faster than any rule violation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Update rules as your community evolves
                </h3>
                <p className="mt-1">
                  As your server grows, new situations will arise. Review and update your rules
                  periodically. Announce changes in Discord so everyone stays informed.
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
                  Can I customize the generated rules?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Toggle individual rules on or off. Change the server type, rule style, and
                  progression style to adjust the tone and content. You can also edit the output
                  after copying.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What server types are supported?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Long-Term Co-op Realm, Modded Valheim Server, Vanilla Valheim Server, Community
                  Building Server, Progression-Controlled Server, Private Friends Server, and Public
                  Whitelist Server.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is shared boss progression?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Shared boss progression means all players on the server agree before summoning and
                  killing a boss. This ensures no one misses out on boss rewards, trophies, and biome
                  unlocks. It is the most common progression style on co-op Valheim servers.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How do I handle ward protection in rules?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Include rules that require players to respect ward-protected areas, not build inside
                  claimed zones, and not damage or modify existing structures without permission. These
                  rules prevent base griefing and property disputes.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use these rules for a Discord server too?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. The generated rules work well for Discord #rules channels, server info pages,
                  and in-game sign boards. Use the Short Discord Version for a quick reference post.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Is this tool free?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes, completely free. No login, no sign-up, and no hidden costs. Built by QUESTPAUSE.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="valheim-server-rules-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ValheimServerRulesGenerator;
