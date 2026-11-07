import PixelLogo from "./PixelLogo.jsx";
import { PILL, PILL_O } from "../ui.jsx";

const TAGS = ["Google Ads", "Meta Ads", "Social Media", "Websites", "AI Videos"];

export default function Hero() {
  return (
    <section id="home" className="pb-16 pt-[120px] md:pt-[140px]">
      <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col items-start gap-0 [&>*]:animate-hin">
          <span className="rounded-full border border-violet-400/40 bg-gradient-to-r from-violet-500/15 to-pink-500/10 px-4 py-2.5 text-[.68rem] font-semibold uppercase leading-none tracking-[.28em] text-[#d6cfff]">
            Creative agency
          </span>
          <h1 className="mb-5 mt-6 font-display text-[clamp(3rem,6.2vw,5.4rem)] font-medium leading-[1.02] tracking-[-.045em]">
            <span className="bg-gradient-to-b from-white to-[#bfc3ee] bg-clip-text text-transparent">Ideas into</span>
            <br />
            <em className="animate-hem bg-gradient-to-r from-[#5ec8ff] via-[#8a6bff] to-[#ff5fd2] bg-[length:200%_100%] bg-clip-text pr-[.08em] font-serif text-[1.14em] font-normal italic leading-[.95] tracking-[-.02em] text-transparent">
              impact.
            </em>
          </h1>
          <p className="max-w-[30em] font-body text-[1.08rem] leading-[1.7] text-[#a9a8c6]">
            Graphic design, AI videos, websites and ads from one creative team, built to help ambitious brands stand out.
          </p>
          <blockquote className="my-5 max-w-[30em] border-l-2 border-transparent py-0.5 pl-5 font-serif text-[clamp(1.3rem,2.1vw,1.65rem)] italic leading-snug text-[#e8e5ff] [border-image:linear-gradient(#5ec8ff,#8a6bff,#ff5fd2)_1]">
            <span aria-hidden="true" className="mr-0.5 text-[#8a6bff]">“</span>
            Grow your business with PixelDreamAi.
          </blockquote>
          <p className="-mt-2 mb-5 max-w-[30em] font-body text-[.95rem] leading-relaxed text-[#9d9cc0]">
            More clicks. More customers. More growth, with Google Ads, Meta Ads and content that converts.
          </p>
          <div className="mt-2 flex flex-wrap gap-3.5">
            <a href="#work" className={PILL}>View our work <span aria-hidden="true">→</span></a>
            <a href="#services" className={PILL_O}>Explore services <span aria-hidden="true">▶</span></a>
          </div>
          <ul className="mt-7 flex flex-wrap gap-2.5 p-0" aria-label="What we make">
            {TAGS.map((t) => (
              <li key={t} className="list-none rounded-full border border-white/10 px-3.5 py-1.5 text-[.8rem] tracking-[.06em] text-[#b4b3d0]">{t}</li>
            ))}
          </ul>
        </div>
        <PixelLogo />
      </div>
    </section>
  );
}
