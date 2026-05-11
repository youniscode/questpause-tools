import FeaturedToolCard from "./FeaturedToolCard.jsx";

function PopularTools({ tools }) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="border-b border-slate-800/80">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 lg:py-14">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Popular Tools</h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-amber-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </span>
        </div>
        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <FeaturedToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularTools;
