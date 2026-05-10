const EDITION_LABELS = {
  java: "Java",
  bedrock: "Bedrock",
  both: "Java + Bedrock",
};

const TYPE_LABELS = {
  smp: "Small Survival SMP",
  whitelist: "Whitelist Survival",
  pve: "Chill PvE",
  vanilla: "Vanilla Survival",
  modded: "Modded Survival",
  community: "Community Building",
};

const PLAYER_COUNT_LABELS = {
  "1-3": "1\u20133",
  "4-8": "4\u20138",
  "under-10": "Under 10",
  open: "Open",
};

const TOGGLE_EMOJIS = {
  whitelist: "Whitelist required",
  discord: "Discord required",
  "no-griefing": "No griefing",
  "no-stealing": "No stealing",
  "no-cheating": "No cheating",
  "no-duping": "No duping",
  "long-term": "Long-term world",
  "fresh-world": "Fresh world",
  "adults": "Adults preferred",
  "voice-chat": "Voice chat optional",
  "beginner-friendly": "Beginner friendly",
};

function toneIntro(tone) {
  switch (tone) {
    case "casual":
      return "Hey! We're looking for a few chill people to play Minecraft with.";
    case "friendly":
      return "Hello! We're a friendly group looking for new members to join our world.";
    case "mature":
      return "We're building a mature Minecraft community and looking for reliable players.";
    case "short":
      return "Looking for players to join our server.";
    default:
      return "We're looking for players to join our Minecraft server.";
  }
}

function toneClosing(tone) {
  switch (tone) {
    case "casual":
      return "No stress, no pressure. Just good vibes and block games.";
    case "friendly":
      return "Everyone is welcome. Come say hi!";
    case "mature":
      return "If this sounds like your kind of server, we'd love to hear from you.";
    case "short":
      return "DM or comment if interested.";
    default:
      return "Thanks for reading!";
  }
}

function buildToggleBullets(selectedToggles, prefix) {
  return selectedToggles
    .map((id) => `${prefix} ${TOGGLE_EMOJIS[id] || id}`)
    .join("\n");
}

function buildTagline(name, typeLabel, editionLabel) {
  return `${name} is a ${typeLabel} ${editionLabel} server looking for new players.`;
}

export function generateLfgPost({
  serverName,
  edition,
  version,
  serverType,
  platform,
  tone,
  playerCount,
  language,
  selectedToggles,
}) {
  const name = serverName.trim() || "our Minecraft server";
  const typeLabel = TYPE_LABELS[serverType] || "Minecraft server";
  const editionLabel = EDITION_LABELS[edition] || "Minecraft";
  const playerLabel = PLAYER_COUNT_LABELS[playerCount] || "";

  const intro = toneIntro(tone);
  const closing = toneClosing(tone);
  const tagline = buildTagline(name, typeLabel, editionLabel);
  const toggleBullets = buildToggleBullets(selectedToggles, "-");

  const versionLine = version.trim()
    ? `**Version:** ${version.trim()}`
    : "";

  const langLine = language.trim()
    ? `**Language:** ${language.trim()}`
    : "";

  const playerLine = playerCount !== "open"
    ? `**Players wanted:** ${playerLabel}`
    : `**Players wanted:** Open \u2014 all are welcome`;

  const editionLine = `**Edition:** ${editionLabel}`;

  const divider = platform === "reddit" ? "---" : "";

  const fullPost = [
    `## ${name} | ${typeLabel}`,
    "",
    intro,
    "",
    tagline,
    "",
    ...(versionLine ? [versionLine, ""] : []),
    `**Server type:** ${typeLabel}`,
    editionLine,
    playerLine,
    ...(langLine ? [langLine, ""] : [""]),
    ...(selectedToggles.length > 0
      ? ["**What we offer:**", toggleBullets, ""]
      : [""]),
    closing,
    "",
    divider,
    `*Small group server \u2014 not a large network. We keep things simple.*`,
  ]
    .filter(Boolean)
    .join("\n");

  const redditVersion = [
    `# ${name} | ${typeLabel} (${editionLabel})`,
    "",
    intro,
    "",
    tagline,
    "",
    ...(versionLine ? [versionLine, ""] : []),
    editionLine,
    `**Server type:** ${typeLabel}`,
    playerLine,
    ...(langLine ? [langLine, ""] : [""]),
    ...(selectedToggles.length > 0
      ? ["---", "**What we offer:**", "", toggleBullets, ""]
      : [""]),
    closing,
    "",
    "---",
    `*Small group server \u2014 not a large network. We keep things simple.*`,
  ]
    .filter(Boolean)
    .join("\n");

  const discordVersion = [
    `**${name} \u2014 ${typeLabel}**`,
    "",
    intro,
    "",
    editionLine,
    ...(versionLine ? [versionLine] : []),
    playerLine,
    ...(langLine ? [langLine] : []),
    "",
    ...(selectedToggles.length > 0
      ? [toggleBullets, ""]
      : []),
    closing,
    "",
    `*Small group server \u2014 not a large network.*`,
  ]
    .filter(Boolean)
    .join("\n");

  return { fullPost, redditVersion, discordVersion };
}
