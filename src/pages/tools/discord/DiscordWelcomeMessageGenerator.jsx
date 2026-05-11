import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Discord Welcome Message Generator | QUESTPAUSE Tools",
  description:
    "Generate Discord welcome messages, onboarding posts, role-selection instructions, pinned messages, and new member guidance for gaming communities and private servers.",
};

const COMMUNITY_TYPES = [
  { id: "gaming-community", label: "Gaming Community" },
  { id: "minecraft-server", label: "Minecraft Server" },
  { id: "project-zomboid-server", label: "Project Zomboid Server" },
  { id: "valheim-server", label: "Valheim Server" },
  { id: "survival-games", label: "Survival Games Community" },
  { id: "roleplay-community", label: "Roleplay Community" },
  { id: "private-friends", label: "Private Friends Server" },
  { id: "general-community", label: "General Community" },
];

const WELCOME_STYLES = [
  { id: "short-friendly", label: "Short and friendly" },
  { id: "detailed-onboarding", label: "Detailed onboarding" },
  { id: "community-first", label: "Community-first" },
  { id: "professional", label: "Professional" },
  { id: "cozy-chill", label: "Cozy / chill" },
  { id: "roleplay", label: "Roleplay-friendly" },
];

const MEMBER_ACTIONS = [
  { id: "read-rules", label: "Read the rules" },
  { id: "choose-role", label: "Choose a role" },
  { id: "introduce-yourself", label: "Introduce yourself" },
  { id: "apply-whitelist", label: "Apply for whitelist" },
  { id: "check-server-info", label: "Check server info" },
  { id: "open-ticket", label: "Open a ticket" },
  { id: "wait-approval", label: "Wait for staff approval" },
  { id: "join-voice", label: "Join voice chat" },
  { id: "check-announcements", label: "Check announcements" },
];

const TOGGLE_OPTIONS = [
  { id: "add-emojis", label: "Add emojis" },
  { id: "mention-rules", label: "Mention rules channel placeholder" },
  { id: "mention-roles", label: "Mention role selection channel placeholder" },
  { id: "mention-announcements", label: "Mention announcements channel placeholder" },
  { id: "mention-support", label: "Mention support/ticket channel placeholder" },
  { id: "mention-whitelist", label: "Mention whitelist/application channel placeholder" },
  { id: "no-rush", label: 'Add "no rush, take your time" tone' },
  { id: "ask-staff", label: "Add \"ask staff if you need help\"" },
  { id: "add-short-version", label: "Add short version" },
  { id: "add-pinned-version", label: "Add pinned message version" },
];

const DEFAULT_TOGGLES = [
  "add-emojis",
  "mention-rules",
  "ask-staff",
  "add-short-version",
];

function welcomeIntro(style, serverName) {
  const intros = {
    "short-friendly": `Welcome to ${serverName}! We are excited to have you here.`,
    "detailed-onboarding": `Hello and welcome to ${serverName}! We are glad you joined us. Take a moment to get settled in — here is everything you need to know to get started.`,
    "community-first": `Welcome to ${serverName}! You are now part of our community. We are happy to have you and hope you enjoy your time here.`,
    professional: `Welcome to ${serverName}. We appreciate your interest in our community and look forward to your participation.`,
    "cozy-chill": `Hey there, welcome to ${serverName}! Grab a seat, make yourself at home, and take your time looking around.`,
    roleplay: `Welcome to ${serverName}! Your journey begins here. Take a moment to learn about our world and find your place in the story.`,
  };
  return intros[style] || intros["short-friendly"];
}

