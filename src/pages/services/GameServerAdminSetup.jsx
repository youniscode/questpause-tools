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
  const [formStatus, setFormStatus] = useState("idle");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("discord", formData.discord || "N/A");
      data.append("community", formData.community);
      data.append("game", formData.game);
      data.append("problem", formData.problem);
      data.append("package", formData.package || "N/A");
      data.append("message", formData.message);
      data.append("_subject", `Game Server Admin Setup Request from ${formData.name}`);

      const res = await fetch("https://formspree.io/f/xblpnjae", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setFormStatus("success");
        setFormData({
          name: "", email: "", discord: "", community: "",
          game: "", problem: "", package: "", message: "",
        });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("contact@jonascode.com");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // clipboard not available
    }
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
            The fastest way is to join the QUESTPAUSE Discord and send me a
            short message about your server, game, and what you want to improve.
          </p>

          {/* Primary CTA */}
          <div className="mt-6 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent px-5 py-5 sm:px-6 sm:py-6 text-center">
            <p className="text-sm text-slate-300">
              Fastest way to contact me — send me a message in the QUESTPAUSE Discord.
            </p>
            <a
              href="https://discord.gg/dUFtAPu48T"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276 14.091 14.091 0 001.2004-1.9482.0763.0763 0 00-.0415-.1057 13.1717 13.1717 0 01-1.8342-.8715.0766.0766 0 01-.0075-.1351c.1301-.0965.2597-.1968.3834-.2887a.0731.0731 0 01.074-.0063c3.8388 1.7459 7.9982 1.7459 11.7938 0a.0716.0716 0 01.0744.0063c.1245.092.2539.1922.3846.2889a.0763.0763 0 01-.0068.1348 13.212 13.212 0 01-1.8356.8708.0772.0772 0 00-.0414.1056c.361.6678.786 1.3217 1.2004 1.9484a.0757.0757 0 00.0844.0274c1.9556-.6066 3.944-1.5219 5.9968-3.0295a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
              </svg>
              Join Discord / Ask for setup help
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-4"
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

            {formStatus === "success" && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">
                Thanks — your request was sent. I'll reply as soon as possible.
              </div>
            )}

            {formStatus === "error" && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                Something went wrong. You can contact me directly on{" "}
                <a
                  href="https://discord.gg/dUFtAPu48T"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-red-200"
                >
                  Discord
                </a>.
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus === "submitting" ? "Sending..." : "Send request form"}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>

          {/* Backup contact options */}
          <div className="mt-8 pt-6 border-t border-slate-800/60">
            <h3 className="text-sm font-semibold text-white text-center">
              Prefer direct contact?
            </h3>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://discord.gg/dUFtAPu48T"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-indigo-500/30 hover:text-indigo-300 transition-colors"
              >
                Join Discord
              </a>
              <a
                href="https://ko-fi.com/questpause"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-amber-500/30 hover:text-amber-300 transition-colors"
              >
                Support on Ko-fi
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-amber-500/30 hover:text-amber-300 transition-colors"
              >
                {copySuccess ? "Copied!" : "Copy email"}
              </button>
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

export default GameServerAdminSetup;
