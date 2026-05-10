export function validateSettings(values) {
  const errors = [];
  if (values.MaxPlayers !== undefined && values.MaxPlayers !== "" && (isNaN(values.MaxPlayers) || values.MaxPlayers < 1)) {
    errors.push("Max players should be a positive number.");
  }
  if (values.FactionMinSize !== undefined && values.FactionMinSize !== "" && (isNaN(values.FactionMinSize) || values.FactionMinSize < 1)) {
    errors.push("Faction minimum size should be a positive number.");
  }
  return errors;
}
