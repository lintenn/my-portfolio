# Deployment

The site is hosted on **Vercel** using its **Git integration** (there is no custom deploy pipeline in this repo):

| Branch                | Vercel environment | URL                                                                            |
| --------------------- | ------------------ | ------------------------------------------------------------------------------ |
| `main`                | **Production**     | [www.luismigarcia.com](https://www.luismigarcia.com) (apex redirects to `www`) |
| `develop`             | **Preview**        | the `…-git-develop-….vercel.app` URL shown in Vercel / on the commit           |
| any other branch / PR | Preview            | unique URL per deployment                                                      |

Every push triggers a build on Vercel; GitHub Actions (`ci.yml`) runs lint, typecheck, tests and the build in parallel as a quality gate. To ship to production, merge `develop` into `main` via a PR (see the `release` skill / [DEVELOPMENT.md](DEVELOPMENT.md#release-flow)).

> The DNS is proxied through Cloudflare (the response headers show `server: cloudflare`). If you ever see odd caching of `/api/chat`, make sure Cloudflare isn't caching or buffering it.

## Vercel project settings

- **Framework preset:** Next.js. **Build command:** default (`npm run build`). **Install:** default (`npm install`/`npm ci`).
- **Node.js version:** **24.x**. `package.json` pins `"engines": { "node": "24.x" }`, which **overrides** the dashboard setting (a range like `>=22` would make Vercel ignore the dashboard and auto-upgrade to every new major). Set the dashboard to 24.x too so both agree and the build log has no warning. AI SDK 7 requires Node ≥ 22.
- **Fluid Compute** is enabled in code (`vercel.json` → `"fluid": true`; projects created before April 2025 have it off by default). For an AI chat this matters: one instance serves several streaming requests concurrently, and you're billed for active CPU, not for the seconds spent waiting on OpenAI. `maxDuration` for `/api/chat` is 60 s (set in the route).
- **Function region:** keep the default `iad1` (Washington). Each chat answer makes one or two round trips to OpenAI, whose API is in the US, so running next to it is faster than running next to the visitor. If you enable Upstash, create the Redis database in a US-East region too.
- Enable **Web Analytics** and **Speed Insights** in the Vercel dashboard (the components are already in the layout; they're cookie-less).

### Other Deployment Settings (dashboard)

| Setting                                                             | Recommendation                                                                                                                                 |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Fluid Compute                                                       | On (done via `vercel.json`)                                                                                                                    |
| Node.js Version                                                     | 24.x                                                                                                                                           |
| Skew Protection                                                     | Turn on if your plan offers it: after a deploy, open tabs keep talking to the matching server version (relevant for the contact Server Action) |
| Prioritize Production Builds                                        | On if available — a production deploy shouldn't wait behind previews                                                                           |
| On-Demand Concurrent Builds, Cold Start Prevention, bigger machines | Not needed for a personal site (paid features)                                                                                                 |
| Deployment Protection                                               | Keep _Standard Protection_: Preview URLs require a Vercel login, Production stays public                                                       |

### Build log notes

- `npm warn deprecated eslint@9…` — ESLint 10 is out, but the plugins bundled in `eslint-config-next` (e.g. `eslint-plugin-react`) still declare ESLint 9 as their peer. Upgrade when they do (Dependabot will propose it). It only affects linting.
- `npm warn install-scripts … not yet covered by allowScripts` — newer npm versions block dependency install scripts unless approved. `package.json → allowScripts` approves the two we use (`esbuild`, `unrs-resolver`, both dev tooling).

## Environment variables

Set them in Vercel → Project → Settings → Environment Variables, for **Production and Preview**. Changes only apply to **new deployments** — redeploy after editing.

| Variable                   | Required      | Used by                      | Notes                                                          |
| -------------------------- | ------------- | ---------------------------- | -------------------------------------------------------------- |
| `OPENAI_API_KEY`           | yes (chat)    | `/api/chat`, evals           | Without it the chat returns 503 and the rest of the site works |
| `OPENAI_MODEL`             | no            | `src/lib/ai/config.ts`       | Default `gpt-6-luna`                                           |
| `UPSTASH_REDIS_REST_URL`   | recommended   | `src/lib/rate-limit.ts`      | Shared rate limiting across function instances                 |
| `UPSTASH_REDIS_REST_TOKEN` | recommended   | `src/lib/rate-limit.ts`      |                                                                |
| `FORMSPREE_ENDPOINT`       | yes (contact) | `src/app/contact/actions.ts` | The Formspree form id (the part after `/f/`)                   |
| `NEXT_PUBLIC_SITE_URL`     | no            | `src/content/site.ts`        | Canonical URL; default `https://www.luismigarcia.com`          |

### Variables to delete (from the 2024 version)

`ASTRA_DB_ENDPOINT`, `ASTRA_DB_APPLICATION_TOKEN`, `ASTRA_DB_COLLECTION` — AstraDB is no longer used. You can also delete the AstraDB database itself.

## OpenAI

1. In [platform.openai.com](https://platform.openai.com), create a **dedicated project** (e.g. `portfolio`).
2. Create a **new API key** inside that project with **Restricted** permissions: grant _Write_ only to the permission that covers the Responses API (`/v1/responses`, listed under _Model capabilities_ / _Responses_ depending on the dashboard version) and leave everything else as _None_. Name it e.g. `portfolio-vercel-prod`.
3. In the project's **Limits**: set a monthly **budget** (e.g. $5–10) with an email alert at 50–80%. Optionally restrict allowed models to the one in use.
4. In **Billing**, add credits (prepaid). Leave auto-recharge off unless you want it. Note that prepaid credits can expire (check the expiry date shown in Billing).
5. Put the key in Vercel (`OPENAI_API_KEY`, Production + Preview) and in your local `.env.local`, then redeploy.
6. **Revoke the old 2024 key** (`My-Portfolio-Key`, permissions "All") once the new one works.
7. Optional: add it as a GitHub repository secret named `OPENAI_API_KEY` to enable the evals workflow.

Why a new key instead of reusing the old one: least privilege (the old one has _All_ permissions), rotation hygiene (it has lived in several places for two years), and per-project budgets/usage tracking.

## Upstash Redis (rate limiting)

Optional but recommended: without it, each serverless instance keeps its own in-memory counters, so limits are approximate.

1. In [console.upstash.com](https://console.upstash.com) create (or reuse, if it still exists) a Redis database — free tier is plenty. Region close to the Vercel function (e.g. `eu-west`).
2. Copy the **REST URL** and **REST token** into `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (or install the Upstash integration from the Vercel Marketplace, which sets them for you).
3. Redeploy. If Redis is unreachable, the limiter fails open (requests are allowed and an error is logged).

## Formspree (contact form)

Reuses the existing Formspree form. `FORMSPREE_ENDPOINT` is the form id. The Server Action posts JSON to `https://formspree.io/f/<id>`; a honeypot field silently drops basic bots. If submissions stop arriving, check the Formspree dashboard (monthly quota, spam filter, verified email).

## Domain

`luismigarcia.com` → redirects to `www.luismigarcia.com` (configured in Vercel Domains). `NEXT_PUBLIC_SITE_URL` must match the canonical host for correct Open Graph URLs and sitemap.

## Troubleshooting

| Symptom                                          | Likely cause → fix                                                                                                          |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Chat says "not configured right now" (503)       | `OPENAI_API_KEY` missing in that environment → add it and redeploy                                                          |
| Chat says "taking a break… AI budget is used up" | OpenAI balance is $0 or the project budget was hit (`chat.error kind:"quota"` in logs) → add credits / raise budget         |
| Chat says "temporarily unavailable"              | Invalid or revoked key (`kind:"auth"`) → new key, redeploy                                                                  |
| "Too many messages" (429)                        | Rate limit hit (per IP or global daily cap). Adjust in `src/lib/rate-limit.ts`                                              |
| Contact form error                               | `FORMSPREE_ENDPOINT` missing/wrong, or Formspree quota reached                                                              |
| Build fails on Vercel with Node errors           | `engines.node` in `package.json` decides (24.x); make sure nothing overrides it                                             |
| Wrong language on first visit                    | The proxy follows the browser's `Accept-Language`; the language switcher then stores the choice in the `NEXT_LOCALE` cookie |
| Old content after editing `src/content`          | `/` and `/about` are ISR (daily); a new deployment refreshes them immediately                                               |
