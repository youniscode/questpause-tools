import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";
import {
  ANNOUNCEMENT_TYPES,
  GAMES,
  TONES,
  ANNOUNCEMENT_TOGGLES,
  generateAnnouncement,
} from "../../../features/tools/discord/announcement-generator/index.js";

const seo = {
  title: "Discord Announcement Generator | QUESTPAUSE Tools",
  description:
    "Generate Discord announcements for gaming communities, server launches, maintenance notices, events, rule updates, and player updates. Free tool by QUESTPAUSE.",
};

function DiscordAnnouncementGenerator() {
  const [communityName, setCommunityName] = useState("");
  const [announcementType, setAnnouncementType] = useState("server-launch");
  const [game, setGame] = useState("minecraft");
  const [tone, setTone] = useState("friendly");
  const [dateTime, setDateTime] = useState("");
  const [reason, setReason] = useState("");
  const [whatToDo, setWhatToDo] = useState("");
  const [extraNote, setExtraNote] = useState("");
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(ANNOUNCEMENT_TOGGLES.map((t) => [t.id, true]))
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
    const selected = ANNOUNCEMENT_TOGGLES.filter((t) => toggles[t.id]).map((t) => t.id);
    const result = generateAnnouncement({
      communityName,
      announcementType,
      game,
      tone,
      dateTime,
      reason,
      whatToDo,
      extraNote,
      selectedToggles: selected,
    });
    setOutput(result);
  }, [communityName, announcementType, game, tone, dateTime, reason, whatToDo, extraNote, toggles]);

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
    setCommunityName("");
    setAnnouncementType("server-launch");
    setGame("minecraft");
    setTone("friendly");
    setDateTime("");
    setReason("");
    setWhatToDo("");
    setExtraNote("");
    setToggles(Object.fromEntries(ANNOUNCEMENT_TOGGLES.map((t) => [t.id, true])));
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
              Discord Announcement Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Create polished announcements for your Discord community.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">
              {/* Community Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Community / Server Name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter your community or server name..."
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Announcement Type */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Announcement Type
                  </label>
                  <select
                    value={announcementType}
                    onChange={(e) => setAnnouncementType(e.target.value)}
                    className={inputClass}
                  >
                    {ANNOUNCEMENT_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Game / Community */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Game / Community
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
              </div>

              {/* Tone */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Tone
                </label>
                <div className="flex gap-0 overflow-hidden rounded-lg border border-slate-700">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`flex-1 px-2 py-2 text-xs font-medium transition ${
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

              {/* Optional fields */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Date / Time
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Saturday at 3 PM UTC"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>
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
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    What Players Need to Do
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Update your client"
                    value={whatToDo}
                    onChange={(e) => setWhatToDo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Extra Note
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Check #announcements"
                    value={extraNote}
                    onChange={(e) => setExtraNote(e.target.value)}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Options
                </label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {ANNOUNCEMENT_TOGGLES.map((t) => (
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
                  Generate Announcement
                </button>
                {output && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.fullAnnouncement, "full")}
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
                      onClick={() => handleCopy(output.fullAnnouncement, "all")}
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
                      Full Announcement
                    </h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      {output.fullAnnouncement}
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
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Discord Announcement Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your community or server name.</li>
              <li>Select the type of announcement you need to make.</li>
              <li>Choose your game or community category and the tone.</li>
              <li>Fill in optional details like date, reason, and what players need to do.</li>
              <li>Toggle formatting options like emojis, role mentions, and a thank-you message.</li>
              <li>
                Click <strong className="text-slate-100">Generate Announcement</strong> to
                preview your post.
              </li>
              <li>
                Copy the full version, short version, or all at once depending on where
                you are posting.
              </li>
            </ol>
          </div>
        </section>

        {/* What Makes a Good Announcement */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              What Makes a Good Discord Announcement
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Clear subject line
                </h3>
                <p className="mt-1">
                  Members should know what the announcement is about without having to
                  read the full message. Use a descriptive title.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Keep it concise
                </h3>
                <p className="mt-1">
                  Discord messages that are too long get skipped. Put the most important
                  information first and keep paragraphs short.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Use formatting intentionally
                </h3>
                <p className="mt-1">
                  Bold headings, bullet points, and separators make announcements easier
                  to scan. Emojis can add personality but use them sparingly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Include a call to action
                </h3>
                <p className="mt-1">
                  Tell members what you need from them &mdash; whether it is reading the update,
                  updating their client, or responding to a poll.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Examples of Discord Announcements
            </h2>
            <div className="mt-4 flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                  Server Launch
                </h3>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`@everyone

🚀 MySMP &mdash; Server Launch

Hey everyone! We have an important server launch to share with the community.

We are excited to announce that Minecraft is now open! Come join us and be part of the community from day one.

**Action required:** Please read the details above and respond if needed.

Thanks for being part of the community!`}
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                  Maintenance Notice
                </h3>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`@everyone

🔧 MySMP &mdash; Maintenance Notice

This is an official maintenance notice for the community.

Minecraft will be down for scheduled maintenance. During this time, the server may be unavailable or restarting.

**When:** Saturday at 3 PM UTC

**What to do:** Save your progress and log out before the maintenance window.

Thank you for your attention to this announcement.`}
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
                  Post announcements in a dedicated channel
                </h3>
                <p className="mt-1">
                  Keep your #announcements channel for official updates only. Use a
                  separate #chat channel for general discussion so announcements are
                  not buried.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Use @everyone sparingly
                </h3>
                <p className="mt-1">
                  Pinging everyone too often causes notification fatigue. Reserve role
                  mentions for important announcements like restarts or rule changes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Pin important announcements
                </h3>
                <p className="mt-1">
                  Pin announcements that members need to reference later, such as server
                  rules, IP addresses, or version information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Follow up after maintenance
                </h3>
                <p className="mt-1">
                  After a maintenance window or restart, post a quick follow-up
                  confirming the server is back online. It reassures the community.
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
                  Can I use this for non-Minecraft communities?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. The generator supports Project Zomboid, Valheim, ICARUS, 7 Days
                  to Die, and a General Discord Community option.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is the difference between full and short versions?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  The full version includes the complete formatted announcement with
                  all details. The short version condenses the most important
                  information for quick reading.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Does this tool post to Discord automatically?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  No. This tool generates the text for you to copy and paste into your
                  Discord channel. It does not connect to Discord or any other service.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I customise the generated announcement?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. The output is plain text. You can edit, reformat, or add your
                  own content before posting.
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

        <RelatedTools currentToolId="discord-announcement-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default DiscordAnnouncementGenerator;
