import { useState, useCallback, useEffect, useMemo } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";
import {
  SERVER_PRESETS,
  LOOT_OPTIONS,
  ZOMBIE_OPTIONS,
  WORLD_RESET_OPTIONS,
  generateSettings,
  generateExplanation,
  validateSettings,
} from "../../../features/tools/project-zomboid/server-settings-helper/index.js";

const seo = {
  title: "Project Zomboid Server Settings Helper | QUESTPAUSE Tools",
  description:
    "Generate and understand common Project Zomboid servertest.ini settings for PvE, PvP, whitelist, safehouses, factions, chat, sleep, and long-term servers.",
};

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";
const selectClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400";
const toggleClass = (on) =>
  `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition ${
    on
      ? "border-indigo-400 bg-indigo-500/30"
      : "border-slate-700 bg-slate-800"
  }`;

const DEFAULT_VALUES = {
  Public: true,
  Open: true,
  PauseEmpty: true,
  GlobalChat: true,
  PVP: false,
  SafetySystem: true,
  AutoCreateUserInWhiteList: true,
  Whitelist: false,
  MaxPlayers: 32,
  SleepAllowed: true,
  SleepNeeded: false,
  FastForwardMultiplier: 40,
  PlayerSafehouse: true,
  SafehouseAllowFire: false,
  SafehouseAllowLoot: false,
  SafehouseAllowTrepass: false,
  FactionsEnabled: false,
  FactionMinSize: 2,
  AnnounceDeath: true,
  DisplayUserName: true,
  ShowFirstAndLastName: false,
  AllowDestructionBySledgehammer: true,
  AllowFireSpread: false,
  KickFastPlayers: false,
  AntiCheatProtection: true,
};

