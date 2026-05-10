function CopyButton({ onClick, justCopied }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        justCopied
          ? "bg-emerald-500 text-white"
          : "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
      }`}
    >
      {justCopied ? "Copied!" : "Copy"}
    </button>
  );
}

export default CopyButton;
