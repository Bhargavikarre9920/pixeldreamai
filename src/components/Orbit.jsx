
import { useEffect, useRef } from "react";
import { SV } from "../data/content.js";
import { makeBR } from "../data/icons.js";
import { Eyebrow, PILL, PILL_S, Reveal, Title } from "../ui.jsx";

const EB = "block text-[.72rem] uppercase tracking-[.22em] text-mute";

export default function Orbit({ onQuote }) {
  const orbRef = useRef(null);
  const capRef = useRef(null);
  const wrapRef = useRef(null);
  const quote = useRef(onQuote);

  quote.current = onQuote;

  useEffect(() => {
    const o = orbRef.current;
    const cap = capRef.current;
    const w = wrapRef.current;

    if (!o || !cap || !w) return;

    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const toForm = (...a) => quote.current?.(...a);

    const pos = (i) => {
      const a = (i / 6) * 6.283 - 1.5708;
      return [Math.cos(a), Math.sin(a)];
    };

    // Load service SVG icons and backgrounds
    const BR = makeBR();

    // Replace Instagram icon with Mobile App Development icon
    BR[3] = {
      bg: "linear-gradient(135deg, #168BFF, #795BFF)",
      c: "#ffffff",
      svg: `
        <svg viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true">
          <rect x="7" y="2" width="10" height="20"
            rx="2.5" stroke="#fff" stroke-width="1.8"/>
          <path d="M10 5h4M11 19h2"
            stroke="#fff" stroke-width="1.5"
            stroke-linecap="round"/>
          <rect x="9" y="8" width="2.5" height="2.5"
            rx=".5" fill="#fff"/>
          <rect x="13" y="8" width="2.5" height="2.5"
            rx=".5" fill="#fff"/>
          <rect x="9" y="12" width="2.5" height="2.5"
            rx=".5" fill="#fff"/>
          <rect x="13" y="12" width="2.5" height="2.5"
            rx=".5" fill="#fff"/>
        </svg>
      `
    };

    let cu = 0;
    let hold = false;
    let iv;

    // User icon
    const PERSON = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4" fill="#fff"/>
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#fff"/>
      </svg>
    `;

    // Growth chart paths
    const LINE = {
      low: "M2 8C16 10 24 20 38 26S58 34 70 42S96 50 110 56",
      up: "M2 56C16 52 26 46 40 40S60 30 72 22S98 12 110 6"
    };

    // Dashboard screen
    const dash = (m) => {
      const up = m === "up";
      const c = up ? "#3ef0b4" : "#ff5d7c";
      const ar = up ? "▲" : "▼";

      return `
        <div class="hd">
          <span class="pa">${PERSON}</span>
          <span class="pn">
            <b>You</b>
            <i>Business owner</i>
          </span>
          <em class="stat">${up ? "Growing" : "Business low"}</em>
        </div>

        <div class="cht" style="--c:${c}">
          <svg viewBox="0 0 112 62" aria-hidden="true">
            <defs>
              <linearGradient id="gr${m}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="${c}" stop-opacity=".5"/>
                <stop offset="1" stop-color="${c}" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <path class="fa"
              d="${LINE[m]}L110 62L2 62Z"
              fill="url(#gr${m})"/>

            <path class="ln" pathLength="100" d="${LINE[m]}"/>
          </svg>

          <i class="pt"
            style="${up ? "right:3px;top:3px" : "right:3px;bottom:3px"}">
          </i>
        </div>

        <div class="tls" style="--c:${c}">
          ${["Sales", "Reach", "Leads"].map(n => `
            <span><u>${n}</u><b>${ar}</b></span>
          `).join("")}
        </div>

        <div class="say">
          <span class="who">You</span>
          ${up ? "We’re growing!" : "Sales are slow…"}
        </div>
      `;
    };

    // Central phone animation
    const reel = `
      <div class="phs">

        <div class="sl sA">
          ${dash("low")}
        </div>

        <div class="sl sB">
          <div class="rings">
            <i></i><i></i><i></i>
          </div>

          <img class="blg"
            src="/assets/pixeldreamai-logo-full.png"
            alt="">

          <u class="scan"></u>

          <div class="say sol">
            <span class="who">PixelDreamAi</span>
            Let’s fix that.
          </div>
        </div>

        <div class="sl sC">
          ${dash("up")}
          <div class="spk">
            <i></i><i></i><i></i>
            <i></i><i></i><i></i>
          </div>
        </div>

        <div class="sl sD">
          <div class="rings">
            <i></i><i></i><i></i>
          </div>

          <img class="blg2"
            src="/assets/pixeldreamai-logo-full.png"
            alt="PixelDreamAi">

          <p class="tag">Ideas into <b>impact.</b></p>
        </div>

      </div>
    `;

    // Build orbit and service buttons
    o.innerHTML = `
      <svg class="ol"
        viewBox="-200 -200 400 400"
        aria-hidden="true">

        <circle r="150" class="ring"/>
        <circle r="190" class="ring r2"/>

        ${SV.map((s, i) => {
          const [x, y] = pos(i);

          return `
            <line
              data-i="${i}"
              x1="0"
              y1="0"
              x2="${x * 150}"
              y2="${y * 150}"
            />
          `;
        }).join("")}
      </svg>

      <div class="ctr">${reel}</div>

      <!-- SVG service icons around the central phone -->
      ${SV.map((s, i) => {
        const [x, y] = pos(i);

        return `
          <button
            class="nd"
            data-i="${i}"
            style="
              left:${50 + x * 37.5}%;
              top:${50 + y * 37.5}%;
              --nb:${BR[i].bg};
              --bc:${BR[i].c};
            "
            aria-label="${s.n}">
            ${BR[i].svg}
          </button>
        `;
      }).join("")}

      ${Array.from({ length: 12 }, (_, k) => {
        const a = (k / 12) * 6.283 + 0.26;

        return `
          <i
            class="av"
            aria-hidden="true"
            style="
              left:${50 + Math.cos(a) * 46}%;
              top:${50 + Math.sin(a) * 46}%;
              animation-delay:${-k * 0.5}s;
            ">
          </i>
        `;
      }).join("")}
    `;

    // Update active service information
    function go(i) {
      cu = (i + SV.length) % SV.length;

      const s = SV[cu];

      $$(".nd", o).forEach((b, k) => {
        b.classList.toggle("on", k === cu);
      });

      $$(".ol line", o).forEach((l, k) => {
        l.classList.toggle("on", k === cu);
      });

      cap.innerHTML = `
        <span class="${EB}">
          0${cu + 1} / 0${SV.length}
        </span>

        <h3>${s.n}</h3>

        <p>${s.d}</p>

        <div class="tags">
          ${s.it.map(x => `<span>${x[0]}</span>`).join("")}
        </div>

        <button class="${PILL} ${PILL_S}" id="oq">
          Get a quote →
        </button>
      `;

      cap.querySelector("#oq").onclick = () => toForm(s.n);
    }

    // Click service icons
    o.onclick = (e) => {
      const b = e.target.closest(".nd");

      if (b) {
        hold = true;
        go(Number(b.dataset.i));
      }
    };

    // Pause animation while hovering
    const enter = () => hold = true;
    const leave = () => hold = false;

    w.addEventListener("pointerenter", enter);
    w.addEventListener("pointerleave", leave);

    // Automatic service rotation
    iv = setInterval(() => {
      if (!hold && !document.hidden) {
        go(cu + 1);
      }
    }, 3600);

    go(0);

    // Cleanup
    return () => {
      clearInterval(iv);
      w.removeEventListener("pointerenter", enter);
      w.removeEventListener("pointerleave", leave);
      o.onclick = null;
    };

  }, []);

  return (
    <section id="connect" className="py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-40px))]">

        <Reveal className="flex flex-wrap items-end justify-between gap-6">

          <div>
            <Eyebrow>AI-powered reach</Eyebrow>
            <Title a="One idea," b="every channel." />
          </div>

          <p className="max-w-[540px] text-mute">
            Your brand at the centre, our services around it.
            Tap a service to see how it helps you reach the right people.
          </p>

        </Reveal>

        <div className="orbw mt-10" ref={wrapRef}>
          <div className="ocap" ref={capRef} aria-live="polite"/>
          <div className="orb" ref={orbRef}/>
        </div>

      </div>
    </section>
  );
}
