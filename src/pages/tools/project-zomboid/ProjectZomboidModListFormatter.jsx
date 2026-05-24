import { useState, useCallback, useEffect } from "react";
import ToolsHeader from "../../../components/tools/ToolsHeader.jsx";
import ToolsFooter from "../../../components/tools/ToolsFooter.jsx";
import RelatedTools from "../../../components/tools/RelatedTools.jsx";
import { setSEO } from "../../../utils/seo.js";
import { formatModList } from "../../../features/tools/project-zomboid/mod-list-formatter/index.js";

const seo = {
  title: "Project Zomboid Mod List Formatter | QUESTPAUSE Tools",
  description:
    "Format Project Zomboid WorkshopItems, Mods, and Map lines for servertest.ini. Free Project Zomboid server admin tool by QUESTPAUSE Tools.",
};

const EXAMPLE_WORKSHOP = `WorkshopItems=2804279850;2840118732;3000793455;2913273816;
2963224045
2757038367
2878196948`;

const EXAMPLE_MODS = `Mods=BetterFPS;BikiniTools;CommonSense;Eggon尼斯;
Fluffy Hair
Filibuster Rhymes Used Cars
Improved Hair Menu`;

const EXAMPLE_MAP = `Map=Muldraugh, KY;Rosewood;2829892800NewEkronTown;
BedfordFalls
Louisville`;

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400";

