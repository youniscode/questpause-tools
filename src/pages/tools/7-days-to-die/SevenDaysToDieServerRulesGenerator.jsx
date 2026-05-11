import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "7 Days to Die Server Rules Generator | QUESTPAUSE Tools",
  description:
    "Generate 7 Days to Die server rules for PvE, PvP, co-op survival, horde night, base claims, loot, traders, vehicles, wipes, and long-term apocalypse communities.",
};

const SERVER_TYPES = [
  { id: "pve-coop", label: "PvE Co-op Server" },
  { id: "pvp", label: "PvP Server" },
  { id: "pve-optional-pvp", label: "PvE with Optional PvP" },
  { id: "long-term", label: "Long-Term Survival Server" },
  { id: "horde-night", label: "Horde Night Community Server" },
  { id: "private", label: "Private Friends Server" },
  { id: "whitelist", label: "Public Whitelist Server" },
  { id: "modded", label: "Modded 7DTD Server" },
];

const RULE_STYLES = [
  { id: "relaxed", label: "Relaxed" },
  { id: "balanced", label: "Balanced" },
  { id: "strict", label: "Strict" },
  { id: "community-first", label: "Community-first" },
  { id: "hardcore", label: "Hardcore survival" },
  { id: "new-player-friendly", label: "New-player friendly" },
];

const WIPE_STYLES = [
  { id: "no-wipes", label: "No scheduled wipes" },
  { id: "seasonal", label: "Seasonal wipes" },
  { id: "horde-night-focused", label: "Horde-night focused" },
  { id: "admin-controlled", label: "Admin-controlled progression" },
  { id: "community-vote", label: "Community-vote resets" },
  { id: "fresh-start", label: "Fresh-start cycles" },
];

const TOGGLE_RULES = [
  { id: "no-griefing", label: "No griefing" },
  { id: "no-cheating", label: "No cheating or exploiting" },
  { id: "no-stealing-claimed", label: "No stealing from claimed bases" },
  { id: "respect-lcb", label: "Respect land claim blocks" },
  { id: "respect-bases", label: "Respect player bases" },
  { id: "no-base-blocking", label: "No base blocking" },
  { id: "no-trader-camping", label: "No trader camping" },
  { id: "no-vehicle-stealing", label: "No vehicle stealing" },
  { id: "no-destroy-community", label: "No destroying community builds" },
  { id: "horde-night-rules", label: "Horde night rules apply" },
  { id: "pvp-zones", label: "PvP zones must be respected" },
  { id: "raiding-rules", label: "Raiding rules must be followed" },
  { id: "report-bugs", label: "Report bugs or exploits" },
  { id: "use-discord", label: "Use Discord for announcements" },
  { id: "admin-final", label: "Admin decisions are final" },
];

const STAFF_CHECKLIST = [
  "Incident reported and logged",
  "Player accounts identified",
  "Evidence/screenshots reviewed",
  "Land claim/LCB status checked",
  "Relevant rule checked",
  "Previous violations reviewed",
  "Staff action taken and logged",
  "Players informed of outcome",
];

const styleDescriptions = {
  relaxed: {
    desc: "Relaxed rules. Survive together, respect each other, and have fun.",
    stealing: "Do not take from others claimed bases.",
    griefing: "Griefing is not allowed.",
    lcb: "Respect land claim blocks.",
  },
  balanced: {
    desc: "Follow the rules, respect claims, and keep the server fair for everyone.",
    stealing: "Stealing from claimed bases is prohibited.",
    griefing: "Griefing is prohibited. Report incidents to staff.",
    lcb: "Land claim blocks define protected territory. Respect them.",
  },
  strict: {
    desc: "Strictly enforced rules. Violations result in immediate action.",
    stealing: "Theft from claimed bases is a bannable offense.",
    griefing: "Griefing is a permanent ban. Zero tolerance.",
    lcb: "LCB protection is absolute. Violations result in bans.",
  },
  "community-first": {
    desc: "We are a community. Rules keep things fair and friendly for all survivors.",
    stealing: "Respect what others have built and claimed.",
    griefing: "Griefing hurts the community and is not tolerated.",
    lcb: "Land claim blocks help us share the map fairly.",
  },
  hardcore: {
    desc: "Hardcore survival. The apocalypse is unforgiving, and so are the rules.",
    stealing: "Raiding is part of the game. Follow raiding rules strictly.",
    griefing: "Griefing beyond raiding rules is not allowed.",
    lcb: "LCBs protect your core base. Raiding is allowed within rules.",
  },
  "new-player-friendly": {
    desc: "New survivors are always welcome. Rules create a safe, helpful environment.",
    stealing: "Help new players learn. Do not raid or steal from beginners.",
    griefing: "Griefing new players is a serious violation.",
    lcb: "Teach new players how LCBs work.",
  },
};