function welcomeMiddle(style, optional) {
  const parts = [];
  if (optional.rulesChannel) {
    parts.push(`:book: Please take a moment to read the rules in ${optional.rulesChannel}.`);
  }
  if (optional.roleChannel) {
    parts.push(`:label: Pick your roles in ${optional.roleChannel} to get access to the channels that interest you.`);
  }
  if (optional.applicationChannel) {
    parts.push(`:inbox_tray: If you need to apply, head over to ${optional.applicationChannel}.`);
  }
  if (optional.supportChannel) {
    parts.push(`:question: Need help? Open a ticket in ${optional.supportChannel}.`);
  }
  if (style === "roleplay") {
    parts.push(":scroll: Read the lore and setting information before creating your character.");
  }
  if (style === "detailed-onboarding") {
    parts.push(":clipboard: Check the pinned messages in each channel for important information.");
  }
  if (optional.extraNote) {
    parts.push(`> ${optional.extraNote}`);
  }
  return parts;
}

function generateFullMessage(serverName, communityType, style, actions, toggles, optional) {
  const useEmoji = toggles.has("add-emojis");
  const parts = [];

  if (useEmoji) parts.push(":wave:");
  parts.push(`**${welcomeIntro(style, serverName)}**`);
  parts.push("");

  const middle = welcomeMiddle(style, optional);
  if (middle.length > 0) {
    middle.forEach((line) => {
      parts.push(line);
      parts.push("");
    });
  }

  if (actions.length > 0) {
    if (useEmoji) parts.push(":arrow_down: **Here is what to do next:**");
    else parts.push("**Here is what to do next:**");
    parts.push("");

    const actionTexts = {
      "read-rules": `Read the rules ${optional.rulesChannel ? "in " + optional.rulesChannel : ""}`,
      "choose-role": `Choose your roles ${optional.roleChannel ? "in " + optional.roleChannel : ""}`,
      "introduce-yourself": "Say hello and introduce yourself",
      "apply-whitelist": `Apply for the whitelist ${optional.applicationChannel ? "in " + optional.applicationChannel : ""}`,
      "check-server-info": "Browse the server info and channels",
      "open-ticket": `Open a ticket ${optional.supportChannel ? "in " + optional.supportChannel : ""} if you need help`,
      "wait-approval": "Wait for staff to approve your access",
      "join-voice": "Join a voice chat and meet other members",
      "check-announcements": "Check the announcements for news and updates",
    };

    actions.forEach((actionId, i) => {
      const text = actionTexts[actionId] || actionId;
      parts.push(`${i + 1}. ${text}`);
    });
    parts.push("");
  }

  if (toggles.has("no-rush")) {
    parts.push(":hourglass_flowing_sand: No rush — take your time getting settled. We are glad to have you!");
    parts.push("");
  }

  if (toggles.has("ask-staff")) {
    parts.push(":raising_hand: If you ever need help, do not hesitate to ask a staff member. We are here for you.");
    parts.push("");
  }

  parts.push(`*Welcome to the community!*`);
  parts.push("");
  parts.push(`*— ${serverName} Staff*`);

  return parts.join("\n");
}

function generateShortVersion(serverName, style, actions, toggles, optional) {
  const useEmoji = toggles.has("add-emojis");
  const parts = [];

  if (useEmoji) parts.push(":wave:");
  parts.push(`**Welcome to ${serverName}!**`);
  parts.push("");

  if (optional.rulesChannel) {
    parts.push(`:book: Read the rules: ${optional.rulesChannel}`);
  }
  if (optional.roleChannel) {
    parts.push(`:label: Choose roles: ${optional.roleChannel}`);
  }

  if (actions.length > 0) {
    const shortTexts = {
      "read-rules": "Read the rules",
      "choose-role": "Pick your roles",
      "introduce-yourself": "Introduce yourself",
      "apply-whitelist": "Apply for whitelist",
      "check-server-info": "Check server info",
      "open-ticket": "Open a ticket if needed",
      "wait-approval": "Wait for approval",
      "join-voice": "Join voice chat",
      "check-announcements": "Check announcements",
    };
    const short = actions.map((a) => shortTexts[a] || a).join(" | ");
    parts.push(`:arrow_right: ${short}`);
  }

  if (toggles.has("ask-staff")) {
    parts.push(":raising_hand: Ask staff if you need help.");
  }

  return parts.join("\n");
}

