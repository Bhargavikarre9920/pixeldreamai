import { GLOBE, IG } from "../data/icons.js";

/** Brand-style tile for each of the six services (same order as SV in content.js). */
const ICONS = [
  { img: "/assets/svc/graphic.jpg" },
  { img: "/assets/svc/ai-video.jpg" },
  { bg: "#21759B", svg: GLOBE },
  // Mobile Application Development
{
  bg: "linear-gradient(135deg, #168BFF, #795BFF)",
  svg: `
    <rect x="7" y="2" width="10" height="20" rx="2.5"
      fill="none" stroke="#fff" stroke-width="1.8"/>
    <path d="M10 5h4M11 19h2"
      stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="9" y="8" width="2.5" height="2.5" rx=".5" fill="#fff"/>
    <rect x="13" y="8" width="2.5" height="2.5" rx=".5" fill="#fff"/>
    <rect x="9" y="12" width="2.5" height="2.5" rx=".5" fill="#fff"/>
    <rect x="13" y="12" width="2.5" height="2.5" rx=".5" fill="#fff"/>
  `,
},
  { img: "/assets/svc/google-ads.png" },
  { img: "/assets/svc/meta.png" },
];
export const SERVICE_ICONS = ICONS;

export default function ServiceIcon({ index, className = "h-20 w-20" }) {
  const d = ICONS[index];
  return (
    <span
      className={`grid place-items-center overflow-hidden rounded-[24%] border-2 border-white/90 bg-white shadow-[0_0_28px_rgba(90,200,255,.45)] ${className}`}
      style={d.bg ? { background: d.bg } : undefined}
    >
      {d.img ? (
        <img src={d.img} alt="" className="h-full w-full object-cover" />
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[58%] w-[58%]" dangerouslySetInnerHTML={{ __html: d.svg }} />
      )}
    </span>
  );
}
