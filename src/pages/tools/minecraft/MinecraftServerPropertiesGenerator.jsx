import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Minecraft server.properties Generator | QUESTPAUSE Tools",
  description:
    "Generate Minecraft server.properties settings for Java Edition servers, including survival SMPs, whitelist servers, PvE communities, creative worlds, and private servers.",
};

const PROFILES = [
  { id: "survival-smp", label: "Survival SMP" },
  { id: "whitelist-survival", label: "Whitelist Survival" },
  { id: "private-friends", label: "Private Friends Server" },
  { id: "creative-building", label: "Creative Building Server" },
  { id: "pve-community", label: "PvE Community Server" },
  { id: "hardcore-survival", label: "Hardcore Survival" },
  { id: "family-friendly", label: "Family-Friendly Server" },
  { id: "modded-base", label: "Modded Server Base Config" },
];

const PROPERTIES_FIELDS = [
  { key: "motd", label: "Server Name / MOTD", type: "text", default: "A Minecraft Server" },
  { key: "max-players", label: "Max Players", type: "number", default: 20 },
  { key: "server-port", label: "Server Port", type: "number", default: 25565 },
  { key: "spawn-protection", label: "Spawn Protection", type: "number", default: 16 },
  { key: "view-distance", label: "View Distance", type: "number", default: 10 },
  { key: "simulation-distance", label: "Simulation Distance", type: "number", default: 8 },
  { key: "player-idle-timeout", label: "Player Idle Timeout (minutes)", type: "number", default: 0 },
  { key: "max-world-size", label: "Max World Size", type: "number", default: 29999984 },
];

const PROFILE_PRESETS = {
  "survival-smp": {
    difficulty: "normal",
    gamemode: "survival",
    "online-mode": true,
    "white-list": false,
    pvp: true,
    hardcore: false,
    "allow-flight": false,
    "spawn-animals": true,
    "spawn-monsters": true,
    "spawn-npcs": true,
    "enable-command-block": false,
    "force-gamemode": false,
    "enable-status": true,
    "enable-query": false,
    "enable-rcon": false,
    "op-permission-level": 3,
  },
  "whitelist-survival": {
    difficulty: "normal",
    gamemode: "survival",
    "online-mode": true,
    "white-list": true,
    pvp: true,
    hardcore: false,
    "allow-flight": false,
    "spawn-animals": true,
    "spawn-monsters": true,
    "spawn-npcs": true,
    "enable-command-block": false,
    "force-gamemode": true,
    "enable-status": true,
    "enable-query": false,
    "enable-rcon": false,
    "op-permission-level": 3,
  },
  "private-friends": {
    difficulty: "easy",
    gamemode: "survival",
    "online-mode": false,
    "white-list": true,
    pvp: false,
    hardcore: false,
    "allow-flight": false,
    "spawn-animals": true,
    "spawn-monsters": true,
    "spawn-npcs": true,
    "enable-command-block": true,
    "force-gamemode": false,
    "enable-status": true,
    "enable-query": false,
    "enable-rcon": false,
    "op-permission-level": 4,
  },
  "creative-building": {
    difficulty: "peaceful",
    gamemode: "creative",
    "online-mode": true,
    "white-list": false,
    pvp: false,
    hardcore: false,
    "allow-flight": true,
    "spawn-animals": false,
    "spawn-monsters": false,
    "spawn-npcs": true,
    "enable-command-block": true,
    "force-gamemode": true,
    "enable-status": true,
    "enable-query": false,
    "enable-rcon": false,
    "op-permission-level": 3,
  },
  "pve-community": {
    difficulty: "normal",
    gamemode: "survival",
    "online-mode": true,
    "white-list": false,
    pvp: false,
    hardcore: false,
    "allow-flight": false,
    "spawn-animals": true,
    "spawn-monsters": true,
    "spawn-npcs": true,
    "enable-command-block": false,
    "force-gamemode": false,
    "enable-status": true,
    "enable-query": false,
    "enable-rcon": false,
    "op-permission-level": 3,
  },
  "hardcore-survival": {
    difficulty: "hard",
    gamemode: "survival",
    "online-mode": true,
    "white-list": false,
    pvp: true,
    hardcore: true,
    "allow-flight": false,
    "spawn-animals": true,
    "spawn-monsters": true,
    "spawn-npcs": true,
    "enable-command-block": false,
    "force-gamemode": true,
    "enable-status": true,
    "enable-query": false,
    "enable-rcon": false,
    "op-permission-level": 3,
  },
  "family-friendly": {
    difficulty: "easy",
    gamemode: "survival",
    "online-mode": true,
    "white-list": false,
    pvp: false,
    hardcore: false,
    "allow-flight": false,
    "spawn-animals": true,
    "spawn-monsters": true,
    "spawn-npcs": true,
    "enable-command-block": false,
    "force-gamemode": false,
    "enable-status": true,
    "enable-query": false,
    "enable-rcon": false,
    "op-permission-level": 2,
  },
  "modded-base": {
    difficulty: "normal",
    gamemode: "survival",
    "online-mode": true,
    "white-list": false,
    pvp: true,
    hardcore: false,
    "allow-flight": false,
    "spawn-animals": true,
    "spawn-monsters": true,
    "spawn-npcs": true,
    "enable-command-block": true,
    "force-gamemode": false,
    "enable-status": true,
    "enable-query": false,
    "enable-rcon": false,
    "op-permission-level": 3,
  },
};

