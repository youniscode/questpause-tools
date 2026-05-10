export function parseInput(input) {
  if (!input || !input.trim()) return [];

  let cleaned = input.trim();
  if (cleaned.startsWith("WorkshopItems=")) cleaned = cleaned.slice("WorkshopItems=".length);
  else if (cleaned.startsWith("Mods=")) cleaned = cleaned.slice("Mods=".length);
  else if (cleaned.startsWith("Map=")) cleaned = cleaned.slice("Map=".length);

  const items = cleaned.split(/[;\n]+/).map((s) => s.trim()).filter((s) => s.length > 0);

  const seen = new Set();
  const unique = [];
  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      unique.push(item);
    }
  }

  return unique;
}

export function formatModList({ workshopItems, mods, map }) {
  const workshopParsed = parseInput(workshopItems);
  const modsParsed = parseInput(mods);
  const mapParsed = parseInput(map);

  const warnings = [];

  if (workshopParsed.length > 0) {
    const nonNumeric = workshopParsed.filter((id) => !/^\d+$/.test(id));
    if (nonNumeric.length > 0) {
      warnings.push({
        type: "WorkshopItems",
        message: `WorkshopItems usually expects numeric Steam Workshop IDs. Non-numeric values found: "${nonNumeric.join('", "')}"`,
      });
    }
  }

  if (modsParsed.length > 0) {
    const numericMods = modsParsed.filter((id) => /^\d+$/.test(id));
    if (numericMods.length > 0) {
      warnings.push({
        type: "Mods",
        message: `Mods usually expects mod folder IDs (e.g., "ModName"), not numeric workshop IDs. Numeric-only values found: "${numericMods.join('", "')}"`,
      });
    }
  }

  const output = {
    workshopItems: workshopParsed.length > 0 ? workshopParsed.join(";") : null,
    mods: modsParsed.length > 0 ? modsParsed.join(";") : null,
    map: mapParsed.length > 0 ? mapParsed.join(";") : null,
    fullBlock: "",
    warnings,
    raw: {
      workshopItems: workshopParsed,
      mods: modsParsed,
      map: mapParsed,
    },
  };

  const lines = [];
  if (output.workshopItems !== null) lines.push(`WorkshopItems=${output.workshopItems}`);
  if (output.mods !== null) lines.push(`Mods=${output.mods}`);
  if (output.map !== null) lines.push(`Map=${output.map}`);
  output.fullBlock = lines.join("\n");

  return output;
}
