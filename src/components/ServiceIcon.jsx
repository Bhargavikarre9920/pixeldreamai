import { GLOBE, IG } from "../data/icons.js";

/** Brand-style tile for each of the six services (same order as SV in content.js). */
const ICONS = [
  { img: "/assets/svc/graphic.jpg" },
  { img: "/assets/svc/ai-video.jpg" },
  { bg: "#21759B", svg: GLOBE },
  {
    bg: "linear-gradient(45deg,#FEDA75,#FA7E1E 25%,#D62976 50%,#962FBF 75%,#4F5BD5)",
    svg: `<path fill="#fff" d="${IG}"/>`,
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
