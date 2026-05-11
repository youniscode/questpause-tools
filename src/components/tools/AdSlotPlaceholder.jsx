const AD_SLOT_POSITIONS = {
  "below-hero": {
    label: "Below tool hero / introduction",
    note: "Future ad slot — appears after the tool's hero section, before the generator form.",
  },
  "between-generator-and-seo": {
    label: "Between generator and SEO content",
    note: "Future ad slot — appears after the tool output area, before the how-to / FAQ sections.",
  },
  sidebar: {
    label: "Desktop sidebar",
    note: "Future ad slot — visible on desktop only, to the side of the main tool content.",
  },
};

function AdSlotPlaceholder({ position = "below-hero", devOnly = true }) {
  const slot = AD_SLOT_POSITIONS[position];
  if (!slot) return null;

  if (devOnly) return null;

  return (
    <div
      className="border border-dashed border-slate-700/50 rounded-xl bg-slate-900/30 py-8 text-center"
      data-ad-slot={position}
      aria-hidden="true"
    >
      <p className="text-[10px] uppercase tracking-widest text-slate-600">
        Ad Slot
      </p>
      <p className="text-xs text-slate-700 mt-1">{slot.label}</p>
    </div>
  );
}

export default AdSlotPlaceholder;
