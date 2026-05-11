import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "ICARUS Server Rules Generator | QUESTPAUSE Tools",
  description:
    "Generate ICARUS server rules for co-op survival worlds, persistent servers, shared bases, missions, mounts, resources, progression, and long-term communities.",
};

const SERVER_TYPES = [
  { id: "long-term-coop", label: "Long-Term Co-op World" },
  { id: "persistent", label: "Persistent Survival World" },
  { id: "private", label: "Private Friends Server" },
  { id: "whitelist", label: "Public Whitelist Server" },
  { id: "mission-focused", label: "Mission-Focused Server" },
  { id: "exploration", label: "Exploration Server" },
  { id: "community-base", label: "Community Base Server" },
  { id: "hardcore", label: "Hardcore Survival Server" },
];

const RULE_STYLES = [
  { id: "relaxed", label: "Relaxed" },
  { id: "balanced", label: "Balanced" },
  { id: "strict", label: "Strict" },
  { id: "community-first", label: "Community-first" },
  { id: "expedition-focused", label: "Expedition-focused" },
  { id: "new-player-friendly", label: "New-player friendly" },
];

const PROGRESSION_STYLES = [
  { id: "free", label: "Free progression" },
  { id: "shared", label: "Shared progression" },
  { id: "admin-guided", label: "Admin-guided progression" },
  { id: "group-vote", label: "Group-vote progression" },
  { id: "no-rush", label: "No rushing major objectives" },
  { id: "mission-by-mission", label: "Mission-by-mission progression" },
];

const TOGGLE_RULES = [
  { id: "no-griefing", label: "No griefing" },
  { id: "no-stealing", label: "No stealing from bases" },
  { id: "respect-storage", label: "Respect shared storage" },
  { id: "respect-bases", label: "Respect player bases" },
  { id: "ask-rare", label: "Ask before taking rare resources" },
  { id: "no-destroy-community", label: "Do not destroy community builds" },
  { id: "coordinate-missions", label: "Coordinate major missions" },
  { id: "no-rush-progression", label: "Do not rush progression alone" },
  { id: "help-new", label: "Help new players when possible" },
  { id: "respect-tames", label: "Respect tames and mounts" },
  { id: "no-cheating", label: "No cheating or exploiting" },
  { id: "report-bugs", label: "Report bugs or stuck characters" },
  { id: "use-discord", label: "Use Discord for announcements" },
  { id: "avoid-risky", label: "Avoid risky activity before restarts" },
  { id: "admin-final", label: "Admin decisions are final" },
];

const STAFF_CHECKLIST = [
  "Incident reported and logged",
  "Player accounts identified",
  "Evidence/screenshots reviewed",
  "Base/claim status checked",
  "Relevant rule checked",
  "Previous violations reviewed",
  "Staff action taken and logged",
  "Players informed of outcome",
];

const styleDescriptions = {
  relaxed: {
    desc: "Relaxed rules. Build freely, respect others, and keep things friendly.",
    storage: "Shared storage is first-come, first-served. Be considerate.",
    griefing: "Griefing is not allowed.",
    stealing: "Do not take from other players personal bases.",
  },
  balanced: {
    desc: "Follow the rules, respect other players, and help keep the server fair.",
    storage: "Respect shared storage. Take what you need, leave what you can.",
    griefing: "Griefing is prohibited. Report incidents to staff.",
    stealing: "Stealing from bases or personal storage is not allowed.",
  },
  strict: {
    desc: "Strictly enforced rules. Violations result in warnings, kicks, or bans.",
    storage: "Shared storage is monitored. Abuse will result in action.",
    griefing: "Griefing is a bannable offense. Zero tolerance.",
    stealing: "Theft from any player is a permanent ban.",
  },
  "community-first": {
    desc: "We are a community first. Rules exist to keep things fair and fun for everyone.",
    storage: "Community storage is for everyone. Be generous, not greedy.",
    griefing: "Griefing hurts the community. It is not tolerated.",
    stealing: "Respect what others have built. Ask before taking.",
  },
  "expedition-focused": {
    desc: "Rules support organized expeditions and mission-focused gameplay.",
    storage: "Shared storage supports expedition supplies. Coordinate usage.",
    griefing: "Griefing disrupts expeditions and is not allowed.",
    stealing: "Mission-critical resources should not be taken without coordination.",
  },
  "new-player-friendly": {
    desc: "New players are always welcome. Rules help create a safe, helpful environment.",
    storage: "New players can use shared starter supplies.",
    griefing: "Griefing new players is a serious violation.",
    stealing: "Help new players get started. Do not take their supplies.",
  },
};

