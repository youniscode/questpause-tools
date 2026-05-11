import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Discord Rules Generator | QUESTPAUSE Tools",
  description:
    "Generate Discord server rules for gaming communities, Minecraft servers, Project Zomboid servers, Valheim communities, roleplay groups, and private Discord servers.",
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

const RULE_STYLES = [
  { id: "relaxed", label: "Relaxed" },
  { id: "balanced", label: "Balanced" },
  { id: "strict", label: "Strict" },
  { id: "family-friendly", label: "Family-friendly" },
  { id: "mature", label: "Mature community" },
  { id: "roleplay", label: "Roleplay-friendly" },
];

const TONE_OPTIONS = [
  { id: "friendly", label: "Friendly" },
  { id: "professional", label: "Professional" },
  { id: "short-direct", label: "Short and direct" },
  { id: "community-first", label: "Community-first" },
  { id: "firm-fair", label: "Firm but fair" },
];

const RULE_CATEGORIES = [
  { id: "be-respectful", label: "Be respectful" },
  { id: "no-harassment", label: "No harassment or hate speech" },
  { id: "no-spam", label: "No spam" },
  { id: "no-advertising", label: "No advertising without permission" },
  { id: "no-nsfw", label: "No NSFW content" },
  { id: "no-cheating", label: "No cheating or exploiting" },
  { id: "no-griefing", label: "No griefing or stealing" },
  { id: "follow-staff", label: "Follow staff instructions" },
  { id: "use-channels", label: "Use channels correctly" },
  { id: "voice-respect", label: "Keep voice chat respectful" },
  { id: "no-drama", label: "No drama or public arguments" },
  { id: "protect-privacy", label: "Protect privacy" },
  { id: "report-issues", label: "Report issues to staff" },
  { id: "bilingual", label: "English/French friendly community" },
  { id: "server-rules-apply", label: "Server-specific rules apply" },
];

const DEFAULT_RULES = [
  "be-respectful",
  "no-harassment",
  "no-spam",
  "no-nsfw",
  "follow-staff",
  "use-channels",
  "report-issues",
];