const PROFILE_EXPLANATIONS = {
  "survival-smp": {
    goodFor: "A balanced multiplayer survival server with standard PvP and exploration.",
    importantSettings: ["motd", "max-players", "difficulty", "pvp", "spawn-protection"],
    securitySettings: ["online-mode", "white-list", "op-permission-level"],
    testSettings: ["view-distance", "simulation-distance", "max-world-size"],
  },
  "whitelist-survival": {
    goodFor: "A private survival community with whitelist access control and enforced gamemode.",
    importantSettings: ["white-list", "online-mode", "force-gamemode", "max-players"],
    securitySettings: ["white-list", "online-mode", "op-permission-level", "enable-query", "enable-rcon"],
    testSettings: ["view-distance", "simulation-distance"],
  },
  "private-friends": {
    goodFor: "A small server for friends with offline-mode support and command blocks enabled.",
    importantSettings: ["online-mode", "white-list", "enable-command-block", "server-port"],
    securitySettings: ["online-mode", "white-list", "op-permission-level"],
    testSettings: ["enable-command-block", "view-distance"],
  },
  "creative-building": {
    goodFor: "A peaceful creative world where players can build freely with flight and command blocks.",
    importantSettings: ["gamemode", "difficulty", "allow-flight", "force-gamemode", "spawn-monsters"],
    securitySettings: ["online-mode", "op-permission-level", "enable-command-block"],
    testSettings: ["view-distance", "max-world-size"],
  },
  "pve-community": {
    goodFor: "A PvE survival server where players cooperate without PvP or griefing concerns.",
    importantSettings: ["pvp", "difficulty", "spawn-protection", "max-players"],
    securitySettings: ["online-mode", "op-permission-level"],
    testSettings: ["view-distance", "simulation-distance"],
  },
  "hardcore-survival": {
    goodFor: "A hardcore survival server where death means a ban or spectator mode.",
    importantSettings: ["hardcore", "difficulty", "pvp", "force-gamemode"],
    securitySettings: ["online-mode", "op-permission-level"],
    testSettings: ["hardcore mode behavior", "view-distance", "simulation-distance"],
  },
  "family-friendly": {
    goodFor: "A safe, easy-difficulty server for younger players and families.",
    importantSettings: ["difficulty", "pvp", "spawn-protection", "max-players"],
    securitySettings: ["online-mode", "op-permission-level", "enable-query"],
    testSettings: ["view-distance", "simulation-distance"],
  },
  "modded-base": {
    goodFor: "A base configuration for modded servers with command blocks enabled.",
    importantSettings: ["enable-command-block", "max-players", "view-distance", "motd"],
    securitySettings: ["online-mode", "op-permission-level", "enable-rcon"],
    testSettings: ["view-distance", "simulation-distance", "max-world-size"],
  },
};

