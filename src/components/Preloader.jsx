import { useEffect, useRef, useState } from "react";

/** Counts up while the page, images and fonts load, then lifts and fires `pdai-go` for the hero. */
export default function Preloader() {
  const [gone, setGone] = useState(false);
  const root = useRef(null), num = useRef(null), bar = useRef(null), mark = useRef(null);

  useEffect(() => {
    const de = document.documentElement, L = root.current;
    if (!L || window.__ldrStarted) return;
    window.__ldrStarted = true;
    de.classList.add("ldg");
    const n = num.current, b = bar.current, m = mark.current;
    let target = 6, shown = 0, loaded = document.readyState === "complete", fonts = false, done = false;
    const t0 = performance.now(), minT = 2100;
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(
      () => (fonts = true),
      () => (fonts = true)
    );
    setTimeout(() => (loaded = fonts = true), 5000);
    setTimeout(() => finish(), 8000);

    function finish() {
      if (done) return;
      done = true;
      n.textContent = "100";
      b.style.transform = "scaleX(1)";
      m.style.setProperty("--p", "100%");
      setTimeout(() => {
        L.classList.add("out");
        setTimeout(() => {
          window.__pdaiGo = true;
          window.dispatchEvent(new Event("pdai-go"));
          de.classList.remove("ldg");
        }, 420);
      }, 320);
      setTimeout(() => setGone(true), 1800);
    }
    function tick(now) {
      if (done) return;
      const el = now - t0;
      const im = [].filter.call(document.images, (i) => i.loading !== "lazy");
      const ip = im.length ? im.filter((i) => i.complete).length / im.length : 1;
      target = Math.max(target, 6 + ip * 58 + (fonts ? 14 : 0) + (loaded ? 22 : 0));
      const goal = Math.min(target, (el / minT) * 100, 100);
      shown += (goal - shown) * 0.1 + 0.06;
      if (shown > goal) shown = goal;
      n.textContent = String(Math.floor(shown)).padStart(2, "0");
      b.style.transform = "scaleX(" + shown / 100 + ")";
      m.style.setProperty("--p", shown + "%");
      if (loaded && fonts && shown >= 99.4) return finish();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, []);

  if (gone) return null;
  return (
    <div id="ldr" ref={root} role="status" aria-label="Loading PixelDreamAi">
      <div className="ld-px" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => <i key={i} />)}
      </div>
      <div className="ld-c">
        <div className="ld-mark" ref={mark}>
          <img className="b" src="/assets/pixeldreamai-mark.png" alt="" />
          <img className="f" src="/assets/pixeldreamai-mark.png" alt="" />
        </div>
        <div className="ld-n"><b ref={num}>00</b><i>%</i></div>
        <div className="ld-bar"><u ref={bar} /></div>
        <p>Creative ideas. Digital impact.</p>
      </div>
    </div>
  );
}
