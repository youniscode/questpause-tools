import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";

const seo = {
  title: "Valheim Event Announcement Generator | QUESTPAUSE Tools",
  description:
    "Generate Valheim event announcements for boss fights, community builds, exploration nights, dungeon runs, trading days, progression votes, and Viking server events.",
};

const EVENT_TYPES = [
  { id: "boss-fight", label: "Boss Fight" },
  { id: "community-build", label: "Community Build" },
  { id: "exploration-night", label: "Exploration Night" },
  { id: "dungeon-run", label: "Dungeon Run" },
  { id: "resource-gathering", label: "Resource Gathering" },
  { id: "market-day", label: "Market / Trading Day" },
  { id: "server-meeting", label: "Server Meeting" },
  { id: "progression-vote", label: "Progression Vote" },
  { id: "seasonal-event", label: "Seasonal Event" },
  { id: "new-world", label: "New World Launch" },
  { id: "modpack-event", label: "Modpack Event" },
  { id: "general", label: "General Valheim Event" },
];

const TONES = [
  { id: "friendly", label: "Friendly" },
  { id: "epic", label: "Epic Viking" },
  { id: "direct", label: "Short and direct" },
  { id: "community-first", label: "Community-first" },
  { id: "roleplay", label: "Roleplay-friendly" },
  { id: "professional", label: "Professional" },
];

const FORMATS = [
  { id: "discord", label: "Discord Announcement" },
  { id: "short", label: "Short Reminder" },
  { id: "full", label: "Full Event Post" },
  { id: "pinned", label: "Pinned Event Message" },
];

const TOGGLE_OPTIONS = [
  { id: "emojis", label: "Add emojis" },
  { id: "role-mention", label: "Add role mention placeholder" },
  { id: "prep-checklist", label: "Add preparation checklist" },
  { id: "new-players", label: 'Add "new players welcome"' },
  { id: "shared-progression", label: 'Add "shared progression" reminder' },
  { id: "no-rush-bosses", label: 'Add "do not rush bosses" reminder' },
  { id: "ask-before-starting", label: 'Add "ask before starting" reminder' },
  { id: "thank-you", label: "Add thank-you line" },
  { id: "short-version", label: "Add short version" },
];

const EVENT_TITLES = {
  "boss-fight": "Boss Fight",
  "community-build": "Community Build Event",
  "exploration-night": "Exploration Night",
  "dungeon-run": "Dungeon Run",
  "resource-gathering": "Resource Gathering",
  "market-day": "Market / Trading Day",
  "server-meeting": "Server Meeting",
  "progression-vote": "Progression Vote",
  "seasonal-event": "Seasonal Event",
  "new-world": "New World Launch",
  "modpack-event": "Modpack Event",
  "general": "Valheim Event",
};

const TONE_OPENINGS = {
  friendly: "Hey Vikings!",
  epic: "Hear me, warriors of Valheim!",
  direct: "Attention:",
  "community-first": "To our Valheim community,",
  roleplay: "Hark, brave souls of the Tenth Realm!",
  professional: "Attention players,",
};

const TONE_CLOSINGS = {
  friendly: "See you there, Vikings!",
  epic: "May Odin guide your axes! Skål!",
  direct: "See you there.",
  "community-first": "Thanks for being part of our community. Together we thrive!",
  roleplay: "May the All-Father watch over your journey.",
  professional: "Thank you for your participation.",
};

