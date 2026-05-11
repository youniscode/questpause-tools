import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Minecraft Whitelist Application Generator | QUESTPAUSE Tools",
  description:
    "Generate Minecraft whitelist application forms, Discord application templates, player screening questions, staff checklists, and approval messages for SMP and whitelist servers.",
};

const SERVER_TYPES = [
  { id: "small-survival-smp", label: "Small Survival SMP" },
  { id: "whitelist-survival", label: "Whitelist Survival Server" },
  { id: "vanilla-survival", label: "Vanilla Survival" },
  { id: "modded-survival", label: "Modded Survival" },
  { id: "pve-community", label: "PvE Community" },
  { id: "family-friendly", label: "Family-Friendly Server" },
  { id: "long-term-world", label: "Long-Term World" },
  { id: "private-friends", label: "Private Friends Server" },
];

const APPLICATION_STYLES = [
  { id: "short", label: "Short and simple" },
  { id: "balanced", label: "Balanced" },
  { id: "detailed", label: "Detailed" },
  { id: "mature", label: "Mature community" },
  { id: "family-friendly", label: "Family-friendly" },
  { id: "roleplay", label: "Roleplay-friendly" },
];

const PLATFORMS = [
  { id: "discord-form", label: "Discord Form" },
  { id: "google-form", label: "Google Form" },
  { id: "forum-post", label: "Forum Post" },
  { id: "copy-paste", label: "Copy-paste Application" },
  { id: "short-dm", label: "Short DM Application" },
];

const QUESTION_CATEGORIES = [
  { id: "minecraft-username", label: "Minecraft username" },
  { id: "age", label: "Age or age range" },
  { id: "country", label: "Country / timezone" },
  { id: "experience", label: "Minecraft experience" },
  { id: "playstyle", label: "Playstyle" },
  { id: "activity", label: "Weekly activity" },
  { id: "why-join", label: "Why they want to join" },
  { id: "rules-agreement", label: "Rules agreement" },
  { id: "griefing-policy", label: "Griefing / stealing policy" },
  { id: "discord-username", label: "Discord username" },
  { id: "voice-chat", label: "Voice chat preference" },
  { id: "red-flags", label: "Red flags / banned history" },
  { id: "favorite-activity", label: "Favorite Minecraft activity" },
  { id: "long-term-fit", label: "Long-term community fit" },
];

const DEFAULT_TOGGLES = [
  "minecraft-username",
  "age",
  "experience",
  "playstyle",
  "activity",
  "why-join",
  "rules-agreement",
  "griefing-policy",
  "discord-username",
];

const QUESTIONS_MAP = {
  "minecraft-username": "What is your Minecraft username?",
  age: "What is your age or age range?",
  country: "What country / timezone are you in?",
  experience: "How long have you been playing Minecraft?",
  playstyle: "How would you describe your playstyle? (builder, explorer, redstoner, farmer, etc.)",
  activity: "How many hours per week can you play?",
  "why-join": "Why do you want to join our server?",
  "rules-agreement": "Do you agree to follow the server rules?",
  "griefing-policy": "What is your stance on griefing and stealing?",
  "discord-username": "What is your Discord username?",
  "voice-chat": "Are you comfortable using voice chat?",
  "red-flags": "Have you ever been banned from a Minecraft server? If so, why?",
  "favorite-activity": "What is your favorite thing to do in Minecraft?",
  "long-term-fit": "Are you looking for a long-term community to play with?",
};

function getQuestionsForStyle(style, toggles) {
  const selected = QUESTION_CATEGORIES.filter((c) => toggles.has(c.id));
  if (style === "short") return selected.slice(0, 5);
  if (style === "balanced") return selected.slice(0, 8);
  return selected;
}

