import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Minecraft MOTD Generator | QUESTPAUSE Tools",
  description:
    "Generate Minecraft MOTDs, server descriptions, color-code friendly server list text, Discord welcome messages, and short promotional text for Minecraft servers.",
};

const SERVER_TYPES = [
  { id: "survival-smp", label: "Survival SMP" },
  { id: "whitelist-survival", label: "Whitelist Survival" },
  { id: "vanilla-survival", label: "Vanilla Survival" },
  { id: "modded-survival", label: "Modded Survival" },
  { id: "pve-community", label: "PvE Community" },
  { id: "building-server", label: "Building Server" },
  { id: "family-friendly", label: "Family-Friendly Server" },
  { id: "long-term-world", label: "Long-Term World" },
];

const TONES = [
  { id: "friendly", label: "Friendly" },
  { id: "epic", label: "Epic" },
  { id: "chill", label: "Chill" },
  { id: "mature", label: "Mature" },
  { id: "short", label: "Short and clean" },
  { id: "community", label: "Community-first" },
];

const MOTD_STYLES = [
  { id: "simple", label: "Simple text" },
  { id: "color", label: "Color-code friendly" },
  { id: "server-list", label: "Server list description" },
  { id: "discord", label: "Discord welcome version" },
  { id: "promo", label: "Short promotional version" },
];

const TOGGLE_OPTIONS = [
  { id: "whitelist", label: "Mention whitelist" },
  { id: "discord", label: "Mention Discord" },
  { id: "long-term", label: "Mention long-term world" },
  { id: "no-griefing", label: "Mention no griefing" },
  { id: "fresh-world", label: "Mention fresh world" },
  { id: "beginner-friendly", label: "Mention beginner friendly" },
  { id: "community-builds", label: "Mention community builds" },
  { id: "economy", label: "Mention survival economy" },
  { id: "small-group", label: "Mention small group" },
];

const COLOR_CODES = [
  { code: "&0", name: "black", hex: "#000000" },
  { code: "&1", name: "dark blue", hex: "#0000AA" },
  { code: "&2", name: "dark green", hex: "#00AA00" },
  { code: "&3", name: "dark aqua", hex: "#00AAAA" },
  { code: "&4", name: "dark red", hex: "#AA0000" },
  { code: "&5", name: "dark purple", hex: "#AA00AA" },
  { code: "&6", name: "gold", hex: "#FFAA00" },
  { code: "&7", name: "gray", hex: "#AAAAAA" },
  { code: "&8", name: "dark gray", hex: "#555555" },
  { code: "&9", name: "blue", hex: "#5555FF" },
  { code: "&a", name: "green", hex: "#55FF55" },
  { code: "&b", name: "aqua", hex: "#55FFFF" },
  { code: "&c", name: "red", hex: "#FF5555" },
  { code: "&d", name: "light purple", hex: "#FF55FF" },
  { code: "&e", name: "yellow", hex: "#FFFF55" },
  { code: "&f", name: "white", hex: "#FFFFFF" },
  { code: "&l", name: "bold", hex: "" },
  { code: "&o", name: "italic", hex: "" },
  { code: "&r", name: "reset", hex: "" },
];

const TONE_TAGLINES = {
  friendly: "A friendly Minecraft community waiting for you.",
  epic: "Adventure awaits. Build. Explore. Survive.",
  chill: "Just a chill place to play Minecraft.",
  mature: "A mature Minecraft community for serious builders.",
  short: "Play. Build. Explore.",
  community: "Built by the community, for the community.",
};

const TONE_INTROS = {
  friendly: "Welcome to",
  epic: "Step into",
  chill: "Relax and play on",
  mature: "Join",
  short: "Play on",
  community: "Welcome to the community of",
};

function getToggleTag(id) {
  const labels = {
    whitelist: "Whitelist enabled",
    discord: "Discord community",
    "long-term": "Long-term world",
    "no-griefing": "No griefing",
    "fresh-world": "Fresh world",
    "beginner-friendly": "Beginner friendly",
    "community-builds": "Community builds",
    economy: "Survival economy",
    "small-group": "Small group",
  };
  return labels[id] || "";
}

