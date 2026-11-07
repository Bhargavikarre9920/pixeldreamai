import { useEffect, useRef, useState } from "react";
import { SV } from "../data/content.js";
import { Eyebrow, PILL, PILL_O, PILL_S, Reveal, Title } from "../ui.jsx";
import Modal from "./Modal.jsx";
import ServiceIcon from "./ServiceIcon.jsx";

const N = SV.length;

export default function Services({ onQuote }) {
  const [cur, setCur] = useState(0);
  const [info, setInfo] = useState(null);
  const [narrow, setNarrow] = useState(false);
  const sx0 = useRef(null);

  useEffect(() => {
    const f = () => setNarrow(Math.min(window.innerWidth, 1180) < 700);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  const go = (i) => setCur((i + N) % N);
  const step = narrow ? 58 : 70;

  return (
    <section id="services" className="py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-40px))] text-center">
        <Reveal>
          <Eyebrow>Services</Eyebrow>
          <Title a="Everything your brand" b="needs." />
          <p className="mx-auto max-w-[540px] text-mute">
            From the first scroll-stopping creative to campaigns designed to reach the right audience.
          </p>
        </Reveal>

        <div
          className="relative mx-auto mt-12 h-[480px] max-md:h-[520px] [perspective:1400px]"
          aria-roledescription="carousel"
          aria-label="Services"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); }}
          onPointerDown={(e) => (sx0.current = e.clientX)}
          onPointerUp={(e) => {
            if (sx0.current != null && Math.abs(e.clientX - sx0.current) > 50) go(cur + (e.clientX < sx0.current ? 1 : -1));
            sx0.current = null;
          }}
        >
          {SV.map((s, i) => {
            const d = ((i - cur + N + N / 2) % N) - N / 2;
            const active = d === 0, visible = Math.abs(d) <= 1;
            const [c1, c2] = s.g.split(",");
            return (
              <article
                key={s.n}
                onClick={() => !active && go(i)}
                aria-hidden={!active}
                style={{
                  transform: visible
                    ? `translateX(${d * step}%) scale(${active ? 1 : 0.84}) rotateY(${-d * 16}deg)`
                    : `translateX(${d * step}%) scale(.7)`,
                  opacity: visible ? (active ? 1 : 0.5) : 0,
                  zIndex: active ? 5 : visible ? 3 : 1,
                  filter: active ? "none" : "brightness(.6)",
                  pointerEvents: visible ? "auto" : "none",
                }}
                className="absolute left-1/2 top-0 -ml-[170px] flex h-[440px] w-[340px] flex-col rounded-[28px] border border-white/10 bg-[#0d0b20] p-7 text-left shadow-[0_30px_80px_rgba(0,0,0,.5)] transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
              >
                <div
                  className="relative mb-5 grid h-[150px] place-items-center overflow-hidden rounded-2xl"
                  style={{ background: `linear-gradient(135deg,${c1},${c2})` }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_55%)]" />
                  <ServiceIcon index={i} className="relative h-24 w-24" />
                </div>
                <h3 className="font-display text-xl">{s.n}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{s.d}</p>
                <div className="mt-auto flex gap-2.5 pt-4">
                  <button tabIndex={active ? 0 : -1} className={`${PILL} ${PILL_S}`} onClick={() => active && setInfo(i)}>Learn more</button>
                  <button tabIndex={active ? 0 : -1} className={`${PILL_O} ${PILL_S}`} onClick={() => active && onQuote(s.n)}>Get a quote</button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-5">
          <button aria-label="Previous service" onClick={() => go(cur - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-2xl transition hover:bg-white/15">‹</button>
          <div className="flex gap-2">
            {SV.map((s, i) => (
              <button
                key={s.n}
                aria-label={s.n}
                aria-current={i === cur}
                onClick={() => go(i)}
                className={`h-2.5 rounded-full transition-all ${i === cur ? "w-7 bg-violet-400" : "w-2.5 bg-white/25"}`}
              />
            ))}
          </div>
          <button aria-label="Next service" onClick={() => go(cur + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-2xl transition hover:bg-white/15">›</button>
        </div>
      </div>

      <Modal open={info != null} onClose={() => setInfo(null)} label={info != null ? SV[info].n : ""}>
        {info != null && (
          <div className="grid md:grid-cols-[.8fr_1.2fr]">
            <div
              className="grid min-h-[220px] place-items-center"
              style={{ background: `linear-gradient(135deg,${SV[info].g.split(",")[0]},${SV[info].g.split(",")[1]})` }}
            >
              <ServiceIcon index={info} className="h-32 w-32" />
            </div>
            <div className="p-8 text-left">
              <Eyebrow>Service</Eyebrow>
              <h3 className="mt-2 font-display text-3xl">{SV[info].n}</h3>
              <p className="mt-3 text-mute">{SV[info].d}</p>
              <h4 className="mb-2 mt-5 font-display text-lg">What’s included</h4>
              <ul className="grid gap-2 p-0 text-sm text-[#d8d8e6]">
                {SV[info].it.map((x) => (
                  <li key={x[0]} className="list-none"><b>{x[0]}.</b> {x[1]}</li>
                ))}
              </ul>
              <button className={`${PILL} mt-6`} onClick={() => { const n = SV[info].n; setInfo(null); onQuote(n); }}>Get a quote →</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
