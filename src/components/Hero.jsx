import PixelLogo from "./PixelLogo.jsx";
import { PILL, PILL_O } from "../ui.jsx";

// const TAGS = ["Google Ads", "Meta Ads", "Social Media", "Websites", "AI Videos"];

export default function Hero() {
  return (
   <section
      id="home"
      className="pb-16 pt-[120px] md:pt-[140px]"
    >
      <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">

        <div className="flex flex-col items-start gap-0 [&>*]:animate-hin">

          <span className="rounded-full border border-violet-400/40 bg-gradient-to-r from-violet-500/15 to-pink-500/10 px-4 py-2.5 text-[.68rem] font-semibold uppercase leading-none tracking-[.28em] text-[#d6cfff]">
            Creative agency
          </span>

        <h1 className="mb-5 mt-6 font-display text-[clamp(3rem,6.2vw,5.4rem)] font-medium leading-[1.02] tracking-[-.045em]">
  <span className="block whitespace-nowrap bg-gradient-to-b from-white to-[#bfc3ee] bg-clip-text text-transparent">
    Grow your business
  </span>

  <em className="block whitespace-nowrap animate-hem bg-gradient-to-r from-[#5ec8ff] via-[#8a6bff] to-[#ff5fd2] bg-[length:200%_100%] bg-clip-text pr-[.06em] font-serif text-[1.12em] font-normal italic leading-[.95] tracking-[-.02em] text-transparent">
    with PixelDreamAi.
  </em>
</h1>

          {/* <p className="max-w-[30em] font-body text-[1.08rem] leading-[1.7] text-[#a9a8c6]">
            Graphic design, AI videos, websites and ads from one creative team, built to help ambitious brands stand out.
          </p> */}

          {/* Animated Brand Quote */}
          

          <p className="-mt-1 mb-5 max-w-[30em] font-body text-[.95rem] leading-relaxed text-[#9d9cc0]">
            More clicks. More customers. More growth, with Google Ads, Meta Ads and content that converts.
          </p>

          <div className="mt-2 flex flex-wrap gap-3.5">

            <a href="#work" className={PILL}>
              View our work <span aria-hidden="true">→</span>
            </a>

            <a href="#services" className={PILL_O}>
              Explore services <span aria-hidden="true">▶</span>
            </a>

          </div>

        </div>

        <PixelLogo />

      </div>

      {/* Quote Animation Styles */}
      <style>{`
        .quote-reveal {
          opacity: 0;
          transform: translateY(22px);
          animation: quoteReveal 1s ease-out 0.7s forwards;
        }

        .quote-gradient {
          background: linear-gradient(
            100deg,
            #ffffff 0%,
            #b9a6ff 35%,
            #5ec8ff 65%,
            #ff8cde 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: quoteShimmer 5s ease-in-out infinite;
        }

        @keyframes quoteReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes quoteShimmer {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .quote-reveal,
          .quote-gradient {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

    </section>
  );
}