const TOGGLE_KEYS = [
  "online-mode", "white-list", "pvp", "hardcore", "allow-flight",
  "spawn-animals", "spawn-monsters", "spawn-npcs", "enable-command-block",
  "force-gamemode", "enable-status", "enable-query", "enable-rcon",
];

const TOGGLE_LABELS = {
  "online-mode": "Online mode",
  "white-list": "Whitelist enabled",
  pvp: "PvP enabled",
  hardcore: "Hardcore enabled",
  "allow-flight": "Allow flight",
  "spawn-animals": "Spawn animals",
  "spawn-monsters": "Spawn monsters",
  "spawn-npcs": "Spawn NPCs",
  "enable-command-block": "Command blocks enabled",
  "force-gamemode": "Force gamemode",
  "enable-status": "Enable status",
  "enable-query": "Enable query",
  "enable-rcon": "Enable RCON",
};

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";
const selectClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400";

function generateConfig(profileId, fields, toggles, motd, maxPlayers, serverPort, levelName, levelSeed, difficulty, gamemode, opLevel) {
  const preset = PROFILE_PRESETS[profileId] || PROFILE_PRESETS["survival-smp"];
  const lines = [
    "# Minecraft server.properties",
    `# Generated by QUESTPAUSE Tools`,
    `# Profile: ${PROFILES.find((p) => p.id === profileId)?.label || "Custom"}`,
    "",
  ];

  const addField = (key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      lines.push(`${key}=${value}`);
    }
  };

  addField("motd", motd.trim() || "A Minecraft Server");
  addField("max-players", Math.max(1, parseInt(maxPlayers) || 20));
  addField("server-port", Math.max(1, parseInt(serverPort) || 25565));

  lines.push("");
  lines.push("# Difficulty & Gamemode");
  addField("difficulty", difficulty || preset.difficulty);
  addField("gamemode", gamemode || preset.gamemode);
  addField("level-name", levelName.trim() || "world");
  if (levelSeed.trim()) addField("level-seed", levelSeed.trim());

  lines.push("");
  lines.push("# Security & Access");
  for (const key of ["online-mode", "white-list", "pvp", "hardcore", "allow-flight"]) {
    addField(key, toggles[key] !== undefined ? toggles[key] : preset[key]);
  }

  lines.push("");
  lines.push("# World & Gameplay");
  for (const key of ["spawn-animals", "spawn-monsters", "spawn-npcs", "enable-command-block", "force-gamemode"]) {
    addField(key, toggles[key] !== undefined ? toggles[key] : preset[key]);
  }

  lines.push("");
  lines.push("# Server & Networking");
  for (const key of ["enable-status", "enable-query", "enable-rcon"]) {
    addField(key, toggles[key] !== undefined ? toggles[key] : preset[key]);
  }

  lines.push("");
  lines.push("# Protection & Performance");
  addField("spawn-protection", Math.max(0, parseInt(fields["spawn-protection"]) || 16));
  addField("view-distance", Math.max(2, parseInt(fields["view-distance"]) || 10));
  addField("simulation-distance", Math.max(2, parseInt(fields["simulation-distance"]) || 8));
  addField("player-idle-timeout", Math.max(0, parseInt(fields["player-idle-timeout"]) || 0));
  addField("max-world-size", Math.max(1, parseInt(fields["max-world-size"]) || 29999984));
  addField("op-permission-level", Math.max(1, Math.min(4, parseInt(opLevel) || 3)));

  return lines.join("\n");
}

