"use client";

import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const categories = ['#Development', '#UXDesign', '#Business', '#DataScience'];

  const handleCategoryClick = (cat: string) => {
    const cleaned = cat.replace('#', '');
    router.push(`/?search=${encodeURIComponent(cleaned)}`);
  };

  return (
    <section className="relative h-[440px] rounded-[2rem] overflow-hidden mb-16 flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 opacity-90" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div className="relative z-10 space-y-6 px-4">
        <h1 className="text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Master New Skills in Real-Time
        </h1>
        <p className="text-slate-300 text-lg max-w-xl mx-auto">
          Access over 5,000+ top-rated courses from industry experts worldwide with 4K interactive streaming.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => handleCategoryClick(cat)}
              className="px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-sm font-medium hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}