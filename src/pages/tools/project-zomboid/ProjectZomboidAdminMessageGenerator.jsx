import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Project Zomboid Admin Message Generator | QUESTPAUSE Tools",
  description:
    "Generate Project Zomboid admin messages for restarts, maintenance, mod updates, whitelist notices, rule reminders, wipes, safehouses, PvP, and community announcements.",
};

const MESSAGE_TYPES = [
  { id: "restart-warning", label: "Restart Warning" },
  { id: "maintenance-notice", label: "Maintenance Notice" },
  { id: "mod-update", label: "Mod Update" },
  { id: "rule-reminder", label: "Rule Reminder" },
  { id: "player-warning", label: "Player Warning" },
  { id: "whitelist-notice", label: "Whitelist Notice" },
  { id: "server-wipe", label: "Server Wipe Notice" },
  { id: "loot-respawn", label: "Loot Respawn Notice" },
  { id: "safehouse-reminder", label: "Safehouse Reminder" },
  { id: "pvp-faction", label: "PvP / Faction Reminder" },
  { id: "community-announcement", label: "Community Announcement" },
  { id: "apology", label: "Apology / Incident Follow-up" },
];

const TONES = [
  { id: "friendly", label: "Friendly" },
  { id: "professional", label: "Professional" },
  { id: "direct", label: "Short and direct" },
  { id: "firm", label: "Firm but fair" },
  { id: "community-first", label: "Community-first" },
  { id: "urgent", label: "Urgent" },
];

const PLATFORMS = [
  { id: "discord", label: "Discord Announcement" },
  { id: "in-game", label: "In-game Message" },
  { id: "short", label: "Short Admin Notice" },
  { id: "full", label: "Full Community Post" },
];

const TOGGLE_OPTIONS = [
  { id: "emojis", label: "Add emojis" },
  { id: "role-mention", label: "Add role mention placeholder" },
  { id: "thank-you", label: "Add thank-you message" },
  { id: "avoid-risky", label: 'Add "avoid risky activity" warning' },
  { id: "backup-data", label: 'Add "backup your character/world data" reminder' },
  { id: "dm-staff", label: 'Add "DM staff if affected" line' },
  { id: "short-version", label: "Add short version" },
];

const SUBJECT_LINES = {
  "restart-warning": "Server Restart Warning",
  "maintenance-notice": "Scheduled Maintenance",
  "mod-update": "Mod Update Notice",
  "rule-reminder": "Server Rules Reminder",
  "player-warning": "Player Warning Notice",
  "whitelist-notice": "Whitelist Update",
  "server-wipe": "Server Wipe Notice",
  "loot-respawn": "Loot Respawn Update",
  "safehouse-reminder": "Safehouse Rules Reminder",
  "pvp-faction": "PvP & Faction Reminder",
  "community-announcement": "Community Announcement",
  "apology": "Incident Follow-up",
};

const TONE_OPENINGS = {
  friendly: "Hey everyone,",
  professional: "Attention players,",
  direct: "Notice:",
  firm: "Attention.",
  "community-first": "To our community,",
  urgent: "URGENT:",
};

const TONE_CLOSINGS = {
  friendly: "Thanks for understanding, and stay safe out there!",
  professional: "Thank you for your attention and cooperation.",
  direct: "Thanks.",
  firm: "Thank you for respecting the server rules and community guidelines.",
  "community-first": "Thanks for being part of our community. We appreciate you.",
  urgent: "Thank you for your immediate attention.",
};