function generateExplanation(profileId, fields, toggles) {
  const preset = PROFILE_PRESETS[profileId] || PROFILE_PRESETS["survival-smp"];
  const profile = PROFILES.find((p) => p.id === profileId);
  const explanation = PROFILE_EXPLANATIONS[profileId] || PROFILE_EXPLANATIONS["survival-smp"];

  const lines = [
    `Profile: ${profile?.label || "Custom"}`,
    "",
    `Best for: ${explanation.goodFor}`,
    "",
    "--- Important Settings ---",
    ...explanation.importantSettings.map((s) => {
      const label = TOGGLE_LABELS[s] || PROPERTIES_FIELDS.find((f) => f.key === s)?.label || s;
      const val = toggles[s] !== undefined ? toggles[s] : preset[s];
      return `  ${label}: ${val}`;
    }),
    "",
    "--- Security Settings ---",
    ...explanation.securitySettings.map((s) => {
      const label = TOGGLE_LABELS[s] || s;
      const val = toggles[s] !== undefined ? toggles[s] : preset[s];
      return `  ${label}: ${val}`;
    }),
    "",
    "--- Test Before Going Live ---",
    ...explanation.testSettings.map((s) => `  ${s}`),
    "",
    "Always back up your server.properties file before replacing it.",
    "Restart your server after making changes.",
  ];

  return lines.join("\n");
}