const RULE_TEXTS = {
  "be-respectful": {
    relaxed: "Treat everyone with respect. We are all here to have fun.",
    balanced: "Be respectful to all members. Harassment, discrimination, and personal attacks will not be tolerated.",
    strict: "All members must treat each other with respect at all times. Zero tolerance for disrespectful behavior.",
    "family-friendly": "Be kind and respectful to everyone. Our community is welcoming to all ages.",
    mature: "Treat fellow members with respect. We maintain a mature environment where everyone feels safe.",
    roleplay: "Respect all players both in and out of character. Keep OOC interactions civil.",
  },
  "no-harassment": {
    relaxed: "No harassment or hate speech. Keep it fun for everyone.",
    balanced: "Harassment, hate speech, discrimination, and bullying of any kind are strictly prohibited.",
    strict: "Absolutely no harassment, hate speech, slurs, discrimination, or bullying. Violations result in an immediate ban.",
    "family-friendly": "Hurtful language, bullying, or hate speech are not allowed. Report any concerns to staff.",
    mature: "Harassment and hate speech are not tolerated. Disagreements should be handled maturely.",
    roleplay: "Harassment and hate speech are prohibited both in and out of character.",
  },
  "no-spam": {
    relaxed: "Please do not spam messages, mentions, or emoji.",
    balanced: "Do not spam messages, mentions, emoji, or reactions in any channel.",
    strict: "Spamming in any form — messages, mentions, emoji, reactions, or DMs — is forbidden.",
    "family-friendly": "Please avoid spamming. Keep chat readable and friendly for everyone.",
    mature: "Excessive spam is not allowed. Keep chat readable and on-topic.",
    roleplay: "No spamming in RP channels or OOC chat. Keep the experience immersive.",
  },
  "no-advertising": {
    relaxed: "Please ask staff before posting invites or ads.",
    balanced: "No advertising without staff permission. This includes DM invites.",
    strict: "Advertising other servers, services, or content without explicit staff approval is prohibited.",
    "family-friendly": "Please do not share links to other servers without asking staff first.",
    mature: "No unsolicited advertising. Ask staff if you want to share something.",
    roleplay: "No advertising in RP channels. Keep promotions to designated areas with staff approval.",
  },
  "no-nsfw": {
    relaxed: "Keep content PG-13. No NSFW content in public channels.",
    balanced: "NSFW content is not allowed in public channels. Keep all content appropriate.",
    strict: "Zero tolerance for NSFW content anywhere on the server.",
    "family-friendly": "All content must be family-friendly. No adult content, language, or discussions.",
    mature: "NSFW content is only allowed in designated channels if they exist. Keep public channels clean.",
    roleplay: "NSFW content is restricted to appropriate channels. Keep public and RP channels clean.",
  },
  "no-cheating": {
    relaxed: "Cheating, exploiting, and unfair play are not allowed on linked servers.",
    balanced: "Cheating, exploiting, and using unfair advantages are prohibited on any linked game servers.",
    strict: "Any form of cheating, exploiting, hacking, or unfair play results in an immediate permanent ban.",
    "family-friendly": "Play fair. Cheating and exploiting are not allowed on our servers.",
    mature: "Cheating and exploiting are taken seriously. Play fair or find another server.",
    roleplay: "Cheating and exploiting break the immersion. They are not allowed on any linked servers.",
  },
  "no-griefing": {
    relaxed: "Respect other players' builds and belongings on linked game servers.",
    balanced: "Griefing, stealing, and destroying others' builds are not allowed on linked game servers.",
    strict: "Griefing, stealing, raiding, or destroying others' builds will result in an immediate ban from all linked servers.",
    "family-friendly": "Be respectful of others' creations. No griefing or stealing on our servers.",
    mature: "Griefing and stealing are not tolerated. Respect the work of others.",
    roleplay: "Griefing and stealing are only permitted if they fit the RP narrative and are agreed upon. Random destruction is not allowed.",
  },
  "follow-staff": {
    relaxed: "Staff decisions are final. Please follow their instructions.",
    balanced: "Always follow staff instructions. Staff have the final say in all situations.",
    strict: "Staff instructions must be followed immediately and without argument. Disputes can be taken to DMs with an admin.",
    "family-friendly": "Listen to our staff team. They are here to help keep everyone safe and happy.",
    mature: "Respect staff decisions. If you disagree, discuss it privately with an admin.",
    roleplay: "Staff decisions regarding rules are final. RP disputes should be handled through proper channels.",
  },
  "use-channels": {
    relaxed: "Keep conversations in the right channels.",
    balanced: "Use each channel for its intended purpose. Check channel descriptions before posting.",
    strict: "All messages must be posted in the correct channel. Misusing channels may result in a warning.",
    "family-friendly": "Please use each channel for its purpose. This keeps our server organized and fun.",
    mature: "Keep topics in their appropriate channels. Off-topic discussion belongs in general chat.",
    roleplay: "Keep RP in designated RP channels and OOC chat in general channels. Do not mix them.",
  },
  "voice-respect": {
    relaxed: "Be mindful of others in voice chat. No screaming or loud noises.",
    balanced: "Keep voice chat respectful. No screaming, loud music, or disruptive noise.",
    strict: "Voice chat rules are strictly enforced. No disruptive behavior, earrape, or harassment in voice channels.",
    "family-friendly": "Keep voice chat family-friendly. No inappropriate language or loud noises.",
    mature: "Be courteous in voice chat. Respect others' conversations and mute when not speaking.",
    roleplay: "Stay in character in RP voice channels. Use push-to-talk if available.",
  },
  "no-drama": {
    relaxed: "Keep arguments out of public channels. Take it to DMs.",
    balanced: "Public arguments, drama, and personal disputes should be taken to DMs. Keep public chat positive.",
    strict: "Zero tolerance for public drama or arguments. Take all disputes to DMs or staff tickets.",
    "family-friendly": "We keep things positive here. Please take disagreements to private messages.",
    mature: "Handle disagreements maturely. Public callouts and drama are not constructive.",
    roleplay: "IC drama stays IC. OOC disputes should be handled privately and maturely.",
  },
  "protect-privacy": {
    relaxed: "Do not share others' personal information without consent.",
    balanced: "Protect the privacy of all members. Do not share personal information without explicit consent.",
    strict: "Sharing personal information (doxxing) of any member results in an immediate and permanent ban.",
    "family-friendly": "Keep personal information private. Never share details about others without their permission.",
    mature: "Respect privacy. Do not share personal information or DMs without consent.",
    roleplay: "Do not share OOC personal information in RP channels or with other players without consent.",
  },
  "report-issues": {
    relaxed: "See something? Let a staff member know.",
    balanced: "If you see something that breaks the rules, report it to staff through the appropriate channel.",
    strict: "All rule violations must be reported to staff immediately. Do not take matters into your own hands.",
    "family-friendly": "If someone is being unkind or breaking rules, please let a staff member know right away.",
    mature: "Report issues to staff. Do not engage with rule-breakers yourself.",
    roleplay: "Report RP violations to staff through the appropriate channels. Do not metagame or retaliate IC.",
  },
  bilingual: {
    relaxed: "English and French are both welcome here.",
    balanced: "This community supports both English and French. Please be respectful of both languages.",
    strict: "English and French are the official languages. Other languages are allowed in private channels only.",
    "family-friendly": "We welcome English and French speakers. Please be kind to everyone regardless of language.",
    mature: "Both English and French are welcome. Keep conversations in a language everyone in the channel can follow.",
    roleplay: "RP can be conducted in English or French. Please clarify the language for your RP scenes.",
  },
  "server-rules-apply": {
    relaxed: "Our game server rules also apply to Discord conversations about the server.",
    balanced: "All rules from our linked game servers also apply to Discord discussions about those servers.",
    strict: "Game server rules extend to Discord. Violating game rules in Discord discussions is subject to the same consequences.",
    "family-friendly": "The same rules that apply on our game servers also apply here in Discord.",
    mature: "Discord discussions about game servers are still subject to those servers' rules.",
    roleplay: "Server rules apply to all Discord channels, including RP channels. Know the rules before you play.",
  },
};

