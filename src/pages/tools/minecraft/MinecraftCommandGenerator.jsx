import { useState, useCallback, useEffect, useMemo } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Minecraft Command Generator | QUESTPAUSE Tools",
  description:
    "Generate Minecraft commands for gamemode, teleport, give item, weather, time, difficulty, effects, gamerules, and server administration. Free Minecraft command tool.",
};

const EDITIONS = [
  { id: "java", label: "Java Edition" },
  { id: "bedrock", label: "Bedrock Edition" },
  { id: "cross", label: "General / Cross-compatible" },
];

const CATEGORIES = [
  { id: "gamemode", label: "Gamemode" },
  { id: "teleport", label: "Teleport" },
  { id: "give", label: "Give Item" },
  { id: "weather", label: "Weather" },
  { id: "time", label: "Time" },
  { id: "difficulty", label: "Difficulty" },
  { id: "effects", label: "Effects" },
  { id: "utility", label: "World / Utility" },
  { id: "server-admin", label: "Server Admin Reference" },
];

const GAMEMODES = ["survival", "creative", "adventure", "spectator"];
const WEATHER_TYPES = ["clear", "rain", "thunder"];
const TIME_TYPES = [
  { id: "day", label: "Day (1000)", ticks: "1000" },
  { id: "noon", label: "Noon (6000)", ticks: "6000" },
  { id: "night", label: "Night (13000)", ticks: "13000" },
  { id: "midnight", label: "Midnight (18000)", ticks: "18000" },
  { id: "custom", label: "Custom ticks", ticks: "" },
];
const DIFFICULTIES = ["peaceful", "easy", "normal", "hard"];

const REFERENCE_COMMANDS = [
  { cmd: "seed", syntax: "seed", desc: "Shows the world seed number." },
  { cmd: "list", syntax: "list", desc: "Lists all online players." },
  { cmd: "say", syntax: "say <message>", desc: "Broadcasts a message to all players." },
  { cmd: "me", syntax: "me <action>", desc: "Shows an action in third-person chat." },
  { cmd: "kill", syntax: "kill <target>", desc: "Kills the specified target entity." },
  { cmd: "clear", syntax: "clear <target>", desc: "Clears the target's inventory." },
  { cmd: "spawnpoint", syntax: "spawnpoint <target>", desc: "Sets the target's spawn point." },
  { cmd: "setworldspawn", syntax: "setworldspawn", desc: "Sets the world spawn point." },
  { cmd: "gamerule keepInventory", syntax: "gamerule keepInventory true/false", desc: "Keep inventory on death." },
  { cmd: "gamerule mobGriefing", syntax: "gamerule mobGriefing true/false", desc: "Allow mobs to change blocks." },
  { cmd: "gamerule doDaylightCycle", syntax: "gamerule doDaylightCycle true/false", desc: "Toggle day/night cycle." },
  { cmd: "gamerule doWeatherCycle", syntax: "gamerule doWeatherCycle true/false", desc: "Toggle weather cycle." },
];

