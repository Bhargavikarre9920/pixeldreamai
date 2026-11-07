import { useMemo } from "react";
import { DIAGRAM_SVG, FLOW_SVG } from "../data/svg.js";
import { CONFIG } from "../data/content.js";
import { Eyebrow, PILL_O, Title, useInView } from "../ui.jsx";
import ContactForm from "./ContactForm.jsx";

export default function Contact({ prefill }) {
  const [ref, seen] = useInView(0.12);
  const pixels = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => {
        const z = 3 + Math.random() * 7, col = ["#4cc9ff", "#8a6bff", "#ff5fd2", "#7ad7ff"][i % 4];
        return { left: `${Math.random() * 100}%`, width: z, height: z, background: col, boxShadow: `0 0 10px ${col}`,
          animationDuration: `${9 + Math.random() * 12}s`, animationDelay: `-${Math.random() * 18}s` };
      }),
    []
  );

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden py-24">
      {/* animated background (styles in effects.css) */}
      <div className="cbg" aria-hidden="true">
        <div className="cgrid" />
        <div dangerouslySetInnerHTML={{ __html: FLOW_SVG }} />
        {pixels.map((s, i) => <i key={i} className="px" style={s} />)}
      </div>
      <i aria-hidden="true" className="pointer-events-none absolute -left-40 -top-28 h-[520px] w-[520px] animate-blob rounded-full bg-blue-500/40 blur-[90px]" />
      <i aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-44 h-[520px] w-[520px] animate-blob rounded-full bg-fuchsia-500/30 blur-[90px] [animation-direction:reverse]" />

      <div className={`relative z-10 mx-auto grid w-[min(1180px,calc(100%-40px))] items-start gap-10 transition duration-700 lg:grid-cols-[.95fr_1.05fr] ${seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h2 className="my-3 font-display text-[clamp(2.1rem,4.6vw,3.4rem)] font-medium leading-[1.04] tracking-[-.04em]">
            Let’s build something{" "}
            <em className="animate-hem bg-gradient-to-r from-[#5ec8ff] via-[#8a6bff] to-[#ff5fd2] bg-[length:200%_100%] bg-clip-text font-serif text-[1.12em] font-normal italic tracking-[-.01em] text-transparent">
              bold.
            </em>
          </h2>
          <p className="max-w-[540px] font-body leading-[1.7] text-[#a9a8c6]">
            Tell us what you’re imagining. You can also message us on Instagram.
          </p>

          <a className="gp" href="#fm" onClick={(e) => { e.preventDefault(); document.getElementById("fm")?.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => document.getElementById("name")?.focus({ preventScroll: true }), 500); }}>
            <i>✦</i><span>Tell us about your project…</span><b>→</b>
          </a>
          <div className="mt-4">
            <a className={PILL_O} href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">Instagram @PixelDreamAi</a>
          </div>

          <div className="br mt-7 rounded-[22px] border border-violet-400/30 bg-[#100e28]/55 p-4 backdrop-blur-md">
            <div dangerouslySetInnerHTML={{ __html: DIAGRAM_SVG }} />
            <p className="mt-2 text-center text-sm text-mute">Creative ideas. Digital impact.</p>
          </div>
        </div>
        <ContactForm prefill={prefill} />
      </div>
    </section>
  );
}
