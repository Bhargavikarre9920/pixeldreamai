// Frontend-only email via EmailJS (https://www.emailjs.com): it sends through YOUR Gmail account,
// so enquiries arrive in your Gmail inbox. No server needed, works on Vercel.
const env = import.meta.env;
const SERVICE = env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE = env.VITE_EMAILJS_TEMPLATE_ID;
const KEY = env.VITE_EMAILJS_PUBLIC_KEY;
const AUTOREPLY = env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;

export const mailConfigured = Boolean(SERVICE && TEMPLATE && KEY);

async function post(template, params) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service_id: SERVICE, template_id: template, user_id: KEY, template_params: params }),
  });
  if (!res.ok) throw new Error((await res.text().catch(() => "")) || "send failed");
}

export async function sendEnquiry(v) {
  const params = {
    from_name: v.name, from_email: v.email, reply_to: v.email, phone: v.phone || "-",
    service: v.service, budget: v.budget, timeline: v.timeline, message: v.message,
  };
  await post(TEMPLATE, params);
  if (AUTOREPLY) post(AUTOREPLY, params).catch(() => {}); // confirmation to the customer; never blocks the result
}
