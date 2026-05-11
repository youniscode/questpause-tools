import { useEffect } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../components/tools/ToolsFooter.jsx";
import { setSEO } from "../utils/seo.js";

const seo = {
  title: "About QUESTPAUSE Tools",
  description:
    "QUESTPAUSE Tools is a free browser-based toolkit for game server admins, Discord community owners, and survival server operators.",
};

function AboutPage() {
  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ToolsHeader />

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">About QUESTPAUSE Tools</h1>

          <div className="mt-8 flex flex-col gap-6 text-sm leading-6 text-slate-400">
            <div>
              <h2 className="text-lg font-semibold text-white">What is QUESTPAUSE Tools?</h2>
              <p className="mt-2">
                QUESTPAUSE Tools is a free browser-based toolkit for game server admins, Discord
                community owners, and survival server operators. No account is required. No payment
                is required. Every tool runs entirely in your browser with nothing to install.
              </p>
              <p className="mt-2">
                The tools are designed to save time and improve community and server operations.
                Instead of typing commands manually, drafting rules from scratch, or formatting
                config files by hand, you can generate what you need in seconds.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Supported Games and Platforms</h2>
              <p className="mt-2">
                QUESTPAUSE Tools covers a wide range of games and server workflows:
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 pl-5">
                <li className="list-disc">Minecraft &mdash; commands, rules, MOTDs, whitelist applications, LFG posts, server.properties</li>
                <li className="list-disc">Discord &mdash; announcements, rules, welcome messages</li>
                <li className="list-disc">Server Admin &mdash; maintenance notices, status messages</li>
                <li className="list-disc">Project Zomboid &mdash; admin messages, mod list formatting, server settings, safehouse rules</li>
                <li className="list-disc">Valheim &mdash; server rules, event announcements, admin command helper</li>
                <li className="list-disc">ICARUS &mdash; server rules</li>
                <li className="list-disc">7 Days to Die &mdash; server rules</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">How It Works</h2>
              <p className="mt-2">
                All processing happens locally in your browser. Nothing is sent to a server. Your
                data stays on your device. Every tool is self-contained with no backend, no
                database, and no login system.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Independent Project</h2>
              <p className="mt-2">
                QUESTPAUSE Tools is an independent fan-made tools project. It is not affiliated
                with Mojang, Microsoft, Discord, The Indie Stone, Iron Gate, RocketWerkz, The Fun
                Pimps, or any other game publisher referenced on this site.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Link
            to="/tools"
            className="text-sm text-slate-500 hover:text-indigo-400 transition"
          >
            &larr; Browse all tools
          </Link>
        </div>
      </section>

      <ToolsFooter />
    </main>
  );
}

export default AboutPage;