function generateFullForm(serverName, serverType, style, platform, toggles, optional) {
  const questions = getQuestionsForStyle(style, toggles);
  const typeLabel = SERVER_TYPES.find((t) => t.id === serverType)?.label || serverType;
  const parts = [];

  parts.push(`# ${serverName} — Whitelist Application`);
  parts.push("");
  parts.push(`Thank you for your interest in joining ${serverName}!`);
  parts.push(`Please fill out this application to be considered for our ${typeLabel}.`);
  parts.push("");

  if (optional.minAge) {
    parts.push(`**Note:** ${optional.minAge}`);
    parts.push("");
  }

  if (optional.rulesLink) {
    parts.push(`Please read the server rules: ${optional.rulesLink}`);
    parts.push("");
  }

  parts.push("---");
  parts.push("## Application Questions");
  parts.push("");

  questions.forEach((q, i) => {
    parts.push(`**${i + 1}. ${QUESTIONS_MAP[q.id]}**`);
    parts.push("");
    parts.push("```");
    parts.push("");
    parts.push("```");
    parts.push("");
  });

  parts.push("---");

  if (optional.extraNote) {
    parts.push(`**Additional note:** ${optional.extraNote}`);
    parts.push("");
  }

  if (optional.reviewTime) {
    parts.push(`Applications are reviewed within: ${optional.reviewTime}`);
    parts.push("");
  }

  if (optional.discordChannel) {
    parts.push(`Submit your application in: ${optional.discordChannel}`);
    parts.push("");
  }

  parts.push("---");
  parts.push("*Thank you for applying! We will review your application and get back to you.*");

  return parts.join("\n");
}

function generateDiscordVersion(serverName, serverType, style, toggles, optional) {
  const questions = getQuestionsForStyle(style, toggles);
  const parts = [];

  parts.push(`**${serverName} — Whitelist Application**`);
  parts.push("");
  parts.push(`> Thank you for your interest in joining ${serverName}!`);
  parts.push(`> Please answer the following questions:`);
  parts.push("");

  questions.forEach((q, i) => {
    parts.push(`**${i + 1}. ${QUESTIONS_MAP[q.id]}**`);
    parts.push("*Your answer:* ");
    parts.push("");
  });

  parts.push("");
  if (optional.rulesLink) {
    parts.push(`:book: Server rules: ${optional.rulesLink}`);
  }
  if (optional.discordChannel) {
    parts.push(`:inbox_tray: Submit in: ${optional.discordChannel}`);
  }
  if (optional.reviewTime) {
    parts.push(`:hourglass: Review time: ${optional.reviewTime}`);
  }

  return parts.join("\n");
}

function generateStaffChecklist() {
  return [
    "## Staff Review Checklist",
    "",
    "- [ ] Username provided",
    "- [ ] Player understands rules",
    "- [ ] No griefing/stealing agreement",
    "- [ ] Playstyle fits the server",
    "- [ ] Timezone/activity level noted",
    "- [ ] Needs follow-up",
    "- [ ] Approved / Denied",
    "",
    "---",
    "**Decision:**",
    "",
    "- [ ] Approved",
    "- [ ] Denied",
    "",
    "**Staff notes:**",
    "```",
    "",
    "```",
  ].join("\n");
}

function generateAcceptanceMessage(serverName) {
  return [
    `**Welcome to ${serverName}!**`,
    "",
    `Hello! Your whitelist application has been reviewed and **approved**.`,
    "",
    `You have been accepted to join ${serverName}. Please check the server access channel or wait for connection details to be shared.`,
    "",
    "Here are a few things to do next:",
    "- Read the server rules if you haven't already",
    "- Introduce yourself to the community",
    "- Make sure you have the latest version of Minecraft",
    "",
    `We look forward to seeing you on ${serverName}!`,
    "",
    "*— Server Staff*",
  ].join("\n");
}

function generateRejectionMessage(serverName) {
  return [
    `**${serverName} — Application Status**`,
    "",
    `Thank you for taking the time to apply to join ${serverName}.`,
    "",
    "After careful review, we regret to inform you that your application has **not been accepted** at this time.",
    "",
    "This does not mean you cannot apply again in the future. If your situation changes or you would like to reapply at a later date, you are welcome to do so.",
    "",
    "We appreciate your interest and wish you the best of luck finding a server that is the right fit for you.",
    "",
    "*— Server Staff*",
  ].join("\n");
}

