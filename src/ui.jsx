import { useEffect, useRef, useState } from "react";

export const PILL =
  "inline-flex items-center gap-2.5 rounded-full border-0 px-6 py-3.5 bg-gradient-to-r from-[#5b8cff] via-[#8a5cff] to-[#b45cff] " +
  "text-white text-[.78rem] font-semibold tracking-[.1em] uppercase shadow-[0_8px_34px_rgba(110,90,255,.45)] " +
  "transition hover:-translate-y-0.5 hover:shadow-[0_10px_46px_rgba(130,100,255,.7)] disabled:opacity-60";
export const PILL_O =
  "inline-flex items-center gap-2.5 rounded-full border border-white/10 px-6 py-3.5 bg-transparent text-white " +
  "text-[.78rem] font-semibold tracking-[.1em] uppercase transition hover:-translate-y-0.5 hover:border-white/30";
export const PILL_S = "!px-4 !py-2.5 !text-[.7rem]";

export function Eyebrow({ children }) {
  return (
    <span className="block text-[.72rem] uppercase tracking-[.22em] text-mute before:mr-1 before:text-brand-lilac before:content-['—']">
      {children}
    </span>
  );
}

export function Title({ a, b, className = "" }) {
  return (
    <h2
      className={`my-3 font-display text-[clamp(2.1rem,4.6vw,3.4rem)] font-semibold leading-[1.05] tracking-[-.03em] ${className}`}
    >
      {a}{" "}
      <em className="bg-gradient-to-r from-[#b36bff] to-[#5b8cff] bg-clip-text not-italic text-transparent">{b}</em>
    </h2>
  );
}

/** Fade/slide a block in when it scrolls into view. */
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

export function Reveal({ children, className = "", delay = 0 }) {
  const [ref, seen] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out ${seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
