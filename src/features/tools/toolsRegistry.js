export const toolsRegistry = [
  {
    id: "minecraft-whitelist-command-generator",
    category: "Minecraft",
    title: "Minecraft Whitelist Command Generator",
    description:
      "Generate whitelist, op, deop, ban, pardon, and kick commands for Minecraft servers.",
    path: "/tools/minecraft-whitelist-command-generator",
    status: "live",
    image: "/images/tools/minecraft-whitelist.jpg",
    icon: "⚔️",
    accentColor: "#10b981",
    tags: ["minecraft", "whitelist", "commands", "server admin"],
    isPopular: true,
    relatedToolIds: ["minecraft-server-rules-generator", "minecraft-lfg-post-generator"],
  },
  {
    id: "minecraft-server-rules-generator",
    category: "Minecraft",
    title: "Minecraft Server Rules Generator",
    description:
      "Generate clear server rules for SMP, whitelist, PvE, and community survival servers.",
    path: "/tools/minecraft-server-rules-generator",
    status: "live",
    image: "/images/tools/minecraft-rules.jpg",
    icon: "📜",
    accentColor: "#10b981",
    tags: ["minecraft", "rules", "server admin", "community"],
    isPopular: false,
    relatedToolIds: ["minecraft-whitelist-command-generator", "minecraft-lfg-post-generator"],
  },
  {
    id: "minecraft-lfg-post-generator",
    category: "Minecraft",
    title: "Minecraft LFG Post Generator",
    description:
      "Generate Reddit and Discord-friendly LFG posts for Minecraft SMPs, whitelist servers, and small survival communities.",
    path: "/tools/minecraft-lfg-post-generator",
    status: "live",
    image: "/images/tools/minecraft-lfg.jpg",
    icon: "📢",
    accentColor: "#10b981",
    tags: ["minecraft", "lfg", "recruitment", "community"],
    isPopular: false,
    relatedToolIds: ["minecraft-whitelist-command-generator", "minecraft-server-rules-generator"],
  },
  {
    id: "discord-announcement-generator",
    category: "Discord",
    title: "Discord Announcement Generator",
    description:
      "Generate polished Discord announcements for gaming communities, server launches, maintenance notices, events, and updates.",
    path: "/tools/discord-announcement-generator",
    status: "live",
    image: "/images/tools/discord-announcement.jpg",
    icon: "💬",
    accentColor: "#6366f1",
    tags: ["discord", "announcements", "community", "notifications"],
    isPopular: true,
    relatedToolIds: [
      "server-maintenance-message-generator",
      "minecraft-lfg-post-generator",
      "minecraft-whitelist-command-generator",
    ],
  },
  {
    id: "server-maintenance-message-generator",
    category: "Server Admin",
    title: "Server Maintenance Message Generator",
    description:
      "Generate maintenance notices, restart warnings, downtime updates, and in-game warning messages for game servers.",
    path: "/tools/server-maintenance-message-generator",
    status: "live",
    image: "/images/tools/server-maintenance.jpg",
    icon: "🔧",
    accentColor: "#3b82f6",
    tags: ["server admin", "maintenance", "downtime", "warnings"],
    isPopular: true,
    relatedToolIds: [
      "discord-announcement-generator",
      "project-zomboid-mod-list-formatter",
      "valheim-admin-command-helper",
    ],
  },
  {
    id: "project-zomboid-mod-list-formatter",
    category: "Project Zomboid",
    title: "Project Zomboid Mod List Formatter",
    description:
      "Format WorkshopItems, Mods, and Map lines for Project Zomboid servertest.ini files.",
    path: "/tools/project-zomboid-mod-list-formatter",
    status: "live",
    image: "/images/tools/project-zomboid-mods.jpg",
    icon: "🧟",
    accentColor: "#e11d48",
    tags: ["project zomboid", "mods", "workshop", "servertest.ini"],
    isPopular: false,
    relatedToolIds: [
      "server-maintenance-message-generator",
      "discord-announcement-generator",
      "minecraft-whitelist-command-generator",
    ],
  },
  {
    id: "project-zomboid-server-settings-helper",
    category: "Project Zomboid",
    title: "Project Zomboid Server Settings Helper",
    description:
      "Generate and understand common Project Zomboid servertest.ini settings for PvE, PvP, whitelist, safehouses, factions, chat, sleep, and long-term servers.",
    path: "/tools/project-zomboid-server-settings-helper",
    status: "live",
    image: "/images/tools/project-zomboid-settings.jpg",
    icon: "⚙️",
    accentColor: "#e11d48",
    tags: ["project zomboid", "server settings", "servertest.ini", "admin"],
    isPopular: true,
    relatedToolIds: [
      "project-zomboid-mod-list-formatter",
      "server-maintenance-message-generator",
      "minecraft-server-rules-generator",
    ],
  },
  {
    id: "valheim-admin-command-helper",
    category: "Valheim",
    title: "Valheim Admin Command Helper",
    description:
      "Search, understand, and copy useful Valheim admin, moderation, debug, teleport, map, and spawn commands.",
    path: "/tools/valheim-admin-command-helper",
    status: "live",
    image: "/images/tools/valheim-admin.jpg",
    icon: "🛡️",
    accentColor: "#f59e0b",
    tags: ["valheim", "admin commands", "server admin", "moderation", "debug", "teleport", "spawn"],
    isPopular: true,
    relatedToolIds: [
      "server-maintenance-message-generator",
      "discord-announcement-generator",
      "project-zomboid-mod-list-formatter",
      "minecraft-server-rules-generator",
    ],
  },
];

export const CATEGORIES = [
  "Minecraft",
  "Discord",
  "Server Admin",
  "Project Zomboid",
  "Valheim",
  "ICARUS",
  "7 Days to Die",
];

export const CATEGORY_COLORS = {
  Minecraft: "#10b981",
  Discord: "#6366f1",
  "Server Admin": "#3b82f6",
  "Project Zomboid": "#e11d48",
  Valheim: "#f59e0b",
  ICARUS: "#06b6d4",
  "7 Days to Die": "#f97316",
};

export const CATEGORY_ICONS = {
  Minecraft: "⚔️",
  Discord: "💬",
  "Server Admin": "🔧",
  "Project Zomboid": "🧟",
  Valheim: "🛡️",
  ICARUS: "🌍",
  "7 Days to Die": "🧱",
};

export function getRelatedTools(toolId, limit = 4) {
  const tool = toolsRegistry.find((t) => t.id === toolId);
  if (!tool) return [];
  return toolsRegistry
    .filter(
      (t) => tool.relatedToolIds?.includes(t.id) && t.status === "live",
    )
    .slice(0, limit);
}
