import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Server Status Message Generator | QUESTPAUSE Tools",
  description:
    "Generate server status messages for online, offline, maintenance, restarts, degraded performance, connection issues, mod updates, and back-online announcements.",
};

const GAME_TYPES = [
  { id: "minecraft", label: "Minecraft" },
  { id: "project-zomboid", label: "Project Zomboid" },
  { id: "valheim", label: "Valheim" },
  { id: "icarus", label: "ICARUS" },
  { id: "7-days-to-die", label: "7 Days to Die" },
  { id: "discord-community", label: "Discord Community" },
  { id: "general", label: "General Game Server" },
];

const STATUS_TYPES = [
  { id: "online", label: "Online" },
  { id: "offline", label: "Offline" },
  { id: "maintenance", label: "Maintenance" },
  { id: "restarting", label: "Restarting" },
  { id: "degraded", label: "Degraded Performance" },
  { id: "connection-issues", label: "Connection Issues" },
  { id: "mod-update", label: "Modpack Update" },
  { id: "investigating", label: "Investigating Issue" },
  { id: "back-online", label: "Back Online" },
  { id: "scheduled-downtime", label: "Scheduled Downtime" },
  { id: "emergency-downtime", label: "Emergency Downtime" },
];

const PLATFORMS = [
  { id: "discord-post", label: "Discord Status Post" },
  { id: "short-status", label: "Short Status Message" },
  { id: "in-game", label: "In-game Message" },
  { id: "status-page", label: "Status Page Update" },
  { id: "community-announcement", label: "Community Announcement" },
];

const TONE_OPTIONS = [
  { id: "friendly", label: "Friendly" },
  { id: "professional", label: "Professional" },
  { id: "short-direct", label: "Short and direct" },
  { id: "urgent", label: "Urgent" },
  { id: "apologetic", label: "Apologetic" },
  { id: "community-first", label: "Community-first" },
];

const TOGGLE_OPTIONS = [
  { id: "add-emojis", label: "Add emojis" },
  { id: "add-role-mention", label: "Add role mention placeholder" },
  { id: "add-thanks", label: "Add thank-you message" },
  { id: "add-investigating", label: 'Add "we are investigating" line' },
  { id: "add-avoid-warning", label: 'Add "avoid risky activity" warning' },
  { id: "add-update-soon", label: 'Add "we will update you soon" line' },
  { id: "add-short-version", label: "Add short version" },
  { id: "add-resolved-version", label: "Add resolved/back-online version" },
];

const DEFAULT_TOGGLES = [
  "add-emojis",
  "add-thanks",
  "add-update-soon",
];

function getStatusIcon(statusId) {
  const icons = {
    online: ":green_circle:",
    offline: ":red_circle:",
    maintenance: ":tools:",
    restarting: ":arrows_counterclockwise:",
    degraded: ":yellow_circle:",
    "connection-issues": ":signal_strength:",
    "mod-update": ":package:",
    investigating: ":mag:",
    "back-online": ":white_check_mark:",
    "scheduled-downtime": ":calendar:",
    "emergency-downtime": ":rotating_light:",
  };
  return icons[statusId] || ":bell:";
}

function getStatusEmoji(statusId) {
  const emojis = {
    online: "\u{1F7E2}",
    offline: "\u{1F534}",
    maintenance: "\u{1F6E0}\uFE0F",
    restarting: "\u{1F504}",
    degraded: "\u{1F7E1}",
    "connection-issues": "\u{1F4F6}",
    "mod-update": "\u{1F4E6}",
    investigating: "\u{1F50D}",
    "back-online": "\u2705",
    "scheduled-downtime": "\u{1F4C5}",
    "emergency-downtime": "\u{1F6A8}",
  };
  return emojis[statusId] || "\u{1F514}";
}

function statusTitleText(statusId) {
  const titles = {
    online: "Server is Online",
    offline: "Server is Offline",
    maintenance: "Server Maintenance",
    restarting: "Server Restarting",
    degraded: "Degraded Performance",
    "connection-issues": "Connection Issues",
    "mod-update": "Modpack Update",
    investigating: "Investigating Issue",
    "back-online": "Back Online",
    "scheduled-downtime": "Scheduled Downtime",
    "emergency-downtime": "Emergency Downtime",
  };
  return titles[statusId] || "Server Status Update";
}