function generateFullRules(serverName, communityType, ruleStyle, tone, toggles, optional) {
  const selectedRules = RULE_CATEGORIES.filter((c) => toggles.has(c.id));
  const parts = [];

  parts.push(`# ${serverName} — Discord Server Rules`);
  parts.push("");
  parts.push(`Welcome to ${serverName}! Please read and follow these rules to keep our community welcoming and enjoyable for everyone.`);
  parts.push("");

  if (optional.welcomeChannel) {
    parts.push(`:wave: Start here: ${optional.welcomeChannel}`);
    parts.push("");
  }

  if (optional.rulesChannel) {
    parts.push(`:book: Full rules channel: ${optional.rulesChannel}`);
    parts.push("");
  }

  if (optional.serverRulesLink) {
    parts.push(`:crossed_swords: Game server rules: ${optional.serverRulesLink}`);
    parts.push("");
  }

  if (optional.extraNote) {
    parts.push(`> ${optional.extraNote}`);
    parts.push("");
  }

  parts.push("---");
  parts.push("## Rules");
  parts.push("");

  selectedRules.forEach((rule, i) => {
    const text = RULE_TEXTS[rule.id]?.[ruleStyle] || RULE_TEXTS[rule.id]?.balanced || "Follow this rule.";
    parts.push(`**${i + 1}. ${RULE_CATEGORIES.find((c) => c.id === rule.id)?.label}**`);
    parts.push("");
    parts.push(text);
    parts.push("");
  });

  parts.push("---");

  if (optional.supportChannel) {
    parts.push(`:question: Need help? Open a ticket in ${optional.supportChannel}`);
    parts.push("");
  }

  parts.push("*Thank you for being part of our community!*");
  parts.push("");
  parts.push(`*— ${serverName} Staff*`);

  return parts.join("\n");
}

