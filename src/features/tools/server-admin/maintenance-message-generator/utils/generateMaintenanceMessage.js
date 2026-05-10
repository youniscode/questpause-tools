const TYPE_LABELS = {
  planned: "Planned Maintenance",
  "quick-restart": "Quick Restart",
  "emergency-restart": "Emergency Restart",
  "modpack-update": "Modpack Update",
  "performance-fix": "Performance Fix",
  "back-online": "Server Back Online",
  "delayed-restart": "Delayed Restart",
  "extended-downtime": "Extended Downtime",
};

const GAME_LABELS = {
  minecraft: "Minecraft",
  "project-zomboid": "Project Zomboid",
  valheim: "Valheim",
  icarus: "ICARUS",
  "7-days": "7 Days to Die",
  general: "game server",
};

function emojify(typeId) {
  const map = {
    planned: "\ud83d\udd27",
    "quick-restart": "\ud83d\udd04",
    "emergency-restart": "\u26a0\ufe0f",
    "modpack-update": "\ud83d\udce6",
    "performance-fix": "\u26a1",
    "back-online": "\u2705",
    "delayed-restart": "\u23f0",
    "extended-downtime": "\ud83d\udd34",
  };
  return map[typeId] || "\ud83d\udce2";
}

function toneIntro(tone, typeLabel) {
  switch (tone) {
    case "friendly":
      return `Hey everyone! We have a ${typeLabel.toLowerCase()} coming up for the server.`;
    case "professional":
      return `This is a notice regarding scheduled ${typeLabel.toLowerCase()}.`;
    case "short":
      return `${typeLabel}:`;
    case "apologetic":
      return `We apologise, but we need to perform a ${typeLabel.toLowerCase()}. We will be back as soon as possible.`;
    case "urgent":
      return `\u26a0\ufe0f **URGENT: ${typeLabel.toUpperCase()}** \u26a0\ufe0f`;
    default:
      return `A ${typeLabel.toLowerCase()} is scheduled for the server.`;
  }
}

function toneBody(tone, typeId, gameLabel) {
  const game = gameLabel || "server";

  switch (typeId) {
    case "planned":
      return `${game} will be down for scheduled maintenance. We will use this time to apply updates and improve performance.`;
    case "quick-restart":
      return `${game} will restart shortly. The downtime should be brief.`;
    case "emergency-restart":
      return `${game} needs an immediate restart to resolve an issue. We apologise for the short notice.`;
    case "modpack-update":
      return `A new modpack update is being applied to ${game}. Please update your client after the restart.`;
    case "performance-fix":
      return `We are applying a performance fix to ${game}. This should improve stability and reduce lag.`;
    case "back-online":
      return `${game} is now back online! You can reconnect and continue playing.`;
    case "delayed-restart":
      return `The previously announced restart for ${game} has been delayed. We will share a new time shortly.`;
    case "extended-downtime":
      return `${game} is experiencing extended downtime. We are working to resolve the issue as quickly as possible.`;
    default:
      return `${game} will be temporarily unavailable.`;
  }
}

function toneClosing(tone, typeId) {
  if (typeId === "back-online") {
    switch (tone) {
      case "friendly": return "Thanks for your patience! The server is ready to go.";
      case "apologetic": return "Sorry for the inconvenience. The server is back now.";
      default: return "Thank you for your patience.";
    }
  }
  switch (tone) {
    case "friendly": return "Thanks for understanding! We will keep you updated.";
    case "professional": return "Thank you for your cooperation.";
    case "short": return "Thanks.";
    case "apologetic": return "We truly apologise for any inconvenience caused.";
    case "urgent": return "Please act promptly. Thank you.";
    default: return "Thank you.";
  }
}

function countdownMessages(name, gameLabel, typeLabel, includeEmojis) {
  const emoji = includeEmojis ? emojify("planned") + " " : "";
  const game = gameLabel || "server";
  const nameStr = name || "our server";
  const times = [15, 10, 5, 1];
  return times.map((min) =>
    `${emoji}[${typeLabel}] ${nameStr} will restart in ${min} minute${min > 1 ? "s" : ""}. Please save your progress and log out.`
  );
}

export function generateMaintenanceMessage({
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
  selectedToggles,
}) {
  const name = serverName.trim() || "our server";
  const typeId = messageType;
  const typeLabel = TYPE_LABELS[typeId] || "Maintenance";
  const gameLabel = GAME_LABELS[game] || "game server";
  const includeEmojis = selectedToggles.includes("emojis");
  const includeRoleMention = selectedToggles.includes("role-mention");
  const includeThankYou = selectedToggles.includes("thank-you");
  const includeRiskyWarning = selectedToggles.includes("risky-warning");
  const includeBackOnline = selectedToggles.includes("back-online-line");
  const includeCountdown = selectedToggles.includes("countdown");

  const emoji = includeEmojis ? emojify(typeId) : "";
  const roleMention = includeRoleMention ? "@everyone" : "";
  const intro = toneIntro(tone, typeLabel);
  const body = toneBody(tone, typeId, gameLabel);
  const closing = toneClosing(tone, typeId);

  const fullLines = [];

  if (roleMention) fullLines.push(roleMention, "");

  const header = `${emoji} ${name} \u2014 ${typeLabel}`.trim();
  fullLines.push(`# ${header}`, "");
  fullLines.push(intro, "");
  fullLines.push(body, "");

  if (maintenanceTime.trim()) fullLines.push(`**When:** ${maintenanceTime.trim()}`, "");
  if (estimatedDowntime.trim()) fullLines.push(`**Estimated downtime:** ${estimatedDowntime.trim()}`, "");
  if (reason.trim()) fullLines.push(`**Reason:** ${reason.trim()}`, "");
  if (whatToDo.trim()) fullLines.push(`**What to do:** ${whatToDo.trim()}`, "");
  if (includeRiskyWarning) fullLines.push(`**\u26a0\ufe0f Avoid risky activity:** Please do not start any major builds, exploration, or PvP until the maintenance is complete.`, "");
  if (includeBackOnline && typeId !== "back-online") fullLines.push(`*We will post a follow-up when ${name} is back online.*`, "");
  if (extraNote.trim()) fullLines.push(`**Note:** ${extraNote.trim()}`, "");
  if (includeThankYou) fullLines.push(closing, "");

  const shortLines = [];
  if (roleMention) shortLines.push(roleMention);
  shortLines.push(`**${header}**`);
  shortLines.push("");
  shortLines.push(body);
  if (maintenanceTime.trim()) shortLines.push(`\nWhen: ${maintenanceTime.trim()}`);
  if (estimatedDowntime.trim()) shortLines.push(`Downtime: ${estimatedDowntime.trim()}`);
  if (whatToDo.trim()) shortLines.push(`\n${whatToDo.trim()}`);

  const ingameLines = [];
  ingameLines.push(`[${typeLabel}] ${name}`);
  if (maintenanceTime.trim()) ingameLines.push(`Time: ${maintenanceTime.trim()}`);
  if (estimatedDowntime.trim()) ingameLines.push(`Downtime: ${estimatedDowntime.trim()}`);
  ingameLines.push(body);

  const countdowns = includeCountdown
    ? countdownMessages(name, gameLabel, typeLabel, includeEmojis)
    : [];

  return {
    title: header,
    fullMessage: fullLines.join("\n"),
    shortVersion: shortLines.join("\n"),
    ingameWarning: ingameLines.join("\n"),
    countdowns,
  };
}
