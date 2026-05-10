export function generateSettings(values, guidance) {
  const lines = [];
  const boolKeys = [
    "Public",
    "Open",
    "PauseEmpty",
    "GlobalChat",
    "PVP",
    "SafetySystem",
    "AutoCreateUserInWhiteList",
    "Whitelist",
    "SleepAllowed",
    "SleepNeeded",
    "PlayerSafehouse",
    "SafehouseAllowFire",
    "SafehouseAllowLoot",
    "SafehouseAllowTrepass",
    "FactionsEnabled",
    "AnnounceDeath",
    "DisplayUserName",
    "ShowFirstAndLastName",
    "AllowDestructionBySledgehammer",
    "AllowFireSpread",
    "KickFastPlayers",
    "AntiCheatProtection",
  ];

  for (const key of boolKeys) {
    if (values[key] !== undefined) {
      lines.push(`${key}=${values[key]}`);
    }
  }

  if (values.MaxPlayers !== undefined && values.MaxPlayers > 0) {
    lines.push(`MaxPlayers=${values.MaxPlayers}`);
  }
  if (values.FactionMinSize !== undefined && values.FactionMinSize > 0) {
    lines.push(`FactionMinSize=${values.FactionMinSize}`);
  }
  if (values.FastForwardMultiplier !== undefined) {
    lines.push(`FastForwardMultiplier=${values.FastForwardMultiplier}`);
  }

  return lines.join("\n");
}

export function generateExplanation(values, preset, guidance) {
  const parts = [];

  parts.push(`Server: ${values.serverName || "Project Zomboid Server"}`);
  parts.push(`Profile: ${preset?.label || "Custom"}`);
  parts.push("");

  if (preset?.guidance) {
    parts.push(preset.guidance);
    parts.push("");
  }

  parts.push("What to watch for:");

  if (values.PVP) {
    parts.push("- PvP is enabled. Players can damage each other. Consider faction and safehouse settings carefully.");
  }
  if (!values.PlayerSafehouse) {
    parts.push("- Safehouses are disabled. Players cannot claim buildings.");
  }
  if (values.SafehouseAllowLoot || values.SafehouseAllowTrepass) {
    parts.push("- Safehouse looting and trespassing are allowed. Base raiding is possible.");
  }
  if (values.SafehouseAllowFire) {
    parts.push("- Fire can be used inside safehouses. This can lead to structural damage.");
  }
  if (!values.SleepAllowed) {
    parts.push("- Sleep is disabled. All players must be online for time to pass.");
  }
  if (values.KickFastPlayers) {
    parts.push("- Fast player kick is enabled. Players moving unusually fast may be removed.");
  }
  if (guidance.lootRespawn && guidance.lootRespawn !== "Balanced") {
    parts.push(`- Loot respawn is set to "${guidance.lootRespawn}". This significantly affects item availability.`);
  }
  if (guidance.zombiePressure && guidance.zombiePressure !== "Balanced") {
    parts.push(`- Zombie pressure is "${guidance.zombiePressure}". Adjust respawn and population settings accordingly.`);
  }

  parts.push("");
  parts.push("Recommended testing:");
  parts.push("- Test these settings on a private server before applying to a live community.");
  parts.push("- Verify safehouse claims, PvP damage, and loot spawn rates work as expected.");
  parts.push("- Check that MaxPlayers and FactionMinSize make sense for your expected population.");
  parts.push("- Back up your servertest.ini before making changes.");

  return parts.join("\n");
}