function generateShortRules(serverName, ruleStyle, toggles) {
  const selectedRules = RULE_CATEGORIES.filter((c) => toggles.has(c.id));
  const parts = [];

  parts.push(`**${serverName} — Short Rules**`);
  parts.push("");

  selectedRules.forEach((rule, i) => {
    const text = RULE_TEXTS[rule.id]?.[ruleStyle] || RULE_TEXTS[rule.id]?.balanced || "Follow this rule.";
    parts.push(`${i + 1}. ${text}`);
  });

  return parts.join("\n");
}

function generateWelcomeReminder(serverName, ruleStyle, optional) {
  const parts = [];

  parts.push(`**Welcome to ${serverName}!**`);
  parts.push("");
  parts.push(`Hello and welcome! We are glad to have you here. Before you start chatting, please take a moment to read our server rules in ${optional.rulesChannel || "#rules"}.`);
  parts.push("");

  if (ruleStyle === "family-friendly") {
    parts.push("We are a family-friendly community. Be kind, be respectful, and have fun!");
  } else if (ruleStyle === "relaxed") {
    parts.push("We keep things relaxed here. Just be respectful and enjoy your time with us.");
  } else if (ruleStyle === "strict") {
    parts.push("Please make sure you read and understand all rules before participating. Our staff team is here to help if you have questions.");
  } else {
    parts.push("Make yourself at home, read the rules, and enjoy the community!");
  }

  if (optional.welcomeChannel) {
    parts.push("");
    parts.push(`Say hello in ${optional.welcomeChannel} and introduce yourself!`);
  }

  return parts.join("\n");
}

function generateStaffNote(serverName, ruleStyle) {
  const parts = [];

  parts.push(`**Staff Enforcement Note — ${serverName}**`);
  parts.push("");

  if (ruleStyle === "relaxed") {
    parts.push("Our approach is relaxed but fair. Staff will issue warnings for minor infractions and escalate consequences if behavior does not improve. The goal is to educate, not punish.");
  } else if (ruleStyle === "strict") {
    parts.push("Rules are strictly enforced. Violations may result in immediate warnings, mutes, kicks, or bans depending on severity. Staff decisions are final. Appeals can be submitted through the appropriate channel.");
  } else if (ruleStyle === "family-friendly") {
    parts.push("We maintain a family-friendly environment. Staff will intervene gently at first, but repeated or serious violations will result in consequences. Our priority is keeping everyone safe.");
  } else if (ruleStyle === "mature") {
    parts.push("We expect mature behavior from all members. Staff will handle issues professionally and expect members to handle disagreements the same way. Consequences scale with severity.");
  } else if (ruleStyle === "roleplay") {
    parts.push("RP and OOC rules are enforced separately. Staff will handle OOC violations directly. IC consequences should be handled through RP. Serious OOC violations still result in server action.");
  } else {
    parts.push("Staff will enforce rules consistently and fairly. Warnings are issued first where appropriate. Repeated or serious violations will result in escalating consequences up to a permanent ban.");
  }

  parts.push("");
  parts.push("*— Server Staff*");

  return parts.join("\n");
}

