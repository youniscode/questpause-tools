import { Link } from "react-router-dom";

function ToolsFooter() {
  return (
    <footer className="border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 text-slate-500 text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
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
              to="/about"
              className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              About
            </Link>
            <span className="text-slate-700 text-[10px] sm:text-xs">/</span>
            <Link
              to="/contact"
              className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Contact
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

        <div className="mt-6 border-t border-slate-800/60 pt-4">
          <p className="text-[10px] sm:text-xs leading-5 text-slate-600 text-center">
            QUESTPAUSE Tools is an independent fan-made tools project and is not affiliated
            with Mojang, Microsoft, Discord, The Indie Stone, Iron Gate, RocketWerkz, The Fun
            Pimps, or other game publishers referenced on this site.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default ToolsFooter;
