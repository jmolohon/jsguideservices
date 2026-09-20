# Deploy jsguideservices.com (Cloudflare Pages + Route 53)

Practical path to host the Astro rebuild of [jsguideservices.com](https://jsguideservices.com) on **Cloudflare Pages**, with the domain registered in **Amazon Route 53**.

Why Cloudflare (not Vercel Hobby): this is a commercial guide-service site. Cloudflare Pages Free allows commercial use. The site is fully static (`npm run build` produces `dist/`); no Astro adapter required.

---

## Prerequisites

1. Cloudflare account (you already have one)
2. GitHub account + this repo pushed: `https://github.com/jmolohon/jsguideservices.git`
3. Route 53 hosting the domain registration for `jsguideservices.com`
4. Node installed locally (already true on your machine)

---


---

## Preferred path (2026): Cloudflare Workers + static assets

Cloudflare’s create wizard now defaults to a **Worker** project (Build command + Deploy command). That is fine for this site. There is no “build output directory” field in that UI — `dist` is declared in `wrangler.jsonc` instead:

```jsonc
{
  "name": "jsguideservices",
  "compatibility_date": "2026-09-19",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

Dashboard settings for the Git-connected Worker:

| Setting | Value |
|--------|--------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Path | `/` |

Commit `wrangler.jsonc` to `main`, push, then **Deploy**. Cloudflare builds, then Wrangler uploads `dist/`.

Pages is not shut down, but new projects are steered to Workers. The older Pages steps below still work if you create via the **Pages** tab instead.

## Step 1 — Confirm GitHub is up to date

In PowerShell:

```powershell
cd C:\Users\jmolo\jsguideservices
git status
git push -u origin main
```

If GitHub already has `main` with the Astro project, you are done here. Cloudflare will build from GitHub, not from your local `dist/` folder.

---

## Step 2 — Create the Pages project

1. Open [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
2. **Create** → **Pages** → **Connect to Git** (or **Import an existing Git repository**)
3. Authorize GitHub if prompted, then select **`jmolohon/jsguideservices`**
4. Use these build settings:

| Setting | Value |
|--------|--------|
| Production branch | `main` |
| Framework preset | Astro (or None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (leave default) |
| Node version | 22 (or latest LTS; project wants `>=22.12.0`) |

5. **Save and Deploy**

First build can take a while (~190MB of photos). When it finishes you get a URL like:

`https://jsguideservices.pages.dev`

(Project name becomes the `*.pages.dev` subdomain; you can rename the project if you want a different preview host.)

---

## Step 3 — Smoke-test the `.pages.dev` URL

Before touching DNS, verify:

- Home + photo slideshow
- `/trophies/` image links
- Sidebar fish-weight calculator
- Favicon (JS initials)
- A few pages: `/rates/`, `/about-joe/`, `/contact/`
- Trailing slashes work (`/rates/` not `/rates`)

Leave the live WordPress site alone until this looks good.

---

## Step 4 — Custom domain + Route 53

You want **`jsguideservices.com`** (apex) on Pages. Cloudflare needs to be the **DNS host** for the apex so it can flatten the CNAME. Route 53 can stay the **registrar**.

### 4a. Add the domain in Pages

1. Open the Pages project → **Custom domains** → **Set up a custom domain**
2. Add `jsguideservices.com`
3. Optionally also add `www.jsguideservices.com` (Pages can redirect one to the other)

Cloudflare will ask you to add the domain as a **zone** on your account if it is not already there.

### 4b. Add the zone in Cloudflare (if prompted)

1. Cloudflare Dashboard → **Add a site** → enter `jsguideservices.com`
2. Choose the **Free** plan
3. Cloudflare shows two nameservers, for example:
   - `ada.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`
   (Yours will differ — copy the pair Cloudflare shows you.)

Skip copying every DNS record by hand at first if Cloudflare can scan existing records; keep any mail/MX and other important records.

### 4c. Point Route 53 nameservers at Cloudflare

In **AWS Console → Route 53**:

1. Open **Registered domains** → `jsguideservices.com`  
   *(If you only have a hosted zone and registered elsewhere, use the registrar UI instead.)*
2. **Edit nameservers** / **Add or edit name servers**
3. Replace the four Route 53 `ns-*.awsdns-*` values with the **two Cloudflare nameservers** from step 4b
4. Save

Notes:

- Do **not** try to put a CNAME on the apex (`@`) inside Route 53 for Pages — Route 53 cannot CNAME the apex, and hard-coding Pages A records is fragile.
- Keeping Route 53 as registrar is fine; only the **nameserver** delegation moves to Cloudflare.
- Propagation is often minutes, sometimes up to 24–48 hours. Cloudflare will show the zone as **Active** when NS have switched.

### 4d. Finish domain attachment in Pages

Back in the Pages project → Custom domains:

- Apex should go **Active** once the zone is active (Cloudflare creates the flattened apex record for you)
- For `www`, either let Cloudflare auto-add the CNAME to `your-project.pages.dev`, or add:

| Type | Name | Target |
|------|------|--------|
| CNAME | `www` | `jsguideservices.pages.dev` (or whatever your project subdomain is) |

HTTPS certificates are issued automatically once DNS validates.

### Optional: keep DNS in Route 53 (www-only)

If you refuse to move nameservers, you can CNAME **only** `www` in Route 53 to `your-project.pages.dev` and use `www.jsguideservices.com` as the public site. The bare apex still needs either Cloudflare DNS or another apex-friendly host. For a business site, **moving NS to Cloudflare (4b–4c)** is the clean path.

---

## Step 5 — After the real domain works

1. Visit `https://jsguideservices.com` and re-run the smoke checklist
2. Keep WordPress up until you are happy
3. Then cancel / retire the old WordPress host so you are not paying twice
4. In Cloudflare DNS, remove any leftover A/CNAME records that still pointed at the old host

---

## Ongoing updates

```powershell
cd C:\Users\jmolo\jsguideservices
# edit content under src/content/html/ or src/data/site.ts
git add .
git commit -m "Describe your change"
git push
```

Every push to `main` triggers a new Pages build and deploy.

Preview: open a PR against `main` and use the Pages preview URL Cloudflare attaches to the deployment.

---

## Optional: deploy from your PC with Wrangler (no Git wait)

Useful for a one-off upload; Git-connected Pages is still better long-term.

```powershell
cd C:\Users\jmolo\jsguideservices
npm install -D wrangler
npm run build
npx wrangler pages deploy dist --project-name=jsguideservices
```

Log in with `npx wrangler login` the first time. This uploads `dist/` to an existing Pages project (create the project in the dashboard first if needed).

Astro’s newer docs also mention **Workers + static assets** for brand-new projects. This site is static-only, so **Pages + Git** is enough and matches the dashboard flow above. No `@astrojs/cloudflare` adapter needed unless you later add server routes.

---

## Notes for this project

- Build ~190MB / ~500 files — fine for Pages Free (limit is 20,000 files)
- No environment variables required
- `astro.config.mjs` already has `site: "https://jsguideservices.com"` and `trailingSlash: "always"`
- Free plan commercial use is OK for this kind of brochure/guide site
- If Auto Minify in Cloudflare is on and you ever see hydration warnings, turn Auto Minify off for the zone (static Astro usually does not care)

---

## Checklist

| Step | Done when |
|------|-----------|
| GitHub `main` has the Astro project | Repo matches local |
| Pages project builds from GitHub | `*.pages.dev` looks correct |
| Domain added in Pages + zone on Cloudflare | Domain listed on the project |
| Route 53 nameservers → Cloudflare | Cloudflare zone status **Active** |
| Custom domain Active + HTTPS | Padlock works on the real domain |
| Final QA on `jsguideservices.com` | Smoke checklist passes |
| Retire WordPress | Old host cancelled |

---

## Quick reference — who owns what

| Piece | Where it lives |
|-------|----------------|
| Domain registration | Amazon Route 53 (registrar) |
| DNS records (after cutover) | Cloudflare DNS |
| Site hosting / builds | Cloudflare Pages |
| Source code | GitHub `jmolohon/jsguideservices` |
| Local project | `C:\Users\jmolo\jsguideservices` |