const EVENT_DESCRIPTIONS = {
  "boss-fight": {
    friendly: "We are gathering to take down a boss. Bring your best gear and join the fight!",
    epic: "A mighty foe awaits! Rally your clan, sharpen your blades, and prepare for glory!",
    direct: "Boss fight scheduled. Be ready.",
    "community-first": "Time to work together and take down a boss as a community!",
    roleplay: "The elders have called a council of war. A great beast threatens our realm.",
    professional: "A boss fight has been scheduled. All players are invited to participate.",
  },
  "community-build": {
    friendly: "Let us build something amazing together! All hands welcome.",
    epic: "Raise your hammers! We build a monument that shall echo through the ages!",
    direct: "Community build event. Come help out.",
    "community-first": "Nothing brings a community together like building together. Join us!",
    roleplay: "The Jarl calls upon all skilled hands to raise a great hall.",
    professional: "A community building session has been organized. All skill levels welcome.",
  },
  "exploration-night": {
    friendly: "Grab your gear and let us explore uncharted lands together!",
    epic: "Uncharted seas and untamed forests await! Who will claim glory?",
    direct: "Exploration run. Come explore new biomes.",
    "community-first": "Exploring is better together. Let us see what the world has to offer!",
    roleplay: "The seers have glimpsed lands beyond our ken. Who will venture forth?",
    professional: "An exploration expedition has been organized. Prepare for unknown dangers.",
  },
  "dungeon-run": {
    friendly: "Dungeon crawl time! Grab your keys and lets see what we find.",
    epic: "Dark crypts and ancient evils await. Only the brave shall claim the spoils!",
    direct: "Dungeon run. Bring crypt keys.",
    "community-first": "Group dungeon run. Share the loot, share the glory!",
    roleplay: "Whispers speak of buried riches and foul creatures beneath the earth.",
    professional: "A dungeon expedition has been scheduled. Bring appropriate gear.",
  },
  "resource-gathering": {
    friendly: "Resource gathering day! Fill those inventory slots.",
    epic: "Forge, build, and stockpile! Today we prepare for the long winter.",
    direct: "Resource gathering session. Bring your tools.",
    "community-first": "Let us pool our resources and build up the community stockpile!",
    roleplay: "The harvest season is upon us. Every hand is needed to fill the storehouses.",
    professional: "A resource gathering event has been scheduled. Organized groups forming.",
  },
  "market-day": {
    friendly: "Market day! Bring your goods and trade with fellow Vikings.",
    epic: "Barter, trade, and deal! The great market opens its gates!",
    direct: "Trading day. Bring items to trade.",
    "community-first": "Support your fellow players. Buy, sell, and trade at the community market!",
    roleplay: "By decree of the Jarl, a market shall be held. Goods and coin shall flow.",
    professional: "A trading event has been organized. All players welcome to participate.",
  },
  "server-meeting": {
    friendly: "Server meeting time! Let us chat about the server and upcoming plans.",
    epic: "All clans, all warriors — your voice matters! Attend the great council!",
    direct: "Server meeting. Important announcements.",
    "community-first": "Your input matters. Come share your thoughts on the servers direction!",
    roleplay: "The Thing is called. All free folk may speak before the Jarl.",
    professional: "A server meeting has been scheduled to discuss upcoming changes and community feedback.",
  },
  "progression-vote": {
    friendly: "Time to vote on our next boss or biome. Lets decide together!",
    epic: "The fate of our progression rests in your hands! Cast your vote!",
    direct: "Progression vote. Cast your vote now.",
    "community-first": "We progress together. Vote on what we tackle next as a community!",
    roleplay: "The council seeks the wisdom of the people. What challenge shall we face next?",
    professional: "A progression vote has been opened. All players are encouraged to participate.",
  },
  "seasonal-event": {
    friendly: "Seasonal event time! Celebrate with the community!",
    epic: "The seasons turn and a great celebration is upon us! Join the feast!",
    direct: "Seasonal event starting. Details below.",
    "community-first": "Celebrate the season together with your fellow survivors!",
    roleplay: "The old traditions must be honored. Gather for the seasonal rites!",
    professional: "A seasonal event has been organized. All players are welcome to join.",
  },
  "new-world": {
    friendly: "A new world awaits! Fresh start, new adventures!",
    epic: "A new realm has been forged! Claim your place in Valhalla!",
    direct: "New world launch. Details below.",
    "community-first": "Fresh start for everyone! Let us build something incredible together!",
    roleplay: "The cycle begins anew. A pristine realm awaits its first settlers.",
    professional: "A new Valheim world has been launched. All players are invited to join.",
  },
  "modpack-event": {
    friendly: "Modpack event! Check out the new mods and join the fun!",
    epic: "New powers, new dangers, new adventures! The modded realm calls!",
    direct: "Modpack event starting. Check mod list.",
    "community-first": "Try out the new modpack with the community! Fresh experiences await!",
    roleplay: "The realm has shifted. Strange new forces are at work.",
    professional: "A modpack event has been launched. Please ensure your client is updated.",
  },
  "general": {
    friendly: "Hey everyone, we have an event coming up!",
    epic: "Vikings! An event stirs on the horizon!",
    direct: "Event notice:",
    "community-first": "Community event coming up! Everyone is welcome.",
    roleplay: "News travels fast through the realm. An event is upon us.",
    professional: "An event has been scheduled. Details are provided below.",
  },
};

function getToneMsg(eventType, tone) {
  return EVENT_DESCRIPTIONS[eventType]?.[tone] || EVENT_DESCRIPTIONS[eventType]?.friendly || "";
}

