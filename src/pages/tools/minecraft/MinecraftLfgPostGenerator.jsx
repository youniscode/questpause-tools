import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";
import {
  EDITIONS,
  SERVER_TYPES,
  PLATFORMS,
  TONES,
  PLAYER_COUNTS,
  LFG_TOGGLES,
  generateLfgPost,
} from "../../../features/tools/minecraft/lfg-post-generator/index.js";

const seo = {
  title: "Minecraft LFG Post Generator | QUESTPAUSE Tools",
  description:
    "Generate Minecraft LFG posts for Reddit, Discord, SMPs, whitelist survival servers, and small Minecraft communities. Free tool by QUESTPAUSE.",
};

function MinecraftLfgPostGenerator() {
  const [serverName, setServerName] = useState("");
  const [edition, setEdition] = useState("java");
  const [version, setVersion] = useState("");
  const [serverType, setServerType] = useState("smp");
  const [platform, setPlatform] = useState("general");
  const [tone, setTone] = useState("friendly");
  const [playerCount, setPlayerCount] = useState("4-8");
  const [language, setLanguage] = useState("");
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(LFG_TOGGLES.map((t) => [t.id, true]))
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
    const selected = LFG_TOGGLES.filter((t) => toggles[t.id]).map((t) => t.id);
    const post = generateLfgPost({
      serverName,
      edition,
      version,
      serverType,
      platform,
      tone,
      playerCount,
      language,
      selectedToggles: selected,
    });
    setOutput(post);
  }, [serverName, edition, version, serverType, platform, tone, playerCount, language, toggles]);

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
    setEdition("java");
    setVersion("");
    setServerType("smp");
    setPlatform("general");
    setTone("friendly");
    setPlayerCount("4-8");
    setLanguage("");
    setToggles(Object.fromEntries(LFG_TOGGLES.map((t) => [t.id, true])));
    setOutput(null);
    setCopiedSection("");
  }, []);

  const toggleInputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";
  const toggleSelectClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400";

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
              Minecraft LFG Post Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Create clean recruitment posts for your Minecraft server.
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
                  className={toggleInputClass}
                  placeholder="Enter your Minecraft server name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Edition */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Edition
                  </label>
                  <select
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    className={toggleSelectClass}
                  >
                    {EDITIONS.map((e) => (
                      <option key={e.id} value={e.id}>{e.label}</option>
                    ))}
                  </select>
                </div>

                {/* Version */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Version
                  </label>
                  <input
                    type="text"
                    className={toggleInputClass}
                    placeholder="e.g. 1.21.4"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Server Type */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Server Type
                  </label>
                  <select
                    value={serverType}
                    onChange={(e) => setServerType(e.target.value)}
                    className={toggleSelectClass}
                  >
                    {SERVER_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className={toggleSelectClass}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Tone */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className={toggleSelectClass}
                  >
                    {TONES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Players Wanted */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Players Wanted
                  </label>
                  <select
                    value={playerCount}
                    onChange={(e) => setPlayerCount(e.target.value)}
                    className={toggleSelectClass}
                  >
                    {PLAYER_COUNTS.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Language */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Language
                </label>
                <input
                  type="text"
                  className={toggleInputClass}
                  placeholder="e.g. English, English / French"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>

              {/* Toggles */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Features &amp; Rules
                </label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {LFG_TOGGLES.map((t) => (
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
                  Generate Post
                </button>
                {output && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.redditVersion, "reddit")}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copiedSection === "reddit"
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                      }`}
                    >
                      {copiedSection === "reddit" ? "Copied!" : "Copy Reddit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.discordVersion, "discord")}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copiedSection === "discord"
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-700 text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
                      }`}
                    >
                      {copiedSection === "discord" ? "Copied!" : "Copy Discord"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.fullPost, "all")}
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
                      Full Post
                    </h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      {output.fullPost}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">
                      Reddit Version
                    </h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      {output.redditVersion}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">
                      Discord Version
                    </h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      {output.discordVersion}
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
              How to Use This Minecraft LFG Post Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your Minecraft server name.</li>
              <li>Select your edition, version, and server type.</li>
              <li>Choose a platform (Reddit, Discord, or General) and tone.</li>
              <li>Set how many players you are looking for and what language.</li>
              <li>Toggle the features and rules that apply to your server.</li>
              <li>
                Click <strong className="text-slate-100">Generate Post</strong> to
                preview your LFG post.
              </li>
              <li>
                Copy the Reddit version, Discord version, or the full post depending
                on where you are posting.
              </li>
            </ol>
          </div>
        </section>

        {/* Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Writing a Good Minecraft Recruitment Post
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Be clear about what kind of server you run
                </h3>
                <p className="mt-1">
                  Tell players upfront if your server is survival, PvE, modded, or
                  whitelist-only. Players who know what to expect are more likely to
                  stay.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Mention your rules and features
                </h3>
                <p className="mt-1">
                  Let people know if you require a whitelist, use Discord, or have
                  anti-griefing rules. This helps filter out players who would not be
                  a good fit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Keep your post friendly and approachable
                </h3>
                <p className="mt-1">
                  A welcoming tone makes a big difference. Players are more likely to
                  join a server where the ad sounds genuine rather than corporate.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Include practical details
                </h3>
                <p className="mt-1">
                  Version, time zone, language, and whether voice chat is used help
                  players decide if your server is right for them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Avoiding Spam */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Avoid Sounding Like Spam
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Many server ads get ignored because they sound like copy-paste spam.
              Here is how to make your post stand out for the right reasons:
            </p>
            <ul className="mt-4 flex flex-col gap-2 pl-5 text-sm leading-6 text-slate-400">
              <li className="list-disc">
                Write a specific title that mentions your server name and type.
              </li>
              <li className="list-disc">
                Avoid all-caps, emoji spam, and phrases like &ldquo;the best server ever.&rdquo;
              </li>
              <li className="list-disc">
                Be honest about what your server offers. Smaller communities are
                often more appealing than exaggerated claims.
              </li>
              <li className="list-disc">
                Include a short note that you are a small group server, not a large
                commercial network.
              </li>
              <li className="list-disc">
                Post in the right subreddits and channels. Read the community rules
                before posting.
              </li>
            </ul>
          </div>
        </section>

        {/* Example */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Example Minecraft LFG Post
            </h2>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
{`## My SMP | Small Survival SMP

Hello! We're a friendly group looking for new members to join our world.

My SMP is a Small Survival SMP Java server looking for new players.

**Edition:** Java
**Server type:** Small Survival SMP
**Players wanted:** 4&ndash;8

**What we offer:**
- Whitelist required
- No griefing
- No stealing
- No cheating
- Long-term world
- Beginner friendly

Everyone is welcome. Come say hi!

---

*Small group server &mdash; not a large network. We keep things simple.*`}
              </pre>
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
                  Where should I post my LFG ad?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Popular places include r/minecraftservers, r/MinecraftBuddies, and
                  r/smp on Reddit, as well as Discord server discovery channels and
                  Minecraft community forums.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is the difference between the Reddit and Discord versions?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  The Reddit version uses markdown headings and separators for a
                  clean Reddit post. The Discord version is shorter and uses bold
                  text formatting for Discord channels. Both include the same
                  essential information.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I edit the output after generating?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. The generated post is plain text &mdash; you can edit, reformat, or
                  add your own details before posting.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What if I do not select any toggles?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  The tool still generates a clean post with your basic server info.
                  No toggles are required to get a usable result.
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

        {/* Common Mistakes */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common Mistakes When Writing LFG Posts
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Sounding like a big server network
                </h3>
                <p className="mt-1">
                  Most players looking for small communities skip posts that sound
                  corporate. Keep your post personal and mention that you are a
                  small group.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Leaving out practical details
                </h3>
                <p className="mt-1">
                  Missing version, edition, or time zone details can lead to
                  mismatched expectations. Include the basics so players know what
                  they are signing up for.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Posting in the wrong place
                </h3>
                <p className="mt-1">
                  Each subreddit and Discord community has its own rules. Make sure
                  your post follows their guidelines, or it may be removed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Not following up
                </h3>
                <p className="mt-1">
                  If people comment or DM you, respond promptly. A slow response can
                  make your server seem inactive or disorganised.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="minecraft-lfg-post-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default MinecraftLfgPostGenerator;