function generateMOTD(name, type, tone, style, toggles, version, language, playerCount, extraNote) {
  const serverName = name.trim() || "our Minecraft server";
  const typeLabel = SERVER_TYPES.find((t) => t.id === type)?.label || "Minecraft server";
  const tagline = TONE_TAGLINES[tone] || TONE_TAGLINES.friendly;
  const intro = TONE_INTROS[tone] || TONE_INTROS.friendly;
  const activeToggleIds = Object.entries(toggles).filter(([, v]) => v).map(([k]) => k);
  const tagBits = activeToggleIds.map(getToggleTag).filter(Boolean);

  if (style === "simple") {
    const lines = [
      `${intro} ${serverName}!`,
      `${typeLabel} — ${tagline}`,
    ];
    if (version.trim()) lines.push(`Version: ${version.trim()}`);
    if (tagBits.length > 0) lines.push(tagBits.join(" | "));
    if (extraNote.trim()) lines.push(extraNote.trim());
    if (playerCount.trim()) lines.push(`Aiming for ${playerCount.trim()} players`);
    return lines.join("\n");
  }

  if (style === "color") {
    const lines = [
      `&6${intro} &e${serverName}&6!`,
      `&7${typeLabel} &8— &f${tagline}`,
    ];
    if (version.trim()) lines.push(`&7Version: &f${version.trim()}`);
    if (tagBits.length > 0) lines.push(`&7${tagBits.join(" &8| &7")}`);
    if (extraNote.trim()) lines.push(`&7${extraNote.trim()}`);
    if (playerCount.trim()) lines.push(`&7Aiming for &f${playerCount.trim()} &7players`);
    if (language.trim()) lines.push(`&7Language: &f${language.trim()}`);
    return lines.join("\n");
  }

  if (style === "server-list") {
    const lines = [
      `--- ${serverName} ---`,
      `${typeLabel} | ${tagline}`,
    ];
    if (version.trim()) lines.push(`Version: ${version.trim()}`);
    if (tagBits.length > 0) lines.push(tagBits.join(" | "));
    if (extraNote.trim()) lines.push(extraNote.trim());
    if (playerCount.trim()) lines.push(`Players: ${playerCount.trim()}`);
    return lines.join("\n");
  }

  if (style === "discord") {
    const lines = [
      `**${serverName}**`,
      `*${typeLabel}*`,
      "",
      tagline,
      "",
    ];
    if (version.trim()) lines.push(`📦 Version: ${version.trim()}`);
    if (tagBits.length > 0) lines.push(`🏷️ ${tagBits.join(" · ")}`);
    if (extraNote.trim()) lines.push(`💬 ${extraNote.trim()}`);
    if (playerCount.trim()) lines.push(`👥 ${playerCount.trim()} players`);
    lines.push("", "Join us and start your adventure!");
    return lines.join("\n");
  }

  if (style === "promo") {
    const lines = [
      `${serverName} — ${typeLabel}`,
      tagline,
    ];
    if (tagBits.length > 0) lines.push(tagBits.join(" | "));
    if (version.trim()) lines.push(version.trim());
    if (extraNote.trim()) lines.push(extraNote.trim());
    return lines.join("\n");
  }

  return "";
}

function generateDescription(serverName, type, tone, toggles, version, language, extraNote) {
  const name = serverName.trim() || "our Minecraft server";
  const typeLabel = SERVER_TYPES.find((t) => t.id === type)?.label || "Minecraft server";
  const tagline = TONE_TAGLINES[tone] || TONE_TAGLINES.friendly;
  const activeToggleIds = Object.entries(toggles).filter(([, v]) => v).map(([k]) => k);
  const tagBits = activeToggleIds.map(getToggleTag).filter(Boolean);

  const lines = [
    `${name} is a ${typeLabel.toLowerCase()} server.`,
    tagline,
  ];
  if (version.trim()) lines.push(`Version: ${version.trim()}`);
  if (tagBits.length > 0) lines.push(tagBits.join(", ") + ".");
  if (language.trim()) lines.push(`Language: ${language.trim()}`);
  if (extraNote.trim()) lines.push(extraNote.trim());
  return lines.join(" ");
}