const TONE_DESCRIPTIONS = {
  "restart-warning": {
    friendly: "The server will be restarting soon. Please wrap up what you are doing and find a safe spot.",
    professional: "The server will undergo a scheduled restart shortly. Please log out to avoid any interruption.",
    direct: "Server restarting soon. Log out now.",
    firm: "The server will restart shortly. All players must log out before the restart. No exceptions.",
    "community-first": "Heads up, everyone. We have a restart coming up to keep things running smoothly for the whole community.",
    urgent: "EMERGENCY RESTART IN 5 MINUTES. Log out immediately.",
  },
  "maintenance-notice": {
    friendly: "The server will be down for maintenance. We are applying updates and improvements. See you on the other side!",
    professional: "Scheduled maintenance will begin shortly. During this time the server will be unavailable. We apologize for any inconvenience.",
    direct: "Server down for maintenance. Will be back soon.",
    firm: "The server is going down for mandatory maintenance. Connection will be restored once updates are complete.",
    "community-first": "Quick heads up — we are taking the server offline briefly for maintenance. This keeps things healthy for everyone.",
    urgent: "SERVER MAINTENANCE IN PROGRESS. Expected downtime: [duration].",
  },
  "mod-update": {
    friendly: "We have updated some mods on the server. Check the mod list for changes and make sure your client is up to date!",
    professional: "Mod updates have been applied to the server. Please ensure your client mod list matches the server configuration.",
    direct: "Mods updated. Sync your client mod list before joining.",
    firm: "Mod updates have been applied. If you use any additional mods not on the whitelist, you may not be able to connect.",
    "community-first": "We have refreshed some mods to improve everyone's experience. Check the mod list to keep your client in sync!",
    urgent: "MOD UPDATE DEPLOYED. Client changes required to connect.",
  },
  "rule-reminder": {
    friendly: "Just a friendly reminder about our server rules. We keep things chill here — be good to each other!",
    professional: "This is a courteous reminder of the server rules. All players are expected to follow the community guidelines.",
    direct: "Rule reminder: follow the server rules or face consequences.",
    firm: "ATTENTION. Server rules are in place for a reason. Violations will result in warnings, kicks, or bans depending on severity.",
    "community-first": "Hey everyone. Lets take a moment to revisit our community rules so we keep this a great place for all survivors.",
    urgent: "NOTICE: Multiple rule violations reported recently. Expect stricter enforcement starting now.",
  },
  "player-warning": {
    friendly: "Hey there. We noticed something that needs attention. Please check your behavior and help keep things positive.",
    professional: "This is an official warning regarding recent behavior that does not align with our server policies.",
    direct: "Warning: your recent actions violate server rules. Correct immediately.",
    firm: "OFFICIAL WARNING. Your behavior has been reported. Further violations will result in a temporary or permanent ban.",
    "community-first": "We want everyone to have a good time. Please take this as a friendly reminder to respect the community guidelines.",
    urgent: "FINAL WARNING: Immediate correction required or you will be removed from the server.",
  },
  "whitelist-notice": {
    friendly: "We have updated the whitelist. If you have recently applied, check if you have been approved!",
    professional: "The server whitelist has been updated. Approved players have been notified. New applications are being reviewed.",
    direct: "Whitelist updated. Check your status before attempting to connect.",
    firm: "Whitelist changes have been applied. Unauthorized players will be unable to connect.",
    "community-first": "Whitelist update! We are reviewing applications regularly. If you are waiting, hang tight!",
    urgent: "WHITELIST CHANGED. All players must re-verify to maintain access.",
  },
  "server-wipe": {
    friendly: "The world will be wiped soon. Enjoy the current run while it lasts — new map, new adventures ahead!",
    professional: "A scheduled world wipe will occur. All progress, bases, and characters will be reset. Please plan accordingly.",
    direct: "Server wipe incoming. Back up your data. Everything will be reset.",
    firm: "MANDATORY WORLD WIPE. All data will be erased on [date]. No rollbacks or exceptions.",
    "community-first": "Wipe announcement! We are starting fresh to keep the experience balanced and exciting for everyone.",
    urgent: "SERVER WIPE CONFIRMED. Save your builds and characters before [date].",
  },
  "loot-respawn": {
    friendly: "Loot has respawned across the map. Time to gear up and explore!",
    professional: "Loot respawn has completed. New items are now available in all loot zones.",
    direct: "Loot respawned. Head out and scavenge.",
    firm: "Loot has been refreshed. Abusing respawn mechanics or exploiting known spawn locations may result in action.",
    "community-first": "Loot is back! Get out there and see what you can find. Remember to leave some for others too!",
    urgent: "LOOT RESPAWN TRIGGERED. Scavenge at your own risk — zombie populations may have increased.",
  },
  "safehouse-reminder": {
    friendly: "Quick reminder about safehouse rules. Claim what you need, respect others claims, and keep things fair!",
    professional: "This is a reminder of the safehouse system rules. Claimed bases are protected. Unauthorized access is prohibited.",
    direct: "Safehouse reminder: respect claimed bases. No trespassing.",
    firm: "SAFEHOUSE RULES ENFORCED. Unauthorized entry into claimed safehouses will result in bans. No warnings.",
    "community-first": "Safehouse check-in! Make sure your base is properly claimed and respect your neighbors territory.",
    urgent: "NOTICE: Safehouse violations reported. Expect increased monitoring and enforcement.",
  },
  "pvp-faction": {
    friendly: "PvP reminder: keep it fair, no spawn killing, and respect faction territories!",
    professional: "This is a reminder of the PvP and faction rules. Combat is permitted only in designated zones. Faction territories must be respected.",
    direct: "PvP / Faction rules: no spawn killing, respect territory claims.",
    firm: "PVP RULES STRICTLY ENFORCED. Spawn killing, griefing, and territory violations will result in immediate action.",
    "community-first": "PvP reminder for everyone: fight fair, respect faction lines, and keep the competition fun for all involved.",
    urgent: "PVP ALERT: Faction hostilities detected. All players are advised to exercise caution in contested zones.",
  },
  "community-announcement": {
    friendly: "Hey everyone, we have some exciting news to share with the community!",
    professional: "We are pleased to share the following announcement with the community.",
    direct: "Community announcement:",
    firm: "ATTENTION ALL PLAYERS: Important community announcement follows.",
    "community-first": "Great news, survivors! We have something special to share with the community.",
    urgent: "IMPORTANT COMMUNITY ANNOUNCEMENT. Please read carefully.",
  },
  "apology": {
    friendly: "Hey all. We wanted to acknowledge something that happened and apologize for any disruption.",
    professional: "We would like to formally address a recent incident and apologize for any inconvenience caused.",
    direct: "Apology regarding recent server incident.",
    firm: "OFFICIAL STATEMENT: We are aware of what happened and take full responsibility. Steps are being taken to prevent recurrence.",
    "community-first": "To our community — we hear you, and we are sorry. Here is what happened and what we are doing about it.",
    urgent: "URGENT INCIDENT FOLLOW-UP: Please read the full statement below.",
  },
};

