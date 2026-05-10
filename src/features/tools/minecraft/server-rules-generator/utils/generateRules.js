import { STRICTNESS_WARNINGS } from "../data/serverRulesData.js";

function strictnessTone(strictness) {
  switch (strictness) {
    case "relaxed":
      return { intro: "We kindly ask everyone to:", footer: "Thanks for being awesome!" };
    case "strict":
      return { intro: "The following rules are strictly enforced:", footer: "Zero tolerance. Play fair or don't play." };
    default:
      return { intro: "Please follow these rules:", footer: "Thanks for helping keep the server fun for everyone." };
  }
}

export function generateRules(serverName, serverType, strictness, selectedToggles, useDiscord) {
  const name = serverName.trim() || "our Minecraft server";
  const tone = strictnessTone(strictness);
  const warning = STRICTNESS_WARNINGS[strictness] || STRICTNESS_WARNINGS.balanced;

  const typeLabel = {
    smp: "Small Survival SMP",
    whitelist: "Whitelist Survival Server",
    pve: "Chill PvE Server",
    community: "Community Building Server",
    family: "Family-Friendly Server",
  };

  const rulesList = selectedToggles.map((id, i) => {
    const labels = {
      "no-griefing": "No griefing",
      "no-stealing": "No stealing",
      "no-cheating": "No cheating or hacked clients",
      "no-duping": "No duping or exploit farms",
      "respect-claims": "Respect claims and bases",
      "respectful-chat": "Keep chat respectful",
      "no-spam": "No spam or advertising",
      "ask-before-changes": "Ask before major world changes",
      "use-discord": "Use Discord for announcements",
      "staff-decisions-final": "Staff decisions are final",
    };
    return `${i + 1}. ${labels[id] || id}`;
  });

  const lines = [
    `${name} - Server Rules`,
    "",
    `Welcome to ${name}! This is a ${typeLabel[serverType] || "Minecraft server"} community.`,
    "",
    warning,
    "",
    tone.intro,
    "",
    ...rulesList,
    "",
    tone.footer,
  ];

  if (useDiscord) {
    lines.push("", "Join our Discord for announcements, support, and community.");
  }

  return lines.join("\n");
}