function generateFullRules(serverName, serverType, ruleStyle, progressionStyle, toggles, discordChannel, restartChannel, sharedBaseNote, resourceNote, progressionNote, extraNote) {
  const name = serverName.trim() || "our ICARUS server";
  const typeLabel = SERVER_TYPES.find((t) => t.id === serverType)?.label || "Server";
  const styleData = styleDescriptions[ruleStyle] || styleDescriptions.balanced;
  const progLabel = PROGRESSION_STYLES.find((p) => p.id === progressionStyle)?.label || "Shared progression";

  const parts = [];

  parts.push(`# ${name} — ICARUS Server Rules`);
  parts.push(`Server type: ${typeLabel}`);
  parts.push(`Rule style: ${styleData.desc}`);
  parts.push(`Progression style: ${progLabel}`);
  parts.push("");

  parts.push("## 1. Base & Storage Rules");
  parts.push("");
  if (toggles["respect-bases"]) {
    parts.push("- Respect all player bases and outposts. Do not enter without permission.");
    parts.push("");
  }
  if (toggles["respect-storage"]) {
    parts.push(`- ${styleData.storage}`);
    parts.push("");
  }
  if (toggles["no-stealing"]) {
    parts.push(`- ${styleData.stealing}`);
    parts.push("");
  }
  if (toggles["no-destroy-community"]) {
    parts.push("- Do not destroy community-built structures without staff approval.");
    parts.push("");
  }
  if (toggles["no-griefing"]) {
    parts.push(`- ${styleData.griefing}`);
    parts.push("");
  }

  parts.push("## 2. Resources & Tames");
  parts.push("");
  if (toggles["ask-rare"]) {
    parts.push("- Ask before taking rare or limited resources from shared storage.");
    parts.push("");
  }
  if (toggles["respect-tames"]) {
    parts.push("- Respect other players tames and mounts. Do not harm or steal them.");
    parts.push("");
  }
  if (resourceNote.trim()) {
    parts.push(`- Resource policy: ${resourceNote.trim()}`);
    parts.push("");
  }
  if (sharedBaseNote.trim()) {
    parts.push(`- Shared base note: ${sharedBaseNote.trim()}`);
    parts.push("");
  }

  parts.push("## 3. Missions & Progression");
  parts.push("");
  parts.push(`Progression: ${progLabel}`);
  parts.push("");
  if (toggles["coordinate-missions"]) {
    parts.push("- Coordinate major missions and operations with the group.");
    parts.push("");
  }
  if (toggles["no-rush-progression"]) {
    parts.push("- Do not rush ahead of the group on major progression milestones.");
    parts.push("");
  }
  if (progressionNote.trim()) {
    parts.push(`- ${progressionNote.trim()}`);
    parts.push("");
  }

  parts.push("## 4. Community Standards");
  parts.push("");
  if (toggles["help-new"]) {
    parts.push("- Help new players when you can. We were all new once.");
    parts.push("");
  }
  if (toggles["no-cheating"]) {
    parts.push("- No cheating, exploiting bugs, or using unauthorized mods.");
    parts.push("");
  }
  if (toggles["report-bugs"]) {
    parts.push("- Report bugs, glitches, or stuck characters to staff immediately.");
    parts.push("");
  }
  if (toggles["use-discord"]) {
    parts.push("- Use Discord for announcements and coordination.");
    parts.push("");
  }
  if (toggles["avoid-risky"]) {
    parts.push("- Avoid risky activities (missions, exploration) before scheduled restarts.");
    parts.push("");
  }
  if (toggles["admin-final"]) {
    parts.push("- Admin decisions regarding rule enforcement are final.");
    parts.push("");
  }

  if (discordChannel.trim()) {
    parts.push(`- Discord: #${discordChannel.trim()}`);
    parts.push("");
  }
  if (restartChannel.trim()) {
    parts.push(`- Restart/maintenance announcements: #${restartChannel.trim()}`);
    parts.push("");
  }
  if (extraNote.trim()) {
    parts.push(`- ${extraNote.trim()}`);
    parts.push("");
  }

  return parts.join("\n").trim();
}

function generateShortVersion(serverName, ruleStyle, progressionStyle, toggles) {
  const name = serverName.trim() || "our ICARUS server";
  const styleData = styleDescriptions[ruleStyle] || styleDescriptions.balanced;
  const progLabel = PROGRESSION_STYLES.find((p) => p.id === progressionStyle)?.label || "Shared progression";

  const lines = [];
  lines.push(`${name} — ICARUS Server Rules`);
  lines.push("");
  lines.push(`Style: ${styleData.desc}`);
  lines.push(`Progression: ${progLabel}`);
  lines.push("");
  if (toggles["no-griefing"]) lines.push("- No griefing");
  if (toggles["no-stealing"]) lines.push("- No stealing");
  if (toggles["respect-bases"]) lines.push("- Respect bases");
  if (toggles["respect-storage"]) lines.push("- Respect shared storage");
  if (toggles["coordinate-missions"]) lines.push("- Coordinate missions");
  if (toggles["help-new"]) lines.push("- Help new players");

  return lines.join("\n");
}

