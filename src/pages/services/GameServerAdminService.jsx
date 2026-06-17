import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../components/tools/ToolsFooter.jsx";
import { setSEO } from "../../utils/seo.js";

const seo = {
  title: "Game Server & Discord Admin Setup | QUESTPAUSE Tools",
  description:
    "I help gaming communities set up cleaner Discord servers, admin workflows, support channels, and simple server status / monitoring structures.",
};

const PROBLEMS = [
  "Messy Discord channels",
  "Confusing roles and permissions",
  "No clear onboarding flow",
  "No proper support/report system",
  "Players do not know where to ask for help",
  "Server admins lose time answering repeated questions",
  "No clear admin handover documentation",
  "No basic status/alert structure",
];

const SERVICES_LIST = [
  "Discord channel structure",
  "Roles and permissions cleanup",
  "Welcome and onboarding flow",
  "Rules and information channels",
  "Support / report / ticket flow planning",
  "Server status channel structure",
  "Admin checklist and handover document",
  "Community operations advice",
];

const PACKAGES = [
  {
    name: "Starter Review",
    price: "from €49",
    items: [
      "Discord/server structure review",
      "5 improvement recommendations",
      "Basic admin checklist",
    ],
  },
  {
    name: "Community Setup",
    price: "from €149",
    items: [
      "Discord channel structure",
      "Roles and permissions setup",
      "Onboarding flow",
      "Rules and support channels",
      "Handover document",
    ],
  },
  {
    name: "Advanced Server Ops Setup",
    price: "from €249",
    items: [
      "Everything in Community Setup",
      "Status/alert channel structure",
      "Support workflow",
      "Admin documentation",
      "7 days post-delivery support",
    ],
    highlighted: true,
  },
  {
    name: "Monthly Support",
    price: "from €29/month",
    items: [
      "Small updates",
      "Community admin advice",
      "Server ops support",
      "Improvement suggestions",
    ],
  },
];

const STEPS = [
  { num: 1, text: "You send your Discord/server context" },
  { num: 2, text: "I review your current setup" },
  { num: 3, text: "I prepare or improve the structure" },
  { num: 4, text: "You receive a clean handover and next steps" },
];

function GameServerAdminService() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    discord: "",
    community: "",
    game: "",
    problem: "",
    package: "",
    message: "",
  });

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Game Server Admin Setup Request from ${formData.name}`,
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}
Email: ${formData.email}
Discord: ${formData.discord || "N/A"}
Community / Server: ${formData.community}
Game: ${formData.game}
Current problem: ${formData.problem}
Package interest: ${formData.package}
Message: ${formData.message}`,
    );
    window.location.href = `mailto:jonas@questpause.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ToolsHeader />

      {/* Hero */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">
            Game Server & Discord Admin Setup
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            I help gaming communities set up cleaner Discord servers, admin workflows,
            support channels, and simple server status / monitoring structures.
          </p>
        </div>
      </section>

      {/* Problems */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
            Problems I help with
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PROBLEMS.map((p) => (
              <li
                key={p}
                className="rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-3 text-sm text-slate-300"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
            Services offered
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {SERVICES_LIST.map((s) => (
              <li
                key={s}
                className="rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-3 text-sm text-slate-300"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Packages */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
            Packages
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl border p-5 flex flex-col ${
                  pkg.highlighted
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-slate-800 bg-slate-900/55"
                }`}
              >
                <h3 className="text-base font-semibold text-white">{pkg.name}</h3>
                <p className="mt-1 text-lg font-bold text-amber-400">{pkg.price}</p>
                <ul className="mt-4 flex flex-col gap-2 text-xs text-slate-400 flex-1">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
            Process
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-xl border border-slate-800 bg-slate-900/55 p-4 text-center"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold">
                  {step.num}
                </span>
                <p className="mt-2 text-sm text-slate-300">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
            Want help setting up your gaming community?
          </h2>
          <p className="mt-3 text-sm text-slate-400 text-center max-w-lg mx-auto">
            Send me your Discord/server context and what you want to improve.
            I will suggest the best starting point.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Email <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Discord username
                </label>
                <input
                  type="text"
                  name="discord"
                  value={formData.discord}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  placeholder="optional"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Community / Server name
                </label>
                <input
                  type="text"
                  name="community"
                  value={formData.community}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  placeholder="Your server name"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Game
                </label>
                <input
                  type="text"
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  placeholder="e.g. Minecraft, Valheim"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Package interest
                </label>
                <select
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Not sure yet</option>
                  <option value="Starter Review">Starter Review</option>
                  <option value="Community Setup">Community Setup</option>
                  <option value="Advanced Server Ops Setup">Advanced Server Ops Setup</option>
                  <option value="Monthly Support">Monthly Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Current problem
              </label>
              <textarea
                name="problem"
                rows={2}
                value={formData.problem}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 resize-none"
                placeholder="What is the main issue you are facing?"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 resize-none"
                placeholder="Any additional details..."
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Request setup help
            </button>

            <p className="text-xs text-slate-600 text-center">
              Your information will be sent via email. No data is stored on a server.
            </p>
          </form>
        </div>
      </section>

      {/* Back link */}
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

export default GameServerAdminService;
