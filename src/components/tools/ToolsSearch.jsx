function ToolsSearch({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full">
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/70"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search tools..."}
        className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 py-3.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-300 focus:border-amber-500/50 focus:bg-slate-900 focus:shadow-lg focus:shadow-amber-500/5 backdrop-blur-sm"
      />
    </div>
  );
}

export default ToolsSearch;