function generateNewPlayerSummary(serverName, ruleStyle, toggles) {
  const name = serverName.trim() || "our ICARUS server";
  const styleData = styleDescriptions[ruleStyle] || styleDescriptions.balanced;

  const lines = [
    `Welcome to ${name}!`,
    "",
    `Rule style: ${styleData.desc}`,
    "",
    "What to know as a new player:",
    "",
  ];
  if (toggles["help-new"]) lines.push("- Ask for help. Our community is happy to guide you.");
  if (toggles["respect-storage"]) lines.push("- Shared storage is available for everyone.");
  if (toggles["respect-bases"]) lines.push("- Find a spot to build and claim your base.");
  if (toggles["no-griefing"]) lines.push("- Respect other players and their builds.");
  if (toggles["coordinate-missions"]) lines.push("- Join group missions to learn the ropes.");
  if (toggles["use-discord"]) lines.push("- Join us on Discord to stay in the loop.");

  return lines.join("\n");
}

function generateStaffChecklist() {
  const lines = ["Staff Enforcement Checklist", ""];
  STAFF_CHECKLIST.forEach((item) => {
    lines.push(`[ ] ${item}`);
  });
  return lines.join("\n");
}

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";

function ICARUSServerRulesGenerator() {
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState("long-term-coop");
  const [ruleStyle, setRuleStyle] = useState("balanced");
  const [progressionStyle, setProgressionStyle] = useState("shared");
  const [toggles, setToggles] = useState(() => Object.fromEntries(TOGGLE_RULES.map((t) => [t.id, false])));
  const [discordChannel, setDiscordChannel] = useState("");
  const [restartChannel, setRestartChannel] = useState("");
  const [sharedBaseNote, setSharedBaseNote] = useState("");
  const [resourceNote, setResourceNote] = useState("");
  const [progressionNote, setProgressionNote] = useState("");
  const [extraNote, setExtraNote] = useState("");

  const [output, setOutput] = useState({ full: "", short: "", newPlayer: "", checklist: "" });
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
    const full = generateFullRules(serverName, serverType, ruleStyle, progressionStyle, toggles, discordChannel, restartChannel, sharedBaseNote, resourceNote, progressionNote, extraNote);
    const short = generateShortVersion(serverName, ruleStyle, progressionStyle, toggles);
    const newPlayer = generateNewPlayerSummary(serverName, ruleStyle, toggles);
    const checklist = generateStaffChecklist();
    setOutput({ full, short, newPlayer, checklist });
    setCopied("");
  }, [serverName, serverType, ruleStyle, progressionStyle, toggles, discordChannel, restartChannel, sharedBaseNote, resourceNote, progressionNote, extraNote]);

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
    setProgressionStyle("shared");
    setToggles(Object.fromEntries(TOGGLE_RULES.map((t) => [t.id, false])));
    setDiscordChannel("");
    setRestartChannel("");
    setSharedBaseNote("");
    setResourceNote("");
    setProgressionNote("");
    setExtraNote("");
    setOutput({ full: "", short: "", newPlayer: "", checklist: "" });
    setCopied("");
  }, []);

  const allText = [output.full, "", "--- SHORT VERSION ---", "", output.short, "", "--- NEW PLAYER SUMMARY ---", "", output.newPlayer, "", "--- STAFF CHECKLIST ---", "", output.checklist].join("\n");

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        {/* Hero */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              ICARUS
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              ICARUS Server Rules Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear server rules for ICARUS co-op survival worlds, persistent servers,
              shared bases, missions, mounts, resources, and long-term communities.
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
                  placeholder="Enter your ICARUS server name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-slate-500">If empty, "our ICARUS server" will be used.</p>
              </div>

              {/* Server Type */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Server Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {SERVER_TYPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        serverType === s.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setServerType(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
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

              {/* Toggle Rules */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Rule Categories
                </label>
                <div className="mt-2 space-y-3">
                  {TOGGLE_RULES.map((t) => (
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
                  Optional Custom Fields
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Discord channel name"
                  value={discordChannel}
                  onChange={(e) => setDiscordChannel(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Restart/maintenance channel name"
                  value={restartChannel}
                  onChange={(e) => setRestartChannel(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Shared base note (optional)"
                  value={sharedBaseNote}
                  onChange={(e) => setSharedBaseNote(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Resource policy note (optional)"
                  value={resourceNote}
                  onChange={(e) => setResourceNote(e.target.value)}
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
                      {copied === "full" ? "Copied!" : "Copy Full Rules"}
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
                      onClick={() => handleCopy(output.newPlayer, "newplayer")}
                      disabled={copied === "newplayer"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "newplayer"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "newplayer" ? "Copied!" : "Copy New Player Summary"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.checklist, "checklist")}
                      disabled={copied === "checklist"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "checklist"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "checklist" ? "Copied!" : "Copy Staff Checklist"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(allText, "all")}
                      disabled={copied === "all"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "all"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                      }`}
                    >
                      {copied === "all" ? "Copied!" : "Copy All"}
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
                      A. Full ICARUS Server Rules Post
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.full}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      B. Short Discord Version
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.short}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      C. New Player Rules Summary
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.newPlayer}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      D. Staff Enforcement Checklist
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
              How to Use This ICARUS Server Rules Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name (or leave blank to use &ldquo;our ICARUS server&rdquo;).</li>
              <li>Select your server type &mdash; co-op world, persistent, whitelist, hardcore, and more.</li>
              <li>Choose a rule style that matches your enforcement level.</li>
              <li>Pick a progression style for how missions and objectives are handled.</li>
              <li>Toggle the rule categories you want included in your rules.</li>
              <li>Fill in optional fields like Discord channels and custom notes.</li>
              <li>Click <strong className="text-slate-100">Generate Rules</strong> to preview all outputs.</li>
              <li>Use the copy buttons to grab the full rules, short version, new player summary, or staff checklist.</li>
            </ol>
          </div>
        </section>

        {/* Common ICARUS Server Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common ICARUS Server Rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              ICARUS servers need clear rules about bases, resources, missions, and community
              behavior. Unlike many survival games, ICARUS has a persistent world where players
              build outposts, tame creatures, and complete missions together. Rules help prevent
              conflicts and keep the experience enjoyable for everyone.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Most servers include rules about respecting bases, not stealing from storage,
              coordinating major missions, and helping new players. Servers with shared
              progression systems need additional rules about how and when to advance.
            </p>
          </div>
        </section>

        {/* Shared Base and Resource Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Shared Base and Resource Rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Shared bases and communal storage are common on ICARUS servers. Rules should define
              how shared storage is used, who can take resources, and how community builds are
              maintained. Without clear rules, disputes over rare materials and base space can
              create tension.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Consider setting up dedicated channels on Discord for resource requests and base
              coordination. A "first come, first served" policy on common materials works well
              for most servers, while rare resources may require staff oversight.
            </p>
          </div>
        </section>

        {/* Mission and Progression Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Mission and Progression Rules for ICARUS Servers
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Shared progression</h3>
                <p className="mt-1">
                  Many ICARUS servers use shared progression where major mission completions
                  benefit everyone. Rules should require group coordination before launching
                  critical missions and ban rushing ahead alone.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Mission coordination</h3>
                <p className="mt-1">
                  Coordinate major missions through Discord. Post the mission, required gear,
                  and a proposed time. This ensures nobody misses out on important progression
                  steps.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Expedition guidelines</h3>
                <p className="mt-1">
                  Expeditions into dangerous biomes should be announced. Players who go on
                  solo expeditions into high-risk areas do so at their own risk and should
                  not expect rescue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Long-Term Community Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Long-Term ICARUS Communities
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Regular server maintenance</h3>
                <p className="mt-1">
                  Announce restart and maintenance schedules clearly. Use the restart channel
                  field to direct players to the right place for updates.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">New player onboarding</h3>
                <p className="mt-1">
                  Use the New Player Rules Summary to help new members get started quickly.
                  A warm welcome goes a long way in building a lasting community.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Document staff actions</h3>
                <p className="mt-1">
                  Use the Staff Enforcement Checklist to keep records of incidents and actions.
                  Consistent documentation helps with appeals and tracking repeat offenders.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Review rules periodically</h3>
                <p className="mt-1">
                  As your server grows, revisit your rules. What worked for 5 players may need
                  adjustment for 20. Keep your community involved in the process.
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
                  What rules should I include on my ICARUS server?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Start with the basics: no griefing, no stealing, respect bases and storage.
                  Add mission coordination and progression rules if you run a shared progression
                  server. The toggle categories in this tool cover the most common ICARUS rules.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is the best progression style for an ICARUS server?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  It depends on your community. Shared progression works well for co-op groups.
                  Admin-guided progression helps maintain balance. Free progression suits relaxed
                  or private servers where trust is already established.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How do I handle disputes over rare resources?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Use the Staff Enforcement Checklist to document the incident. Review screenshots
                  and check shared storage logs if available. Clear rules about rare resources
                  (set in the resource policy note) prevent most disputes before they start.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use this tool for other survival games?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. The rules are ICARUS-themed but work for any survival game with shared
                  bases, resources, and progression. Adjust the server name and customize from
                  there.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Is this tool free?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes, completely free. No login, no sign-up, and no hidden costs. Built by
                  QUESTPAUSE.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="icarus-server-rules-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ICARUSServerRulesGenerator;