function generateAnnouncement(serverName, eventType, tone, formatType, toggles, dateTime, location, gear, bossBiome, bringItems, discordChannel, extraNote) {
  const name = serverName.trim() || "our Valheim server";
  const title = EVENT_TITLES[eventType] || "Valheim Event";
  const opening = TONE_OPENINGS[tone] || TONE_OPENINGS.friendly;
  const closing = TONE_CLOSINGS[tone] || TONE_CLOSINGS.friendly;
  const body = getToneMsg(eventType, tone);

  const useEmojis = toggles["emojis"];
  const useRole = toggles["role-mention"];
  const useNewPlayers = toggles["new-players"];
  const useSharedProgression = toggles["shared-progression"];
  const useNoRush = toggles["no-rush-bosses"];
  const useAskBeforeStarting = toggles["ask-before-starting"];
  const useThankYou = toggles["thank-you"];
  // prep-checklist and short-version are separate outputs, not embedded

  const emoji = (e) => (useEmojis ? e : "");

  if (formatType === "short") {
    const lines = [];
    lines.push(`${emoji("⚡")} ${name} — ${title}`);
    if (dateTime.trim()) lines.push(`${emoji("🕐")} ${dateTime.trim()}`);
    if (location.trim()) lines.push(`${emoji("📍")} ${location.trim()}`);
    if (gear.trim()) lines.push(`${emoji("🛡️")} ${gear.trim()}`);
    lines.push(body);
    if (extraNote.trim()) lines.push(extraNote.trim());
    return lines.join("\n");
  }

  const lines = [];

  if (useRole) {
    lines.push(`${emoji("📢")} @here`);
    lines.push("");
  }

  lines.push(`${emoji("⚔️")} ${name} — ${title}`);
  lines.push("");

  if (formatType !== "pinned") {
    lines.push(opening);
    lines.push("");
  }

  lines.push(body);
  lines.push("");

  const details = [];
  if (dateTime.trim()) details.push(`${emoji("🕐")} When: ${dateTime.trim()}`);
  if (location.trim()) details.push(`${emoji("📍")} Where: ${location.trim()}`);
  if (gear.trim()) details.push(`${emoji("🛡️")} Gear: ${gear.trim()}`);
  if (bossBiome.trim()) details.push(`${emoji("🌲")} Biome/Boss: ${bossBiome.trim()}`);
  if (bringItems.trim()) details.push(`${emoji("🎒")} Bring: ${bringItems.trim()}`);

  if (details.length > 0) {
    details.forEach((d) => lines.push(d));
    lines.push("");
  }

  if (useNewPlayers) {
    lines.push(`${emoji("🌟")} New players are always welcome — no experience needed!`);
    lines.push("");
  }
  if (useSharedProgression) {
    lines.push(`${emoji("🤝")} This is a shared progression event. We go forward together!`);
    lines.push("");
  }
  if (useNoRush) {
    lines.push(`${emoji("🐢")} No need to rush — enjoy the journey and explore at your own pace.`);
    lines.push("");
  }
  if (useAskBeforeStarting) {
    lines.push(`${emoji("💬")} Please ask before triggering bosses or starting major events.`);
    lines.push("");
  }

  if (discordChannel.trim()) {
    lines.push(`${emoji("💬")} Discord: #${discordChannel.trim()}`);
    lines.push("");
  }
  if (extraNote.trim()) {
    lines.push(`${emoji("📝")} ${extraNote.trim()}`);
    lines.push("");
  }

  if (useThankYou && formatType !== "pinned") {
    lines.push(closing);
    lines.push("");
  }

  if (formatType === "pinned") {
    lines.push(`— ${name} Event Team`);
  }

  return lines.join("\n");
}

function generatePrepChecklist(eventType, bossBiome, gear) {
  const lines = ["Preparation Checklist", ""];
  lines.push("[ ] Equip your best armor and weapons");
  if (gear.trim()) lines.push(`[ ] ${gear.trim()}`);
  if (bossBiome.trim()) lines.push(`[ ] Prepare for: ${bossBiome.trim()}`);
  lines.push("[ ] Bring food and healing items");
  lines.push("[ ] Repair gear before departure");
  lines.push("[ ] Clear your inventory for loot");
  lines.push("[ ] Set your spawn point");
  lines.push("[ ] Coordinate with your group");
  return lines.join("\n");
}

