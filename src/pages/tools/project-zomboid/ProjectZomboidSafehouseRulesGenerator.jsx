import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Project Zomboid Safehouse Rules Generator | QUESTPAUSE Tools",
  description:
    "Generate Project Zomboid safehouse rules, base claim rules, faction rules, abandoned base policies, staff checklists, and dispute templates for multiplayer servers.",
};

const SERVER_TYPES = [
  { id: "pve", label: "PvE Community Server" },
  { id: "pvp", label: "PvP / Faction Server" },
  { id: "roleplay", label: "Roleplay Server" },
  { id: "longterm", label: "Long-Term Survival Server" },
  { id: "private", label: "Private Friends Server" },
  { id: "whitelist", label: "Public Whitelist Server" },
  { id: "hardcore", label: "Hardcore Survival Server" },
];

const SAFEHOUSE_STYLES = [
  { id: "relaxed", label: "Relaxed" },
  { id: "balanced", label: "Balanced" },
  { id: "strict", label: "Strict" },
  { id: "roleplay", label: "Roleplay-friendly" },
  { id: "faction", label: "Faction-focused" },
  { id: "community", label: "Community-first" },
];

const CLAIM_POLICIES = [
  { id: "first-come", label: "First come, first served" },
  { id: "staff-approval", label: "Staff approval required" },
  { id: "safehouse-only", label: "Claim with safehouse only" },
  { id: "faction-claim", label: "Faction claim required" },
  { id: "public-hubs", label: "Public hubs protected by staff" },
  { id: "no-permanent", label: "No permanent claims" },
];

const TOGGLE_RULES = [
  { id: "respect-safehouses", label: "Respect safehouses" },
  { id: "no-trespassing", label: "No trespassing" },
  { id: "no-stealing", label: "No stealing from bases" },
  { id: "no-destroy", label: "No destroying player builds" },
  { id: "no-burning", label: "No burning safehouses" },
  { id: "no-blocking", label: "No blocking roads or public areas" },
  { id: "no-public-claim", label: "No claiming public buildings" },
  { id: "no-spawn-claim", label: "No claiming spawn areas" },
  { id: "respect-factions", label: "Respect faction bases" },
  { id: "ask-storage", label: "Ask before using shared storage" },
  { id: "abandoned-clear", label: "Abandoned bases may be cleared" },
  { id: "staff-inactive", label: "Staff may remove inactive claims" },
  { id: "pvp-declared", label: "PvP requires declared conflict" },
  { id: "report-griefing", label: "Report griefing to staff" },
  { id: "screenshots", label: "Screenshots required for disputes" },
  { id: "admin-final", label: "Admin decisions are final" },
];

const STAFF_CHECKLIST = [
  "Safehouse owner identified",
  "Claim is active",
  "Evidence/screenshots reviewed",
  "Trespass/stealing rule checked",
  "Faction/PvP status checked",
  "Staff action logged",
  "Player informed",
];

const DISPUTE_TEMPLATE_FIELDS = [
  "Your username",
  "Safehouse/base location",
  "What happened",
  "Approximate time/date",
  "Screenshots or evidence",
  "Players involved",
  "What help you need",
];

