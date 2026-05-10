import CommandCard from "./CommandCard.jsx";

function CommandList({ commands, generateFn, copyFn, copiedIndex }) {
  return (
    <div className="mt-4 space-y-2">
      {commands.map((cmd, i) => {
        const command = generateFn(cmd.template);
        return (
          <CommandCard
            key={cmd.label}
            label={cmd.label}
            command={command}
            onCopy={() => copyFn(command, i)}
            justCopied={copiedIndex === i}
          />
        );
      })}
    </div>
  );
}

export default CommandList;
