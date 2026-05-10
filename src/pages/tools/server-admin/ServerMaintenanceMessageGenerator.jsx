import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";
import {
  GAMES,
  MESSAGE_TYPES,
  PLATFORMS,
  TONES,
  MAINTENANCE_TOGGLES,
  generateMaintenanceMessage,
} from "../../../features/tools/server-admin/maintenance-message-generator/index.js";

const seo = {
  title: "Server Maintenance Message Generator | QUESTPAUSE Tools",
  description:
    "Generate server maintenance messages, restart warnings, downtime notices, and Discord announcements for Minecraft, Project Zomboid, Valheim, ICARUS, and other game servers.",
};

function ServerMaintenanceMessageGenerator() {
  const [serverName, setServerName] = useState("");
  const [game, setGame] = useState("minecraft");
  const [messageType, setMessageType] = useState("planned");
  const [platform, setPlatform] = useState("discord");
  const [tone, setTone] = useState("professional");
  const [maintenanceTime, setMaintenanceTime] = useState("");
  const [estimatedDowntime, setEstimatedDowntime] = useState("");
  const [reason, setReason] = useState("");
  const [whatToDo, setWhatToDo] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(MAINTENANCE_TOGGLES.map((t) => [t.id, true]))
  );
  const [output, setOutput] = useState(null);
  const [copiedSection, setCopiedSection] = useState("");

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const handleToggle = useCallback((id) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleGenerate = useCallback(() => {
    const selected = MAINTENANCE_TOGGLES.filter((t) => toggles[t.id]).map((t) => t.id);
    const result = generateMaintenanceMessage({
      serverName,
      game,
      messageType,
      platform,
      tone,
      maintenanceTime,
      estimatedDowntime,
      reason,
      whatToDo,
      extraNote,
      selectedToggles: selected,
    });
    setOutput(result);
  }, [serverName, game, messageType, platform, tone, maintenanceTime, estimatedDowntime, reason, whatToDo, extraNote, toggles]);

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
    setGame("minecraft");
    setMessageType("planned");
    setPlatform("discord");
    setTone("professional");
    setMaintenanceTime("");
    setEstimatedDowntime("");
    setReason("");
    setWhatToDo("");
    setExtraNote("");
    setToggles(Object.fromEntries(MAINTENANCE_TOGGLES.map((t) => [t.id, true])));
    setOutput(null);
    setCopiedSection("");
  }, []);

  const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";

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
              Server Maintenance Message Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear maintenance and restart messages for your game server.
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
                  className={inputClass}
                  placeholder="Enter your server or community name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Game */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Game
                  </label>
                  <select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className={inputClass}
                  >
                    {GAMES.map((g) => (
                      <option key={g.id} value={g.id}>{g.label}</option>
                    ))}
                  </select>
                </div>

                {/* Message Type */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Message Type
                  </label>
                  <select
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value)}
                    className={inputClass}
                  >
                    {MESSAGE_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Platform */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className={inputClass}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Tone
                  </label>
                  <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-700">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`flex-1 px-1.5 py-2 text-[10px] font-medium transition ${
                          tone === t.id
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                        }`}
                        onClick={() => setTone(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional fields */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Maintenance Time
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Saturday 3 PM UTC"
                    value={maintenanceTime}
                    onChange={(e) => setMaintenanceTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Estimated Downtime
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. 30 minutes"
                    value={estimatedDowntime}
                    onChange={(e) => setEstimatedDowntime(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Reason
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Server performance update"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    What Players Should Do
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Save and log out"
                    value={whatToDo}
                    onChange={(e) => setWhatToDo(e.target.value)}
                  />
                </div>
              </div>

              {/* Extra Note */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Extra Note
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Check #announcements for updates"
                  value={extraNote}
                  onChange={(e) => setExtraNote(e.target.value)}
                />
              </div>

              {/* Toggles */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Options
                </label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {MAINTENANCE_TOGGLES.map((t) => (
                    <label
                      key={t.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600"
                    >
                      <input
                        type="checkbox"
                        checked={toggles[t.id]}
                        onChange={() => handleToggle(t.id)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 accent-indigo-500"
                      />
                      {t.label}
                    </label>
                  ))}
                </div>
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
                {output && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.fullMessage, "full")}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copiedSection === "full"
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                      }`}
                    >
                      {copiedSection === "full" ? "Copied!" : "Copy Full"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.shortVersion, "short")}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copiedSection === "short"
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                      }`}
                    >
                      {copiedSection === "short" ? "Copied!" : "Copy Short"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.ingameWarning, "ingame")}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copiedSection === "ingame"
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                      }`}
                    >
                      {copiedSection === "ingame" ? "Copied!" : "Copy In-game"}
                    </button>
                    {output.countdowns.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleCopy(output.countdowns.join("\n\n"), "countdown")}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          copiedSection === "countdown"
                            ? "bg-emerald-500 text-white"
                            : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                        }`}
                      >
                        {copiedSection === "countdown" ? "Copied!" : "Copy Countdown"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopy(output.fullMessage + "\n\n--- SHORT ---\n\n" + output.shortVersion + "\n\n--- IN-GAME ---\n\n" + output.ingameWarning + (output.countdowns.length > 0 ? "\n\n--- COUNTDOWN ---\n\n" + output.countdowns.join("\n\n") : ""), "all")}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copiedSection === "all"
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                      }`}
                    >
                      {copiedSection === "all" ? "Copied!" : "Copy All"}
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
              {output && (
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">
                      Title
                    </h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      {output.title}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">
                      Full Message
                    </h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      {output.fullMessage}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">
                      Short Version
                    </h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      {output.shortVersion}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">
                      In-game Warning
                    </h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      {output.ingameWarning}
                    </pre>
                  </div>
                  {output.countdowns.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300 mb-2">
                        Countdown Messages
                      </h3>
                      <div className="flex flex-col gap-2">
                        {output.countdowns.map((msg, i) => (
                          <pre
                            key={i}
                            className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-3 sm:p-4"
                          >
                            {msg}
                          </pre>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Server Maintenance Message Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server or community name.</li>
              <li>Select the game, message type, platform, and tone.</li>
              <li>Fill in optional details like time, downtime, reason, and what players should do.</li>
              <li>Toggle options like emojis, role mentions, countdown messages, and a thank-you note.</li>
              <li>
                Click <strong className="text-slate-100">Generate Message</strong> to
                preview your maintenance notice.
              </li>
              <li>
                Copy the full version for Discord, the in-game warning, short version,
                or countdown messages depending on where you need them.
              </li>
            </ol>
          </div>
        </section>

        {/* Why Clear Warnings Matter */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Why Clear Restart Warnings Matter
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Unexpected server restarts can cause players to lose progress, especially
              in games where auto-save is infrequent. Clear, advance warnings give
              players time to save, log out safely, and return when the server is back.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              A well-timed maintenance message also builds trust with your community.
              Players appreciate being informed rather than disconnected without notice.
              Regular, transparent communication about downtime reduces frustration and
              support requests.
            </p>
          </div>
        </section>

        {/* Examples */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Examples of Maintenance Messages
            </h2>
            <div className="mt-4 flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                  Planned Maintenance (Discord)
                </h3>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`@everyone

🔧 MySMP &mdash; Planned Maintenance

This is a notice regarding scheduled planned maintenance.

Minecraft will be down for scheduled maintenance. We will use this time to apply updates and improve performance.

**When:** Saturday 3 PM UTC
**Estimated downtime:** 30 minutes
**Reason:** Server performance update

**What to do:** Save your progress and log out before the maintenance window.

**⚠️ Avoid risky activity:** Please do not start any major builds, exploration, or PvP until the maintenance is complete.

*We will post a follow-up when MySMP is back online.*

Thank you for your cooperation.`}
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                  Server Back Online
                </h3>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`✅ MySMP &mdash; Server Back Online

Hey everyone! We have a server back online update to share.

MySMP is now back online! You can reconnect and continue playing.

Thanks for your patience! The server is ready to go.`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Game Server Admins
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Give as much advance notice as possible
                </h3>
                <p className="mt-1">
                  Post planned maintenance at least a few hours ahead of time. For
                  emergency restarts, explain why it was necessary.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Use in-game warnings before restarting
                </h3>
                <p className="mt-1">
                  Send countdown warnings at 15, 10, 5, and 1 minute so players have
                  time to save and find a safe spot to log out.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Always post a follow-up
                </h3>
                <p className="mt-1">
                  After maintenance, confirm the server is back online. A simple
                  follow-up message reassures the community and reduces questions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Keep a channel for server status
                </h3>
                <p className="mt-1">
                  Having a dedicated #server-status or #announcements channel keeps
                  maintenance history easy to find and reduces repeated questions.
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
                  Can I use this for non-Minecraft servers?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. The generator supports Project Zomboid, Valheim, ICARUS, 7 Days
                  to Die, and a General Game Server option.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is the difference between the message versions?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  The full message is a detailed Discord announcement. The short version
                  is condensed for quick reading. The in-game warning is plain text for
                  server chat. Countdown messages are timed warnings for restart windows.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Will this automatically post to my server?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  No. This tool generates text for you to copy and paste. It does not
                  connect to Discord, game servers, or any external service.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What if my server has extended downtime?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Use the Extended Downtime message type and update your community as
                  new information becomes available. Regular updates help manage
                  expectations.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Is this tool free?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes, completely free. No login, no sign-up, and no hidden costs.
                  Built by QUESTPAUSE.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="server-maintenance-message-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ServerMaintenanceMessageGenerator;