const styleDescriptions = {
  relaxed: {
    desc: "We keep things relaxed. Build where you like and respect others.",
    trespass: "Respect boundaries, but accidental wandering is not a big deal.",
    destroy: "Do not destroy other players builds.",
    steal: "Do not take from other players bases.",
    fire: "No arson. Burn your own stuff, not others.",
    claim: "First come, first served. If you build it, it is yours.",
    inactive: "Claims go inactive after [inactivityPeriod]. They may be cleared.",
    pvp: "PvP is allowed only with mutual consent.",
    faction: "Faction bases are respected by all players.",
    staff: "Staff help resolve disputes fairly.",
  },
  balanced: {
    desc: "Follow the safehouse rules and respect all claims. Keep the server fair for everyone.",
    trespass: "Do not enter claimed safehouses without permission.",
    destroy: "Destroying other players builds is not allowed.",
    steal: "Stealing from bases or storage is prohibited.",
    fire: "Burning down safehouses is strictly forbidden.",
    claim: "Claims are first come, first served. Staff may resolve conflicts.",
    inactive: "Inactive claims may be cleared after [inactivityPeriod].",
    pvp: "PvP is allowed in designated zones or with mutual consent.",
    faction: "Faction territories must be respected by all players.",
    staff: "Staff enforce rules and mediate disputes.",
  },
  strict: {
    desc: "Safehouse rules are strictly enforced. Violations result in immediate consequences.",
    trespass: "Trespassing on claimed property is a bannable offense.",
    destroy: "Griefing or destroying builds results in an immediate ban.",
    steal: "Theft from bases is zero tolerance. Permanent ban.",
    fire: "Arson is strictly prohibited. Ban on first offense.",
    claim: "All claims must be registered with staff. Unregistered claims are not protected.",
    inactive: "Abandoned claims are cleared after [inactivityPeriod]. No exceptions.",
    pvp: "PvP is only allowed in designated arenas. No exceptions.",
    faction: "Faction territories are strictly enforced by staff.",
    staff: "Staff decisions are final. No appeals.",
  },
  roleplay: {
    desc: "All safehouse and base activity must stay in character. Respect RP boundaries.",
    trespass: "IC trespassing requires RP justification. OOC trespass is not allowed.",
    destroy: "IC destruction requires admin-approved RP events.",
    steal: "IC theft must be RP-driven and staff-approved.",
    fire: "Arson requires staff-supervised RP event approval.",
    claim: "Claims are IC. Faction territories are established through RP.",
    inactive: "IC inactivity may lead to claim forfeiture after [inactivityPeriod].",
    pvp: "PvP must be RP-driven with clear IC motivation.",
    faction: "Faction RP is respected. Inter-faction conflict must be RP-approved.",
    staff: "Staff oversee RP events and resolve OOC disputes.",
  },
  faction: {
    desc: "Faction claims and territories are the foundation of this server.",
    trespass: "Trespassing into faction territory may be met with PvP.",
    destroy: "Faction base destruction is only permitted during declared war.",
    steal: "Stealing from faction bases is grounds for faction-wide conflict.",
    fire: "Arson against faction bases is an act of war.",
    claim: "Factions must claim territory. Individual claims must be faction-approved.",
    inactive: "Inactive faction claims are cleared after [inactivityPeriod].",
    pvp: "PvP is allowed between factions. Internal faction PvP is regulated.",
    faction: "Faction leaders are responsible for their members actions.",
    staff: "Staff mediate inter-faction disputes and enforce war rules.",
  },
  community: {
    desc: "We are a community first. Safehouse rules exist to keep things fair and friendly.",
    trespass: "Respect others space. Ask before entering claimed areas.",
    destroy: "Help each other build, dont tear down.",
    steal: "Community storage is shared. Personal storage is off-limits.",
    fire: "Fire safety is everyone's responsibility. No burning.",
    claim: "Claims are respected. Work with staff if you need space.",
    inactive: "Inactive claims may be freed up after [inactivityPeriod] to help new players.",
    pvp: "PvP is not the focus here. Keep it friendly.",
    faction: "Factions are welcome but must not disrupt the community.",
    staff: "Staff are here to help, not just enforce. Talk to us.",
  },
};

