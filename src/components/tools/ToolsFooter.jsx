import { Link } from "react-router-dom";

function ToolsFooter() {
  return (
    <footer className="border-t border-slate-800 py-6 sm:py-8 text-slate-500 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="text-center sm:text-left">
          <span className="font-bold text-white text-sm sm:text-base tracking-tight">
            QUESTPAUSE{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Tools
            </span>
          </span>
          <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5">Free tools for game server admins</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <Link
            to="/tools"
            className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            All Tools
          </Link>
          <span className="text-slate-700 text-[10px] sm:text-xs">/</span>
          <Link
            to="/privacy-policy"
            className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Privacy Policy
          </Link>
          <span className="text-slate-700 text-[10px] sm:text-xs">/</span>
          <Link
            to="/terms"
            className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Terms
          </Link>

        </div>
      </div>
    </footer>
  );
}

export default ToolsFooter;