function getToneMsg(msgType, tone) {
  return TONE_DESCRIPTIONS[msgType]?.[tone] || TONE_DESCRIPTIONS[msgType]?.balanced || "";
}

function generateMessage(serverName, msgType, tone, platform, toggles, dateTime, reason, playerAction, affectedArea, extraNote, discordChannel) {
  const name = serverName.trim() || "our Project Zomboid server";
  const typeLabel = MESSAGE_TYPES.find((t) => t.id === msgType)?.label || "Notice";
  const subject = SUBJECT_LINES[msgType] || "Server Notice";
  const opening = TONE_OPENINGS[tone] || TONE_OPENINGS.balanced;
  const closing = TONE_CLOSINGS[tone] || TONE_CLOSINGS.balanced;
  const body = getToneMsg(msgType, tone);

  const useEmojis = toggles["emojis"];
  const useRole = toggles["role-mention"];
  const useThankYou = toggles["thank-you"];
  const useAvoidRisky = toggles["avoid-risky"];
  const useBackupData = toggles["backup-data"];
  const useDmStaff = toggles["dm-staff"];

  const emoji = (e) => (useEmojis ? e : "");

  const lines = [];

  if (platform === "short") {
    lines.push(`[${typeLabel}] ${subject}`);
    if (dateTime.trim()) lines.push(`When: ${dateTime.trim()}`);
    if (reason.trim()) lines.push(`Reason: ${reason.trim()}`);
    if (affectedArea.trim()) lines.push(`Area: ${affectedArea.trim()}`);
    lines.push(body);
    if (playerAction.trim()) lines.push(playerAction.trim());
    if (extraNote.trim()) lines.push(extraNote.trim());
    return lines.join("\n");
  }

  if (useRole) {
    lines.push(`${emoji("📢")} @here`);
    lines.push("");
  }

  const titlePrefix = platform === "in-game" ? `${emoji("⚡")} ` : "";
  lines.push(`${titlePrefix}${name} — ${subject}`);
  lines.push("");

  if (platform !== "in-game") {
    lines.push(opening);
    lines.push("");
  }

  lines.push(body);
  lines.push("");

  const details = [];
  if (dateTime.trim()) details.push(`🕐 When: ${dateTime.trim()}`);
  if (reason.trim()) details.push(`📋 Reason: ${reason.trim()}`);
  if (affectedArea.trim()) details.push(`📍 Area: ${affectedArea.trim()}`);
  if (playerAction.trim()) details.push(`✅ What to do: ${playerAction.trim()}`);
  if (details.length > 0) {
    details.forEach((d) => lines.push(d));
    lines.push("");
  }

  if (useAvoidRisky) {
    lines.push(`${emoji("⚠️")} Please avoid risky activities until the server is back to normal.`);
    lines.push("");
  }
  if (useBackupData) {
    lines.push(`${emoji("💾")} Remember to back up your character and world data regularly.`);
    lines.push("");
  }
  if (useDmStaff) {
    lines.push(`${emoji("✉️")} If this affects you directly, please DM a staff member.`);
    lines.push("");
  }
  if (extraNote.trim()) {
    lines.push(`${emoji("💬")} ${extraNote.trim()}`);
    lines.push("");
  }
  if (discordChannel.trim()) {
    lines.push(`${emoji("💬")} Discord: ${discordChannel.trim()}`);
    lines.push("");
  }
  if (useThankYou) {
    lines.push(closing);
    lines.push("");
  }
  if (platform === "in-game") {
    lines.push(`— ${name} Admin Team`);
  }

  return lines.join("\n");
}

