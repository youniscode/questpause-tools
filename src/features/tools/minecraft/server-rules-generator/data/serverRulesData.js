export const SERVER_TYPES = [
  { id: "smp", label: "Small Survival SMP" },
  { id: "whitelist", label: "Whitelist Survival Server" },
  { id: "pve", label: "Chill PvE Server" },
  { id: "community", label: "Community Building Server" },
  { id: "family", label: "Family-Friendly Server" },
];

export const RULE_STRICTNESS = [
  { id: "relaxed", label: "Relaxed" },
  { id: "balanced", label: "Balanced" },
  { id: "strict", label: "Strict" },
];

export const RULE_TOGGLES = [
  { id: "no-griefing", label: "No griefing" },
  { id: "no-stealing", label: "No stealing" },
  { id: "no-cheating", label: "No cheating or hacked clients" },
  { id: "no-duping", label: "No duping or exploit farms" },
  { id: "respect-claims", label: "Respect claims and bases" },
  { id: "respectful-chat", label: "Keep chat respectful" },
  { id: "no-spam", label: "No spam or advertising" },
  { id: "ask-before-changes", label: "Ask before major world changes" },
  { id: "use-discord", label: "Use Discord for announcements" },
  { id: "staff-decisions-final", label: "Staff decisions are final" },
];

export const STRICTNESS_WARNINGS = {
  relaxed:
    "We want everyone to have a good time. Please follow these guidelines to keep the server enjoyable for all.",
  balanced:
    "Please follow the rules below. Breaking them may result in warnings or temporary suspension.",
  strict:
    "All rules are strictly enforced. Violations will result in immediate action, including permanent bans at staff discretion.",
};
