# Joe Scegura's Guide Service (Astro)

Static rebuild of [jsguideservices.com](https://jsguideservices.com) — originally WordPress with a Twenty Twelve child theme. Layout, colors, navigation, and page content are preserved.

## Quick start

```bash
cd C:\Users\jmolo\jsguideservices
npm install
npm run dev
```

Open **http://localhost:4321**

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## What's included

| Route | Content |
|-------|---------|
| `/` | Home + photo slideshow |
| `/rates/` | 2022 Rates |
| `/about-joe/` | About Joe |
| `/about-your-trip/` | About Your Trip |
| `/alexandria/` | Alexandria + map |
| `/areas-we-serve/` | Areas We Serve |
| `/contact/` | Contact |
| `/mille-lacs-lake/` | Mille Lacs Lake + map |
| `/recommended-links/` | Partner / brand links |
| `/trophies/` | Trophy Room – Years Past |
| `/2020-pictures/` | 2020 Pictures |
| `/calc/calc.html` | Fish weight calculator (sidebar) |

## Look & feel preserved

- Blue gradient page shell (`#085173` → `#7db9e8`)
- Brown outset borders and tan sidebar (`#AD845A`)
- Background pattern image
- Open Sans typography
- Same navigation, contact sidebar, and “What’s it weigh?” calculator

## Project layout

```
src/
  components/   Header, Sidebar, Slideshow
  content/html/ Editable page body HTML
  data/         Site name, phone, email, nav
  layouts/      BaseLayout
  pages/        Routes
  styles/       site.css (theme)
public/
  uploads/      Images migrated from WordPress
  partners/     Recommended brand logos
  calc/         Weight calculator
```

## Editing content

| What | Where |
|------|--------|
| Page body text/images | `src/content/html/<slug>.html` |
| Phone, email, nav labels | `src/data/site.ts` |
| Colors / layout | `src/styles/site.css` |
| Home intro | `src/content/html/home-intro.html` |

## Deploy

The site is fully static. Upload the `dist/` folder after `npm run build` to any static host:

- Netlify / Cloudflare Pages / Vercel
- GitHub Pages
- S3 + CloudFront
- Traditional web hosting (Apache/Nginx)

Point the domain `jsguideservices.com` at the new host when ready, then retire WordPress.

## Notes

- WordPress plugins (slideshow, AdRotate) were replaced with lightweight Astro/vanilla JS equivalents.
- ~480 images were downloaded from the live WordPress media library.
- Rates still say **2022 Rates** — update `src/content/html/rates.html` and the nav label in `src/data/site.ts` when prices change.
