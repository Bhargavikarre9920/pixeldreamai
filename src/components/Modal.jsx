import { useEffect, useRef } from "react";

/** Accessible modal built on the native <dialog> element (focus, Esc and scroll lock). */
export default function Modal({ open, onClose, children, label = "Details" }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      document.documentElement.style.overflow = "hidden";
      d.showModal();
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      className="m-auto w-[min(960px,92vw)] max-w-none overflow-hidden rounded-3xl border border-white/10 bg-[#0c0b1c] p-0 text-white shadow-[0_30px_120px_rgba(60,40,200,.5)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {open && (
        <>
          <button
            aria-label="Close"
            onClick={() => ref.current.close()}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-2xl leading-none hover:bg-white/20"
          >
            ×
          </button>
          {children}
        </>
      )}
    </dialog>
  );
}
