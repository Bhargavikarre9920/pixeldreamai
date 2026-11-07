import { CONFIG } from "../data/content.js";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-9">
      <div className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3.5">
          <img src="/assets/pixeldreamai-logo-full.png" alt="PixelDreamAi" loading="lazy" className="h-[54px] w-auto" />
          <span className="text-sm text-mute">© {new Date().getFullYear()} PixelDreamAi. Creative ideas. Digital impact.</span>
        </div>
        <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-mute transition hover:text-white">
          Instagram
        </a>
      </div>
    </footer>
  );
}
