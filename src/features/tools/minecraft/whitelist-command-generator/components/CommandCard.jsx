import CopyButton from "./CopyButton.jsx";

function CommandCard({ label, command, onCopy, justCopied }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 sm:gap-4 sm:p-4">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
        <code className="mt-0.5 block truncate font-mono text-sm text-indigo-200">
          {command}
        </code>
      </div>
      <CopyButton onClick={onCopy} justCopied={justCopied} />
    </div>
  );
}

export default CommandCard;