function generateFullRules(serverName, serverType, ruleStyle, wipeStyle, toggles, discordChannel, wipeNote, pvpNote, hordeNote, baseClaimNote, extraNote) {
  const name = serverName.trim() || "our 7 Days to Die server";
  const typeLabel = SERVER_TYPES.find((t) => t.id === serverType)?.label || "Server";
  const styleData = styleDescriptions[ruleStyle] || styleDescriptions.balanced;
  const wipeLabel = WIPE_STYLES.find((w) => w.id === wipeStyle)?.label || "No scheduled wipes";

  const parts = [];

  parts.push(`# ${name} — 7 Days to Die Server Rules`);
  parts.push(`Server type: ${typeLabel}`);
  parts.push(`Rule style: ${styleData.desc}`);
  parts.push(`Wipe/progression style: ${wipeLabel}`);
  parts.push("");

  parts.push("## 1. Base & Land Claim Rules");
  parts.push("");
  if (toggles["respect-lcb"]) {
    parts.push(`- ${styleData.lcb}`);
    parts.push("");
  }
  if (toggles["respect-bases"]) {
    parts.push("- Respect all player bases and outposts. Do not enter claimed territory without permission.");
    parts.push("");
  }
  if (toggles["no-base-blocking"]) {
    parts.push("- Do not block other players bases with your own structures.");
    parts.push("");
  }
  if (toggles["no-stealing-claimed"]) {
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
  if (baseClaimNote.trim()) {
    parts.push(`- Base claim note: ${baseClaimNote.trim()}`);
    parts.push("");
  }

  parts.push("## 2. PvP & Raiding Rules");
  parts.push("");
  if (toggles["pvp-zones"]) {
    parts.push("- PvP zones must be respected. Non-consensual PvP outside designated zones is not allowed.");
    parts.push("");
  }
  if (toggles["raiding-rules"]) {
    parts.push("- Raiding is only permitted within defined raiding rules. Check the raiding policy before engaging.");
    parts.push("");
  }
  if (pvpNote.trim()) {
    parts.push(`- PvP zone note: ${pvpNote.trim()}`);
    parts.push("");
  }

  parts.push("## 3. Horde Night Rules");
  parts.push("");
  if (toggles["horde-night-rules"]) {
    parts.push("- Horde night rules apply to all players. Be prepared and do not attract hordes to other players bases.");
    parts.push("");
  }
  if (hordeNote.trim()) {
    parts.push(`- Horde night note: ${hordeNote.trim()}`);
    parts.push("");
  }

  parts.push("## 4. Vehicles & Traders");
  parts.push("");
  if (toggles["no-vehicle-stealing"]) {
    parts.push("- Do not steal or destroy other players vehicles.");
    parts.push("");
  }
  if (toggles["no-trader-camping"]) {
    parts.push("- Do not camp traders or block access to trader compounds.");
    parts.push("");
  }

  parts.push("## 5. Community Standards");
  parts.push("");
  if (toggles["no-cheating"]) {
    parts.push("- No cheating, exploiting bugs, or using unauthorized mods.");
    parts.push("");
  }
  if (toggles["report-bugs"]) {
    parts.push("- Report bugs, exploits, or suspicious activity to staff.");
    parts.push("");
  }
  if (toggles["use-discord"]) {
    parts.push("- Use Discord for announcements, coordination, and reporting.");
    parts.push("");
  }
  if (toggles["admin-final"]) {
    parts.push("- Admin decisions regarding rule enforcement are final.");
    parts.push("");
  }

  if (wipeNote.trim()) {
    parts.push(`- Wipe schedule: ${wipeNote.trim()}`);
    parts.push("");
  }
  if (discordChannel.trim()) {
    parts.push(`- Discord: #${discordChannel.trim()}`);
    parts.push("");
  }
  if (extraNote.trim()) {
    parts.push(`- ${extraNote.trim()}`);
    parts.push("");
  }

  return parts.join("\n").trim();
}

function generateShortVersion(serverName, ruleStyle, wipeStyle, toggles) {
  const name = serverName.trim() || "our 7 Days to Die server";
  const styleData = styleDescriptions[ruleStyle] || styleDescriptions.balanced;
  const wipeLabel = WIPE_STYLES.find((w) => w.id === wipeStyle)?.label || "No scheduled wipes";

  const lines = [];
  lines.push(`${name} — 7 Days to Die Server Rules`);
  lines.push("");
  lines.push(`Style: ${styleData.desc}`);
  lines.push(`Wipes: ${wipeLabel}`);
  lines.push("");
  if (toggles["no-griefing"]) lines.push("- No griefing");
  if (toggles["no-stealing-claimed"]) lines.push("- No stealing from claimed bases");
  if (toggles["respect-lcb"]) lines.push("- Respect land claim blocks");
  if (toggles["respect-bases"]) lines.push("- Respect player bases");
  if (toggles["pvp-zones"]) lines.push("- Respect PvP zones");
  if (toggles["horde-night-rules"]) lines.push("- Horde night rules apply");

  return lines.join("\n");
}

function generateNewPlayerSummary(serverName, ruleStyle, toggles) {
  const name = serverName.trim() || "our 7 Days to Die server";
  const styleData = styleDescriptions[ruleStyle] || styleDescriptions.balanced;

  const lines = [
    `Welcome to ${name}!`,
    "",
    `Rule style: ${styleData.desc}`,
    "",
    "What to know as a new survivor:",
    "",
  ];
  if (toggles["respect-lcb"]) lines.push("- Use your land claim block to protect your base.");
  if (toggles["respect-bases"]) lines.push("- Find a spot and build. Respect others claims.");
  if (toggles["no-griefing"]) lines.push("- Respect other players and their builds.");
  if (toggles["horde-night-rules"]) lines.push("- Prepare for horde night. Find shelter before dark.");
  if (toggles["pvp-zones"]) lines.push("- Check which zones are PvP before engaging.");
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

function SevenDaysToDieServerRulesGenerator() {
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState("pve-coop");
  const [ruleStyle, setRuleStyle] = useState("balanced");
  const [wipeStyle, setWipeStyle] = useState("no-wipes");
  const [toggles, setToggles] = useState(() => Object.fromEntries(TOGGLE_RULES.map((t) => [t.id, false])));
  const [discordChannel, setDiscordChannel] = useState("");
  const [wipeNote, setWipeNote] = useState("");
  const [pvpNote, setPvpNote] = useState("");
  const [hordeNote, setHordeNote] = useState("");
  const [baseClaimNote, setBaseClaimNote] = useState("");
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
    const full = generateFullRules(serverName, serverType, ruleStyle, wipeStyle, toggles, discordChannel, wipeNote, pvpNote, hordeNote, baseClaimNote, extraNote);
    const short = generateShortVersion(serverName, ruleStyle, wipeStyle, toggles);
    const newPlayer = generateNewPlayerSummary(serverName, ruleStyle, toggles);
    const checklist = generateStaffChecklist();
    setOutput({ full, short, newPlayer, checklist });
    setCopied("");
  }, [serverName, serverType, ruleStyle, wipeStyle, toggles, discordChannel, wipeNote, pvpNote, hordeNote, baseClaimNote, extraNote]);

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
    setServerType("pve-coop");
    setRuleStyle("balanced");
    setWipeStyle("no-wipes");
    setToggles(Object.fromEntries(TOGGLE_RULES.map((t) => [t.id, false])));
    setDiscordChannel("");
    setWipeNote("");
    setPvpNote("");
    setHordeNote("");
    setBaseClaimNote("");
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
              7 Days to Die
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              7 Days to Die Server Rules Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear server rules for 7 Days to Die PvE, PvP, co-op survival, horde night,
              base claims, loot, traders, vehicles, wipes, and long-term apocalypse communities.
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
                  placeholder="Enter your 7 Days to Die server name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-slate-500">If empty, "our 7 Days to Die server" will be used.</p>
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

              {/* Wipe Style */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Wipe / Progression Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {WIPE_STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        wipeStyle === s.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setWipeStyle(s.id)}
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
                  placeholder="Wipe schedule note (optional)"
                  value={wipeNote}
                  onChange={(e) => setWipeNote(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="PvP zone note (optional)"
                  value={pvpNote}
                  onChange={(e) => setPvpNote(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Horde night note (optional)"
                  value={hordeNote}
                  onChange={(e) => setHordeNote(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Base claim note (optional)"
                  value={baseClaimNote}
                  onChange={(e) => setBaseClaimNote(e.target.value)}
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
                      A. Full 7 Days to Die Server Rules Post
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
              How to Use This 7 Days to Die Server Rules Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name (or leave blank to use &ldquo;our 7 Days to Die server&rdquo;).</li>
              <li>Select your server type &mdash; PvE, PvP, co-op, horde night, and more.</li>
              <li>Choose a rule style that matches your enforcement level.</li>
              <li>Pick a wipe/progression style for how the world resets.</li>
              <li>Toggle the rule categories you want included in your rules.</li>
              <li>Fill in optional fields like Discord channels and custom notes.</li>
              <li>Click <strong className="text-slate-100">Generate Rules</strong> to preview all outputs.</li>
              <li>Use the copy buttons to grab the full rules, short version, new player summary, or staff checklist.</li>
            </ol>
          </div>
        </section>

        {/* Common 7DTD Server Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common 7 Days to Die Server Rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              7 Days to Die servers need clear rules about base protection, PvP, raiding, and horde
              nights. The land claim block system is central to most servers &mdash; rules should
              clearly state how LCBs work, what happens when someone ignores them, and how disputes
              over claimed territory are resolved.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Most servers include rules against griefing, stealing from claimed bases, camping
              traders, and destroying community builds. Servers with PvP need additional rules about
              designated PvP zones and raiding etiquette.
            </p>
          </div>
        </section>

        {/* PvE and PvP Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              PvE and PvP Rules for 7DTD Servers
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              PvE servers focus on cooperative survival against the zombie horde. Rules typically
              prohibit player-versus-player combat entirely or restrict it to designated arenas.
              PvP servers allow combat but need clear rules about raiding, griefing, and territory
              control to prevent toxic behavior.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Hybrid servers with optional PvP should define exactly where and when PvP is allowed.
              Common approaches include PvP-enabled zones on the map or PvP hours during certain
              times of day.
            </p>
          </div>
        </section>

        {/* Horde Night and Base Claims */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Horde Night and Base Claim Rules
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Horde night participation</h3>
                <p className="mt-1">
                  Decide whether all players must participate in horde night or if they can opt out.
                  Some servers require players to be online and fighting, while others let players
                  hide in bases. Define consequences for players who attract hordes to others bases.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Land claim blocks</h3>
                <p className="mt-1">
                  LCBs are the foundation of base protection. Set clear rules about LCB range,
                  whether multiple claims are allowed, and what happens when a claim expires.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Base blocking</h3>
                <p className="mt-1">
                  Prohibit building structures that block access to other players bases, POIs, or
                  trader compounds. This is one of the most common disputes on 7DTD servers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Wipe and Progression */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Wipe and Progression Rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Wipe schedules define how often the world resets. Some servers never wipe, while
              others wipe seasonally or on a set schedule. Horde-night focused servers may wipe
              after each horde night cycle. Community-vote resets give players a say in when the
              world refreshes.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Whatever schedule you choose, communicate it clearly. Players need to know when their
              bases will be wiped so they can plan accordingly.
            </p>
          </div>
        </section>

        {/* Long-Term Community Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Long-Term 7 Days to Die Communities
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Use Discord for communication</h3>
                <p className="mt-1">
                  Set up dedicated channels for rule discussions, dispute reports, and wipe
                  announcements. Good communication prevents most conflicts.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Document staff actions</h3>
                <p className="mt-1">
                  Use the Staff Enforcement Checklist to keep records. Consistent documentation
                  helps with appeals and tracking repeat offenders.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Review rules periodically</h3>
                <p className="mt-1">
                  As your community grows, revisit your rules. What worked for a small group may
                  need adjustment for a larger, more diverse player base.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Welcome new players</h3>
                <p className="mt-1">
                  Use the New Player Summary to help newcomers understand your server culture.
                  A good first impression keeps players coming back.
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
                  What rules should I include on my 7 Days to Die server?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Start with land claim block rules, griefing policy, and base protection. Add PvP
                  and raiding rules if your server supports those features. Horde night rules are
                  essential for community servers.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How do land claim blocks work with server rules?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  LCBs define protected territory. Your rules should state whether LCB protection
                  is absolute, whether raiding can bypass LCBs on PvP servers, and how long claims
                  last before expiring.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is the best wipe schedule for a new server?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Start with seasonal wipes (every 3-4 months) or no scheduled wipes if you want
                  long-term progression. Horde-night focused servers may wipe weekly or biweekly.
                  Ask your community what they prefer.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use this tool for modded 7DTD servers?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Select "Modded 7DTD Server" as the server type. Add any mod-specific rules
                  in the extra note or adjust the generated output as needed.
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

        <RelatedTools currentToolId="7-days-to-die-server-rules-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default SevenDaysToDieServerRulesGenerator;