const SEARCHABLE_COMMANDS = [
  { cmd: "gamemode", syntax: "gamemode <mode> [target]", category: "Player", desc: "Changes the gamemode of a player.", edition: "Java + Bedrock" },
  { cmd: "tp", syntax: "tp [target] <destination>", category: "Player", desc: "Teleports a player or entity.", edition: "Java + Bedrock" },
  { cmd: "give", syntax: "give <target> <item> [amount]", category: "Admin", desc: "Gives an item to a player.", edition: "Java + Bedrock" },
  { cmd: "effect give", syntax: "effect give <target> <effect> [seconds] [amplifier] [hideParticles]", category: "Admin", desc: "Applies a status effect.", edition: "Java + Bedrock" },
  { cmd: "weather", syntax: "weather <clear|rain|thunder> [duration]", category: "World", desc: "Sets the weather.", edition: "Java + Bedrock" },
  { cmd: "time set", syntax: "time set <value|day|night>", category: "World", desc: "Sets the world time.", edition: "Java + Bedrock" },
  { cmd: "difficulty", syntax: "difficulty <peaceful|easy|normal|hard>", category: "World", desc: "Sets the game difficulty.", edition: "Java + Bedrock" },
  { cmd: "gamerule", syntax: "gamerule <rule> [value]", category: "World", desc: "Sets or queries a gamerule.", edition: "Java + Bedrock" },
  { cmd: "kill", syntax: "kill [target]", category: "Player", desc: "Kills entities.", edition: "Java + Bedrock" },
  { cmd: "clear", syntax: "clear [target] [item]", category: "Admin", desc: "Clears inventory items.", edition: "Java + Bedrock" },
  { cmd: "spawnpoint", syntax: "spawnpoint [target] [pos]", category: "Player", desc: "Sets spawn point.", edition: "Java + Bedrock" },
  { cmd: "setworldspawn", syntax: "setworldspawn [pos]", category: "World", desc: "Sets world spawn.", edition: "Java + Bedrock" },
  { cmd: "seed", syntax: "seed", category: "Utility", desc: "Shows the world seed.", edition: "Java + Bedrock" },
  { cmd: "list", syntax: "list", category: "Utility", desc: "Lists online players.", edition: "Java + Bedrock" },
  { cmd: "say", syntax: "say <message>", category: "Admin", desc: "Broadcasts a server message.", edition: "Java + Bedrock" },
  { cmd: "me", syntax: "me <action>", category: "Player", desc: "Describes an action in chat.", edition: "Java" },
  { cmd: "whitelist add", syntax: "whitelist add <player>", category: "Admin", desc: "Adds a player to the whitelist.", edition: "Java" },
  { cmd: "whitelist remove", syntax: "whitelist remove <player>", category: "Admin", desc: "Removes a player from the whitelist.", edition: "Java" },
  { cmd: "op", syntax: "op <player>", category: "Admin", desc: "Grants operator status.", edition: "Java" },
  { cmd: "deop", syntax: "deop <player>", category: "Admin", desc: "Removes operator status.", edition: "Java" },
  { cmd: "ban", syntax: "ban <player> [reason]", category: "Admin", desc: "Permanently bans a player.", edition: "Java + Bedrock" },
  { cmd: "pardon", syntax: "pardon <player>", category: "Admin", desc: "Unbans a player.", edition: "Java + Bedrock" },
  { cmd: "kick", syntax: "kick <player> [reason]", category: "Admin", desc: "Kicks a player from the server.", edition: "Java + Bedrock" },
  { cmd: "enchant", syntax: "enchant <target> <enchantment> [level]", category: "Player", desc: "Enchants an item.", edition: "Java" },
  { cmd: "xp", syntax: "xp <amount> [target]", category: "Player", desc: "Gives experience points.", edition: "Java + Bedrock" },
];

const CATEGORY_FILTERS = ["All", "Player", "Admin", "World", "Gameplay", "Utility"];

function generateExplanation(category, inputs) {
  const explanations = {
    gamemode: `Sets the gamemode of ${inputs.target} to ${inputs.mode}.`,
    teleport: inputs.dest
      ? `Teleports ${inputs.target} to ${inputs.dest}.`
      : `Teleports ${inputs.target} to coordinates (${inputs.x}, ${inputs.y}, ${inputs.z}).`,
    give: `Gives ${inputs.amount}x ${inputs.item} to ${inputs.target}.`,
    weather: inputs.duration
      ? `Sets the weather to ${inputs.type} for ${inputs.duration} seconds.`
      : `Sets the weather to ${inputs.type}.`,
    time: inputs.value === "custom"
      ? `Sets the world time to ${inputs.ticks} ticks.`
      : `Sets the time to ${inputs.value}.`,
    difficulty: `Sets the game difficulty to ${inputs.level}.`,
    effects: `Applies ${inputs.effect} (amplifier ${inputs.amp}) for ${inputs.duration} seconds to ${inputs.target}${inputs.hideParticles ? " with particles hidden" : ""}.`,
  };
  return explanations[category] || "";
}

