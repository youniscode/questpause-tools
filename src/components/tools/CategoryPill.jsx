import { CATEGORY_COLORS } from "../../features/tools/toolsRegistry.js";

function CategoryPill({ category, size = "sm" }) {
  const color = CATEGORY_COLORS[category] || "#6b7280";
  const sizeClasses = size === "lg"
    ? "px-3 py-1 text-xs"
    : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider ${sizeClasses}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {category}
    </span>
  );
}

export default CategoryPill;
