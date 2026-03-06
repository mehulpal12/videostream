export const Hero = () => (
  <section className="relative h-[400px] rounded-3xl overflow-hidden bg-hero-gradient flex flex-col items-center justify-center text-center px-4 mb-12">
    <div className="absolute inset-0 bg-black/20" /> {/* Overlay */}
    <div className="relative z-10 max-w-3xl">
      <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
        Master New Skills in Real-Time
      </h1>
      <p className="text-slate-200 mb-8 max-w-lg mx-auto">
        Access over 5,000+ top-rated courses from industry experts worldwide.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {['#Development', '#UXDesign', '#Business', '#DataScience'].map(tag => (
          <button key={tag} className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm hover:bg-white/20 transition">
            {tag}
          </button>
        ))}
      </div>
    </div>
  </section>
);