function statusBodyText(statusId, serverName, tone, reason) {
  const reasonLine = reason ? `\n\n**Reason:** ${reason}` : "";

  const bodies = {
    online: `${serverName} is online and available. Everything is running normally.${reasonLine}`,
    offline: `${serverName} is currently offline. We are working to resolve this as quickly as possible.${reasonLine}`,
    maintenance: `${serverName} is temporarily under maintenance. Please avoid reconnecting until the update is complete.${reasonLine}`,
    restarting: `${serverName} is restarting. Please give it a few moments before reconnecting.${reasonLine}`,
    degraded: `We are aware of lag or performance issues on ${serverName} and are currently investigating.${reasonLine}`,
    "connection-issues": `Some players may be experiencing connection issues with ${serverName}. We are looking into it.${reasonLine}`,
    "mod-update": `${serverName} is updating its modpack. Please update your client to match the new version.${reasonLine}`,
    investigating: `We are investigating an issue affecting ${serverName}. More information will follow.${reasonLine}`,
    "back-online": `${serverName} is back online. Thanks for your patience.${reasonLine}`,
    "scheduled-downtime": `${serverName} will be going down for scheduled maintenance. Please plan accordingly.${reasonLine}`,
    "emergency-downtime": `${serverName} is undergoing emergency maintenance. We apologize for the disruption.${reasonLine}`,
  };
  return bodies[statusId] || `${serverName} has a status update.${reasonLine}`;
}

function tonePrefix(tone, statusId) {
  if (tone === "urgent") return ":warning: **URGENT** :warning:\n\n";
  if (tone === "apologetic" && ["offline", "maintenance", "degraded", "connection-issues", "emergency-downtime"].includes(statusId)) {
    return ":pray: We apologize for the inconvenience.\n\n";
  }
  if (tone === "community-first") return ":heart: To our community:\n\n";
  return "";
}

function toneSuffix(tone) {
  if (tone === "friendly") return "\n\nWe appreciate you!";
  if (tone === "professional") return "\n\nThank you for your understanding.";
  if (tone === "community-first") return "\n\nWe'll keep you posted.";
  if (tone === "apologetic") return "\n\nWe sincerely apologize for any disruption.";
  return "";
}

function generateFullStatus(serverName, statusId, tone, platform, toggles, optional) {
  const useEmoji = toggles.has("add-emojis");
  const emoji = useEmoji ? getStatusEmoji(statusId) + " " : "";
  const icon = useEmoji ? getStatusIcon(statusId) + " " : "";
  const parts = [];

  parts.push(`${emoji}${icon}**${statusTitleText(statusId)}**`);
  parts.push("");

  const prefix = tonePrefix(tone, statusId);
  const suffix = toneSuffix(tone);

  parts.push(prefix + statusBodyText(statusId, serverName, tone, optional.reason) + suffix);

  if (optional.dateTime) {
    parts.push("");
    parts.push(`:clock1: **Time:** ${optional.dateTime}`);
  }
  if (optional.estimatedDowntime) {
    parts.push(`:hourglass: **Estimated downtime:** ${optional.estimatedDowntime}`);
  }
  if (optional.affectedServer) {
    parts.push(`:desktop: **Affected:** ${optional.affectedServer}`);
  }
  if (toggles.has("add-avoid-warning") && ["maintenance", "restarting", "scheduled-downtime", "emergency-downtime"].includes(statusId)) {
    parts.push(`:warning: **Please avoid risky activities** until the server is back to normal.`);
  }
  if (toggles.has("add-investigating") && ["degraded", "connection-issues", "offline", "investigating"].includes(statusId)) {
    parts.push(`:mag: We are actively investigating this issue.`);
  }
  if (toggles.has("add-update-soon") && !["online", "back-online"].includes(statusId)) {
    parts.push(`:bell: We will update you as soon as we have more information.`);
  }
  if (toggles.has("add-role-mention")) {
    parts.push(`:mega: <@&role-id>`);
  }
  if (optional.playerAction) {
    parts.push("");
    parts.push(`**What you should do:** ${optional.playerAction}`);
  }
  if (toggles.has("add-thanks")) {
    parts.push("");
    parts.push(`Thank you for your patience.`);
  }
  if (optional.extraNote) {
    parts.push("");
    parts.push(`> ${optional.extraNote}`);
  }
  if (optional.discordChannel) {
    parts.push(`\n:inbox_tray: Updates in: ${optional.discordChannel}`);
  }

  return parts.join("\n");
}

