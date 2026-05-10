function CopyButton({ onClick, copied }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={copied}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
        copied
          ? "bg-emerald-500 text-white cursor-default"
          : "bg-indigo-500 text-white hover:bg-indigo-400"
      }`}
    >
      {copied ? "Copied!" : "Copy Rules"}
    </button>
  );
}

export default CopyButton;