function generateShortVersion(serverName, msgType, tone, toggles, dateTime, reason) {
  const name = serverName.trim() || "our Project Zomboid server";
  const subject = SUBJECT_LINES[msgType] || "Notice";
  const body = getToneMsg(msgType, tone);
  const useEmojis = toggles["emojis"];
  const emoji = (e) => (useEmojis ? e : "");

  const lines = [];
  if (toggles["role-mention"]) lines.push("@here");
  lines.push(`${emoji("📢")} ${name} — ${subject}`);
  lines.push("");
  lines.push(body);
  if (dateTime.trim()) lines.push(`When: ${dateTime.trim()}`);
  if (reason.trim()) lines.push(`Why: ${reason.trim()}`);
  if (toggles["dm-staff"]) lines.push("DM staff if affected.");

  return lines.join("\n");
}

function generateInGameVersion(serverName, msgType, tone, dateTime, reason, affectedArea) {
  const name = serverName.trim() || "our Project Zomboid server";
  const subject = SUBJECT_LINES[msgType] || "Notice";
  const body = getToneMsg(msgType, tone);

  const lines = [];
  lines.push(`[${name}] ${subject}`);
  lines.push("");
  lines.push(body);
  if (dateTime.trim()) lines.push(`When: ${dateTime.trim()}`);
  if (reason.trim()) lines.push(`Reason: ${reason.trim()}`);
  if (affectedArea.trim()) lines.push(`Area: ${affectedArea.trim()}`);

  return lines.join("\n");
}

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";