function generateShortList(name, type, toggles, version) {
  const serverName = name.trim() || "our Minecraft server";
  const activeToggleIds = Object.entries(toggles).filter(([, v]) => v).map(([k]) => k);
  const tagBits = activeToggleIds.map(getToggleTag).filter(Boolean);

  const parts = [serverName];
  if (version.trim()) parts.push(`[${version.trim()}]`);
  if (tagBits.length > 0) parts.push(tagBits.slice(0, 3).join(" "));
  return parts.join(" ");
}

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";

function MinecraftMOTDGenerator() {
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState("survival-smp");
  const [tone, setTone] = useState("friendly");
  const [motdStyle, setMotdStyle] = useState("color");
  const [toggles, setToggles] = useState(() => Object.fromEntries(TOGGLE_OPTIONS.map((t) => [t.id, false])));
  const [version, setVersion] = useState("");
  const [language, setLanguage] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [extraNote, setExtraNote] = useState("");

  const [output, setOutput] = useState({ motd: "", description: "", discord: "", shortList: "" });
  const [copied, setCopied] = useState("");
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const handleToggle = useCallback((id) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleGenerate = useCallback(() => {
    const motd = generateMOTD(serverName, serverType, tone, motdStyle, toggles, version, language, playerCount, extraNote);
    const description = generateDescription(serverName, serverType, tone, toggles, version, language, extraNote);
    const discord = generateMOTD(serverName, serverType, tone, "discord", toggles, version, language, playerCount, extraNote);
    const shortList = generateShortList(serverName, serverType, toggles, version);
    setOutput({ motd, description, discord, shortList });
    setCopied("");
  }, [serverName, serverType, tone, motdStyle, toggles, version, language, playerCount, extraNote]);

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
    setServerType("survival-smp");
    setTone("friendly");
    setMotdStyle("color");
    setToggles(Object.fromEntries(TOGGLE_OPTIONS.map((t) => [t.id, false])));
    setVersion("");
    setLanguage("");
    setPlayerCount("");
    setExtraNote("");
    setOutput({ motd: "", description: "", discord: "", shortList: "" });
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
              Minecraft
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Minecraft MOTD Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Create clean server MOTDs, server list descriptions, color-code friendly
              welcome messages, and short promotional text for your Minecraft server.
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

              {/* MOTD Style */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  MOTD Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOTD_STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        motdStyle === s.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setMotdStyle(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Include in MOTD
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

              {/* Color Code Helper Toggle */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowColors(!showColors)}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                >
                  {showColors ? "Hide color codes" : "Show Minecraft color codes"}
                </button>
                {showColors && (
                  <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-[10px] text-slate-500 mb-2">
                      Use these codes in your MOTD. Prefix with &amp; before the character.
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      {COLOR_CODES.map((c) => (
                        <span
                          key={c.code}
                          className="text-[11px] font-mono text-slate-300"
                          style={c.hex ? { color: c.hex } : {}}
                        >
                          {c.code} {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Fields */}
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Optional Details
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Version (e.g. 1.21)"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Language (optional)"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Player count target (optional)"
                  value={playerCount}
                  onChange={(e) => setPlayerCount(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Extra note (optional)"
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
                  Generate MOTD
                </button>
                {output.motd && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.motd, "motd")}
                      disabled={copied === "motd"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "motd"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "bg-indigo-500 text-white hover:bg-indigo-400"
                      }`}
                    >
                      {copied === "motd" ? "Copied!" : "Copy MOTD"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.description, "desc")}
                      disabled={copied === "desc"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "desc"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "desc" ? "Copied!" : "Copy Description"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.discord, "disc")}
                      disabled={copied === "disc"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "disc"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "disc" ? "Copied!" : "Copy Discord Version"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(
                        [
                          "--- MOTD ---",
                          output.motd,
                          "",
                          "--- Description ---",
                          output.description,
                          "",
                          "--- Discord Welcome ---",
                          output.discord,
                          "",
                          "--- Short List ---",
                          output.shortList,
                        ].join("\n"),
                        "all"
                      )}
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
              {output.motd && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Minecraft MOTD Version
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.motd}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Plain Text Server Description
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.description}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Discord Welcome Version
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.discord}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Short Server List Version
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.shortList}
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
              How to Use This Minecraft MOTD Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name (or leave blank for &ldquo;our Minecraft server&rdquo;).</li>
              <li>Select your server type to set the right context.</li>
              <li>Choose a tone that matches your server&rsquo;s vibe.</li>
              <li>Pick a MOTD style &mdash; simple text, color-coded, server list, Discord, or promotional.</li>
              <li>Toggle the features you want to highlight in your description.</li>
              <li>Open the color code helper to add Minecraft color codes to your MOTD.</li>
              <li>Click <strong className="text-slate-100">Generate MOTD</strong> to preview all versions.</li>
              <li>Use the copy buttons to grab the MOTD, description, Discord version, or all at once.</li>
            </ol>
          </div>
        </section>

        {/* What is a MOTD */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              What Is a Minecraft MOTD?
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              The MOTD (Message of the Day) is the text that appears below your server name in
              the Minecraft server list. It is the first thing players see when browsing for a
              server to join. A good MOTD catches attention, communicates the server type, and
              sets expectations for new players.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              MOTDs can include color codes using the &amp; symbol, which allows you to create
              visually appealing text. The first line is the top line and the second line is the
              bottom line in the server list view.
            </p>
          </div>
        </section>

        {/* Color Codes Explained */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Minecraft MOTD Color Codes Explained
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Minecraft uses the &amp; symbol followed by a character to change text color and
              formatting in MOTDs. For example, &amp;6 produces gold text, &amp;b produces aqua,
              and &amp;l makes text bold. You can combine codes like &amp;6&amp;l for bold gold text.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              The &amp;r code resets all formatting back to default white text. Use it to switch
              colors mid-line. Formatting codes like &amp;l (bold) and &amp;o (italic) can be
              combined with color codes but must come after the color code.
            </p>
          </div>
        </section>

        {/* Examples */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Examples of Minecraft Server Descriptions
            </h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`&6Welcome to &eMy Survival SMP&6!
&7Survival SMP &8— &fA friendly Minecraft community waiting for you.`}
                </pre>
                <p className="mt-2 text-[11px] text-slate-500">Color-coded MOTD for a Survival SMP server</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`My Whitelist Server
Whitelist Survival | A mature Minecraft community for serious builders.`}
                </pre>
                <p className="mt-2 text-[11px] text-slate-500">Simple server list description</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`**Modded Fun Server**
*Modded Survival*

Adventure awaits. Build. Explore. Survive.

🏷️ Discord community · Beginner friendly
Join us and start your adventure!`}
                </pre>
                <p className="mt-2 text-[11px] text-slate-500">Discord welcome version for a modded server</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Writing a Good Minecraft Server List Message
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Keep the first line punchy
                </h3>
                <p className="mt-1">
                  Players scan server lists quickly. The first line should immediately
                  communicate what makes your server special. Use color codes to make key
                  words stand out.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Include key details on the second line
                </h3>
                <p className="mt-1">
                  Use the second line for server type, version, or features. Keep it concise.
                  Too much text gets cut off in the server list.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Test your MOTD before publishing
                </h3>
                <p className="mt-1">
                  MOTDs can look different depending on the Minecraft version and client
                  settings. Test your MOTD by adding your server and checking how it appears
                  in the multiplayer server list.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Match the tone to your community
                </h3>
                <p className="mt-1">
                  A family-friendly server should feel warm and welcoming. A mature server
                  can be more direct. Let your MOTD reflect the actual culture of your community.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Update your MOTD regularly
                </h3>
                <p className="mt-1">
                  An updated MOTD shows that the server is active. Change it with seasons,
                  updates, or events to keep the server list looking fresh.
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
                  What does MOTD mean in Minecraft?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  MOTD stands for Message of the Day. It is the text displayed under your
                  server name in the Minecraft multiplayer server list.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  How do I add color codes to my MOTD?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Use the &amp; symbol followed by a character code. For example, &amp;6 for
                  gold, &amp;e for yellow, &amp;b for aqua. You can find the full list in
                  the color code helper on this page.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Where do I put the MOTD in my server config?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  The MOTD is set in your <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">server.properties</code> file under the
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300"> motd=</code> field. Paste your generated MOTD after the equals sign.
                  Some hosting panels also have a MOTD field in the server settings.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use formatting like bold and italic?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Use &amp;l for bold and &amp;o for italic. Combine them with color
                  codes like &amp;6&amp;l for bold gold text.
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

        <RelatedTools currentToolId="minecraft-motd-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default MinecraftMOTDGenerator;