function generatePinnedVersion(serverName, style, actions, toggles, optional) {
  const useEmoji = toggles.has("add-emojis");
  const parts = [];

  if (useEmoji) parts.push(":pushpin:");
  parts.push(`**Welcome to ${serverName}!**`);
  parts.push("");

  if (optional.rulesChannel) {
    parts.push(`:book: Rules: ${optional.rulesChannel}`);
  }
  if (optional.roleChannel) {
    parts.push(`:label: Roles: ${optional.roleChannel}`);
  }
  if (optional.applicationChannel) {
    parts.push(`:inbox_tray: Apply: ${optional.applicationChannel}`);
  }

  if (actions.length > 0) {
    const pinnedTexts = {
      "read-rules": "Read #rules",
      "choose-role": "Pick roles",
      "introduce-yourself": "Say hi",
      "apply-whitelist": "Apply for whitelist",
      "check-server-info": "Look around",
      "open-ticket": "Open ticket",
      "wait-approval": "Wait for staff",
      "join-voice": "Join VC",
      "check-announcements": "Read #announcements",
    };
    parts.push(`:arrow_right: ${actions.map((a) => pinnedTexts[a] || a).join(" | ")}`);
  }

  parts.push("");
  if (toggles.has("ask-staff")) parts.push("Ask staff if you need help.");

  return parts.join("\n");
}

function generateStaffVersion(serverName, style, actions, toggles, optional) {
  const parts = [];

  parts.push(`**Staff Welcome Template — ${serverName}**`);
  parts.push("");
  parts.push(`Use this message to welcome new members manually:`);
  parts.push("");

  const intro = welcomeIntro(style, serverName);
  parts.push(intro);
  parts.push("");

  if (actions.length > 0) {
    parts.push("Please take a moment to:");
    const staffTexts = {
      "read-rules": "Read the server rules",
      "choose-role": "Select your roles",
      "introduce-yourself": "Introduce yourself to the community",
      "apply-whitelist": "Submit a whitelist application",
      "check-server-info": "Browse available channels",
      "open-ticket": "Open a support ticket if needed",
      "wait-approval": "Wait while staff review your access",
      "join-voice": "Join a voice channel to meet others",
      "check-announcements": "Read recent announcements",
    };
    actions.forEach((a) => {
      parts.push(`- ${staffTexts[a] || a}`);
    });
    parts.push("");
  }

  if (toggles.has("ask-staff")) {
    parts.push("If you have any questions, feel free to reach out to any staff member.");
    parts.push("");
  }

  parts.push("Be sure to:");
  if (optional.rulesChannel) parts.push(`- Point them to ${optional.rulesChannel}`);
  if (optional.roleChannel) parts.push(`- Direct them to ${optional.roleChannel} for roles`);
  if (optional.applicationChannel) parts.push(`- Mention ${optional.applicationChannel} if they need to apply`);
  if (optional.extraNote) parts.push(`- Note: ${optional.extraNote}`);

  return parts.join("\n");
}