function MinecraftWhitelistApplicationGenerator() {
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState("small-survival-smp");
  const [appStyle, setAppStyle] = useState("balanced");
  const [platform, setPlatform] = useState("discord-form");
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

  const resolvedName = serverName.trim() || "our Minecraft server";

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
      minAge: optionalFields.minAge || "",
      discordChannel: optionalFields.discordChannel || "",
      rulesLink: optionalFields.rulesLink || "",
      reviewTime: optionalFields.reviewTime || "",
      extraNote: optionalFields.extraNote || "",
    };

    setGenerated({
      fullForm: generateFullForm(resolvedName, serverType, appStyle, platform, toggles, optional),
      discordVersion: generateDiscordVersion(resolvedName, serverType, appStyle, toggles, optional),
      staffChecklist: generateStaffChecklist(),
      acceptanceMessage: generateAcceptanceMessage(resolvedName),
      rejectionMessage: generateRejectionMessage(resolvedName),
    });
  }, [resolvedName, serverType, appStyle, platform, toggles, optionalFields]);

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
      "=== FULL APPLICATION FORM ===",
      generated.fullForm,
      "",
      "=== DISCORD VERSION ===",
      generated.discordVersion,
      "",
      "=== STAFF CHECKLIST ===",
      generated.staffChecklist,
      "",
      "=== ACCEPTANCE MESSAGE ===",
      generated.acceptanceMessage,
      "",
      "=== REJECTION MESSAGE ===",
      generated.rejectionMessage,
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
    setServerType("small-survival-smp");
    setAppStyle("balanced");
    setPlatform("discord-form");
    setToggles(new Set(DEFAULT_TOGGLES));
    setOptionalFields({});
    setGenerated(null);
    setShowClearConfirm(false);
  }, []);

  const copyButtons = generated && [
    { key: "fullForm", label: "Copy Full Form" },
    { key: "discordVersion", label: "Copy Discord Version" },
    { key: "staffChecklist", label: "Copy Staff Checklist" },
    { key: "acceptanceMessage", label: "Copy Acceptance Message" },
    { key: "rejectionMessage", label: "Copy Rejection Message" },
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
              Minecraft Whitelist Application Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate whitelist application forms, Discord templates, player screening questions, staff checklists, and approval messages.
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
                  placeholder="Enter your server name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-slate-500">
                  If empty, "our Minecraft server" will be used.
                </p>
              </div>

              {/* Server Type */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Server Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {SERVER_TYPES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        serverType === st.id
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                      onClick={() => setServerType(st.id)}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Application Style */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Application Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {APPLICATION_STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        appStyle === s.id
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                      onClick={() => setAppStyle(s.id)}
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

              {/* Question Categories */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Question Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUESTION_CATEGORIES.map((qc) => {
                    const enabled = toggles.has(qc.id);
                    return (
                      <button
                        key={qc.id}
                        type="button"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          enabled
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-200"
                            : "border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                        }`}
                        onClick={() => handleToggle(qc.id)}
                      >
                        {enabled ? "\u2713 " : ""}{qc.label}
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
                      Minimum age note
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="e.g. Must be 16+"
                      value={optionalFields.minAge || ""}
                      onChange={(e) => handleOptionalChange("minAge", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Discord channel name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="e.g. #apply"
                      value={optionalFields.discordChannel || ""}
                      onChange={(e) => handleOptionalChange("discordChannel", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Server rules link
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="https://..."
                      value={optionalFields.rulesLink || ""}
                      onChange={(e) => handleOptionalChange("rulesLink", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Review time
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="e.g. Within 24 hours"
                      value={optionalFields.reviewTime || ""}
                      onChange={(e) => handleOptionalChange("reviewTime", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Extra server note
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="Any additional information for applicants..."
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
                  Generate Application
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

            {/* A. Full Application Form */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  A. Full Whitelist Application Form
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.fullForm}
                </pre>
              </div>
            </section>

            {/* B. Short Discord Version */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  B. Short Discord Version
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.discordVersion}
                </pre>
              </div>
            </section>

            {/* C. Staff Review Checklist */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  C. Staff Review Checklist
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.staffChecklist}
                </pre>
              </div>
            </section>

            {/* D. Acceptance Message */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  D. Acceptance Message
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.acceptanceMessage}
                </pre>
              </div>
            </section>

            {/* E. Rejection Message */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  E. Rejection Message
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.rejectionMessage}
                </pre>
              </div>
            </section>
          </>
        )}

        {/* SEO Content Sections */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Minecraft Whitelist Application Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name or leave it blank to use "our Minecraft server".</li>
              <li>Select your server type — SMP, whitelist survival, modded, PvE, or family-friendly.</li>
              <li>Choose an application style: short, balanced, detailed, or family-friendly.</li>
              <li>Pick the platform where the application will be used: Discord, Google Forms, forum, or DM.</li>
              <li>Toggle the question categories you want to include in your application.</li>
              <li>Fill in optional fields like minimum age, Discord channel, rules link, or review time.</li>
              <li>Click "Generate Application" and copy the output that fits your needs.</li>
            </ol>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              What to Ask in a Minecraft Whitelist Application
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              A good whitelist application helps server owners screen players before they join.
              Essential questions include the player's Minecraft username, age or age range,
              playstyle, how many hours they can play per week, and why they want to join your
              server. You should also ask for a rules agreement and a clear stance on griefing
              and stealing. These questions help you build a safe, respectful community where
              players actually read the rules and understand what kind of server they are joining.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Minecraft SMP Application Questions
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              For Survival Multiplayer (SMP) servers, focus your application questions on
              playstyle compatibility and long-term fit. Ask about building style, redstone
              experience, interest in community projects, and whether the player is looking
              for a long-term world. SMP servers thrive when members share similar goals and
              respect each other's builds. Including a question about previous server experience
              helps you identify players who understand community etiquette.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Review Whitelist Applications Fairly
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Check for completeness</h3>
                <p className="mt-1">
                  Make sure the applicant answered all required questions. Incomplete
                  applications may indicate low effort or lack of interest.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Look for red flags</h3>
                <p className="mt-1">
                  Watch for vague answers, refusal to agree to rules, or history of bans.
                  Trust your instincts when something feels off.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Consider playstyle fit</h3>
                <p className="mt-1">
                  A great player for one server may not fit another. Match the applicant's
                  playstyle and goals to your server's culture and community.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Use the staff checklist</h3>
                <p className="mt-1">
                  Our generated staff checklist ensures your team reviews every application
                  consistently and doesn't miss important details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Be respectful in responses</h3>
                <p className="mt-1">
                  Whether you approve or deny an application, respond politely. A respectful
                  rejection leaves the door open for future applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Example Minecraft Whitelist Application
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Here is an example output for a Survival SMP server with balanced questions:
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`# My Survival Server — Whitelist Application

Thank you for your interest in joining My Survival Server!
Please fill out this application to be considered for our Small Survival SMP.

---

## Application Questions

**1. What is your Minecraft username?**



**2. What is your age or age range?**



**3. How long have you been playing Minecraft?**



**4. How would you describe your playstyle?**



**5. How many hours per week can you play?**



**6. Why do you want to join our server?**



**7. Do you agree to follow the server rules?**



**8. What is your stance on griefing and stealing?**



---

*Thank you for applying! We will review your application and get back to you.*`}
              </pre>
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
                  What is a Minecraft whitelist application?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  A whitelist application is a form that players fill out to request access
                  to a private or whitelisted Minecraft server. It helps server owners screen
                  applicants and build a trusted community.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What questions should I include in a whitelist application?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                Include the player's Minecraft username, age, playstyle, activity level,
                  reason for joining, rules agreement, and griefing policy stance. These
                  questions help you assess whether the player is a good fit.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How do I review whitelist applications?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Use the staff review checklist generated by this tool. Check for complete
                  answers, red flags, playstyle compatibility, and rules agreement. Discuss
                  borderline applications with your staff team.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What should I say when rejecting a whitelist application?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Be polite and respectful. Let the player know their application was not
                  accepted at this time, but keep the door open for future reapplications.
                  Our tool generates professional rejection messages for you.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use this tool for Discord applications?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Select "Discord Form" as your platform and you will get a
                  Discord-friendly formatted application that players can fill out directly
                  in your Discord server.
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

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Related Tools
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              If you are setting up a whitelist server, these related tools can help you
              manage the rest of your server setup:
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm leading-6 text-slate-300 list-disc pl-5">
              <li>
                <a href="/tools/minecraft-whitelist-command-generator" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                  Minecraft Whitelist Command Generator
                </a>{" "}
                — Generate whitelist, op, ban, and kick commands.
              </li>
              <li>
                <a href="/tools/minecraft-server-rules-generator" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                  Minecraft Server Rules Generator
                </a>{" "}
                — Create clear server rules for your community.
              </li>
              <li>
                <a href="/tools/minecraft-lfg-post-generator" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                  Minecraft LFG Post Generator
                </a>{" "}
                — Write player recruitment posts for Reddit and Discord.
              </li>
              <li>
                <a href="/tools/minecraft-motd-generator" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                  Minecraft MOTD Generator
                </a>{" "}
                — Create a server MOTD and server list description.
              </li>
            </ul>
          </div>
        </section>

        <RelatedTools currentToolId="minecraft-whitelist-application-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default MinecraftWhitelistApplicationGenerator;
