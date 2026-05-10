export const GAMES = [
  { id: "minecraft", label: "Minecraft" },
  { id: "project-zomboid", label: "Project Zomboid" },
  { id: "valheim", label: "Valheim" },
  { id: "icarus", label: "ICARUS" },
  { id: "7-days", label: "7 Days to Die" },
  { id: "general", label: "General Game Server" },
];

export const MESSAGE_TYPES = [
  { id: "planned", label: "Planned Maintenance" },
  { id: "quick-restart", label: "Quick Restart" },
  { id: "emergency-restart", label: "Emergency Restart" },
  { id: "modpack-update", label: "Modpack Update" },
  { id: "performance-fix", label: "Performance Fix" },
  { id: "back-online", label: "Server Back Online" },
  { id: "delayed-restart", label: "Delayed Restart" },
  { id: "extended-downtime", label: "Extended Downtime" },
];

export const PLATFORMS = [
  { id: "discord", label: "Discord Announcement" },
  { id: "ingame", label: "In-game Warning" },
  { id: "short", label: "Short Message" },
  { id: "full", label: "Full Maintenance Post" },
];

export const TONES = [
  { id: "friendly", label: "Friendly" },
  { id: "professional", label: "Professional" },
  { id: "short", label: "Short and direct" },
  { id: "apologetic", label: "Apologetic" },
  { id: "urgent", label: "Urgent" },
];

export const MAINTENANCE_TOGGLES = [
  { id: "emojis", label: "Add emojis" },
  { id: "role-mention", label: "Add role mention placeholder" },
  { id: "thank-you", label: "Add thank-you message" },
  { id: "risky-warning", label: 'Add "avoid risky activity" warning' },
  { id: "back-online-line", label: 'Add "server is back online" line' },
  { id: "countdown", label: "Add countdown versions" },
];
