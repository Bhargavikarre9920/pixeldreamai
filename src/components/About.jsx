import { Eyebrow, PILL, Title, useInView } from "../ui.jsx";
import HoloCube from "./HoloCube.jsx";

const CARDS = [
  ["Creative-first", "Design with purpose"],
  ["AI-powered", "Modern possibilities"],
  ["Goal-focused", "Work built around you"],
  ["End-to-end", "One creative partner"],
];

export default function About() {
  const [ref, seen] = useInView(0.2);
  return (
    <section id="about" className="py-24" ref={ref}>
      <div className="ab2 mx-auto grid w-[min(1180px,calc(100%-40px))] items-center gap-9 lg:grid-cols-2">
        <div>
          <Eyebrow>About</Eyebrow>
          <Title a="Creativity meets" b="technology." />
          <p className="max-w-[540px] text-mute">
            PixelDreamAi turns ideas into digital impact. We combine design, modern AI tools and clear strategy to
            create work that stands out and supports your goals.
          </p>
          <div className="mt-6"><a href="#contact" className={PILL}>Discuss a project</a></div>

          <div className="mt-7 grid grid-cols-2 gap-3 [perspective:800px]">
            {CARDS.map(([a, b], i) => (
              <span
                key={a}
                style={
                  seen
                    ? { animation: `cardin .7s cubic-bezier(.2,.9,.3,1.2) ${0.1 + i * 0.12}s forwards` }
                    : undefined
                }
                className="relative block origin-bottom translate-y-[30px] scale-[.94] rounded-2xl border border-white/10 bg-white/[.045] px-[18px] py-3.5 font-display font-semibold opacity-0 [transform:translateY(30px)_scale(.94)_rotateX(-18deg)]"
              >
                {a}
                <small className="block font-body text-[.8rem] font-normal text-mute">{b}</small>
                {seen && (
                  <i
                    aria-hidden="true"
                    style={{ animation: `cardhi 8s ease-in-out ${i * 2}s infinite` }}
                    className="pointer-events-none absolute inset-0 rounded-2xl border border-violet-400/80 opacity-0"
                  />
                )}
              </span>
            ))}
          </div>
        </div>
        <HoloCube />
      </div>
    </section>
  );
}
