import { useEffect, useMemo, useState } from "react";
import { CONFIG } from "../data/content.js";
import { mailConfigured, sendEnquiry } from "../lib/sendMail.js";

/**
 * PixelDreamAi contact form — React + Tailwind CSS (v3 or v4).
 *
 * Usage:
 *   <ContactForm endpoint="https://formspree.io/f/yourFormId" />
 *
 * With no `endpoint`, nothing is submitted: the form shows a "Not sent yet"
 * notice and lets the visitor copy the enquiry and open Instagram instead.
 */

const SERVICES = [
  "Graphic Designing",
  "AI Videos",
  "Website Designing",
  "App Development",
  "Google Ads",
  "Meta Ads",
];
const BUDGETS = ["Not sure yet", "Small project", "Medium project", "Large project"];
const TIMELINES = ["Flexible", "Within a month", "As soon as possible"];
const INSTAGRAM = CONFIG.instagram;

const INITIAL = {
  name: "",
  email: "",
  service: "",
  phone: "",
  budget: BUDGETS[0],
  timeline: TIMELINES[0],
  message: "",
};

const RULES = {
  name: (v) => (v.trim() ? "" : "Please enter your name."),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.",
  service: (v) => (v ? "" : "Please choose a service."),
  message: (v) =>
    v.trim().length >= 10 ? "" : "Please describe your project (at least 10 characters).",
};

const fieldBase =
  "w-full rounded-xl border bg-white/[0.06] px-4 py-3 text-base text-[#f1efff] " +
  "placeholder-[#8886b0] backdrop-blur transition outline-none " +
  "hover:border-violet-400/60 focus:border-violet-500 focus:bg-white/10 " +
  "focus:ring-4 focus:ring-violet-500/30";

