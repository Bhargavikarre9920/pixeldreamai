# PixelDreamAi (React + Tailwind CSS)

Vite + React 18 + Tailwind CSS 3.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/ — upload it to Netlify / Vercel / Cloudflare Pages
```

## Where things are
- `src/App.jsx` — page order. `src/components/*` — one component per section.
- `src/data/content.js` — services, categories, portfolio items and `CONFIG`.
  Set `CONFIG.endpoint` to your form service URL (e.g. `https://formspree.io/f/xxxx`) so the contact form delivers enquiries.
- `src/effects.css` — CSS for the animated showpieces (preloader, hologram cube, orbit phone story,
  hero logo panel, process connectors, contact glow). Everything else uses Tailwind utility classes.
- `public/assets/*` — logo, work images and service icons.

## Contact form → your Gmail (frontend only, works on Vercel)
No backend. The form sends through **EmailJS**, which uses your Gmail account, and every enquiry lands in your inbox.
(A Gmail App Password cannot be used in frontend code: anyone could read it from the site and send mail as you.)

1. Sign up free at emailjs.com. **Email Services → Add service → Gmail** and connect your account.
2. **Email Templates → Create**. Set *To email* = your Gmail, *Reply-To* = `{{reply_to}}`, subject e.g. `New enquiry: {{service}} from {{from_name}}`.
   Body can use `{{from_name}} {{from_email}} {{phone}} {{service}} {{budget}} {{timeline}} {{message}}`.
3. (Optional) Make a second template with *To email* = `{{from_email}}` as the customer auto-reply.
4. **Account → API keys** → copy the Public Key.
5. Locally: copy `.env.example` to `.env.local` and fill the values. On Vercel: Project → Settings → Environment Variables, add the same `VITE_EMAILJS_*` names, then redeploy.

Vercel: import the repo, framework Vite, build `npm run build`, output `dist`.
Until the keys are set, the form shows "Not sent yet" and offers the Instagram fallback.

## Hero
The hero logo is built from 3D cubes with three.js (`three@0.128` in package.json, `src/components/PixelLogo.jsx`). If a browser has no WebGL, the 2D pixel-swirl canvas shows instead.
