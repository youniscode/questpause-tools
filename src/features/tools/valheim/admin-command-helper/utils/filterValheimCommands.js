export function filterValheimCommands(commands, { search, category }) {
  let result = commands;

  if (category && category !== "All") {
    result = result.filter((cmd) => cmd.category === category);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        cmd.syntax.toLowerCase().includes(q),
    );
  }

  return result;
}
