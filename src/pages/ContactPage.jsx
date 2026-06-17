import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ToolsHeader from "../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../components/tools/ToolsFooter.jsx";
import { setSEO } from "../utils/seo.js";

const seo = {
  title: "Contact QUESTPAUSE Tools",
  description:
    "Report bugs, suggest new tools, or send feedback about QUESTPAUSE Tools.",
};

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
    const mailSubject = encodeURIComponent(
      `QUESTPAUSE Tools Contact: ${formData.subject}`,
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}
Email: ${formData.email}
Message:
${formData.message}`,
    );
    window.location.href = `mailto:jonas@questpause.com?subject=${mailSubject}&body=${body}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ToolsHeader />

      <section className="border-b border-slate-800/80">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Contact QUESTPAUSE Tools</h1>

          <div className="mt-8 flex flex-col gap-6 text-sm leading-6 text-slate-400">
            <p>
              Have a bug to report, a tool suggestion, or general feedback? I would love to
              hear from you.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Subject <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Message <span className="text-amber-400">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/55 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
              >
                Send message
              </button>

              <p className="text-xs text-slate-600 text-center">
                Your information will be sent via email. No data is stored on a server.
              </p>
            </form>
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

export default ContactPage;
