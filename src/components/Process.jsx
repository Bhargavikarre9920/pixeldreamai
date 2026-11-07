import { useEffect, useRef, useState } from "react";
import { Eyebrow, Reveal, Title } from "../ui.jsx";

const PS = [
  ["Discover", ["Understand your goals", "Identify your target audience", "Define the scope and requirements"], "We start by listening, so the work is built around what you need."],
  ["Create", ["Develop concepts and visual direction", "Design and build the agreed deliverables", "Collect and manage your feedback"], "Ideas become real work, shaped together with you."],
  ["Launch & Improve", ["Deliver the approved work", "Support launch where included in the project", "Discuss further improvements when needed"], "We finish with a clear hand-over and next steps."],
];

export default function Process() {
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(-1);
  const visible = useRef(false);
  const idle = useRef(0);
  const sec = useRef(null);

  // glowing tip on the connector that was just completed
  useEffect(() => {
    if (step === 0) return setRun(-1);
    setRun(step - 1);
    const t = setTimeout(() => setRun(-1), 1100);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(sec.current);
    const iv = setInterval(() => {
      if (!visible.current || document.hidden || Date.now() - idle.current < 9000) return;
      setStep((s) => (s + 1) % 3);
    }, 4200);
    return () => { io.disconnect(); clearInterval(iv); };
  }, []);

  const pick = (i) => { idle.current = Date.now(); setStep(i); };
  const p = PS[step];

  return (
    <section id="process" className="py-24" ref={sec}>
      <div className="mx-auto w-[min(1180px,calc(100%-40px))]">
        <Reveal>
          <Eyebrow>Process</Eyebrow>
          <Title a="Simple from idea to" b="launch." />
        </Reveal>

        {/* connected step flow (styles live in effects.css under #process) */}
        <div className="pflow" aria-hidden="true">
          {PS.map((_, i) => (
            <div key={i} className={`pc ${i < step ? "done" : ""} ${i === step ? "on" : ""} ${i === step ? "flow" : ""} ${i === run ? "run" : ""}`}>
              <span className="pn"><b>{i + 1}</b></span>
              {i < 2 && <i className="ln"><u style={{ width: i < step ? "100%" : "0" }} /></i>}
            </div>
          ))}
        </div>

        <div className="mb-2 mt-8 grid gap-3.5 md:grid-cols-3">
          {PS.map((s, i) => (
            <button
              key={s[0]}
              aria-pressed={i === step}
              onClick={() => pick(i)}
              className={`st rounded-[20px] border p-5 text-left transition ${
                i === step
                  ? "border-violet-400/50 bg-gradient-to-b from-[#1d1736] to-[#101018]"
                  : "border-white/10 bg-white/[.045] hover:border-white/25"
              }`}
            >
              <b className="font-display text-[.8rem] tracking-[.14em] text-brand-lilac">STEP {i + 1}</b>
              <h3 className="mt-1 text-[1.3rem]">{s[0]}</h3>
            </button>
          ))}
        </div>

        <div className="my-5 h-[3px] rounded-full bg-white/10">
          <i className="block h-full rounded-full bg-gradient-to-r from-[#5b8cff] to-[#b45cff] transition-[width] duration-700" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>

        <div className="pd grid gap-5 rounded-[22px] border border-white/10 bg-white/[.045] p-7 md:grid-cols-2" style={{ "--px": `${100 / 6 + (step * 100) / 3}%` }}>
          <div key={`a${step}`} className="animate-rise">
            <h3 className="mb-2 text-2xl">{p[0]}</h3>
            <p className="text-mute">{p[2]}</p>
          </div>
          <ul key={`b${step}`} className="m-0 grid animate-rise gap-2.5 p-0">
            {p[1].map((x) => (
              <li key={x} className="relative list-none pl-6 text-[#d8d8e6] before:absolute before:left-0 before:text-brand-lilac before:content-['✦']">{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
