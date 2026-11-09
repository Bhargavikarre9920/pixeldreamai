import { useEffect, useRef } from "react";
import ServiceIcon from "./ServiceIcon.jsx";

// Cube sides in order f1..f6 (f5 is the top). icon = index into ServiceIcon, or "brand" for the logo tile
const FACES = [
  { n: "Google Ads", icon: 4, blurb: "Search ads that get you found" },
  { n: "Meta Ads", icon: 5, blurb: "Facebook and Instagram campaigns" },
  { n: "Website Designing", icon: 2, blurb: "Fast, modern, mobile-first sites" },
  { n: "App Development", icon: 3, blurb: "Content, social and growth" },
  { n: "PixelDreamAi", icon: "brand", blurb: "Grow your business with us" },
  { n: "Graphic Design & AI Videos", icon: 0, blurb: "Brand visuals and reels" },
];

/**
 * Glass hologram cube with the six services on its faces (CSS 3D).
 * Drag to rotate; it inertia-spins on its own, and every few seconds the six sides fly apart
 * and snap back together.
 */
export default function HoloCube() {
  const host = useRef(null), cube = useRef(null), scn = useRef(null);

  useEffect(() => {
    const h = host.current, cb = cube.current, sc = scn.current;
    let ry = -30, rx = -18, vy = 0, vx = 0, drag = false, lx = 0, ly = 0, px = 0, py = 0, tpx = 0, tpy = 0;
    let vis = true, last = performance.now(), raf = 0, busy = false;
    const timers = [];

    // assemble the first time it scrolls into view
    h.classList.add("pre");
    let started = false;
    const assemble = () => { if (started) return; started = true; h.classList.remove("pre"); };
    const io1 = new IntersectionObserver((e, o) => {
      if (e.some((r) => r.isIntersecting)) { timers.push(setTimeout(assemble, 150)); o.disconnect(); }
    }, { threshold: 0.35 });
    io1.observe(h);
    timers.push(setTimeout(assemble, 20000));

    const apply = () => {
      cb.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      sc.style.transform = `rotateX(${py * -8}deg) rotateY(${px * 10}deg)`;
    };
    apply();

    const down = (e) => { drag = true; lx = e.clientX; ly = e.clientY; try { h.setPointerCapture(e.pointerId); } catch {} h.classList.add("drag"); };
    const move = (e) => {
      const r = h.getBoundingClientRect();
      tpx = ((e.clientX - r.left) / r.width) * 2 - 1; tpy = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (drag) {
        const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
        vy = dx * 0.45; vx = -dy * 0.45; ry += vy; rx = Math.max(-80, Math.min(80, rx + vx));
      }
    };
    const up = () => { drag = false; h.classList.remove("drag"); };
    const leave = () => { tpx = tpy = 0; };
    h.addEventListener("pointerdown", down); h.addEventListener("pointermove", move);
    h.addEventListener("pointerup", up); h.addEventListener("pointercancel", up); h.addEventListener("pointerleave", leave);

    const io2 = new IntersectionObserver((a) => (vis = a[0].isIntersecting));
    io2.observe(h);

    const loop = (now) => {
      const k = Math.min(3, (now - last) / 16.7); last = now;
      if (vis && !document.hidden) {
        if (!drag) { ry += vy * k + 0.22 * k; rx += vx * k; rx += (-18 - rx) * 0.01 * k; vy *= Math.pow(0.95, k); vx *= Math.pow(0.95, k); }
        px += (tpx - px) * 0.06; py += (tpy - py) * 0.06; apply();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // explode and re-collect on a loop
    const cycle = () => {
      if (!vis || document.hidden || busy || drag || !started) return;
      busy = true; h.classList.add("pre");
      timers.push(setTimeout(() => { h.classList.remove("pre"); timers.push(setTimeout(() => (busy = false), 1500)); }, 1100));
    };
    const iv = setInterval(cycle, 6500);

    return () => {
      cancelAnimationFrame(raf); clearInterval(iv); timers.forEach(clearTimeout); io1.disconnect(); io2.disconnect();
      h.removeEventListener("pointerdown", down); h.removeEventListener("pointermove", move);
      h.removeEventListener("pointerup", up); h.removeEventListener("pointercancel", up); h.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="hx4" ref={host}>
      <div className="bokeh" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
      <div className="beam" aria-hidden="true" />
      <div className="plat" aria-hidden="true"><i className="p1" /><i className="p2" /><i className="p3" /></div>
      <div className="scn" ref={scn} aria-hidden="true">
        <div className="ring r1"><b /></div>
        <div className="ring r2"><b /></div>
        <div className="flo2">
          <div className="core" />
          <div className="cube" ref={cube}>
            {[1, 2, 3, 4, 5, 6].map((n) => <i key={`p${n}`} className={`pane f${n}`} />)}
            {FACES.map((s, i) => (
              <figure key={s.n} className={`face f${i + 1}`}>
                {s.icon === "brand" ? (
                  <span className="grid aspect-square w-[36%] place-items-center overflow-hidden rounded-[24%] border-2 border-white/90 bg-white p-[8%] shadow-[0_0_28px_rgba(90,200,255,.55)]">
                    <img src="/assets/pixeldreamai-mark.png" alt="" className="h-full w-full object-contain" />
                  </span>
                ) : (
                  <ServiceIcon index={s.icon} className="aspect-square w-[36%]" />
                )}
                <b>{s.n}</b>
                <small>{s.blurb}</small>
                <i>PixelDreamAi</i>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <p className="hint" aria-hidden="true">Drag to rotate the cube</p>
    </div>
  );
}