function generateShortStatus(serverName, statusId, tone, toggles, optional) {
  const useEmoji = toggles.has("add-emojis");
  const emoji = useEmoji ? getStatusEmoji(statusId) + " " : "";
  const parts = [];

  const statusLabel = STATUS_TYPES.find((s) => s.id === statusId)?.label || "Status Update";
  parts.push(`${emoji}**${serverName}** — ${statusLabel}`);

  if (optional.reason) {
    parts.push(`Reason: ${optional.reason}`);
  }
  if (optional.estimatedDowntime) {
    parts.push(`ETA: ${optional.estimatedDowntime}`);
  }
  if (toggles.has("add-update-soon") && !["online", "back-online"].includes(statusId)) {
    parts.push("More info soon.");
  }

  return parts.join(" | ");
}

function generateInGameVersion(serverName, statusId, tone, toggles) {
  const parts = [];

  const statusLabel = STATUS_TYPES.find((s) => s.id === statusId)?.label || "Status Update";
  parts.push(`[${statusLabel}] ${serverName}`);

  if (statusId === "online") parts.push("Server is online.");
  else if (statusId === "offline") parts.push("Server is offline. Please wait for updates.");
  else if (statusId === "maintenance") parts.push("Server is under maintenance. Do not reconnect yet.");
  else if (statusId === "restarting") parts.push("Server is restarting. Give it a moment.");
  else if (statusId === "degraded") parts.push("Lag or performance issues detected. Investigating.");
  else if (statusId === "connection-issues") parts.push("Connection issues detected. Trying to reconnect.");
  else if (statusId === "mod-update") parts.push("Modpack update in progress. Update your client.");
  else if (statusId === "investigating") parts.push("Issue detected. Staff are investigating.");
  else if (statusId === "back-online") parts.push("Server is back online. You can reconnect now.");
  else if (statusId === "scheduled-downtime") parts.push("Scheduled downtime coming. Plan accordingly.");
  else if (statusId === "emergency-downtime") parts.push("Emergency downtime. We will update you.");

  if (toggles.has("add-avoid-warning") && ["maintenance", "restarting", "emergency-downtime"].includes(statusId)) {
    parts.push("Avoid risky activities until the server is back.");
  }

  return parts.join(" — ");
}

function generateResolvedMessage(serverName, statusId, tone, toggles, optional) {
  if (statusId === "online" || statusId === "back-online") {
    return generateFullStatus(serverName, "back-online", tone, "discord-post", toggles, optional);
  }
  const parts = [];

  parts.push(`:white_check_mark: **${serverName} — Issue Resolved**`);
  parts.push("");
  parts.push(`The issue affecting ${serverName} has been resolved. Everything should be back to normal.`);

  if (optional.reason) {
    parts.push(`\n**Cause:** ${optional.reason}`);
  }
  if (toggles.has("add-thanks")) {
    parts.push(`\nThank you for your patience and understanding.`);
  }

  return parts.join("\n");
}