function Field({ id, label, error, className = "", children }) {
  return (
    <div className={`group flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={id}
        className="text-sm font-semibold tracking-wide text-[#d9d5ff] transition-colors group-focus-within:text-sky-300"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`e-${id}`} className="text-sm text-pink-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({ endpoint = CONFIG.endpoint, prefill }) {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { text, bad }
  const [notSent, setNotSent] = useState(false);
  const [sending, setSending] = useState(false);

  // "Get a quote" buttons elsewhere on the page pre-select a service and focus the name field
  useEffect(() => {
    if (!prefill) return;
    setValues((v) => ({
      ...v,
      service: prefill.service || v.service,
      message: prefill.message && !v.message ? prefill.message : v.message,
    }));
    const t = setTimeout(() => document.getElementById("name")?.focus({ preventScroll: true }), 500);
    return () => clearTimeout(t);
  }, [prefill]);

  const pixels = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const z = 3 + Math.random() * 5, col = ["#4cc9ff", "#8a6bff", "#ff5fd2"][i % 3];
        return { left: `${Math.random() * 100}%`, width: z, height: z, background: col, boxShadow: `0 0 8px ${col}`,
          animationDuration: `${8 + Math.random() * 9}s`, animationDelay: `-${Math.random() * 14}s` };
      }),
    []
  );

  const border = (key) =>
    errors[key] ? "border-pink-400/80" : "border-violet-400/30";

  const bind = (key) => ({
    id: key,
    name: key,
    value: values[key],
    "aria-invalid": errors[key] ? "true" : undefined,
    "aria-describedby": errors[key] ? `e-${key}` : undefined,
    onChange: (e) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
    },
  });

  const enquiryText = () =>
    `Hi PixelDreamAi! I'm ${values.name} (${values.email}). Service: ${values.service}. ` +
    `Budget: ${values.budget}. Timeline: ${values.timeline}. ${values.message}`;

  async function copyAndOpenInstagram() {
    try {
      await navigator.clipboard.writeText(enquiryText());
      setNotSent(false);
      setStatus({ text: "Enquiry copied. Paste it into our Instagram chat.", bad: false });
    } catch {
      setStatus({
        text: "Copy failed. Please type your message in our Instagram chat.",
        bad: true,
      });
    }
    window.open(INSTAGRAM, "_blank", "noopener");
  }

  async function onSubmit(e) {
    e.preventDefault();
    const next = {};
    Object.entries(RULES).forEach(([key, rule]) => {
      const msg = rule(values[key]);
      if (msg) next[key] = msg;
    });
    setErrors(next);
    setStatus(null);
    setNotSent(false);

    const firstBad = Object.keys(next)[0];
    if (firstBad) {
      document.getElementById(firstBad)?.focus();
      return;
    }

    if (!endpoint && !mailConfigured) {
      setNotSent(true);
      return;
    }

    setSending(true);
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("bad response");
      } else {
        if (values.website) { setValues(INITIAL); return; } // honeypot
        await sendEnquiry(values);
      }
      setStatus({ text: "Thank you. Your enquiry has been sent. We’ll reply soon.", bad: false });
      setValues(INITIAL);
    } catch (err) {
      setStatus({
        text: err.message && err.message !== "bad response" && err.message !== "Failed to fetch"
          ? `${err.message} Your details are still here.`
          : "Sorry, something went wrong and your enquiry was not sent. Your details are still here. Please try again.",
        bad: true,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      id="fm"
      noValidate
      onSubmit={onSubmit}
      className="relative isolate grid grid-cols-1 gap-x-6 gap-y-5 overflow-hidden rounded-[28px] border border-violet-400/30 bg-gradient-to-br from-[#0f0d2e] via-[#0a0a22] to-[#150b2c] p-6 text-[#eae8ff] shadow-[0_24px_80px_rgba(60,40,200,0.4)] sm:grid-cols-2 sm:p-9"
    >
      {/* animated colour glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-blue-500/50 blur-3xl" />
        <div className="absolute -right-16 top-0 h-64 w-64 animate-pulse rounded-full bg-violet-500/40 blur-3xl [animation-delay:1.2s]" />
        <div className="absolute -bottom-24 right-10 h-72 w-72 animate-pulse rounded-full bg-fuchsia-500/30 blur-3xl [animation-delay:2.4s]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,140,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(120,140,255,.1) 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="fpx">{pixels.map((s, i) => <i key={i} style={s} />)}</div>
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={values.website || ""} onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
        className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <Field id="name" label="Full name *" error={errors.name}>
        <input {...bind("name")} autoComplete="name" className={`${fieldBase} ${border("name")}`} />
      </Field>

      <Field id="email" label="Email *" error={errors.email}>
        <input
          {...bind("email")}
          type="email"
          autoComplete="email"
          className={`${fieldBase} ${border("email")}`}
        />
      </Field>

      <Field id="service" label="Service *" error={errors.service}>
        <select {...bind("service")} className={`${fieldBase} ${border("service")}`}>
          <option value="" className="bg-[#12112e]">
            Choose a service
          </option>
          {SERVICES.map((s) => (
            <option key={s} className="bg-[#12112e]">
              {s}
            </option>
          ))}
          <option className="bg-[#12112e]">Not sure yet</option>
        </select>
      </Field>

      <Field id="phone" label="Phone (optional)">
        <input
          {...bind("phone")}
          type="tel"
          autoComplete="tel"
          className={`${fieldBase} border-violet-400/30`}
        />
      </Field>

      <Field id="budget" label="Budget range">
        <select {...bind("budget")} className={`${fieldBase} border-violet-400/30`}>
          {BUDGETS.map((b) => (
            <option key={b} className="bg-[#12112e]">
              {b}
            </option>
          ))}
        </select>
      </Field>

      <Field id="timeline" label="Timeline">
        <select {...bind("timeline")} className={`${fieldBase} border-violet-400/30`}>
          {TIMELINES.map((t) => (
            <option key={t} className="bg-[#12112e]">
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Project description *" error={errors.message} className="sm:col-span-2">
        <textarea
          {...bind("message")}
          rows={4}
          className={`${fieldBase} resize-y ${border("message")}`}
        />
      </Field>

      <p className="text-sm text-[#9d9bc4] sm:col-span-2">
        We use the details you share only to reply to your enquiry.
      </p>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={sending}
          className="group relative overflow-hidden rounded-full border-2 border-transparent bg-[#171236] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_30px_rgba(110,90,255,0.45)] transition [background:linear-gradient(#171236,#171236)_padding-box,linear-gradient(90deg,#4cc9ff,#8a6bff,#ff5fd2)_border-box] hover:-translate-y-0.5 hover:shadow-[0_8px_44px_rgba(150,110,255,0.7)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="relative z-10">{sending ? "Sending…" : "Send enquiry →"}</span>
          <span
            aria-hidden
            className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-[20deg] bg-white/30 transition-all duration-700 group-hover:left-[130%]"
          />
        </button>
      </div>

      <div role="status" aria-live="polite" className="sm:col-span-2 empty:hidden">
        {notSent && (
          <div className="rounded-2xl border border-pink-400/60 bg-[#3c0f28]/80 p-4 text-pink-100">
            <b>Not sent yet.</b> Online delivery isn’t connected on this site yet, so nothing has been
            submitted. You can copy your enquiry and send it to us on Instagram.
            <button
              type="button"
              onClick={copyAndOpenInstagram}
              className="mt-4 block rounded-full border border-violet-400/60 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/20"
            >
              Copy and open Instagram
            </button>
          </div>
        )}
        {status && (
          <div
            className={`rounded-2xl border p-4 ${
              status.bad
                ? "border-pink-400/60 bg-[#3c0f28]/80 text-pink-100"
                : "border-violet-400/50 bg-[#14123c]/80 text-[#eae8ff]"
            }`}
          >
            {status.text}
          </div>
        )}
      </div>
    </form>
  );
}