function generateFullRules(serverName, serverType, style, claimPolicy, toggles, inactivityPeriod, claimChannel, staffChannel, hubNote, extraNote) {
  const name = serverName.trim() || "our Project Zomboid server";
  const styleData = styleDescriptions[style] || styleDescriptions.balanced;
  const typeLabel = SERVER_TYPES.find((t) => t.id === serverType)?.label || "Server";
  const claimLabel = CLAIM_POLICIES.find((p) => p.id === claimPolicy)?.label || "First come, first served";

  const parts = [];

  parts.push(`# ${name} — Safehouse & Base Rules`);
  parts.push(`Server type: ${typeLabel}`);
  parts.push(`Safehouse style: ${styleData.desc}`);
  parts.push(`Base claim policy: ${claimLabel}`);
  parts.push("");

  parts.push("## 1. Safehouse Rules");
  parts.push("");
  if (toggles["respect-safehouses"]) {
    parts.push("- Respect all claimed safehouses. Do not enter without permission.");
    parts.push("");
  }
  if (toggles["no-trespassing"]) {
    parts.push(`- ${styleData.trespass}`);
    parts.push("");
  }
  if (toggles["no-stealing"]) {
    parts.push(`- ${styleData.steal}`);
    parts.push("");
  }
  if (toggles["no-destroy"]) {
    parts.push(`- ${styleData.destroy}`);
    parts.push("");
  }
  if (toggles["no-burning"]) {
    parts.push(`- ${styleData.fire}`);
    parts.push("");
  }
  if (toggles["no-blocking"]) {
    parts.push("- Do not block roads, paths, or public access points with your builds.");
    parts.push("");
  }
  if (toggles["no-public-claim"]) {
    parts.push("- Do not claim public buildings (schools, police stations, hospitals, warehouses) as personal safehouses.");
    parts.push("");
  }
  if (toggles["no-spawn-claim"]) {
    parts.push("- Do not claim buildings or areas near spawn points.");
    parts.push("");
  }

  parts.push("## 2. Base Claims");
  parts.push("");
  parts.push(`Policy: ${claimLabel}`);
  parts.push("");
  if (inactivityPeriod.trim()) {
    parts.push(`- Inactivity cleanup: Claims may be cleared after ${inactivityPeriod.trim()} of inactivity.`);
    parts.push("");
  }
  if (toggles["abandoned-clear"]) {
    parts.push("- Abandoned bases may be cleared to free up space for active players.");
    parts.push("");
  }
  if (toggles["staff-inactive"]) {
    parts.push("- Staff may remove inactive claims at their discretion.");
    parts.push("");
  }

  parts.push("## 3. Faction & PvP Rules");
  parts.push("");
  if (toggles["respect-factions"]) {
    parts.push(`- ${styleData.faction}`);
    parts.push("");
  }
  if (toggles["ask-storage"]) {
    parts.push("- Ask before using shared or faction storage.");
    parts.push("");
  }
  if (toggles["pvp-declared"]) {
    parts.push(`- ${styleData.pvp}`);
    parts.push("");
  }

  parts.push("## 4. Enforcement & Disputes");
  parts.push("");
  if (toggles["report-griefing"]) {
    parts.push("- Report griefing, theft, or base violations to staff immediately.");
    parts.push("");
  }
  if (toggles["screenshots"]) {
    parts.push("- Screenshots or video evidence are required for all disputes.");
    parts.push("");
  }
  if (toggles["admin-final"]) {
    parts.push("- Admin decisions regarding safehouse and base disputes are final.");
    parts.push("");
  }

  if (claimChannel.trim()) {
    parts.push(`- Safehouse claims channel: #${claimChannel.trim()}`);
    parts.push("");
  }
  if (staffChannel.trim()) {
    parts.push(`- Staff contact channel: #${staffChannel.trim()}`);
    parts.push("");
  }
  if (hubNote.trim()) {
    parts.push(`- Public hub note: ${hubNote.trim()}`);
    parts.push("");
  }
  if (extraNote.trim()) {
    parts.push(`- ${extraNote.trim()}`);
    parts.push("");
  }

  return parts.join("\n").trim();
}

function generateShortVersion(serverName, style, claimPolicy, toggles, inactivityPeriod) {
  const name = serverName.trim() || "our Project Zomboid server";
  const styleData = styleDescriptions[style] || styleDescriptions.balanced;

  const lines = [];
  lines.push(`${name} — Safehouse Rules`);
  lines.push("");
  lines.push(`Style: ${styleData.desc}`);
  lines.push(`Claims: ${CLAIM_POLICIES.find((p) => p.id === claimPolicy)?.label}`);
  if (inactivityPeriod.trim()) lines.push(`Inactivity: ${inactivityPeriod.trim()}`);
  lines.push("");
  if (toggles["respect-safehouses"]) lines.push("- Respect safehouses");
  if (toggles["no-trespassing"]) lines.push("- No trespassing");
  if (toggles["no-stealing"]) lines.push("- No stealing");
  if (toggles["no-destroy"]) lines.push("- No destroying builds");
  if (toggles["no-burning"]) lines.push("- No burning");
  if (toggles["report-griefing"]) lines.push("- Report griefing to staff");

  return lines.join("\n");
}

function generateStaffChecklist() {
  const lines = ["Staff Enforcement Checklist", ""];
  STAFF_CHECKLIST.forEach((item) => {
    lines.push(`[ ] ${item}`);
  });
  return lines.join("\n");
}

function generateDisputeTemplate() {
  const lines = ["Player Dispute Report", ""];
  DISPUTE_TEMPLATE_FIELDS.forEach((field) => {
    lines.push(`${field}:`);
    lines.push("");
  });
  return lines.join("\n");
}

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";