function ServerStatusMessageGenerator() {
  const [serverName, setServerName] = useState("");
  const [gameType, setGameType] = useState("general");
  const [statusId, setStatusId] = useState("online");
  const [platform, setPlatform] = useState("discord-post");
  const [tone, setTone] = useState("friendly");
  const [toggles, setToggles] = useState(new Set(DEFAULT_TOGGLES));
  const [optionalFields, setOptionalFields] = useState({});
  const [generated, setGenerated] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const resolvedName = serverName.trim() || "our server";

  const handleToggle = useCallback((id) => {
    setToggles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleOptionalChange = useCallback((key, value) => {
    setOptionalFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    const optional = {
      dateTime: optionalFields.dateTime || "",
      estimatedDowntime: optionalFields.estimatedDowntime || "",
      reason: optionalFields.reason || "",
      affectedServer: optionalFields.affectedServer || "",
      playerAction: optionalFields.playerAction || "",
      extraNote: optionalFields.extraNote || "",
      discordChannel: optionalFields.discordChannel || "",
    };

    setGenerated({
      fullStatus: generateFullStatus(resolvedName, statusId, tone, platform, toggles, optional),
      shortStatus: generateShortStatus(resolvedName, statusId, tone, toggles, optional),
      inGameVersion: generateInGameVersion(resolvedName, statusId, tone, toggles, optional),
      resolvedMessage: generateResolvedMessage(resolvedName, statusId, tone, toggles, optional),
    });
  }, [resolvedName, statusId, tone, platform, toggles, optionalFields]);

  const copyToClipboard = useCallback(async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const copyAll = useCallback(async () => {
    if (!generated) return;
    const all = [
      "=== FULL STATUS UPDATE ===",
      generated.fullStatus,
      "",
      "=== SHORT DISCORD STATUS ===",
      generated.shortStatus,
      "",
      "=== IN-GAME VERSION ===",
      generated.inGameVersion,
      "",
      "=== RESOLVED / BACK-ONLINE MESSAGE ===",
      generated.resolvedMessage,
    ].join("\n\n");
    try {
      await navigator.clipboard.writeText(all);
      setCopied("all");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard not available
    }
  }, [generated]);

  const handleClear = useCallback(() => {
    setServerName("");
    setGameType("general");
    setStatusId("online");
    setPlatform("discord-post");
    setTone("friendly");
    setToggles(new Set(DEFAULT_TOGGLES));
    setOptionalFields({});
    setGenerated(null);
    setShowClearConfirm(false);
  }, []);

  const copyButtons = generated && [
    { key: "fullStatus", label: "Copy Full Status" },
    { key: "shortStatus", label: "Copy Short Version" },
    { key: "inGameVersion", label: "Copy In-game Version" },
    { key: "resolvedMessage", label: "Copy Resolved Message" },
  ];

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
              Server Status Message Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear online, offline, maintenance, degraded performance, restart, and back-online status messages for game servers.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">
              {/* Server Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Server / Community Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                  placeholder="Enter your server name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-slate-500">
                  If empty, "our server" will be used.
                </p>
              </div>

              {/* Game Type */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Game / Server Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {GAME_TYPES.map((gt) => (
                    <button
                      key={gt.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        gameType === gt.id
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                      onClick={() => setGameType(gt.id)}
                    >
                      {gt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Type */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Status Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_TYPES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        statusId === st.id
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                      onClick={() => setStatusId(st.id)}
                    >
                      {st.label}
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
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        platform === p.id
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                      onClick={() => setPlatform(p.id)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        tone === t.id
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                      onClick={() => setTone(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Options */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Options
                </label>
                <div className="flex flex-wrap gap-2">
                  {TOGGLE_OPTIONS.map((to) => {
                    const enabled = toggles.has(to.id);
                    return (
                      <button
                        key={to.id}
                        type="button"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          enabled
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-200"
                            : "border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                        }`}
                        onClick={() => handleToggle(to.id)}
                      >
                        {enabled ? "\u2713 " : ""}{to.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Fields */}
              <div className="mt-8 border-t border-slate-800 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-4">
                  Optional Fields
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Date / time
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="e.g. May 11, 2026 14:00 UTC"
                      value={optionalFields.dateTime || ""}
                      onChange={(e) => handleOptionalChange("dateTime", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Estimated downtime
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="e.g. 30 minutes"
                      value={optionalFields.estimatedDowntime || ""}
                      onChange={(e) => handleOptionalChange("estimatedDowntime", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Reason
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="e.g. Hardware upgrade"
                      value={optionalFields.reason || ""}
                      onChange={(e) => handleOptionalChange("reason", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Affected server / world
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="e.g. Survival World"
                      value={optionalFields.affectedServer || ""}
                      onChange={(e) => handleOptionalChange("affectedServer", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      What players should do
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="e.g. Disconnect and wait for updates"
                      value={optionalFields.playerAction || ""}
                      onChange={(e) => handleOptionalChange("playerAction", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Discord role / channel
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="#server-status"
                      value={optionalFields.discordChannel || ""}
                      onChange={(e) => handleOptionalChange("discordChannel", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Extra note
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="Any additional information..."
                      value={optionalFields.extraNote || ""}
                      onChange={(e) => handleOptionalChange("extraNote", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Generate / Clear */}
              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Generate Status
                </button>

                {showClearConfirm ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-rose-400">Clear all?</span>
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
                  generated && (
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-rose-500 hover:text-rose-400"
                    >
                      Clear
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Generated Output */}
        {generated && (
          <>
            {/* Copy Buttons */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-6">
                <div className="flex flex-wrap gap-2">
                  {copyButtons.map((btn) => (
                    <button
                      key={btn.key}
                      type="button"
                      onClick={() => copyToClipboard(btn.key, generated[btn.key])}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        copied === btn.key
                          ? "bg-emerald-500 text-white"
                          : "bg-indigo-500 text-white hover:bg-indigo-400"
                      }`}
                    >
                      {copied === btn.key ? "Copied!" : btn.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={copyAll}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      copied === "all"
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-500 text-slate-950 hover:bg-amber-400"
                    }`}
                  >
                    {copied === "all" ? "Copied!" : "Copy All"}
                  </button>
                </div>
              </div>
            </section>

            {/* A. Full Status Update */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  A. Full Status Update
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.fullStatus}
                </pre>
              </div>
            </section>

            {/* B. Short Discord Status */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  B. Short Discord Status
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.shortStatus}
                </pre>
              </div>
            </section>

            {/* C. In-game / Server Chat Version */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  C. In-game / Server Chat Version
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.inGameVersion}
                </pre>
              </div>
            </section>

            {/* D. Resolved / Back-Online Message */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  D. Resolved / Back-Online Follow-up
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.resolvedMessage}
                </pre>
              </div>
            </section>
          </>
        )}

        {/* SEO Content Sections */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Server Status Message Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name or leave it blank to use "our server".</li>
              <li>Select the game or server type — Minecraft, Project Zomboid, Valheim, or general.</li>
              <li>Choose the status type: online, offline, maintenance, restarting, degraded, or back-online.</li>
              <li>Pick the platform where the message will be posted: Discord, in-game, status page, or announcement.</li>
              <li>Select a tone that matches your community: friendly, professional, urgent, or apologetic.</li>
              <li>Toggle optional features like emojis, role mentions, and "we are investigating" lines.</li>
              <li>Fill in optional fields like date/time, reason, estimated downtime, or what players should do.</li>
              <li>Click "Generate Status" and copy the output that fits your needs.</li>
            </ol>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Server Status Message Examples
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Online</h3>
                <p className="mt-1">
                  "Server is online and available. Everything is running normally."
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Maintenance</h3>
                <p className="mt-1">
                  "Server is temporarily under maintenance. Please avoid reconnecting until the update is complete."
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Degraded Performance</h3>
                <p className="mt-1">
                  "We are aware of lag or connection issues and are currently investigating."
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Back Online</h3>
                <p className="mt-1">
                  "The server is back online. Thanks for your patience."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Online, Offline, and Maintenance Status Messages
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Server status messages fall into a few common categories. Online messages confirm
              that the server is operational. Offline messages acknowledge that the server is
              down and that staff are aware. Maintenance messages inform players about planned
              downtime and when to expect the server back. Each type should be clear about the
              current situation and what players should do next. Adding estimated downtime and
              regular updates helps maintain trust with your community.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Communicate Server Issues Clearly
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Be transparent</h3>
                <p className="mt-1">
                  Tell your community what is happening, why, and when you expect it to be
                  resolved. Transparency builds trust even during outages.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Use the right channel</h3>
                <p className="mt-1">
                  Post status updates in a dedicated channel so players know where to look
                  for information. Use role mentions sparingly to avoid notification fatigue.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Update regularly</h3>
                <p className="mt-1">
                  Even if there is no new information, post an update to let players know you
                  are still working on the issue. Silence can be frustrating.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Follow up after resolution</h3>
                <p className="mt-1">
                  Once the issue is resolved, post a clear "back online" message explaining
                  what happened. This closes the loop and reassures your community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Game Server Admins
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Keep a template of common status messages ready to go so you can post updates
              quickly during incidents. Use short, clear language — players scanning on mobile
              should immediately understand the situation. Pair Discord status posts with
              in-game messages so players who are already connected also see the update.
              Always include estimated downtime if you have it, and never promise a fix time
              you are not confident about. A simple "We will update you soon" is better than
              a missed deadline.
            </p>
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
                  How often should I post status updates?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  During an ongoing issue, post an update at least every 30-60 minutes even if
                  there is no new information. Silence makes players wonder if anyone is working
                  on the problem.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Should I use in-game messages for status updates?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Pair Discord announcements with in-game messages so connected players
                  see the update without leaving the game. Our tool generates both formats.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What tone should I use for emergency downtime?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Use "Urgent" or "Apologetic" tone depending on the situation. Urgent is best
                  for unexpected crashes. Apologetic works well when the downtime affects many
                  players and you want to acknowledge the disruption.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What should a resolved message include?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Confirm that the server is back online, briefly explain what caused the issue
                  if known, and thank the community for their patience. A simple follow-up goes
                  a long way.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Is this tool free to use?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes, completely free. No login, no sign-up, and no hidden costs.
                  Built by QUESTPAUSE.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="server-status-message-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ServerStatusMessageGenerator;
