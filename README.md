# ResumeWala

> AI-assisted resume workspace for building, auditing, and enhancing resumes with ATS intelligence + Groq AI.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e?logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-AI-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

ResumeWala lets candidates craft job-ready, ATS-friendly resumes in minutes. Start from a blank canvas, import an existing PDF/DOC/TXT, receive instant ATS scoring, then let Groq’s LLMs rewrite weak sections with role-specific keywords and quantified impact. Supabase powers authentication and (soon) storage, while Vercel ships the experience globally.

---

## 📚 Table of Contents
1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Getting Started](#-getting-started)
5. [Environment Variables](#%EF%B8%8F-environment-variables)
6. [Supabase & OAuth Setup](#-supabase--oauth-setup)
7. [Groq Integration](#-groq-integration)
8. [Architecture Overview](#-architecture-overview)
9. [Available Scripts](#-available-scripts)
10. [Deployment Checklist](#-deployment-checklist)
11. [Troubleshooting](#-troubleshooting)
12. [Roadmap](#%EF%B8%8F-roadmap)

---

## ✨ Features
- **Enterprise-grade auth** – Supabase email/password + Google & GitHub OAuth, session hydration, and protected routes.
- **Guided builder** – Five-step wizard (personal info → experience → education → skills → projects) with completion tracking, inline validation, and mobile-friendly layout.
- **Pixel-perfect preview** – Live preview rendered with Framer Motion animations and typography tuned for ATS readability.
- **Upload & ATS audit** – Drag/drop resume files, parse text, compute ATS score, display section breakdown, and surface blocking issues.
- **Groq AI enhancement** – Optional upgrade that rewrites bullet points, injects role-specific keywords, and projects “before vs after” ATS scores.
- **Payment-ready hooks** – Stub payment component (₹19 upsell) already wired for future Stripe/Razorpay integration.
- **Responsive dashboard** – Single entry point to launch builder, upload resumes, check drafts, or log out.

## 🧱 Tech Stack
| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite 8, React Router 7 |
| Styling & UX | Tailwind tokens, custom CSS, Framer Motion, Lucide Icons |
| State & Context | React Context API, custom hooks |
| Backend-as-a-Service | Supabase (Auth, storage later) |
| AI & Scoring | Groq API, custom ATS analyzer utilities |
| Tooling | ESLint 9, PostCSS, autoprefixer |

## 📁 Project Structure
```
src/
├── api/                # ATS scoring + Groq helpers
├── components/
│   ├── builder/        # Step sections + live preview
│   ├── upload/         # Upload pipeline & ATS UI
│   ├── payment/        # Paywall stub (₹19 upsell)
│   └── ProtectedRoute.jsx
├── context/            # AuthProvider (Supabase sessions)
├── lib/                # Supabase client
├── pages/              # Landing, Auth, Dashboard, Builder, Upload
└── utils/              # ATS analyzer + helpers
```

## ⚙️ Environment Variables
| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL (`https://<project-ref>.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Public anon key from Supabase settings |
| `VITE_GROQ_API_KEY` | Client-side Groq key (used only for optional builder helpers) |
| `VITE_RAZORPAY_KEY_ID` | Publishable Razorpay key ID (for checkout modal) |
| `GROQ_API_KEY` | **Serverless** Groq key used inside `/api/enhance-resume` |
| `RAZORPAY_KEY_ID` | Razorpay key ID for serverless order creation/verification |
| `RAZORPAY_KEY_SECRET` | Razorpay secret used to sign/verify payments |

Create a `.env` (or configure them in Vercel) with:
```
VITE_SUPABASE_URL=your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=anon-key-from-supabase
VITE_GROQ_API_KEY=groq_api_key
VITE_RAZORPAY_KEY_ID=rzp_live_xxx

# Serverless (Vercel Dashboard → Environment Variables)
GROQ_API_KEY=groq_api_key
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your_secret
```

- `/api/enhance-resume` and `/api/generate-pdf` run on Vercel’s Node runtime, so keep those keys on the server only.
- `VITE_RAZORPAY_KEY_ID` is safe to expose on the client (it’s publishable) but never ship the secret to the browser.

- Do **not** commit the `.env` file; `.env.example` documents required keys.
- When deploying on Vercel, add the same variables so both build and runtime environments can reach Supabase and Groq.

## 🚀 Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the dev server**
   ```bash
   npm run dev
   ```
3. Visit <http://localhost:5173>.

### Recommended workflow
- Run `npm run lint` before pushing to keep the codebase consistent.
- Use a second terminal to tail Vite logs (`npm run dev`) while iterating.
- For Supabase edge functions (future), run them alongside the app.

## 🔐 Supabase & OAuth Setup
1. Create a Supabase project and grab the `PROJECT_URL` + `anon` key for `.env`.
2. Enable **Email**, **Google**, and **GitHub** providers under **Authentication → Providers**. Paste the client IDs/secrets from Google Cloud Console and GitHub Developer Settings.
3. In **Authentication → URL Configuration**, add:
   - `http://localhost:5173/auth/callback`
   - `https://your-vercel-domain.vercel.app/auth/callback`
4. In Google/GitHub OAuth app settings, add the exact same callback URLs **plus** the Supabase callback (`https://<project>.supabase.co/auth/v1/callback`).
5. (Optional) Configure RLS policies and storage buckets when persisting resume data to Supabase tables (`profiles`, `resumes`, etc.).

> ⚠️ Common gotcha: if GitHub OAuth bounces back to `/auth` without logging in, double-check that the GitHub app’s callback URL **exactly** matches the Supabase URL configuration entry.

## 🤖 Groq Integration
- Generate a key from <https://console.groq.com> and store it in `VITE_GROQ_API_KEY`.
- `src/api/groqApi.js` handles requests to Groq’s large language models for rewriting sections and improving ATS alignment.
- The upload wizard sends raw text + optional job description to Groq and streams progress updates to the UI.

## 🏗️ Architecture Overview

```
┌─────────────┐     login/signup     ┌──────────────┐
│ React Views │ ───────────────────▶ │ Supabase Auth│
└─────┬───────┘                      └─────┬────────┘
   │ session + user metadata           │ JWT / profile events
   ▼                                   ▼
┌─────────────┐  fetch/save resume  ┌──────────────┐
│ Builder/    │ ───────────────────▶ │ (Planned)    │
│ Upload UI   │  data via REST/RPC  │ Supabase DB  │
└─────┬───────┘                      └──────────────┘
   │ text + JD
   ▼
┌─────────────┐  AI rewrite/scores
│ Groq LLMs   │ ◀──────────────────┐
└─────────────┘                    │
   ▲                            │
   └─────── ATS analyzer ◀──────┘
```

- `src/context/AuthContext.jsx` hydrates Supabase sessions and exposes `login`, `signup`, `logout`, and `loginWithProvider`.
- `src/components/ProtectedRoute.jsx` gates any page that needs authentication.
- `src/api/atsScore.js` + `src/utils/atsAnalyzer.js` evaluate form data or uploaded text and power the progress rings.
- `src/api/groqApi.js` orchestrates Groq requests for rewriting sections and improving ATS scores.

## 📜 Available Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot module replacement |
| `npm run build` | Create an optimized production build (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint with the project config |

### Testing
- **Unit tests**: Pending (to be added when ATS analyzer is finalized).
- **Manual flows**: Test builder, upload, and OAuth logins in both local and Vercel environments.

## 🌐 Deployment Checklist
1. Push code to GitHub and import the repo into Vercel.
2. Configure the three environment variables in Vercel’s dashboard.
3. Add the Vercel domain to Supabase redirect URLs and OAuth provider settings.
4. Trigger a deploy — Vercel runs `npm install` + `npm run build` automatically.
5. Test email/password, Google, and GitHub logins on the live URL.
6. Verify that Groq-powered enhancement flows work end-to-end in production.

> Deployment tip: Vercel may warn about large JS chunks (>500 kB). This is expected due to pdfjs + framer-motion. Consider code-splitting later if needed.

## 🧩 Troubleshooting
| Issue | Fix |
| --- | --- |
| **GitHub OAuth redirects back to Sign In** | Ensure the GitHub OAuth app callback matches Supabase redirect URL exactly and includes `/auth/callback`. |
| **“redirect URL not allowed” from Supabase** | Add both local (`http://localhost:5173/auth/callback`) and production (`https://<domain>/auth/callback`) URLs under Supabase Authentication → URL Configuration. |
| **Groq calls fail locally** | Confirm `VITE_GROQ_API_KEY` is present, restart `npm run dev`, and verify there are no ad-blockers blocking the request. |
| **Build warnings about chunk size** | Safe to ignore for now; add dynamic imports for heavy modules later. |

## 🛣️ Roadmap
- Persist resume drafts to Supabase (`profiles`, `resumes` tables) instead of `localStorage`.
- Add tiered plans + real payment integration (Stripe or Razorpay) to replace the current stub.
- Export polished PDFs with custom templates.
- Admin dashboard for monitoring ATS stats and usage.
- Integrate analytics + logging to track ATS improvements over time.
- Add collaborative editing / recruiter review links.

---
Built with ❤️ to help candidates ship job-ready resumes in minutes.