function ProjectZomboidModListFormatter() {
  const [workshopItems, setWorkshopItems] = useState("");
  const [mods, setMods] = useState("");
  const [map, setMap] = useState("");
  const [result, setResult] = useState(null);
  const [copiedSection, setCopiedSection] = useState("");

  useEffect(() => {
    setSEO(seo, "en");
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const handleFormat = useCallback(() => {
    const output = formatModList({ workshopItems, mods, map });
    setResult(output);
  }, [workshopItems, mods, map]);

  const handleCopy = useCallback(async (text, label) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(label);
      setTimeout(() => setCopiedSection(""), 2000);
    } catch {
      // clipboard not available
    }
  }, []);

  const handleClear = useCallback(() => {
    setWorkshopItems("");
    setMods("");
    setMap("");
    setResult(null);
    setCopiedSection("");
  }, []);

  const handleExample = useCallback(() => {
    setWorkshopItems(EXAMPLE_WORKSHOP);
    setMods(EXAMPLE_MODS);
    setMap(EXAMPLE_MAP);
  }, []);

  const hasOutput = result !== null;
  const hasWorkshop = result?.workshopItems !== null;
  const hasMods = result?.mods !== null;
  const hasMap = result?.map !== null;

  return (
    <>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <ToolsHeader />

        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Project Zomboid
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Project Zomboid Mod List Formatter
            </h1>
            <p className="mt-3 text-base text-slate-400">
              Clean, format, and validate WorkshopItems, Mods, and Map lines for
              your servertest.ini file.
            </p>
          </div>
        </section>

        {/* Tool Inputs */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="flex flex-col gap-6">
              {/* WorkshopItems */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  WorkshopItems
                </label>
                <textarea
                  value={workshopItems}
                  onChange={(e) => setWorkshopItems(e.target.value)}
                  placeholder={`Paste your WorkshopItems here...`}
                  rows={4}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Paste a raw WorkshopItems= line, semicolon-separated list, or
                  newline-separated list.
                </p>
              </div>

              {/* Mods */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Mods
                </label>
                <textarea
                  value={mods}
                  onChange={(e) => setMods(e.target.value)}
                  placeholder={`Paste your Mods here...`}
                  rows={4}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Paste a raw Mods= line, semicolon-separated list, or
                  newline-separated list.
                </p>
              </div>

              {/* Map */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Map <span className="text-slate-500">(optional)</span>
                </label>
                <textarea
                  value={map}
                  onChange={(e) => setMap(e.target.value)}
                  placeholder={`Paste your Map list here...`}
                  rows={3}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Paste a raw Map= line, semicolon-separated list, or
                  newline-separated list.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleFormat}
                  className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Format Lists
                </button>
                <button
                  onClick={handleExample}
                  className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
                >
                  Load Example
                </button>
                <button
                  onClick={handleClear}
                  className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-rose-400 hover:text-rose-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Output */}
        {hasOutput && (
          <section className="border-b border-slate-800/80">
            <div className="mx-auto max-w-2xl px-4 py-10">
              <h2 className="text-lg font-semibold text-white mb-4">
                Formatted Output
              </h2>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300 mb-2">
                    Warnings
                  </p>
                  <ul className="flex flex-col gap-2">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="text-sm leading-6 text-amber-200">
                        <strong className="text-amber-100">{w.type}:</strong>{" "}
                        {w.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* WorkshopItems Output */}
              {hasWorkshop && (
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-200">
                      WorkshopItems
                    </label>
                    <button
                      onClick={() =>
                        handleCopy(result.workshopItems, "workshop")
                      }
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                    >
                      {copiedSection === "workshop"
                        ? "Copied!"
                        : "Copy WorkshopItems"}
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <code className="block break-all text-sm leading-relaxed text-indigo-200">
                      WorkshopItems={result.workshopItems}
                    </code>
                  </div>
                </div>
              )}

              {/* Mods Output */}
              {hasMods && (
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-200">
                      Mods
                    </label>
                    <button
                      onClick={() => handleCopy(result.mods, "mods")}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                    >
                      {copiedSection === "mods" ? "Copied!" : "Copy Mods"}
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <code className="block break-all text-sm leading-relaxed text-indigo-200">
                      Mods={result.mods}
                    </code>
                  </div>
                </div>
              )}

              {/* Map Output */}
              {hasMap && (
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-200">
                      Map
                    </label>
                    <button
                      onClick={() => handleCopy(result.map, "map")}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                    >
                      {copiedSection === "map" ? "Copied!" : "Copy Map"}
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <code className="block break-all text-sm leading-relaxed text-indigo-200">
                      Map={result.map}
                    </code>
                  </div>
                </div>
              )}

              {/* Full servertest.ini Block */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200">
                    Full servertest.ini Block
                  </label>
                  <button
                    onClick={() => handleCopy(result.fullBlock, "full")}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                  >
                    {copiedSection === "full"
                      ? "Copied!"
                      : "Copy Full Block"}
                  </button>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-relaxed text-emerald-200">
                    {result.fullBlock}
                  </pre>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4 text-sm text-slate-400">
                {hasWorkshop && (
                  <p>
                    <strong className="text-slate-200">
                      {result.raw.workshopItems.length}
                    </strong>{" "}
                    WorkshopItems
                  </p>
                )}
                {hasMods && (
                  <p>
                    <strong className="text-slate-200">
                      {result.raw.mods.length}
                    </strong>{" "}
                    Mods
                  </p>
                )}
                {hasMap && (
                  <p>
                    <strong className="text-slate-200">
                      {result.raw.map.length}
                    </strong>{" "}
                    Map entries
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* How to Use */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              How to Use This Project Zomboid Mod List Formatter
            </h2>
            <ol className="mt-6 flex flex-col gap-3 pl-5 text-sm leading-6 text-slate-300">
              <li>
                Paste your <strong className="text-slate-100">WorkshopItems</strong>{" "}
                into the first textarea. You can paste a raw{" "}
                <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                  WorkshopItems=
                </code>{" "}
                line, a semicolon-separated list, or a newline-separated list.
              </li>
              <li>
                Paste your <strong className="text-slate-100">Mods</strong> into
                the second textarea using the same formats.
              </li>
              <li>
                Optionally paste your <strong className="text-slate-100">Map</strong>{" "}
                entries into the third textarea.
              </li>
              <li>
                Click <strong className="text-slate-100">Format Lists</strong> to
                clean, deduplicate, and validate your entries.
              </li>
              <li>
                Review any warnings about non-numeric WorkshopItems or
                numeric-only Mods.
              </li>
              <li>
                Copy individual lines or the full servertest.ini block and paste
                them into your server configuration.
              </li>
            </ol>
          </div>
        </section>

        {/* WorkshopItems vs Mods */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Difference Between WorkshopItems and Mods in Project Zomboid
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  WorkshopItems
                </h3>
                <p className="mt-1">
                  This line contains numeric Steam Workshop IDs. Each mod
                  published on the Steam Workshop has a unique numeric ID. You
                  can find the ID in the browser URL when viewing a workshop
                  item. Example: <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">2804279850</code>.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Mods</h3>
                <p className="mt-1">
                  This line contains the mod folder names as they appear in the
                  server mods directory. These are human-readable names like{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">BetterFPS</code>{" "}
                  or <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">CommonSense</code>.
                  They are usually not the same value as the workshop ID.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Why both are needed
                </h3>
                <p className="mt-1">
                  The server needs WorkshopItems to download the mod from the
                  workshop, and Mods to know which folders to load. Both lines
                  must be present in servertest.ini for your mods to work
                  correctly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Common servertest.ini Mod List Mistakes
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-6 text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-100">
                  Mismatched WorkshopItems and Mods
                </h3>
                <p className="mt-1">
                  Each workshop mod needs an entry in both WorkshopItems (the
                  numeric ID) and Mods (the folder name). Missing either will
                  cause the mod to fail to load.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Duplicate entries
                </h3>
                <p className="mt-1">
                  Having the same workshop ID or mod name listed multiple times
                  will not break the server, but it makes the file harder to
                  read and maintain. This tool removes duplicates
                  automatically.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Trailing semicolons and empty values
                </h3>
                <p className="mt-1">
                  A trailing semicolon creates an empty entry at the end of the
                  list. While the server may handle it, it is cleaner to remove
                  them. This tool trims empty values.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Wrong Map order for custom maps
                </h3>
                <p className="mt-1">
                  Map order matters. Maps are loaded in the order they appear in
                  the Map= line. If a custom map depends on another map, it must
                  be listed after its dependency. Muldraugh, KY should usually
                  be first or near the beginning.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Confusing numeric IDs between lines
                </h3>
                <p className="mt-1">
                  WorkshopItems and Mods are not interchangeable. Putting a
                  numeric workshop ID in the Mods line will not work. The Mods
                  line expects the actual mod folder name, not the Steam
                  workshop ID.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Example */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Example Project Zomboid Mod List
            </h2>
            <div className="mt-4 flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                  Before Formatting
                </h3>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-400">
{`WorkshopItems=2804279850;2840118732;3000793455;
2913273816
2804279850
2757038367`}
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                  After Formatting
                </h3>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-emerald-200">
{`WorkshopItems=2804279850;2840118732;3000793455;2913273816;2757038367
Mods=BetterFPS;BikiniTools;CommonSense;Eggon尼斯;Fluffy Hair;Filibuster Rhymes Used Cars;Improved Hair Menu
Map=Muldraugh, KY;Rosewood;2829892800NewEkronTown;BedfordFalls;Louisville`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-slate-800/80">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <h2 className="text-xl font-semibold text-white">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 divide-y divide-slate-800">
              <div className="py-4 first:pt-0">
                <h3 className="text-sm font-semibold text-white">
                  Where do I find my WorkshopItems IDs?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Open the Steam Workshop page for any mod. The numeric ID is in
                  the URL. For example, in{" "}
                  <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-xs text-indigo-300">
                    steamcommunity.com/sharedfiles/filedetails/?id=2804279850
                  </code>
                  , the ID is <strong className="text-slate-200">2804279850</strong>.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Where do I find the mod folder names for the Mods line?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Mod folder names are in your server mods directory (usually
                  the workshop download folder on your server). Each mod has a
                  folder with a human-readable name. The folder name is what
                  goes in the Mods line.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Is WorkshopItems the same as Mods?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  No. WorkshopItems contains numeric Steam workshop IDs. Mods
                  contains folder names. They serve different purposes one
                  tells Steam what to download, the other tells the server what
                  to load.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Does map order really matter?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes. The server loads maps in the order listed in the Map=
                  line. If a custom map depends on another map, it must come
                  after its dependency. Muldraugh, KY is usually listed first as
                  the base map.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Will this tool modify my server files directly?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  No. This tool runs entirely in your browser. It generates
                  formatted text for you to copy and paste into your
                  servertest.ini file. No data is sent anywhere.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-sm font-semibold text-white">
                  Is this tool free?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Yes, completely free. No login, no sign-up, and no hidden
                  costs. Built by QUESTPAUSE.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools currentToolId="project-zomboid-mod-list-formatter" />

        <ToolsFooter />
      </main>
    </>
  );
}

export default ProjectZomboidModListFormatter;
