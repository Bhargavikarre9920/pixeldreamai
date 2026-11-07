import { useEffect, useState } from "react";
import { PILL, PILL_S } from "../ui.jsx";

const LINKS = ["Home", "Work", "Services", "Process", "About", "Contact"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let cur = "home";
      document.querySelectorAll("main section[id]").forEach((s) => {
        if (s.getBoundingClientRect().top < 160) cur = s.id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition ${
        scrolled ? "border-b border-white/10 bg-[#07050f]/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] w-[min(1180px,calc(100%-40px))] items-center justify-between gap-6">
        <a href="#home" aria-label="PixelDreamAi home" className="flex items-center gap-2.5 font-display text-xl font-bold">
          <img src="/assets/pixeldreamai-mark.png" alt="" width="52" height="36" className="h-9 w-auto" />
          <span>
            Pixel
            <b className="bg-gradient-to-r from-[#5b8cff] to-[#a06bff] bg-clip-text text-transparent">Dream</b>
            <i className="bg-gradient-to-r from-[#a06bff] to-[#ff5fd2] bg-clip-text not-italic text-transparent">Ai</i>
          </span>
        </a>

        <button
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xl md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <div
          className={`${
            open
              ? "absolute left-0 right-0 top-[72px] flex flex-col gap-4 border-b border-white/10 bg-[#0a0a0e] px-6 py-5"
              : "hidden"
          } md:static md:flex md:flex-row md:gap-9 md:border-0 md:bg-transparent md:p-0`}
        >
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className={`text-[.78rem] uppercase tracking-[.18em] transition hover:text-white ${
                active === l.toLowerCase() ? "text-white" : "text-mute"
              }`}
            >
              {l}
            </a>
          ))}
        </div>

        <a href="#contact" className={`${PILL} ${PILL_S} hidden md:inline-flex`}>Start a project</a>
      </nav>
    </header>
  );
}