function DiscordWelcomeMessageGenerator() {
  const [serverName, setServerName] = useState("");
  const [communityType, setCommunityType] = useState("gaming-community");
  const [welcomeStyle, setWelcomeStyle] = useState("short-friendly");
  const [actions, setActions] = useState(["read-rules", "introduce-yourself"]);
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

  const resolvedName = serverName.trim() || "our Discord server";

  const toggleAction = useCallback((id) => {
    setActions((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id);
      return [...prev, id];
    });
  }, []);

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
      rulesChannel: optionalFields.rulesChannel || "",
      roleChannel: optionalFields.roleChannel || "",
      applicationChannel: optionalFields.applicationChannel || "",
      supportChannel: optionalFields.supportChannel || "",
      extraNote: optionalFields.extraNote || "",
    };

    setGenerated({
      fullMessage: generateFullMessage(resolvedName, communityType, welcomeStyle, actions, toggles, optional),
      shortVersion: generateShortVersion(resolvedName, welcomeStyle, actions, toggles, optional),
      pinnedVersion: generatePinnedVersion(resolvedName, welcomeStyle, actions, toggles, optional),
      staffVersion: generateStaffVersion(resolvedName, welcomeStyle, actions, toggles, optional),
    });
  }, [resolvedName, communityType, welcomeStyle, actions, toggles, optionalFields]);

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
      "=== FULL WELCOME MESSAGE ===",
      generated.fullMessage,
      "",
      "=== SHORT WELCOME VERSION ===",
      generated.shortVersion,
      "",
      "=== PINNED ONBOARDING MESSAGE ===",
      generated.pinnedVersion,
      "",
      "=== STAFF-FRIENDLY VERSION ===",
      generated.staffVersion,
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
    setCommunityType("gaming-community");
    setWelcomeStyle("short-friendly");
    setActions(["read-rules", "introduce-yourself"]);
    setToggles(new Set(DEFAULT_TOGGLES));
    setOptionalFields({});
    setGenerated(null);
    setShowClearConfirm(false);
  }, []);

  const copyButtons = generated && [
    { key: "fullMessage", label: "Copy Full Message" },
    { key: "shortVersion", label: "Copy Short Version" },
    { key: "pinnedVersion", label: "Copy Pinned Message" },
    { key: "staffVersion", label: "Copy Staff Version" },
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
              Discord Welcome Message Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate friendly Discord welcome messages, onboarding posts, role-selection instructions, and pinned new member guidance.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">
              {/* Server Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Community / Server Name
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
                  If empty, "our Discord server" will be used.
                </p>
              </div>

              {/* Community Type */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Community Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMUNITY_TYPES.map((ct) => (
                    <button
                      key={ct.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        communityType === ct.id
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                      onClick={() => setCommunityType(ct.id)}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Welcome Style */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Welcome Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {WELCOME_STYLES.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        welcomeStyle === ws.id
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                      onClick={() => setWelcomeStyle(ws.id)}
                    >
                      {ws.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* New Member Actions */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  New Member Actions
                </label>
                <div className="flex flex-wrap gap-2">
                  {MEMBER_ACTIONS.map((act) => {
                    const enabled = actions.includes(act.id);
                    return (
                      <button
                        key={act.id}
                        type="button"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          enabled
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-200"
                            : "border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                        }`}
                        onClick={() => toggleAction(act.id)}
                      >
                        {enabled ? "\u2713 " : ""}{act.label}
                      </button>
                    );
                  })}
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
                  Optional Custom Fields
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Rules channel name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="#rules"
                      value={optionalFields.rulesChannel || ""}
                      onChange={(e) => handleOptionalChange("rulesChannel", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Role channel name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="#roles"
                      value={optionalFields.roleChannel || ""}
                      onChange={(e) => handleOptionalChange("roleChannel", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Application channel name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="#apply"
                      value={optionalFields.applicationChannel || ""}
                      onChange={(e) => handleOptionalChange("applicationChannel", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Support channel name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="#support"
                      value={optionalFields.supportChannel || ""}
                      onChange={(e) => handleOptionalChange("supportChannel", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Extra community note
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="Any additional information for new members..."
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
                  Generate Welcome Message
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

            {/* A. Full Welcome Message */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  A. Full Welcome Message
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.fullMessage}
                </pre>
              </div>
            </section>

            {/* B. Short Welcome Version */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  B. Short Welcome Version
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.shortVersion}
                </pre>
              </div>
            </section>

            {/* C. Pinned Onboarding Message */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  C. Pinned Onboarding Message
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.pinnedVersion}
                </pre>
              </div>
            </section>

            {/* D. Staff-Friendly Version */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  D. Staff-Friendly Version
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.staffVersion}
                </pre>
              </div>
            </section>
          </>
        )}

        {/* SEO Content Sections */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Discord Welcome Message Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name or leave it blank to use "our Discord server".</li>
              <li>Select your community type — gaming, Minecraft, Project Zomboid, Valheim, or general.</li>
              <li>Choose a welcome style that matches your server culture: short, detailed, community-first, or cozy.</li>
              <li>Pick the actions new members should take: read rules, choose roles, introduce themselves, and more.</li>
              <li>Toggle optional features like emojis, channel placeholders, and helpful notes.</li>
              <li>Fill in optional fields like channel names or extra community notes.</li>
              <li>Click "Generate Welcome Message" and copy the output that fits your needs.</li>
            </ol>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              What Should a Discord Welcome Message Include?
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              A good Discord welcome message sets the tone for your entire community. It should
              greet the new member warmly, point them to the rules channel, explain what steps
              they should take next, and let them know where to go if they need help. Include
              channel mentions for rules, roles, and support so new members can find everything
              easily. A welcome message that is clear and friendly reduces confusion, helps new
              members feel comfortable, and encourages them to participate from day one.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Discord Onboarding Message Examples
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Short and friendly</h3>
                <p className="mt-1">
                  A quick welcome with a link to rules and a prompt to introduce themselves.
                  Best for active communities where members jump right into conversation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Detailed onboarding</h3>
                <p className="mt-1">
                  A step-by-step guide covering rules, roles, introductions, and how to get
                  help. Best for larger servers with multiple channels and systems.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Community-first</h3>
                <p className="mt-1">
                  Emphasizes belonging and participation. Encourages new members to introduce
                  themselves, share their interests, and get involved in community events.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Cozy / chill</h3>
                <p className="mt-1">
                  A relaxed, low-pressure welcome. Tells new members to take their time, look
                  around, and join conversations when they feel ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Welcome Messages for Gaming Communities
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Gaming communities should tailor their welcome messages to their specific game
              and culture. For Minecraft servers, include instructions on whitelist applications
              and server IP. For Project Zomboid servers, mention PvP rules and safehouse
              etiquette. For Valheim communities, guide new members to role selection and build
              rules. Roleplay servers should include lore and character creation steps. Whatever
              your community type, a warm welcome sets the foundation for a positive member
              experience.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Helping New Members Settle In
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Make the first step easy</h3>
                <p className="mt-1">
                  Give new members one clear action to take first — usually reading the rules
                  or introducing themselves. Too many steps at once can be overwhelming.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Assign a welcome role</h3>
                <p className="mt-1">
                  Use a bot or manual process to give new members a temporary role that grants
                  access to limited channels. This prevents spam and gives them space to learn
                  the server before they have full access.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Encourage introductions</h3>
                <p className="mt-1">
                  A dedicated introductions channel where new members can post about themselves
                  helps the community get to know them and makes them feel welcome.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Have staff reach out</h3>
                <p className="mt-1">
                  A quick welcome from a staff member or community member can make a huge
                  difference in whether a new member stays and participates.
                </p>
              </div>
            </div>
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
                  Should I use a bot for welcome messages?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes, bots like MEE6, Carl-bot, or Dyno can automatically send welcome
                  messages when new members join. Use the full message from this generator
                  as your bot's welcome message template.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How long should a welcome message be?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Keep it concise. A short and friendly message works for most servers.
                  Detailed onboarding is better for larger communities with multiple channels
                  and systems. You can always include both — a short version in the welcome
                  channel and a pinned message with full details.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What channels should I mention in a welcome message?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  At minimum, mention the rules channel and an introductions channel. If your
                  server has role selection, mention that too. Support and announcement channels
                  are helpful additions.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use this tool for private Discord servers?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Absolutely. Select "Private Friends Server" as your community type and
                  choose a welcome style that fits your group. The messages work for any
                  type of Discord server.
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

        <RelatedTools currentToolId="discord-welcome-message-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default DiscordWelcomeMessageGenerator;