function ProjectZomboidAdminMessageGenerator() {
  const [serverName, setServerName] = useState("");
  const [msgType, setMsgType] = useState("restart-warning");
  const [tone, setTone] = useState("friendly");
  const [platform, setPlatform] = useState("discord");
  const [toggles, setToggles] = useState(() => Object.fromEntries(TOGGLE_OPTIONS.map((t) => [t.id, false])));
  const [dateTime, setDateTime] = useState("");
  const [reason, setReason] = useState("");
  const [playerAction, setPlayerAction] = useState("");
  const [affectedArea, setAffectedArea] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [discordChannel, setDiscordChannel] = useState("");

  const [output, setOutput] = useState({ full: "", short: "", inGame: "" });
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
    const full = generateMessage(serverName, msgType, tone, platform, toggles, dateTime, reason, playerAction, affectedArea, extraNote, discordChannel);
    const short = generateShortVersion(serverName, msgType, tone, toggles, dateTime, reason);
    const inGame = generateInGameVersion(serverName, msgType, tone, dateTime, reason, affectedArea);
    setOutput({ full, short, inGame });
    setCopied("");
  }, [serverName, msgType, tone, platform, toggles, dateTime, reason, playerAction, affectedArea, extraNote, discordChannel]);

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
    setMsgType("restart-warning");
    setTone("friendly");
    setPlatform("discord");
    setToggles(Object.fromEntries(TOGGLE_OPTIONS.map((t) => [t.id, false])));
    setDateTime("");
    setReason("");
    setPlayerAction("");
    setAffectedArea("");
    setExtraNote("");
    setDiscordChannel("");
    setOutput({ full: "", short: "", inGame: "" });
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
              Project Zomboid
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Project Zomboid Admin Message Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear, fair admin messages for restarts, maintenance, rule reminders,
              wipes, mod updates, whitelist notices, and community announcements.
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
              </div>

              {/* Message Type */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Message Type
                </label>
                <select
                  value={msgType}
                  onChange={(e) => setMsgType(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                >
                  {MESSAGE_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Tone */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        tone === s.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setTone(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Platform
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        platform === s.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setPlatform(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Options
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
                  placeholder="Date / time (optional)"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Reason (optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="What players need to do (optional)"
                  value={playerAction}
                  onChange={(e) => setPlayerAction(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Affected area (optional)"
                  value={affectedArea}
                  onChange={(e) => setAffectedArea(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Extra note (optional)"
                  value={extraNote}
                  onChange={(e) => setExtraNote(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Discord channel name (optional)"
                  value={discordChannel}
                  onChange={(e) => setDiscordChannel(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Generate Message
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
                      {copied === "full" ? "Copied!" : "Copy Full Message"}
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
                      onClick={() => handleCopy(output.inGame, "ingame")}
                      disabled={copied === "ingame"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "ingame"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "ingame" ? "Copied!" : "Copy In-game Version"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy([output.full, "", "--- SHORT ---", "", output.short, "", "--- IN-GAME ---", "", output.inGame].join("\n"), "all")}
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
                      Full Admin Message
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
                      In-game Message Version
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.inGame}
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
              How to Use This Project Zomboid Admin Message Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name (or leave blank to use &ldquo;our Project Zomboid server&rdquo;).</li>
              <li>Select the type of message you need &mdash; restart, maintenance, mod update, warning, etc.</li>
              <li>Choose a tone that matches your admin style.</li>
              <li>Pick the platform where the message will be posted.</li>
              <li>Toggle optional extras like emojis, role mentions, warnings, and reminders.</li>
              <li>Add any relevant details: date/time, reason, player instructions, or notes.</li>
              <li>Click <strong className="text-slate-100">Generate Message</strong> to preview all versions.</li>
              <li>Use the copy buttons to grab the full message, short version, or in-game version.</li>
            </ol>
          </div>
        </section>

        {/* Common Admin Messages */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Project Zomboid Admin Messages
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Project Zomboid server admins frequently send messages about scheduled restarts,
              mod updates, rule reminders, and whitelist changes. Restart warnings are the most
              common, especially on long-term servers where players invest significant time in
              their characters and bases.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Clear and consistent admin communication builds trust with your community. Players
              appreciate knowing when maintenance is coming, what to expect after a wipe, and
              how to report issues.
            </p>
          </div>
        </section>

        {/* Restart and Maintenance */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Restart and Maintenance Message Examples
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              A good restart warning gives players enough time to find shelter and log out safely.
              Include the time until restart, the reason, and what players should do. For scheduled
              maintenance, announce it in advance through Discord and follow up with an in-game
              warning before the server goes down.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Emergency restarts should be short and clear. Explain why the restart is happening
              and apologize for the disruption. Follow up with a full announcement once the server
              is back online.
            </p>
          </div>
        </section>

        {/* Rule Reminder Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Rule Reminder and Player Warning Tips
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Be specific about violations
                </h3>
                <p className="mt-1">
                  When issuing a warning, reference the specific rule that was broken.
                  Vague warnings create confusion and can make enforcement harder later.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Use a progressive enforcement system
                </h3>
                <p className="mt-1">
                  Start with a friendly reminder, escalate to a firm warning, then enforce
                  consequences. This gives players a chance to correct their behavior.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Keep warnings private when possible
                </h3>
                <p className="mt-1">
                  Public warnings can embarrass players and create tension. Use DMs for
                  individual warnings and save public announcements for general rule reminders.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Document everything
                </h3>
                <p className="mt-1">
                  Keep records of warnings and incidents. This helps you track repeat
                  offenders and provides evidence if a ban appeal arises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Long-Term Project Zomboid Communities
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Schedule regular restart windows
                </h3>
                <p className="mt-1">
                  Project Zomboid servers benefit from daily restarts to clear lag and refresh
                  loot. Announce a consistent restart window so players can plan around it.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Communicate mod updates clearly
                </h3>
                <p className="mt-1">
                  Mod updates can break saves or change gameplay. Always announce mod changes
                  before they are applied and give players time to update their clients.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Use multiple platforms for important announcements
                </h3>
                <p className="mt-1">
                  Post critical announcements in Discord and in-game. Players who miss one
                  channel will catch the other. This is especially important for restart
                  warnings and whitelist changes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Build an admin log
                </h3>
                <p className="mt-1">
                  Keep a shared log of admin actions, announcements, and incidents. This helps
                  the admin team stay consistent and provides a reference for future decisions.
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
                  Can I customize the generated messages?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Choose the message type, tone, platform, and toggle optional features.
                  You can also edit the output after copying.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What message types are supported?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Restart Warning, Maintenance Notice, Mod Update, Rule Reminder, Player
                  Warning, Whitelist Notice, Server Wipe Notice, Loot Respawn Notice, Safehouse
                  Reminder, PvP/Faction Reminder, Community Announcement, and Apology/Incident
                  Follow-up.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is the difference between the three output versions?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  The Full Admin Message includes everything with formatting and details. The
                  Short Discord Version is compact for quick posting. The In-game Message Version
                  is formatted for the in-game chat or server message system.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use these messages for other games too?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Many of the message types work for any game server. Adjust the server
                  name and details to fit your community.
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

        <RelatedTools currentToolId="project-zomboid-admin-message-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ProjectZomboidAdminMessageGenerator;
