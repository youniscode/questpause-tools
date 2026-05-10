function ToggleOption({ id, label, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(id)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
      />
      <span className="text-sm text-slate-300 group-hover:text-slate-200 transition">
        {label}
      </span>
    </label>
  );
}

export default ToggleOption;