function MinecraftServerPropertiesGenerator() {
  const [profile, setProfile] = useState("survival-smp");
  const [motd, setMotd] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("20");
  const [serverPort, setServerPort] = useState("25565");
  const [levelName, setLevelName] = useState("world");
  const [levelSeed, setLevelSeed] = useState("");
  const [difficulty, setDifficulty] = useState("normal");
  const [gamemode, setGamemode] = useState("survival");
  const [opLevel, setOpLevel] = useState("3");
  const [toggles, setToggles] = useState(() => {
    const preset = PROFILE_PRESETS["survival-smp"];
    const initial = {};
    for (const key of TOGGLE_KEYS) {
      initial[key] = preset[key];
    }
    return initial;
  });
  const [fieldValues, setFieldValues] = useState(() => {
    const initial = {};
    for (const f of PROPERTIES_FIELDS) {
      initial[f.key] = String(f.default);
    }
    return initial;
  });

  const [output, setOutput] = useState({ config: "", explanation: "" });
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const applyProfile = useCallback((id) => {
    setProfile(id);
    const preset = PROFILE_PRESETS[id] || PROFILE_PRESETS["survival-smp"];
    const newToggles = {};
    for (const key of TOGGLE_KEYS) {
      newToggles[key] = preset[key];
    }
    setToggles(newToggles);
    setDifficulty(preset.difficulty || "normal");
    setGamemode(preset.gamemode || "survival");
    setOutput({ config: "", explanation: "" });
    setCopied("");
  }, []);

  const handleToggle = useCallback((key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleFieldChange = useCallback((key, value) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    const config = generateConfig(profile, fieldValues, toggles, motd, maxPlayers, serverPort, levelName, levelSeed, difficulty, gamemode, opLevel);
    const explanation = generateExplanation(profile, fieldValues, toggles);
    setOutput({ config, explanation });
    setCopied("");
  }, [profile, fieldValues, toggles, motd, maxPlayers, serverPort, levelName, levelSeed, difficulty, gamemode, opLevel]);

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
    setProfile("survival-smp");
    setMotd("");
    setMaxPlayers("20");
    setServerPort("25565");
    setLevelName("world");
    setLevelSeed("");
    setDifficulty("normal");
    setGamemode("survival");
    setOpLevel("3");
    const preset = PROFILE_PRESETS["survival-smp"];
    const newToggles = {};
    for (const key of TOGGLE_KEYS) newToggles[key] = preset[key];
    setToggles(newToggles);
    const newFields = {};
    for (const f of PROPERTIES_FIELDS) newFields[f.key] = String(f.default);
    setFieldValues(newFields);
    setOutput({ config: "", explanation: "" });
    setCopied("");
  }, []);

  const toggleValue = (key) => toggles[key] !== undefined ? toggles[key] : PROFILE_PRESETS[profile]?.[key];

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
              Minecraft server.properties Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clean server.properties configuration files for Minecraft Java Edition
              servers. Built for survival SMPs, whitelist servers, PvE worlds, and more.
            </p>
          </div>
        </section>

        {/* Tool */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">
              {/* Profile Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Server Profile
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROFILES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        profile === p.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => applyProfile(p.id)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Settings */}
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Basic Settings
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Server name / MOTD"
                  value={motd}
                  onChange={(e) => setMotd(e.target.value)}
                  autoFocus
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-medium text-slate-500">Max Players</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-medium text-slate-500">Server Port</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={serverPort}
                      onChange={(e) => setServerPort(e.target.value)}
                      min="1"
                      max="65535"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-medium text-slate-500">Difficulty</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
                      <option value="peaceful">Peaceful</option>
                      <option value="easy">Easy</option>
                      <option value="normal">Normal</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-medium text-slate-500">Gamemode</label>
                    <select value={gamemode} onChange={(e) => setGamemode(e.target.value)} className={selectClass}>
                      <option value="survival">Survival</option>
                      <option value="creative">Creative</option>
                      <option value="adventure">Adventure</option>
                      <option value="spectator">Spectator</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Level name (world)"
                    value={levelName}
                    onChange={(e) => setLevelName(e.target.value)}
                  />
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Seed (optional)"
                    value={levelSeed}
                    onChange={(e) => setLevelSeed(e.target.value)}
                  />
                </div>
              </div>

              {/* World/Gameplay Toggles */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  World &amp; Gameplay
                </label>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3">
                  {TOGGLE_KEYS.map((key) => (
                    <label key={key} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={!!toggleValue(key)}
                        onChange={() => handleToggle(key)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-slate-200 transition">
                        {TOGGLE_LABELS[key]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Protection & Performance */}
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Protection &amp; Performance
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {PROPERTIES_FIELDS.filter((f) => f.key !== "motd" && f.key !== "max-players" && f.key !== "server-port").map((f) => (
                    <div key={f.key}>
                      <label className="mb-1 block text-[10px] font-medium text-slate-500">{f.label}</label>
                      <input
                        type={f.type}
                        className={inputClass}
                        value={fieldValues[f.key]}
                        onChange={(e) => handleFieldChange(f.key, e.target.value)}
                        min="0"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-500">Op Permission Level</label>
                  <select value={opLevel} onChange={(e) => setOpLevel(e.target.value)} className={selectClass}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
                <p className="text-xs leading-5 text-amber-200">
                  <strong className="text-amber-100">Important:</strong> server.properties options
                  can vary by Minecraft version, server software, and hosting setup. Always back up
                  your server.properties file before replacing it and restart your server after changes.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Generate Config
                </button>
                {output.config && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.config, "config")}
                      disabled={copied === "config"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "config"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "bg-indigo-500 text-white hover:bg-indigo-400"
                      }`}
                    >
                      {copied === "config" ? "Copied!" : "Copy server.properties"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.explanation, "explain")}
                      disabled={copied === "explain"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "explain"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "explain" ? "Copied!" : "Copy Explanation"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(
                        ["--- server.properties ---", output.config, "", "--- Explanation ---", output.explanation].join("\n"),
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
              {output.config && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      server.properties
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.config}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Profile Explanation
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-emerald-200">
                        {output.explanation}
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
              How to Use This Minecraft server.properties Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Select a server profile that matches your server type.</li>
              <li>Adjust the basic settings like server name, max players, difficulty, and gamemode.</li>
              <li>Toggle world and gameplay options to match your server rules.</li>
              <li>Set protection and performance values like view distance and spawn protection.</li>
              <li>Click <strong className="text-slate-100">Generate Config</strong> to create your server.properties file.</li>
              <li>Copy the config and paste it into your server.properties file.</li>
              <li>Always back up your existing file before replacing it and restart after changes.</li>
            </ol>
          </div>
        </section>

        {/* Common Settings Explained */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Minecraft server.properties Settings Explained
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">motd</h3>
                <p className="mt-1">
                  The Message of the Day appears in the server list below your server name.
                  Use this to describe your server type, version, or community.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">online-mode</h3>
                <p className="mt-1">
                  When true, only players with authenticated Minecraft accounts can join.
                  Set to false only for LAN or private servers with friends who do not have
                  premium accounts. Disabling online-mode opens security risks.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">white-list</h3>
                <p className="mt-1">
                  When true, only players added to the whitelist can join. Essential for
                  private communities. Use with online-mode true for the best security.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">view-distance and simulation-distance</h3>
                <p className="mt-1">
                  View distance controls how far players can see. Simulation distance controls
                  how far chunks are active. Lower values improve performance on weaker hardware.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">enable-rcon and enable-query</h3>
                <p className="mt-1">
                  RCON allows remote server administration. Query allows server list tools to
                  read basic info. Only enable these if you need them and secure them with
                  strong passwords.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended for Survival SMP */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Recommended Settings for Survival SMP Servers
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              A standard Survival SMP server works well with difficulty set to normal, PvP enabled,
              and a reasonable view distance of 8-10. Set max players based on your server hardware
              and community size. Spawn protection of 16 blocks prevents new players from
              griefing the spawn area.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              For larger communities, consider enabling whitelist and setting force-gamemode to
              true so all players start in survival mode. Keep online-mode true to prevent
              unauthorized access. Disable RCON and query unless you specifically need them.
            </p>
          </div>
        </section>

        {/* Whitelist and Security */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Whitelist, Online-mode, and Security Settings
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Keep online-mode on for public servers</h3>
                <p className="mt-1">
                  Disabling online-mode allows cracked clients to join, which also means anyone
                  can join with any username. This makes moderation and banning much harder.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Use whitelist for private communities</h3>
                <p className="mt-1">
                  A whitelist ensures only approved players can join. Combine with online-mode
                  true for the best security. Manage your whitelist through the in-game
                  /whitelist commands.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Restrict op-permission-level</h3>
                <p className="mt-1">
                  Level 3 is standard for most admins. Level 4 gives full access including
                  server console commands. Only give level 4 to trusted staff members.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Disable RCON unless needed</h3>
                <p className="mt-1">
                  RCON allows remote commands without being in-game. If you do not need remote
                  administration, keep it disabled to reduce attack surface.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PvP and World Settings */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              PvP, Difficulty, and World Settings Explained
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              PvP settings determine whether players can damage each other. On PvE servers,
              keep PvP disabled. On survival SMPs, PvP is usually on but with rules against
              spawn killing and griefing. Hardcore mode sets players to spectator after death,
              which is best for tightly moderated communities.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Difficulty affects mob damage, hunger depletion, and zombie reinforcement.
              Peaceful disables all hostile mobs. Easy is good for families and new players.
              Normal offers a balanced challenge. Hard increases mob damage and allows
              starvation to kill.
            </p>
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
                  Where is my server.properties file located?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  It is in the root directory of your Minecraft server. Look for
                  server.properties next to your server JAR file. Most hosting panels also
                  have a file manager where you can edit it directly.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Do I need to restart after changing server.properties?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Most settings require a server restart to take effect. Some hosting
                  panels may handle this automatically after saving.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What happens if I set an invalid value?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  The server will either use a default value, log a warning, or fail to
                  start. Always back up your server.properties before making changes and
                  test after restarting.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use this for Bedrock Edition?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  No. This generator targets Java Edition server.properties. Bedrock Edition
                  uses a different configuration format.
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

        <RelatedTools currentToolId="minecraft-server-properties-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default MinecraftServerPropertiesGenerator;
