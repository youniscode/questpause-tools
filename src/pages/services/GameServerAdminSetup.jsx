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

const SERVICES = [
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
    price: "from \u20ac49",
    includes: [
      "Discord/server structure review",
      "5 improvement recommendations",
      "Basic admin checklist",
    ],
  },
  {
    name: "Community Setup",
    price: "from \u20ac149",
    includes: [
      "Discord channel structure",
      "Roles and permissions setup",
      "Onboarding flow",
      "Rules and support channels",
      "Handover document",
    ],
  },
  {
    name: "Advanced Server Ops Setup",
    price: "from \u20ac249",
    includes: [
      "Everything in Community Setup",
      "Status/alert channel structure",
      "Support workflow",
      "Admin documentation",
      "7 days post-delivery support",
    ],
  },
  {
    name: "Monthly Support",
    price: "from \u20ac29/month",
    includes: [
      "Small updates",
      "Community admin advice",
      "Server ops support",
      "Improvement suggestions",
    ],
  },
];

const STEPS = [
  {
    step: 1,
    title: "You send your Discord/server context",
  },
  {
    step: 2,
    title: "I review your current setup",
  },
  {
    step: 3,
    title: "I prepare or improve the structure",
  },
  {
    step: 4,
    title: "You receive a clean handover and next steps",
  },
];

function GameServerAdminSetup() {
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
      [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        `Discord: ${formData.discord || "N/A"}`,
        `Community/Server: ${formData.community}`,
        `Game: ${formData.game}`,
        `Current problem: ${formData.problem}`,
        `Package interest: ${formData.package || "N/A"}`,
        `Message: ${formData.message}`,
      ].join("\n"),
    );
    window.location.href = `mailto:contact@jonascode.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ToolsHeader />

      {/* Hero */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 text-center">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Game Server & Discord Admin Setup
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            I help gaming communities set up cleaner Discord servers, admin
            workflows, support channels, and simple server status / monitoring
            structures.
          </p>
        </div>
      </section>

      {/* Problems */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Problems I help with
          </h2>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {PROBLEMS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-3 text-sm text-slate-300"
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Services offered
          </h2>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-3 text-sm text-slate-300"
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Packages */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <h2 className="text-lg sm:text-xl font-semibold text-white text-center">
            Packages
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/55 p-5"
              >
                <h3 className="text-base font-semibold text-white">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-sm text-amber-400 font-medium">
                  {pkg.price}
                </p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {pkg.includes.map((item) => (
                    <li
                      key={item}
                      className="text-xs text-slate-400 flex items-start gap-1.5"
                    >
                      <span className="text-amber-400 mt-px">&#8226;</span>
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
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <h2 className="text-lg sm:text-xl font-semibold text-white text-center">
            How it works
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400">
                  {step.step}
                </span>
                <p className="text-sm text-slate-300">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
          <h2 className="text-lg sm:text-xl font-semibold text-white text-center">
            Want help setting up your gaming community?
          </h2>
          <p className="mt-2 text-sm text-slate-400 text-center">
            Send me your Discord/server context and what you want to improve. I
            will suggest the best starting point.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-500/40 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-500/40 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Discord username <span className="text-slate-600">(optional)</span>
                </label>
                <input
                  type="text"
                  name="discord"
                  value={formData.discord}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-500/40 focus:outline-none"
                  placeholder="user#0000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Community / server name
                </label>
                <input
                  type="text"
                  name="community"
                  required
                  value={formData.community}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-500/40 focus:outline-none"
                  placeholder="My awesome server"
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
                  required
                  value={formData.game}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-500/40 focus:outline-none"
                  placeholder="Minecraft, Valheim, ..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Current problem
                </label>
                <input
                  type="text"
                  name="problem"
                  required
                  value={formData.problem}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-500/40 focus:outline-none"
                  placeholder="Messy channels, unclear roles..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Package interest
              </label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2.5 text-sm text-slate-300 focus:border-amber-500/40 focus:outline-none"
              >
                <option value="">Not sure yet</option>
                {PACKAGES.map((pkg) => (
                  <option key={pkg.name} value={pkg.name}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-amber-500/40 focus:outline-none resize-y"
                placeholder="Tell me more about your community and what you need help with..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Request setup help
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <p className="text-xs text-slate-600 text-center">
              Your information will be sent via email. No data is stored on a
              server.
            </p>
          </form>
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

export default GameServerAdminSetup;