function ProjectZomboidSafehouseRulesGenerator() {
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState("pve");
  const [style, setStyle] = useState("balanced");
  const [claimPolicy, setClaimPolicy] = useState("first-come");
  const [toggles, setToggles] = useState(() => Object.fromEntries(TOGGLE_RULES.map((t) => [t.id, false])));
  const [inactivityPeriod, setInactivityPeriod] = useState("");
  const [claimChannel, setClaimChannel] = useState("");
  const [staffChannel, setStaffChannel] = useState("");
  const [hubNote, setHubNote] = useState("");
  const [extraNote, setExtraNote] = useState("");

  const [output, setOutput] = useState({ full: "", short: "", checklist: "", dispute: "" });
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
    const full = generateFullRules(serverName, serverType, style, claimPolicy, toggles, inactivityPeriod, claimChannel, staffChannel, hubNote, extraNote);
    const short = generateShortVersion(serverName, style, claimPolicy, toggles, inactivityPeriod);
    const checklist = generateStaffChecklist();
    const dispute = generateDisputeTemplate();
    setOutput({ full, short, checklist, dispute });
    setCopied("");
  }, [serverName, serverType, style, claimPolicy, toggles, inactivityPeriod, claimChannel, staffChannel, hubNote, extraNote]);

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
    setServerType("pve");
    setStyle("balanced");
    setClaimPolicy("first-come");
    setToggles(Object.fromEntries(TOGGLE_RULES.map((t) => [t.id, false])));
    setInactivityPeriod("");
    setClaimChannel("");
    setStaffChannel("");
    setHubNote("");
    setExtraNote("");
    setOutput({ full: "", short: "", checklist: "", dispute: "" });
    setCopied("");
  }, []);

  const allText = [output.full, "", "--- SHORT VERSION ---", "", output.short, "", "--- STAFF CHECKLIST ---", "", output.checklist, "", "--- DISPUTE TEMPLATE ---", "", output.dispute].join("\n");

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        {/* Hero */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Project Zomboid
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Project Zomboid Safehouse Rules Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear safehouse rules, base claim policies, faction rules, abandoned base cleanup rules,
              staff checklists, and player dispute templates for your Project Zomboid server.
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
                  placeholder="Enter your Project Zomboid server name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-slate-500">If empty, "our Project Zomboid server" will be used.</p>
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

              {/* Safehouse Style */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Safehouse Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {SAFEHOUSE_STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        style === s.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setStyle(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Base Claim Policy */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Base Claim Policy
                </label>
                <div className="flex flex-wrap gap-2">
                  {CLAIM_POLICIES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        claimPolicy === p.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setClaimPolicy(p.id)}
                    >
                      {p.label}
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
                  placeholder="Inactivity cleanup period (e.g. 14 days)"
                  value={inactivityPeriod}
                  onChange={(e) => setInactivityPeriod(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Safehouse claim channel name (e.g. claims)"
                  value={claimChannel}
                  onChange={(e) => setClaimChannel(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Staff contact channel name (e.g. staff-tickets)"
                  value={staffChannel}
                  onChange={(e) => setStaffChannel(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Public hub rule note (optional)"
                  value={hubNote}
                  onChange={(e) => setHubNote(e.target.value)}
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
                      onClick={() => handleCopy(output.dispute, "dispute")}
                      disabled={copied === "dispute"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "dispute"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "dispute" ? "Copied!" : "Copy Dispute Template"}
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
                      A. Full Safehouse/Base Rules Post
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
                      C. Staff Enforcement Checklist
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.checklist}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      D. Player Dispute Report Template
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.dispute}
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
              How to Use This Project Zomboid Safehouse Rules Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name (or leave blank to use &ldquo;our Project Zomboid server&rdquo;).</li>
              <li>Select your server type &mdash; PvE, PvP, Roleplay, Long-Term, Private, Whitelist, or Hardcore.</li>
              <li>Choose a safehouse style that matches your server&rsquo;s enforcement level.</li>
              <li>Pick a base claim policy that fits how players claim territory.</li>
              <li>Toggle the rule categories you want included in your rules.</li>
              <li>Fill in optional fields like inactivity period and channel names.</li>
              <li>Click <strong className="text-slate-100">Generate Rules</strong> to preview all outputs.</li>
              <li>Use the copy buttons to grab the full rules, short version, staff checklist, or dispute template.</li>
            </ol>
          </div>
        </section>

        {/* Common Safehouse Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Project Zomboid Safehouse Rules
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Safehouse rules are essential for any multiplayer Project Zomboid server. They define how
              players can claim bases, what happens when someone trespasses or steals, and how disputes
              are resolved. Without clear safehouse rules, conflicts between players can escalate quickly
              and ruin the community experience.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Most servers include rules about respecting claimed safehouses, not destroying other
              players&rsquo; builds, no stealing from bases, and reporting griefing. Servers with factions
              or PvP often need additional rules about faction territories and declared conflict.
            </p>
          </div>
        </section>

        {/* Base Claim Rules */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Base Claim Rules for Multiplayer Servers
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Base claim rules determine how players secure their builds and belongings. The most
              common policy is &ldquo;first come, first served&rdquo; &mdash; if you build it and claim
              it with the safehouse system, it is yours. Some servers require staff approval for claims
              to prevent land-grabbing or blocking important areas.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Long-term servers often have inactivity cleanup policies that free up claims from players
              who have not logged in for a set period. This keeps the map healthy and gives new players
              room to build.
            </p>
          </div>
        </section>

        {/* Faction, PvP, Trespass */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Faction, PvP, and Trespass Rules
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Faction territories</h3>
                <p className="mt-1">
                  Faction-based servers need clear rules about territory claims and inter-faction
                  conflict. Establish how factions claim territory, whether PvP is allowed between
                  factions, and how war is declared.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">PvP and combat</h3>
                <p className="mt-1">
                  Define where and when PvP is allowed. Some servers restrict PvP to designated zones
                  or require mutual consent. Faction servers may allow open PvP between factions but
                  restrict internal faction fighting.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Trespassing</h3>
                <p className="mt-1">
                  Clearly define what counts as trespassing and the consequences. Some servers treat
                  accidental wandering leniently, while strict servers consider any unauthorized entry
                  a bannable offense.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Abandoned Bases */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Abandoned Base Cleanup Policies
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Abandoned bases are a common problem on Project Zomboid servers. Players build large
              bases, stop playing, and leave their claims blocking valuable space. An inactivity
              cleanup policy helps keep the map healthy. Set a clear inactivity period (e.g. 14 or
              30 days) and communicate it in your rules.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Staff should screenshot evidence of inactivity before clearing a claim and give players
              a warning if possible. Some servers maintain a &ldquo;marked for cleanup&rdquo; channel
              where upcoming removals are announced.
            </p>
          </div>
        </section>

        {/* Moderation Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Fair Safehouse Moderation
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Document everything</h3>
                <p className="mt-1">
                  Keep records of safehouse claims, dispute reports, and staff actions. Use the staff
                  checklist and dispute template from this tool to stay consistent.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Be consistent</h3>
                <p className="mt-1">
                  Apply the same rules to all players. Inconsistent enforcement erodes trust and leads
                  to more disputes. When in doubt, refer to your written rules.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Communicate clearly</h3>
                <p className="mt-1">
                  When resolving a dispute, explain your decision to both parties. Use the dispute
                  template to ensure you have all the information you need before making a call.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Review claims regularly</h3>
                <p className="mt-1">
                  Periodically review active claims to catch abandoned bases and resolve conflicts
                  before they escalate. A healthy map makes for a happy community.
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
                  What safehouse rules should I include on my server?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  At minimum, include rules about respecting claimed safehouses, no trespassing, no
                  stealing, no griefing, and how to report violations. Add faction and PvP rules if
                  your server supports those features.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How do I handle base claim disputes?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Use the dispute report template to collect evidence from both parties. Review
                  screenshots, check claim activity, and refer to your safehouse rules. Staff
                  decisions should be final to avoid endless appeals.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is a good inactivity period for clearing bases?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  14 to 30 days is common. Shorter periods work for active servers with high player
                  turnover. Longer periods suit long-term communities where players take breaks.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Should I allow PvP near safehouses?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Most servers prohibit PvP inside or near claimed safehouses. If you allow it,
                  set clear boundaries and consequences. Faction servers may make exceptions during
                  declared conflicts.
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

        <RelatedTools currentToolId="project-zomboid-safehouse-rules-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ProjectZomboidSafehouseRulesGenerator;
