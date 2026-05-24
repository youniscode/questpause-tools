const TYPE_HEADERS = {
  "server-launch": "Server Launch",
  maintenance: "Maintenance Notice",
  restart: "Restart Warning",
  "modpack-update": "Modpack Update",
  "rule-update": "Rule Update",
  "new-event": "New Event",
  "whitelist-opening": "Whitelist Opening",
  "new-player": "New Player Welcome",
  general: "Announcement",
};

const GAME_LABELS = {
  minecraft: "Minecraft",
  "project-zomboid": "Project Zomboid",
  valheim: "Valheim",
  icarus: "ICARUS",
  "7-days": "7 Days to Die",
  general: "community",
};

function toneIntro(tone, typeLabel) {
  switch (tone) {
    case "friendly":
      return `Hey everyone! We have an important ${typeLabel.toLowerCase()} to share with the community.`;
    case "professional":
      return `This is an official ${typeLabel.toLowerCase()} for the community.`;
    case "short":
      return `${typeLabel}:`;
    case "community":
      return `Hi everyone! Here is a ${typeLabel.toLowerCase()} for our community:`;
    case "urgent":
      return `\u26a0\ufe0f **URGENT ${typeLabel.toUpperCase()}** \u26a0\ufe0f`;
    default:
      return `Here is a ${typeLabel.toLowerCase()} for the community.`;
  }
}

function toneBody(tone, typeId, gameLabel) {
  const game = gameLabel || "server";

  switch (typeId) {
    case "server-launch":
      return `We are excited to announce that ${game} is now open! Come join us and be part of the community from day one.`;
    case "maintenance":
      return `${game} will be down for scheduled maintenance. During this time, the server may be unavailable or restarting.`;
    case "restart":
      return `${game} will restart soon. Please save your progress and log out before the restart.`;
    case "modpack-update":
      return `There is a new modpack update for ${game}. Please update your client before connecting.`;
    case "rule-update":
      return `We have updated the rules for ${game}. Please review the changes to stay informed.`;
    case "new-event":
      return `A new event is starting on ${game}! Check the details below and join in on the fun.`;
    case "whitelist-opening":
      return `The whitelist for ${game} is now open! Apply today to secure your spot.`;
    case "new-player":
      return `Please give a warm welcome to our newest members of ${game}! We are glad to have you.`;
    case "general":
    default:
      return `Here is an update for ${game}. Please read through the details below.`;
  }
}

function toneClosing(tone) {
  switch (tone) {
    case "friendly":
      return "Thanks for being part of the community!";
    case "professional":
      return "Thank you for your attention to this announcement.";
    case "short":
      return "Thanks.";
    case "community":
      return "As always, thank you for being part of this community!";
    case "urgent":
      return "Please act promptly. Thank you for your cooperation.";
    default:
      return "Thank you.";
  }
}

function emojify(typeId) {
  const map = {
    "server-launch": "\ud83d\ude80",
    maintenance: "\ud83d\udd27",
    restart: "\ud83d\udd04",
    "modpack-update": "\ud83d\udce6",
    "rule-update": "\ud83d\udcdc",
    "new-event": "\ud83c\udf89",
    "whitelist-opening": "\ud83d\udd13",
    "new-player": "\ud83d\udc4b",
    general: "\ud83d\udce2",
  };
  return map[typeId] || "\ud83d\udce2";
}

export function generateAnnouncement({
  communityName,
  announcementType,
  game,
  tone,
  dateTime,
  reason,
  whatToDo,
  extraNote,
  selectedToggles,
}) {
  const name = communityName.trim() || "our community";
  const typeId = announcementType;
  const typeLabel = TYPE_HEADERS[typeId] || "Announcement";
  const gameLabel = GAME_LABELS[game] || "community";
  const includeEmojis = selectedToggles.includes("emojis");
  const includeRoleMention = selectedToggles.includes("role-mention");
  const includeCta = selectedToggles.includes("call-to-action");
  const includeThankYou = selectedToggles.includes("thank-you");

  const emoji = includeEmojis ? emojify(typeId) : "";
  const roleMention = includeRoleMention ? "@everyone" : "";
  const intro = toneIntro(tone, typeLabel);
  const body = toneBody(tone, typeId, gameLabel);
  const closing = toneClosing(tone);

  const lines = [];

  if (roleMention) lines.push(roleMention, "");

  const title = `${emoji} ${name} \u2014 ${typeLabel}`.trim();
  lines.push(`# ${title}`, "");

  if (includeEmojis) {
    lines.push(`${emoji} **${name}**`, "");
  }

  lines.push(intro, "");
  lines.push(body, "");

  if (dateTime.trim()) {
    lines.push(`**When:** ${dateTime.trim()}`, "");
  }

  if (reason.trim()) {
    lines.push(`**Reason:** ${reason.trim()}`, "");
  }

  if (whatToDo.trim()) {
    lines.push(`**What to do:** ${whatToDo.trim()}`, "");
  }

  if (includeCta) {
    lines.push("**Action required:** Please read the details above and respond if needed.", "");
  }

  if (extraNote.trim()) {
    lines.push(`**Note:** ${extraNote.trim()}`, "");
  }

  if (includeThankYou) {
    lines.push(closing, "");
  }

  const shortLines = [];

  if (roleMention) shortLines.push(roleMention);
  shortLines.push(`**${title}**`);
  shortLines.push("");
  shortLines.push(body);
  if (dateTime.trim()) shortLines.push(`\nWhen: ${dateTime.trim()}`);
  if (whatToDo.trim()) shortLines.push(`\n${whatToDo.trim()}`);

  const fullAnnouncement = lines.join("\n");
  const shortVersion = shortLines.join("\n");

  return {
    title: `${emoji} ${name} \u2014 ${typeLabel}`.trim(),
    fullAnnouncement,
    shortVersion,
  };
}
