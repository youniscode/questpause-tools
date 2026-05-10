import { Link } from "react-router-dom";

function ToolBreadcrumbs({ category, toolName }) {
  return (
    <nav className="text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/tools" className="hover:text-indigo-400 transition">
            QUESTPAUSE Tools
          </Link>
        </li>
        {category && (
          <>
            <li className="text-slate-600">/</li>
            <li>
              <Link
                to={`/tools#${category.toLowerCase().replace(/\s+/g, "-")}-tools`}
                className="hover:text-indigo-400 transition"
              >
                {category}
              </Link>
            </li>
          </>
        )}
        {toolName && (
          <>
            <li className="text-slate-600">/</li>
            <li className="text-slate-300">{toolName}</li>
          </>
        )}
      </ol>
    </nav>
  );
}

export default ToolBreadcrumbs;