function generatePinnedVersion(serverName, eventType, tone, toggles, dateTime, location, discordChannel) {
  const name = serverName.trim() || "our Valheim server";
  const title = EVENT_TITLES[eventType] || "Valheim Event";
  const body = getToneMsg(eventType, tone);
  const useEmojis = toggles["emojis"];
  const emoji = (e) => (useEmojis ? e : "");

  const lines = [];
  lines.push(`${emoji("📌")} ${name} — ${title}`);
  lines.push("");
  lines.push(body);
  if (dateTime.trim()) lines.push(`${emoji("🕐")} ${dateTime.trim()}`);
  if (location.trim()) lines.push(`${emoji("📍")} ${location.trim()}`);
  if (discordChannel.trim()) lines.push(`${emoji("💬")} #${discordChannel.trim()}`);
  return lines.join("\n");
}

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";

function ValheimEventAnnouncementGenerator() {
  const [serverName, setServerName] = useState("");
  const [eventType, setEventType] = useState("boss-fight");
  const [tone, setTone] = useState("friendly");
  const [formatType, setFormatType] = useState("discord");
  const [toggles, setToggles] = useState(() => Object.fromEntries(TOGGLE_OPTIONS.map((t) => [t.id, false])));
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [gear, setGear] = useState("");
  const [bossBiome, setBossBiome] = useState("");
  const [bringItems, setBringItems] = useState("");
  const [discordChannel, setDiscordChannel] = useState("");
  const [extraNote, setExtraNote] = useState("");

  const [output, setOutput] = useState({ full: "", short: "", checklist: "", pinned: "" });
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const handleToggle = useCallback((id) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleGenerate = useCallback(() => {
    const full = generateAnnouncement(serverName, eventType, tone, formatType, toggles, dateTime, location, gear, bossBiome, bringItems, discordChannel, extraNote);
    const short = generateAnnouncement(serverName, eventType, tone, "short", toggles, dateTime, location, gear, bossBiome, bringItems, discordChannel, extraNote);
    const checklist = generatePrepChecklist(eventType, bossBiome, gear);
    const pinned = generatePinnedVersion(serverName, eventType, tone, toggles, dateTime, location, discordChannel);
    setOutput({ full, short, checklist, pinned });
    setCopied("");
  }, [serverName, eventType, tone, formatType, toggles, dateTime, location, gear, bossBiome, bringItems, discordChannel, extraNote]);

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
    setEventType("boss-fight");
    setTone("friendly");
    setFormatType("discord");
    setToggles(Object.fromEntries(TOGGLE_OPTIONS.map((t) => [t.id, false])));
    setDateTime("");
    setLocation("");
    setGear("");
    setBossBiome("");
    setBringItems("");
    setDiscordChannel("");
    setExtraNote("");
    setOutput({ full: "", short: "", checklist: "", pinned: "" });
    setCopied("");
  }, []);

  const allText = [output.full, "", "--- SHORT REMINDER ---", "", output.short, "", "--- PREPARATION CHECKLIST ---", "", output.checklist, "", "--- PINNED VERSION ---", "", output.pinned].join("\n");

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        {/* Hero */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Valheim
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Valheim Event Announcement Generator
            </h1>
            <p className="mt-3 text-slate-400">
              Generate clear event announcements for boss fights, community builds, exploration
              nights, trading days, progression votes, and Viking server events.
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
                  placeholder="Enter your Valheim server name..."
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-slate-500">If empty, "our Valheim server" will be used.</p>
              </div>

              {/* Event Type */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                >
                  {EVENT_TYPES.map((t) => (
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

              {/* Format */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Event Format
                </label>
                <div className="flex flex-wrap gap-2">
                  {FORMATS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        formatType === s.id
                          ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                          : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                      onClick={() => setFormatType(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-6 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Options
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

              {/* Custom Fields */}
              <div className="mt-6 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Optional Details
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Date / time"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Meeting location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Required gear"
                  value={gear}
                  onChange={(e) => setGear(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Boss name or biome"
                  value={bossBiome}
                  onChange={(e) => setBossBiome(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="What players should bring"
                  value={bringItems}
                  onChange={(e) => setBringItems(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Discord channel name"
                  value={discordChannel}
                  onChange={(e) => setDiscordChannel(e.target.value)}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Extra note"
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
                  Generate Announcement
                </button>
                {output.full && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.full, "full")}
                      disabled={copied === "full"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "full"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "bg-indigo-500 text-white hover:bg-indigo-400"
                      }`}
                    >
                      {copied === "full" ? "Copied!" : "Copy Full Announcement"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.short, "short")}
                      disabled={copied === "short"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "short"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "short" ? "Copied!" : "Copy Short Reminder"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.checklist, "checklist")}
                      disabled={copied === "checklist"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "checklist"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "checklist" ? "Copied!" : "Copy Checklist"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(output.pinned, "pinned")}
                      disabled={copied === "pinned"}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        copied === "pinned"
                          ? "bg-emerald-500 text-white cursor-default"
                          : "border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10"
                      }`}
                    >
                      {copied === "pinned" ? "Copied!" : "Copy Pinned Version"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(allText, "all")}
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
              {output.full && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      A. Full Event Announcement
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.full}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      B. Short Discord Reminder
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.short}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      C. Preparation Checklist
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.checklist}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      D. Pinned Event Version
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-indigo-200">
                        {output.pinned}
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
              How to Use This Valheim Event Announcement Generator
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>Enter your server name (or leave blank to use &ldquo;our Valheim server&rdquo;).</li>
              <li>Select the event type &mdash; boss fight, community build, exploration, dungeon run, and more.</li>
              <li>Choose a tone that matches your community&rsquo;s style.</li>
              <li>Pick the event format &mdash; Discord announcement, short reminder, full post, or pinned message.</li>
              <li>Toggle optional extras like emojis, role mentions, checklists, and reminders.</li>
              <li>Fill in optional details like date, location, gear, and boss information.</li>
              <li>Click <strong className="text-slate-100">Generate Announcement</strong> to preview all outputs.</li>
              <li>Use the copy buttons to grab the full announcement, short reminder, checklist, or pinned version.</li>
            </ol>
          </div>
        </section>

        {/* Event Examples */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Valheim Event Announcement Examples
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Valheim event announcements help organize your community around shared goals. Whether
              you are gathering to fight The Elder, building a communal great hall, or exploring a
              new biome together, a clear announcement sets expectations and gets everyone excited.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Good event announcements include the time, location, required gear, and what players
              can expect. Tone matters too &mdash; an epic Viking call-to-arms works well for boss
              fights, while a friendly message suits community building events.
            </p>
          </div>
        </section>

        {/* Boss Fights and Progression */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Boss Fight and Shared Progression Announcements
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Boss fight announcements are among the most important events on a Valheim server.
              Shared progression servers need clear rules about when and how bosses are fought.
              Include whether all players should be present, what gear is required, and whether
              the event is happening on a schedule or when a quorum is reached.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Use the &ldquo;ask before starting&rdquo; and &ldquo;shared progression&rdquo;
              toggle options to reinforce community norms around boss fights and progression.
            </p>
          </div>
        </section>

        {/* Community Build and Exploration */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Community Build and Exploration Events
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Community builds</h3>
                <p className="mt-1">
                  Organize community build days to construct shared infrastructure like docks,
                  roads, meeting halls, or defensive walls. These events build camaraderie and
                  leave a lasting mark on the world.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Exploration nights</h3>
                <p className="mt-1">
                  Exploration events are great for smaller groups. Sail to new islands, map
                  uncharted biomes, and discover resources together. New players especially
                  benefit from guided exploration runs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Resource gathering</h3>
                <p className="mt-1">
                  Coordinate large-scale resource gathering operations. These events help stockpile
                  materials for community projects and are a great way for new players to contribute.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Tips for Organizing Valheim Server Events
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">Announce early, remind often</h3>
                <p className="mt-1">
                  Post the full announcement a day or two in advance, then send a short reminder
                  an hour before the event starts. Use the pinned version for ongoing visibility.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Set clear expectations</h3>
                <p className="mt-1">
                  Include what gear is needed, what time zone you are using, and whether new
                  players are welcome. The more information you provide, the smoother the event.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Use role pings sparingly</h3>
                <p className="mt-1">
                  Use the role mention for important events only. Over-pinging leads to players
                  muting the channel and missing future announcements.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Follow up after the event</h3>
                <p className="mt-1">
                  Post a recap or thank-you message after the event. This builds community and
                  encourages attendance at future events.
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
                  What types of events can I announce with this tool?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Boss fights, community builds, exploration nights, dungeon runs, resource
                  gathering, trading days, server meetings, progression votes, seasonal events,
                  new world launches, modpack events, and general Valheim events.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  What is the difference between the four output versions?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  The Full Event Announcement is a complete post with all details. The Short
                  Discord Reminder is a compact version for quick updates. The Preparation
                  Checklist helps players get ready. The Pinned Event Version is concise for
                  pinned messages in Discord channels.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I customize the tone of the announcement?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. Choose from Friendly, Epic Viking, Short and direct, Community-first,
                  Roleplay-friendly, or Professional. Each tone changes the opening, body,
                  and closing of the announcement.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Can I use this tool for non-Valheim events?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. The announcements are Valheim-themed but the structure works for any
                  game server event. Just customize the server name and details.
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

        <RelatedTools currentToolId="valheim-event-announcement-generator" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ValheimEventAnnouncementGenerator;
