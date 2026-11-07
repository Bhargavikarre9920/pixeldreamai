import { useState } from "react";
import { CAT, CS, WK } from "../data/content.js";
import { Eyebrow, PILL, Reveal, Title } from "../ui.jsx";
import Modal from "./Modal.jsx";

export default function Work({ onQuote }) {
  const [filter, setFilter] = useState("all");
  const [openIdx, setOpenIdx] = useState(null);
  const list = WK.map((w, i) => ({ w, i })).filter(({ w }) => filter === "all" || w[0] === filter);
  const cur = openIdx != null ? WK[openIdx] : null;

  return (
    <section id="work" className="py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-40px))]">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Projects</Eyebrow>
            <Title a="Creative work that" b="delivers." />
          </div>
          <p className="max-w-[540px] text-mute">Real campaigns and creatives made by PixelDreamAi. Tap any card to explore.</p>
        </Reveal>

        <div className="my-8 flex flex-wrap gap-2.5" role="group" aria-label="Filter work">
          {CAT.map(([k, label]) => (
            <button
              key={k}
              aria-pressed={filter === k}
              onClick={() => setFilter(k)}
              className={`rounded-full border px-5 py-2 text-sm transition ${
                filter === k
                  ? "border-violet-400/60 bg-violet-500/20 text-white"
                  : "border-white/10 bg-white/[.045] text-mute hover:border-white/30 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(({ w, i }, n) => (
            <button
              key={w[1]}
              onClick={() => setOpenIdx(i)}
              aria-label={`View project: ${w[1]}`}
              style={{ animationDelay: `${n * 0.05}s` }}
              className="group animate-rise overflow-hidden rounded-3xl border border-white/10 bg-white/[.045] text-left transition hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-[0_20px_60px_rgba(90,70,220,.35)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0b22]">
                <img src={`/${w[3]}`} alt={`${w[1]} — ${w[2]}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[.68rem] uppercase tracking-widest backdrop-blur">
                  {CAT.find((c) => c[0] === w[0])[1]}
                </span>
                {w[4] && (
                  <span aria-hidden="true" className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-white/20 text-xl backdrop-blur">▶</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <b className="block font-display text-lg">{w[1]}</b>
                  <span className="text-sm text-mute">{w[2]}</span>
                </div>
                <i className="not-italic text-xl text-brand-lilac transition group-hover:translate-x-1 group-hover:-translate-y-1">↗</i>
              </div>
            </button>
          ))}
        </div>
        {!list.length && <p className="mt-6 text-mute">No projects in this category yet.</p>}
      </div>

      <Modal open={!!cur} onClose={() => setOpenIdx(null)} label={cur?.[1]}>
        {cur && (
          <div className="grid md:grid-cols-[1.2fr_.8fr]">
            <div className="grid place-items-center bg-black">
              {cur[4] ? (
                <video className="max-h-[80vh] w-full" src={`/${cur[4]}`} poster={`/${cur[3]}`} controls autoPlay playsInline preload="metadata" />
              ) : (
                <img className="max-h-[80vh] w-full object-contain" src={`/${cur[3]}`} alt={`${cur[1]} — ${cur[2]}`} />
              )}
            </div>
            <div className="flex flex-col justify-center gap-3 p-8">
              <Eyebrow>{CAT.find((c) => c[0] === cur[0])[1]}</Eyebrow>
              <h3 className="font-display text-2xl">{cur[1]}</h3>
              <p className="text-mute">{cur[2]}</p>
              <button
                className={`${PILL} mt-3 self-start`}
                onClick={() => { setOpenIdx(null); onQuote(CS[cur[0]], `I like the "${cur[1]}" work.`); }}
              >
                Similar project →
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