function ProjectZomboidServerSettingsHelper() {
  const [serverName, setServerName] = useState("");
  const [settings, setSettings] = useState({ ...DEFAULT_VALUES });
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [lootRespawn, setLootRespawn] = useState("Balanced");
  const [zombiePressure, setZombiePressure] = useState("Balanced");
  const [worldReset, setWorldReset] = useState("No resets");
  const [output, setOutput] = useState(null);
  const [copiedSection, setCopiedSection] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const applyPreset = useCallback((preset) => {
    setSelectedPreset(preset.id);
    setSettings({ ...preset.values });
    setLootRespawn(preset.lootRespawn);
    setZombiePressure(preset.zombiePressure);
    setWorldReset(preset.worldReset);
    setErrors([]);
    setOutput(null);
  }, []);

  const toggleSetting = useCallback((key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleNumberChange = useCallback((key, val) => {
    const num = parseInt(val, 10);
    setSettings((prev) => ({
      ...prev,
      [key]: isNaN(num) ? "" : num,
    }));
  }, []);

  const handleGenerate = useCallback(() => {
    const name = serverName.trim() || "Project Zomboid Server";
    const vals = { ...settings, serverName: name };
    const errs = validateSettings(vals);
    setErrors(errs);
    if (errs.length > 0) return;

    const preset = SERVER_PRESETS.find((p) => p.id === selectedPreset);
    const iniBlock = generateSettings(vals);
    const explanation = generateExplanation(vals, preset, {
      lootRespawn,
      zombiePressure,
      worldReset,
    });
    setOutput({ iniBlock, explanation, serverName: name });
    setCopiedSection("");
  }, [serverName, settings, selectedPreset, lootRespawn, zombiePressure, worldReset]);

  const handleCopy = useCallback(async (text, label) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(label);
      setTimeout(() => setCopiedSection(""), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const handleClear = useCallback(() => {
    setServerName("");
    setSettings({ ...DEFAULT_VALUES });
    setSelectedPreset(null);
    setLootRespawn("Balanced");
    setZombiePressure("Balanced");
    setWorldReset("No resets");
    setOutput(null);
    setCopiedSection("");
    setErrors([]);
  }, []);

  const fullOutput = useMemo(() => {
    if (!output) return "";
    return `ServerName=${output.serverName}\n${output.iniBlock}`;
  }, [output]);

  const Toggle = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={toggleClass(value)}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Project Zomboid
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Project Zomboid Server Settings Helper
            </h1>
            <p className="mt-3 text-base text-slate-400">
              Generate and understand common servertest.ini settings for PvE,
              PvP, whitelist, safehouses, factions, chat, sleep, and long-term
              survival servers.
            </p>
          </div>
        </section>

        {/* Profile Presets */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            <h2 className="text-base font-semibold text-white mb-4">
              Server Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedPreset === preset.id
                      ? "border-indigo-400 bg-indigo-500/10"
                      : "border-slate-800 bg-slate-900/55 hover:border-slate-600"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">
                    {preset.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Settings Form */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="flex flex-col gap-3 mb-6">
              <label className="text-xs font-semibold text-slate-300">
                Server Name
              </label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="Project Zomboid Server"
                className={inputClass}
              />
            </div>

            <h3 className="text-sm font-semibold text-white mb-3 border-b border-slate-800 pb-2">
              Basic Settings
            </h3>
            <div className="divide-y divide-slate-800/60">
              <Toggle label="Public server" value={settings.Public} onChange={() => toggleSetting("Public")} />
              <Toggle label="Open server" value={settings.Open} onChange={() => toggleSetting("Open")} />
              <Toggle label="Pause when empty" value={settings.PauseEmpty} onChange={() => toggleSetting("PauseEmpty")} />
              <Toggle label="Global chat" value={settings.GlobalChat} onChange={() => toggleSetting("GlobalChat")} />
              <Toggle label="PvP enabled" value={settings.PVP} onChange={() => toggleSetting("PVP")} />
              <Toggle label="Safety system" value={settings.SafetySystem} onChange={() => toggleSetting("SafetySystem")} />
              <Toggle label="Whitelist enabled" value={settings.Whitelist} onChange={() => toggleSetting("Whitelist")} />
              <Toggle label="Auto-create whitelist users" value={settings.AutoCreateUserInWhiteList} onChange={() => toggleSetting("AutoCreateUserInWhiteList")} />
            </div>

            <h3 className="text-sm font-semibold text-white mb-3 mt-8 border-b border-slate-800 pb-2">
              Community Settings
            </h3>
            <div className="divide-y divide-slate-800/60">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-300">Max players</span>
                <input
                  type="number"
                  value={settings.MaxPlayers}
                  onChange={(e) => handleNumberChange("MaxPlayers", e.target.value)}
                  className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 text-right outline-none focus:border-indigo-400"
                  min="1"
                />
              </div>
              <Toggle label="Player sleep allowed" value={settings.SleepAllowed} onChange={() => toggleSetting("SleepAllowed")} />
              <Toggle label="Fast forward when all asleep" value={!settings.SleepNeeded} onChange={() => toggleSetting("SleepNeeded")} />
              <Toggle label="Safehouse enabled" value={settings.PlayerSafehouse} onChange={() => toggleSetting("PlayerSafehouse")} />
              {settings.PlayerSafehouse && (
                <>
                  <Toggle label="Safehouse allow fire" value={settings.SafehouseAllowFire} onChange={() => toggleSetting("SafehouseAllowFire")} />
                  <Toggle label="Safehouse allow loot" value={settings.SafehouseAllowLoot} onChange={() => toggleSetting("SafehouseAllowLoot")} />
                  <Toggle label="Safehouse allow trespass" value={settings.SafehouseAllowTrepass} onChange={() => toggleSetting("SafehouseAllowTrepass")} />
                </>
              )}
              <Toggle label="Factions enabled" value={settings.FactionsEnabled} onChange={() => toggleSetting("FactionsEnabled")} />
              {settings.FactionsEnabled && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-300">Faction minimum size</span>
                  <input
                    type="number"
                    value={settings.FactionMinSize}
                    onChange={(e) => handleNumberChange("FactionMinSize", e.target.value)}
                    className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 text-right outline-none focus:border-indigo-400"
                    min="1"
                  />
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold text-white mb-3 mt-8 border-b border-slate-800 pb-2">
              Admin / Moderation Settings
            </h3>
            <div className="divide-y divide-slate-800/60">
              <Toggle label="Announce death" value={settings.AnnounceDeath} onChange={() => toggleSetting("AnnounceDeath")} />
              <Toggle label="Display user name" value={settings.DisplayUserName} onChange={() => toggleSetting("DisplayUserName")} />
              <Toggle label="Show first and last name" value={settings.ShowFirstAndLastName} onChange={() => toggleSetting("ShowFirstAndLastName")} />
              <Toggle label="Allow player-to-player damage" value={settings.PVP} onChange={() => toggleSetting("PVP")} />
              <Toggle label="Allow fire spread" value={settings.AllowFireSpread} onChange={() => toggleSetting("AllowFireSpread")} />
              <Toggle label="Kick fast players" value={settings.KickFastPlayers} onChange={() => toggleSetting("KickFastPlayers")} />
              <Toggle label="Anti-cheat protection" value={settings.AntiCheatProtection} onChange={() => toggleSetting("AntiCheatProtection")} />
            </div>

            <h3 className="text-sm font-semibold text-white mb-3 mt-8 border-b border-slate-800 pb-2">
              Long-Term Survival Guidance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              These do not generate exact sandbox settings but provide
              recommended values and guidance notes.
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Loot Respawn Style
                </label>
                <select value={lootRespawn} onChange={(e) => setLootRespawn(e.target.value)} className={selectClass}>
                  {LOOT_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Zombie Pressure
                </label>
                <select value={zombiePressure} onChange={(e) => setZombiePressure(e.target.value)} className={selectClass}>
                  {ZOMBIE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  World Reset Style
                </label>
                <select value={worldReset} onChange={(e) => setWorldReset(e.target.value)} className={selectClass}>
                  {WORLD_RESET_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-6 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4">
                {errors.map((err, i) => (
                  <p key={i} className="text-sm text-rose-200">{err}</p>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleGenerate}
                className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Generate Settings
              </button>
              <button
                onClick={handleClear}
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-rose-400 hover:text-rose-300"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Output */}
        {output && (
          <section className="border-b border-slate-800/80">
            <div className="mx-auto max-w-2xl px-4 py-10">
              <h2 className="text-lg font-semibold text-white mb-4">
                Generated Settings
              </h2>

              {/* servertest.ini block */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200">
                    servertest.ini Block
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCopy(output.iniBlock, "ini")}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                    >
                      {copiedSection === "ini" ? "Copied!" : "Copy Block"}
                    </button>
                    <button
                      onClick={() => handleCopy(fullOutput, "full")}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                    >
                      {copiedSection === "full" ? "Copied!" : "Copy All"}
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-emerald-200">
                    ServerName={output.serverName}{"\n"}
                    {output.iniBlock}
                  </pre>
                </div>
              </div>

              {/* Explanation */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200">
                    Explanation
                  </label>
                  <button
                    onClick={() => handleCopy(output.explanation, "explain")}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                  >
                    {copiedSection === "explain" ? "Copied!" : "Copy Explanation"}
                  </button>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300 font-sans">
                    {output.explanation}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
              <p className="text-sm leading-6 text-amber-200">
                <strong className="text-amber-100">Important:</strong> Project
                Zomboid server settings may vary by game version, server build,
                hosting setup, and mods. Always back up your servertest.ini
                before making changes and test settings on a private server
                before applying them to a live community.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Project Zomboid Server Settings Helper
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Choose a <strong className="text-slate-100">Server Profile</strong>{" "}
                preset to quickly load recommended settings for common server types.
              </li>
              <li>
                Adjust individual <strong className="text-slate-100">Basic</strong>,{" "}
                <strong className="text-slate-100">Community</strong>, and{" "}
                <strong className="text-slate-100">Admin</strong> settings using
                the toggles and number inputs.
              </li>
              <li>
                Set <strong className="text-slate-100">Long-Term Survival Guidance</strong>{" "}
                options for loot respawn, zombie pressure, and world reset style.
              </li>
              <li>
                Click <strong className="text-slate-100">Generate Settings</strong>{" "}
                to create your servertest.ini block and explanation.
              </li>
              <li>
                Copy the generated block and paste it into your servertest.ini
                file. Review the explanation for important notes about your
                configuration.
              </li>
            </ol>
          </div>
        </section>

        {/* Common Settings Explained */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Project Zomboid servertest.ini Settings Explained
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Public and Open</h3>
                <p className="mt-1">
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">Public</code>{" "}
                  controls whether your server appears in the server browser.{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">Open</code>{" "}
                  controls whether new players can join without an invite. For
                  whitelist servers, set Public=true and Whitelist=true.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Pause When Empty</h3>
                <p className="mt-1">
                  When <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">PauseEmpty=true</code>,{" "}
                  the game world pauses when no players are connected. This is
                  essential for solo or small private servers. Large public
                  servers usually disable this.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Sleep and Fast Forward</h3>
                <p className="mt-1">
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">SleepAllowed</code>{" "}
                  lets players sleep to pass time.{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">FastForwardMultiplier</code>{" "}
                  controls how fast time passes when all players are asleep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PvE vs PvP */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              PvE vs PvP Server Settings
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">PvE Servers</h3>
                <p className="mt-1">
                  PvE servers disable player-to-player damage. Safehouses
                  protect builds from other players. Safety system helps
                  prevent griefing. These settings work well for survival
                  communities and roleplay servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">PvP Servers</h3>
                <p className="mt-1">
                  PvP servers enable player damage and often allow safehouse
                  raiding through fire, loot, and trespass settings. Factions
                  help organize player groups. Safety system is usually
                  disabled to allow full interaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Long-Term Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Recommended Settings for Long-Term Project Zomboid Servers
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Loot Economy</h3>
                <p className="mt-1">
                  For long-term servers, set loot respawn to Rare or None. This
                  prevents item oversaturation and keeps exploration rewarding.
                  Frequent loot respawn can make the world feel empty of
                  challenge within days.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Safehouse Rules</h3>
                <p className="mt-1">
                  Enable safehouses and consider disabling fire and loot access
                  to protect long-term builds. Safehouse claims prevent base
                  destruction when players are offline.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Sleep and Time</h3>
                <p className="mt-1">
                  Enable sleep and fast forward to help players pass nights
                  quickly. This is especially important for servers with
                  fewer players who cannot defend during nighttime hordes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">World Resets</h3>
                <p className="mt-1">
                  Periodic partial resets can refresh loot and reduce
                  performance issues from accumulated world data. Schedule
                  resets during low-activity hours and announce them in advance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="project-zomboid-server-settings-helper" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ProjectZomboidServerSettingsHelper;