function MinecraftCommandGenerator() {
  const [edition, setEdition] = useState("java");
  const [commandMode, setCommandMode] = useState("console");
  const [playerTarget, setPlayerTarget] = useState("");
  const [category, setCategory] = useState("gamemode");

  const [gamemodeMode, setGamemodeMode] = useState("survival");
  const [teleportTarget, setTeleportTarget] = useState("");
  const [teleportDestination, setTeleportDestination] = useState("");
  const [teleportX, setTeleportX] = useState("");
  const [teleportY, setTeleportY] = useState("");
  const [teleportZ, setTeleportZ] = useState("");
  const [giveTarget, setGiveTarget] = useState("");
  const [giveItemId, setGiveItemId] = useState("");
  const [giveAmount, setGiveAmount] = useState("64");
  const [weatherType, setWeatherType] = useState("clear");
  const [weatherDuration, setWeatherDuration] = useState("");
  const [timeType, setTimeType] = useState("day");
  const [timeTicks, setTimeTicks] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("normal");
  const [effectTarget, setEffectTarget] = useState("");
  const [effectId, setEffectId] = useState("");
  const [effectDuration, setEffectDuration] = useState("30");
  const [effectAmplifier, setEffectAmplifier] = useState("0");
  const [effectHideParticles, setEffectHideParticles] = useState(false);

  const [generated, setGenerated] = useState(null);
  const [copiedLabels, setCopiedLabels] = useState([]);
  const [cmdRefSearch, setCmdRefSearch] = useState("");
  const [cmdRefFilter, setCmdRefFilter] = useState("All");
  const [copyRefLabel, setCopyRefLabel] = useState("");

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const prefix = commandMode === "ingame" ? "/" : "";

  const handleCopy = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabels((prev) => [...prev, label]);
      setTimeout(() => setCopiedLabels((prev) => prev.filter((l) => l !== label)), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const handleCopyRef = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText("/" + text);
      setCopyRefLabel(text);
      setTimeout(() => setCopyRefLabel(""), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const handleGenerate = useCallback(() => {
    const t = playerTarget.trim() || "@p";
    const giveT = giveTarget.trim() || "@p";
    const item = giveItemId.trim() || "minecraft:stone";
    const amount = giveAmount.trim() || "1";
    const tpT = teleportTarget.trim() || "@p";
    const effT = effectTarget.trim() || "@p";
    const effId = effectId.trim() || "minecraft:speed";
    const effDur = effectDuration.trim() || "30";
    const effAmp = effectAmplifier.trim() || "0";

    let command = "";
    let explanation = "";

    switch (category) {
      case "gamemode": {
        command = `gamemode ${gamemodeMode} ${t}`;
        explanation = generateExplanation("gamemode", { target: t, mode: gamemodeMode });
        break;
      }
      case "teleport": {
        if (teleportDestination.trim()) {
          command = `tp ${tpT} ${teleportDestination.trim()}`;
          explanation = generateExplanation("teleport", { target: tpT, dest: teleportDestination.trim() });
        } else if (teleportX.trim() && teleportY.trim() && teleportZ.trim()) {
          command = `tp ${tpT} ${teleportX.trim()} ${teleportY.trim()} ${teleportZ.trim()}`;
          explanation = generateExplanation("teleport", { target: tpT, x: teleportX.trim(), y: teleportY.trim(), z: teleportZ.trim() });
        } else {
          command = `tp ${tpT} ~ ~ ~`;
          explanation = "Teleports the target to their current position (syntax reference). Specify coordinates for a targeted teleport.";
        }
        break;
      }
      case "give": {
        command = `give ${giveT} ${item} ${amount}`;
        explanation = generateExplanation("give", { target: giveT, item, amount });
        break;
      }
      case "weather": {
        command = weatherDuration.trim()
          ? `weather ${weatherType} ${weatherDuration.trim()}`
          : `weather ${weatherType}`;
        explanation = generateExplanation("weather", { type: weatherType, duration: weatherDuration.trim() });
        break;
      }
      case "time": {
        if (timeType === "custom") {
          const ticks = timeTicks.trim() || "0";
          command = `time set ${ticks}`;
          explanation = generateExplanation("time", { value: "custom", ticks });
        } else {
          const tInfo = TIME_TYPES.find((t) => t.id === timeType);
          command = `time set ${tInfo.ticks}`;
          explanation = generateExplanation("time", { value: timeType });
        }
        break;
      }
      case "difficulty": {
        command = `difficulty ${difficultyLevel}`;
        explanation = generateExplanation("difficulty", { level: difficultyLevel });
        break;
      }
      case "effects": {
        command = `effect give ${effT} ${effId} ${effDur} ${effAmp}${effectHideParticles ? " true" : " false"}`;
        explanation = generateExplanation("effects", { target: effT, effect: effId, duration: effDur, amp: effAmp, hideParticles: effectHideParticles });
        break;
      }
      default:
        command = "";
        explanation = "Select a command category and configure the options above.";
    }

    const consoleVersion = command;
    const slashVersion = "/" + command;

    setGenerated({
      command: prefix + command,
      consoleVersion,
      slashVersion,
      explanation,
    });
  }, [category, playerTarget, gamemodeMode, teleportTarget, teleportDestination, teleportX, teleportY, teleportZ, giveTarget, giveItemId, giveAmount, weatherType, weatherDuration, timeType, timeTicks, difficultyLevel, effectTarget, effectId, effectDuration, effectAmplifier, effectHideParticles, prefix]);

  const handleClear = useCallback(() => {
    setPlayerTarget("");
    setCategory("gamemode");
    setGamemodeMode("survival");
    setTeleportTarget("");
    setTeleportDestination("");
    setTeleportX("");
    setTeleportY("");
    setTeleportZ("");
    setGiveTarget("");
    setGiveItemId("");
    setGiveAmount("64");
    setWeatherType("clear");
    setWeatherDuration("");
    setTimeType("day");
    setTimeTicks("");
    setDifficultyLevel("normal");
    setEffectTarget("");
    setEffectId("");
    setEffectDuration("30");
    setEffectAmplifier("0");
    setEffectHideParticles(false);
    setGenerated(null);
    setCopiedLabels([]);
  }, []);

  const filteredRefCommands = useMemo(() => {
    let result = SEARCHABLE_COMMANDS;
    if (cmdRefFilter !== "All") {
      result = result.filter((c) => c.category === cmdRefFilter);
    }
    if (cmdRefSearch.trim()) {
      const q = cmdRefSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.cmd.toLowerCase().includes(q) ||
          c.syntax.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q),
      );
    }
    return result;
  }, [cmdRefSearch, cmdRefFilter]);

  const toggleBtn = (active, onClick, label) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-indigo-500 text-white"
          : "bg-slate-900 text-slate-300 hover:bg-slate-800"
      }`}
    >
      {label}
    </button>
  );

  const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";
  const selectClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ToolsHeader />

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">Free Tool</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Minecraft Command Generator</h1>
          <p className="mt-3 text-slate-400">Generate common Minecraft commands for gamemode, teleport, give item, weather, time, difficulty, effects, gamerules, and server administration.</p>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">

            <div className="space-y-2">
              <label className={labelClass}>Player Target</label>
              <input
                type="text"
                className={inputClass}
                placeholder="PlayerName or @p"
                value={playerTarget}
                onChange={(e) => setPlayerTarget(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-slate-500">Defaults to <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-xs text-indigo-300">@p</code> if empty.</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={labelClass}>Command Mode</label>
                <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-700">
                  {toggleBtn(commandMode === "console", () => setCommandMode("console"), "Server Console")}
                  {toggleBtn(commandMode === "ingame", () => setCommandMode("ingame"), "In-Game (/)")}
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Edition</label>
                <select value={edition} onChange={(e) => setEdition(e.target.value)} className={selectClass}>
                  {EDITIONS.map((e) => (
                    <option key={e.id} value={e.id}>{e.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className={labelClass}>Command Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      category === cat.id
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                        : "border-slate-700 text-slate-400 hover:border-indigo-400 hover:text-indigo-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {category === "gamemode" && (
              <div className="mt-6 space-y-2">
                <label className={labelClass}>Gamemode</label>
                <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-700">
                  {GAMEMODES.map((gm) => toggleBtn(gamemodeMode === gm, () => setGamemodeMode(gm), gm))}
                </div>
              </div>
            )}

            {category === "teleport" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className={labelClass}>Target Player</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="@p"
                    value={teleportTarget}
                    onChange={(e) => setTeleportTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Destination Player (optional)</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="OtherPlayerName"
                    value={teleportDestination}
                    onChange={(e) => setTeleportDestination(e.target.value)}
                  />
                </div>
                <fieldset className="rounded-lg border border-slate-800 p-4">
                  <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 px-1">OR Coordinates</legend>
                  <div className="grid gap-3 sm:grid-cols-3 mt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">X</label>
                      <input type="text" className={inputClass} placeholder="~" value={teleportX} onChange={(e) => setTeleportX(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Y</label>
                      <input type="text" className={inputClass} placeholder="~" value={teleportY} onChange={(e) => setTeleportY(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Z</label>
                      <input type="text" className={inputClass} placeholder="~" value={teleportZ} onChange={(e) => setTeleportZ(e.target.value)} />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-amber-400">Fill all three coordinates or use a destination player name.</p>
                </fieldset>
              </div>
            )}

            {category === "give" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className={labelClass}>Target</label>
                  <input type="text" className={inputClass} placeholder="@p" value={giveTarget} onChange={(e) => setGiveTarget(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Item ID</label>
                  <input type="text" className={inputClass} placeholder="minecraft:diamond" value={giveItemId} onChange={(e) => setGiveItemId(e.target.value)} />
                  <p className="text-xs text-slate-500">Defaults to <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-xs text-indigo-300">minecraft:stone</code> if empty.</p>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Amount</label>
                  <input type="text" className={inputClass} placeholder="64" value={giveAmount} onChange={(e) => setGiveAmount(e.target.value)} />
                  <p className="text-xs text-slate-500">Defaults to 1 if empty.</p>
                </div>
              </div>
            )}

            {category === "weather" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className={labelClass}>Weather Type</label>
                  <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-700">
                    {WEATHER_TYPES.map((wt) => toggleBtn(weatherType === wt, () => setWeatherType(wt), wt))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Duration (seconds, optional)</label>
                  <input type="text" className={inputClass} placeholder="Leave empty for default" value={weatherDuration} onChange={(e) => setWeatherDuration(e.target.value)} />
                </div>
              </div>
            )}

            {category === "time" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className={labelClass}>Time</label>
                  <div className="flex flex-wrap gap-2">
                    {TIME_TYPES.map((tt) => (
                      <button
                        key={tt.id}
                        type="button"
                        onClick={() => setTimeType(tt.id)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          timeType === tt.id
                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                            : "border-slate-700 text-slate-400 hover:border-indigo-400 hover:text-indigo-300"
                        }`}
                      >
                        {tt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {timeType === "custom" && (
                  <div className="space-y-2">
                    <label className={labelClass}>Ticks (20 ticks = 1 second)</label>
                    <input type="text" className={inputClass} placeholder="e.g. 1000" value={timeTicks} onChange={(e) => setTimeTicks(e.target.value)} />
                  </div>
                )}
              </div>
            )}

            {category === "difficulty" && (
              <div className="mt-6 space-y-2">
                <label className={labelClass}>Difficulty</label>
                <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-700">
                  {DIFFICULTIES.map((d) => toggleBtn(difficultyLevel === d, () => setDifficultyLevel(d), d))}
                </div>
              </div>
            )}

            {category === "effects" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className={labelClass}>Target</label>
                  <input type="text" className={inputClass} placeholder="@p" value={effectTarget} onChange={(e) => setEffectTarget(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Effect ID</label>
                  <input type="text" className={inputClass} placeholder="minecraft:speed" value={effectId} onChange={(e) => setEffectId(e.target.value)} />
                  <p className="text-xs text-slate-500">Defaults to <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-xs text-indigo-300">minecraft:speed</code> if empty.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className={labelClass}>Duration (seconds)</label>
                    <input type="text" className={inputClass} placeholder="30" value={effectDuration} onChange={(e) => setEffectDuration(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Amplifier</label>
                    <input type="text" className={inputClass} placeholder="0" value={effectAmplifier} onChange={(e) => setEffectAmplifier(e.target.value)} />
                  </div>
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600">
                  <input
                    type="checkbox"
                    checked={effectHideParticles}
                    onChange={() => setEffectHideParticles((p) => !p)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 accent-indigo-500"
                  />
                  Hide Particles
                </label>
              </div>
            )}

            {category === "utility" && (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-slate-400">Click any command to copy it.</p>
                {REFERENCE_COMMANDS.map((rc) => {
                  const label = rc.cmd;
                  return (
                    <div key={label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                      <div>
                        <code className="text-sm text-indigo-200">{"/" + rc.syntax}</code>
                        <p className="text-xs text-slate-500 mt-0.5">{rc.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy("/" + rc.syntax, label)}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          copiedLabels.includes(label)
                            ? "bg-emerald-500 text-white"
                            : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                        }`}
                      >
                        {copiedLabels.includes(label) ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {category === "server-admin" && (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-slate-400">Common server admin commands. Click to copy.</p>
                {REFERENCE_COMMANDS.map((rc) => {
                  const label = rc.cmd;
                  return (
                    <div key={label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                      <div>
                        <code className="text-sm text-indigo-200">{"/" + rc.syntax}</code>
                        <p className="text-xs text-slate-500 mt-0.5">{rc.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy("/" + rc.syntax, label)}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          copiedLabels.includes(label)
                            ? "bg-emerald-500 text-white"
                            : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                        }`}
                      >
                        {copiedLabels.includes(label) ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Generate Command
              </button>
              {generated && (
                <>
                  <button
                    type="button"
                    onClick={() => handleCopy(generated.command, "generated")}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      copiedLabels.includes("generated")
                        ? "bg-emerald-500 text-white"
                        : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                    }`}
                  >
                    {copiedLabels.includes("generated") ? "Copied!" : "Copy Generated"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(generated.consoleVersion, "console")}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      copiedLabels.includes("console")
                        ? "bg-emerald-500 text-white"
                        : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                    }`}
                  >
                    {copiedLabels.includes("console") ? "Copied!" : "Copy Console"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(generated.slashVersion, "slash")}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      copiedLabels.includes("slash")
                        ? "bg-emerald-500 text-white"
                        : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                    }`}
                  >
                    {copiedLabels.includes("slash") ? "Copied!" : "Copy Slash"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${generated.command}\n\nConsole: ${generated.consoleVersion}\nSlash: ${generated.slashVersion}`, "all")}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      copiedLabels.includes("all")
                        ? "bg-emerald-500 text-white"
                        : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                    }`}
                  >
                    {copiedLabels.includes("all") ? "Copied!" : "Copy All"}
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

            {generated && (
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Generated Command</h3>
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                    {generated.command}
                  </pre>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Console Version</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300 rounded-xl border border-slate-800 bg-slate-950 p-4">
                      {generated.consoleVersion}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">In-Game Slash Version</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300 rounded-xl border border-slate-800 bg-slate-950 p-4">
                      {generated.slashVersion}
                    </pre>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">What This Command Does</h3>
                  <p className="text-sm leading-6 text-slate-400 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    {generated.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h2 className="text-xl font-semibold text-white">Searchable Command Reference</h2>
          <p className="mt-2 text-sm text-slate-400">Browse common Minecraft commands by category. Click to copy.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              type="text"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400"
              placeholder="Search commands..."
              value={cmdRefSearch}
              onChange={(e) => setCmdRefSearch(e.target.value)}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setCmdRefFilter(f)}
                className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                  cmdRefFilter === f
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                    : "border-slate-700 text-slate-400 hover:border-indigo-400 hover:text-indigo-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {filteredRefCommands.map((sc) => (
              <div key={sc.cmd} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-indigo-200">{"/" + sc.syntax}</code>
                    <span className="text-[10px] uppercase tracking-wider text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">{sc.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{sc.desc}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{sc.edition}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyRef(sc.syntax)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    copyRefLabel === sc.syntax
                      ? "bg-emerald-500 text-white"
                      : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                  }`}
                >
                  {copyRefLabel === sc.syntax ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
            {filteredRefCommands.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No commands found.</p>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h2 className="text-xl font-semibold text-white">How to Use This Minecraft Command Generator</h2>
          <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
            <li>Enter a player target name or leave it as <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">@p</code>.</li>
            <li>Choose <strong className="text-slate-100">Server Console</strong> or <strong className="text-slate-100">In-Game (/)</strong> mode depending on where you will run the command.</li>
            <li>Select your Minecraft edition for edition-specific syntax.</li>
            <li>Pick a command category and fill in the options.</li>
            <li>Click <strong className="text-slate-100">Generate Command</strong> and copy the result.</li>
          </ol>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h2 className="text-xl font-semibold text-white">Common Minecraft Commands for Server Admins</h2>
          <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
            <div>
              <h3 className="font-semibold text-slate-100">Player Management</h3>
              <p className="mt-1">Use <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/whitelist add</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/op</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/ban</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/kick</code>, and <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/pardon</code> to manage who can join your server and their permissions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Server Operations</h3>
              <p className="mt-1">Commands like <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/seed</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/list</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/say</code>, and <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/gamerule</code> help you monitor and configure your server on the fly.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">World Management</h3>
              <p className="mt-1">Control weather, time, and difficulty with <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/weather</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/time set</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/difficulty</code>, and <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/setworldspawn</code>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h2 className="text-xl font-semibold text-white">Minecraft Gamemode and Teleport Commands</h2>
          <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
            <div>
              <h3 className="font-semibold text-slate-100">Gamemode Command</h3>
              <p className="mt-1">Use <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/gamemode survival</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/gamemode creative</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/gamemode adventure</code>, or <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/gamemode spectator</code> to change a player's game mode. Append a player name to target someone else.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Teleport Command</h3>
              <p className="mt-1">Use <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/tp</code> to teleport players. You can teleport one player to another (<code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/tp Alex Bob</code>) or to specific coordinates (<code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/tp Alex 100 64 -200</code>).</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h2 className="text-xl font-semibold text-white">Minecraft Give Item and Effect Commands</h2>
          <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
            <div>
              <h3 className="font-semibold text-slate-100">Give Item Command</h3>
              <p className="mt-1">Use <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/give</code> to give items to players. Syntax: <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/give &lt;player&gt; &lt;item&gt; [amount]</code>. Example: <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/give Alex minecraft:diamond 64</code>.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Effect Command</h3>
              <p className="mt-1">Use <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/effect give</code> to apply status effects. Syntax: <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/effect give &lt;player&gt; &lt;effect&gt; [seconds] [amplifier] [hideParticles]</code>. Example: <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/effect give Alex minecraft:speed 60 1 true</code>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h2 className="text-xl font-semibold text-white">Minecraft Gamerule Commands Explained</h2>
          <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
            <div>
              <h3 className="font-semibold text-slate-100">Keep Inventory</h3>
              <p className="mt-1"><code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/gamerule keepInventory true</code> &mdash; Players keep their items and XP after death. Set to <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">false</code> for vanilla survival.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Mob Griefing</h3>
              <p className="mt-1"><code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/gamerule mobGriefing false</code> &mdash; Prevents creepers, endermen, and other mobs from modifying the world.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Daylight Cycle</h3>
              <p className="mt-1"><code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/gamerule doDaylightCycle false</code> &mdash; Freezes the day/night cycle at the current time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Weather Cycle</h3>
              <p className="mt-1"><code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/gamerule doWeatherCycle false</code> &mdash; Stops weather changes, keeping the current weather state.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h2 className="text-xl font-semibold text-white">Java vs Bedrock Command Differences</h2>
          <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
            <div>
              <h3 className="font-semibold text-slate-100">Command Syntax</h3>
              <p className="mt-1">Most basic commands work the same across both editions. Advanced commands like <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/data</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/execute</code>, and NBT-related commands are Java-only.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Whitelist and Operator Commands</h3>
              <p className="mt-1">Whitelist commands (<code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/whitelist</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/op</code>, <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/deop</code>) are Java Edition only. Bedrock Edition uses the server settings UI or the <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">allowlist.json</code> file.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Player Names with Spaces</h3>
              <p className="mt-1">Bedrock Edition allows spaces in player names. When using commands with Bedrock players, wrap names in quotes if they contain spaces.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Item IDs</h3>
              <p className="mt-1">Java Edition uses namespaced IDs (<code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">minecraft:diamond</code>). Bedrock also supports IDs but may use numeric IDs or different names for some items.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
          <div className="mt-6 divide-y divide-slate-800">
            <div className="py-4 first:pt-0">
              <h3 className="text-sm font-semibold text-white">What is the difference between console and in-game mode?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">Console mode generates commands without a forward slash, for pasting into your server terminal or control panel. In-game mode adds the <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">/</code> prefix for Minecraft chat.</p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-semibold text-white">Does this tool work for both Java and Bedrock Edition?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">Yes. Select your edition from the dropdown. The generator adapts basic command syntax. Note that some advanced commands are edition-specific.</p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-semibold text-white">What if I do not enter a player name?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">The tool defaults to <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">@p</code> (nearest player) when no name is entered. This is useful for commands you run while standing near the target.</p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-semibold text-white">Can I use these commands on any server?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">You need operator (op) permissions on the server to run most commands. Some servers use plugins that may change command syntax.</p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-semibold text-white">Why is my command not working?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">Check that you have operator permissions, that the player name is correct, and that the command syntax matches your server software (Bukkit, Spigot, Paper, etc.). Test commands in a safe area first.</p>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-semibold text-white">Is this tool free to use?</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">Yes, completely free. No login, no sign-up, no hidden costs. Built by QUESTPAUSE.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-amber-300">Disclaimer</h2>
            <p className="mt-2 text-xs leading-5 text-amber-200/70">
              Minecraft commands can vary by edition, server software, permission level, and game version. Test commands carefully before using them on a live server.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools currentToolId="minecraft-command-generator" />

      <ToolsFooter />
    </main>
  );
}

export default MinecraftCommandGenerator;
