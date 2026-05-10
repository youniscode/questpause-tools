export function generateCommand(template, playerName, prefix) {
  const name = playerName.trim() || "{name}";
  return `${prefix}${template.replace("{name}", name)}`;
}

export function generateAllCommands(templates, playerName, prefix) {
  return templates.map((t) => generateCommand(t, playerName, prefix));
}