function DiscordRulesGenerator() {
  const [serverName, setServerName] = useState("");
  const [communityType, setCommunityType] = useState("gaming-community");
  const [ruleStyle, setRuleStyle] = useState("balanced");
  const [tone, setTone] = useState("friendly");
  const [toggles, setToggles] = useState(new Set(DEFAULT_RULES));
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
      welcomeChannel: optionalFields.welcomeChannel || "",
      rulesChannel: optionalFields.rulesChannel || "",
      supportChannel: optionalFields.supportChannel || "",
      serverRulesLink: optionalFields.serverRulesLink || "",
      extraNote: optionalFields.extraNote || "",
    };

    setGenerated({
      fullRules: generateFullRules(resolvedName, communityType, ruleStyle, tone, toggles, optional),
      shortRules: generateShortRules(resolvedName, ruleStyle, toggles),
      welcomeReminder: generateWelcomeReminder(resolvedName, ruleStyle, optional),
      staffNote: generateStaffNote(resolvedName, ruleStyle),
    });
  }, [resolvedName, communityType, ruleStyle, tone, toggles, optionalFields]);

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
      "=== FULL DISCORD RULES ===",
      generated.fullRules,
      "",
      "=== SHORT RULES VERSION ===",
      generated.shortRules,
      "",
      "=== WELCOME + RULES REMINDER ===",
      generated.welcomeReminder,
      "",
      "=== STAFF ENFORCEMENT NOTE ===",
      generated.staffNote,
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
    setRuleStyle("balanced");
    setTone("friendly");
    setToggles(new Set(DEFAULT_RULES));
    setOptionalFields({});
    setGenerated(null);
    setShowClearConfirm(false);
  }, []);

  const copyButtons = generated && [
    { key: "fullRules", label: "Copy Full Rules" },
    { key: "shortRules", label: "Copy Short Version" },
    { key: "welcomeReminder", label: "Copy Welcome Reminder" },
    { key: "staffNote", label: "Copy Staff Note" },
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
              Discord Rules Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear Discord rules for gaming communities, survival servers, roleplay groups, private servers, and community hubs.
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
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        ruleStyle === s.id
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                      onClick={() => setRuleStyle(s.id)}
                    >
                      {s.label}
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

              {/* Rule Categories */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Rule Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {RULE_CATEGORIES.map((rc) => {
                    const enabled = toggles.has(rc.id);
                    return (
                      <button
                        key={rc.id}
                        type="button"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          enabled
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-200"
                            : "border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                        }`}
                        onClick={() => handleToggle(rc.id)}
                      >
                        {enabled ? "\u2713 " : ""}{rc.label}
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
                      Welcome channel name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="#welcome"
                      value={optionalFields.welcomeChannel || ""}
                      onChange={(e) => handleOptionalChange("welcomeChannel", e.target.value)}
                    />
                  </div>
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
                      Support / ticket channel
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="#support"
                      value={optionalFields.supportChannel || ""}
                      onChange={(e) => handleOptionalChange("supportChannel", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Game server rules link
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="https://..."
                      value={optionalFields.serverRulesLink || ""}
                      onChange={(e) => handleOptionalChange("serverRulesLink", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Extra community note
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
                      placeholder="Any additional information for your community..."
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
                  Generate Rules
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

            {/* A. Full Discord Rules */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  A. Full Discord Rules Post
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.fullRules}
                </pre>
              </div>
            </section>

            {/* B. Short Rules Version */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  B. Short Rules Version
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.shortRules}
                </pre>
              </div>
            </section>

            {/* C. Welcome + Rules Reminder */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  C. Welcome + Rules Reminder
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.welcomeReminder}
                </pre>
              </div>
            </section>

            {/* D. Staff Enforcement Note */}
            <section className="border-b border-slate-800/80">
              <div className="mx-auto max-w-2xl px-4 py-10">
                <h2 className="text-lg font-semibold text-white mb-4">
                  D. Staff Enforcement Note
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  {generated.staffNote}
                </pre>
              </div>
            </section>
          </>
        )}

        {/* SEO Content Sections */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Discord Rules Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name or leave it blank to use "our Discord server".</li>
              <li>Select your community type — gaming, Minecraft, Project Zomboid, Valheim, or general.</li>
              <li>Choose a rule style that matches your server culture: relaxed, balanced, strict, or family-friendly.</li>
              <li>Pick the tone for your rules: friendly, professional, short, community-first, or firm.</li>
              <li>Toggle the rule categories you want to include in your server rules.</li>
              <li>Fill in optional fields like channel names, rules links, or extra notes.</li>
              <li>Click "Generate Rules" and copy the output that fits your needs.</li>
            </ol>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              What Rules Should a Discord Server Have?
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Every Discord server needs a clear set of rules to maintain a healthy community.
              Essential rules include being respectful to all members, no harassment or hate speech,
              no spamming, no NSFW content in public channels, following staff instructions, and
              using channels correctly. Depending on your community type, you may also need
              game-specific rules about cheating, griefing, or roleplay conduct. Clear rules help
              members understand expectations and make moderation easier for your staff team.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Discord Rules for Gaming Communities
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Gaming communities should include rules about respectful communication during gameplay,
              voice chat etiquette, no cheating or exploiting on linked servers, and no griefing or
              stealing. If your community supports multiple games, make it clear that server-specific
              rules apply to each game. Include rules about reporting issues to staff and handling
              disputes privately. Gaming communities thrive when players feel safe and respected
              both in Discord and in-game.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Discord Rules for Minecraft, Project Zomboid, and Valheim Servers
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Game-specific Discord servers need rules that bridge the gap between Discord and
              in-game behavior. For Minecraft servers, include rules about griefing, stealing,
              and whitelist conduct. For Project Zomboid servers, cover PvP rules, safehouse
              etiquette, and roleplay expectations. For Valheim servers, address ward protection,
              portal rules, and boss progression. Always link your game server rules in the Discord
              rules post so members can easily find them. Our generator makes it easy to include
              all of these with the right rule category toggles.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Enforcing Discord Rules Fairly
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Be consistent</h3>
                <p className="mt-1">
                  Apply the same rules to all members regardless of status, role, or how long
                  they have been in the community. Consistency builds trust.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Warn before punishing</h3>
                <p className="mt-1">
                  Unless the violation is severe, issue a warning first. Give members a chance
                  to correct their behavior before escalating to mutes, kicks, or bans.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Document everything</h3>
                <p className="mt-1">
                  Keep records of warnings, mutes, and bans. Documentation helps resolve disputes
                  and ensures your staff team stays aligned on enforcement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Communicate clearly</h3>
                <p className="mt-1">
                  When taking action, explain which rule was violated and why the action was taken.
                  Clear communication reduces confusion and resentment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Review rules regularly</h3>
                <p className="mt-1">
                  Update your rules as your community grows. What worked for 50 members may not
                  work for 500. Regular reviews keep your rules relevant.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Example Discord Rules Template
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Here is an example output for a gaming community with balanced rules and friendly tone:
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`# My Gaming Community — Discord Server Rules

Welcome to My Gaming Community! Please read and follow these rules to keep our community welcoming and enjoyable for everyone.

---

## Rules

**1. Be respectful**
Treat everyone with respect. We are all here to have fun.

**2. No harassment or hate speech**
Harassment, hate speech, discrimination, and bullying of any kind are strictly prohibited.

**3. No spam**
Do not spam messages, mentions, emoji, or reactions in any channel.

**4. No NSFW content**
NSFW content is not allowed in public channels. Keep all content appropriate.

**5. Follow staff instructions**
Always follow staff instructions. Staff have the final say in all situations.

**6. Use channels correctly**
Use each channel for its intended purpose. Check channel descriptions before posting.

**7. Report issues to staff**
If you see something that breaks the rules, report it to staff through the appropriate channel.

---

*Thank you for being part of our community!*

*— My Gaming Community Staff*`}
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
                  How many rules should my Discord server have?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Aim for 5-10 clear, concise rules. Too few may leave gaps in your code of
                  conduct. Too many may overwhelm new members. Focus on the most important
                  behaviors you want to encourage or prevent.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Should I include game-specific rules in my Discord rules?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. If your Discord server is linked to a game server, include rules about
                  cheating, griefing, and in-game conduct. Link to your full game server rules
                  so members know where to find them.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How do I choose between rule styles?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Consider your community culture. Relaxed rules work for small friend groups.
                  Balanced rules suit most gaming communities. Strict rules are better for
                  large public servers. Family-friendly rules are essential if minors are present.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use this tool for non-gaming Discord servers?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Absolutely. Select "General Community" as your community type and customize
                  the rules to fit your server. The tool works for study groups, hobby communities,
                  professional networks, and more.
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

        <RelatedTools currentToolId="discord-rules-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default DiscordRulesGenerator;
