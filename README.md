# Nutype Creative website

Everything needed to deploy the site, run the content editor, and get enquiries flowing.

## What's in here

```
index.html              the whole site (one page)
content/content.json    all editable text, images, videos, links — this is what the CMS edits
admin/                  the content editor (Decap CMS)
assets/                 images, icons, video
sitemap.xml, robots.txt SEO files
netlify.toml            hosting config
```

Before you push this to GitHub, delete the four unused original video files in `assets/` —
`hero-landscape.mp4`, `hero-portrait.mp4`, `nutype-promo.mp4`, and `hero-loop.mp4`. These were
replaced by compressed `-web` versions that the site actually uses (same look, roughly a
quarter of the file size). The originals are only sitting there as leftovers and would bulk up
your repo for no reason.

## 1. Deploy

1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick the repo.
3. Build settings: leave the build command **empty** and set the publish directory to `.` (the
   repo root). `netlify.toml` already has this set, so Netlify should pick it up automatically.
4. Deploy. You'll get a `*.netlify.app` URL immediately — you can point your own domain
   (`nutype.co.uk`) at it afterwards from **Site settings → Domain management**.

## 2. Turn on the content editor (one-time setup, ~10 minutes)

The editor lives at `yoursite.com/admin`. It needs two things switched on in Netlify first:

1. **Site settings → Identity → Enable Identity.**
2. Under Identity settings, set **Registration** to "Invite only" (so random people can't sign
   themselves up).
3. **Site settings → Identity → Services → Git Gateway → Enable Git Gateway.** This is what lets
   the editor save changes back to GitHub on your behalf, without you needing a GitHub login.
4. Go to the **Identity** tab (top nav in your Netlify site dashboard) → **Invite users** → enter
   your own email. You'll get an email — click it, set a password.
5. Visit `yoursite.com/admin`, log in, and you're in.

From then on, editing text, swapping images/videos, adding testimonials, or flipping a section
on/off is all point-and-click — every save commits to GitHub and Netlify redeploys automatically
(takes a minute or so to go live).

## 3. Get enquiries emailed to you

The contact form uses Netlify's built-in form handling — no signup, no API key, nothing to
configure in the code. The only step left is:

**Site settings → Forms → Form notifications → Add notification → Email notification** →
`dan@nutype.co.uk`.

Do this once and every enquiry lands in your inbox. You can also see every submission any time
under **Forms** in the Netlify dashboard.

## 4. Things to fill in before launch

All of these are editable in `/admin` once it's set up — no code needed:

- **Social links** — LinkedIn and Instagram URLs in the CMS are currently blank, so those two
  footer icons are hidden until you add real links.
- **Testimonials** — the three quotes are placeholders, clearly labelled as such.
- **Our Work section** — off by default (`sections.work.visible`). Flip it on in the CMS once
  you've got real client projects to show; until then it's fully built but invisible, with the
  gallery, hover titles, and swipeable lightbox (including video support) all ready.
- **Logo ticker** — currently showing your own logo mark twice as a placeholder. Swap in real
  client logos when you have permission to display them.
- **Footer legal pages** — Privacy Policy and Terms of Business currently show a "coming soon"
  message when clicked. Write the real thing under **Footer legal pages** in the CMS whenever
  you're ready — bold, italic, links, quotes and lists all work from the toolbar. You can add
  more documents the same way (just click "Add"), and hide/show each one individually.

## 5. SEO / getting found on Google

A few things are already baked in:

- Page title, meta description, Open Graph and Twitter card tags, all mentioning Northampton and
  built-in service keywords — editable from the CMS under "SEO" if you want to tweak them later.
- Structured data (the invisible bit Google reads to understand *what* your business is) marking
  Nutype Creative as a professional service based in Northampton, founded by Daniel Luke Hall,
  with your phone and email attached. This is one of the things that helps AI answer engines
  (ChatGPT, Perplexity, Google's AI Overviews) correctly describe your business when someone asks
  about it.
- Alt text on every image, `sitemap.xml` and `robots.txt`, semantic heading structure.
- All three videos were recompressed — total video weight dropped from ~125MB to ~30MB. Page
  speed is a genuine Google ranking factor (especially on mobile), so this matters more than it
  sounds.

One thing to update once you're live: `sitemap.xml`, `robots.txt`, and the structured data in
`index.html` currently assume the site will live at `https://nutype.co.uk/`. If you end up using
a different domain, search those three files for `nutype.co.uk` and swap it.

The single biggest thing left to do for SEO isn't technical — it's content and links: real client
work in the Our Work section, real testimonials, and getting other Northampton-area sites (local
business directories, Chamber of Commerce, client sites linking back to you) to link to yours.
That matters more for ranking than almost anything on the code side.

## 6. Cookies

The site doesn't currently use any tracking or analytics — so strictly speaking, UK law doesn't
require a cookie banner yet. I've added a small, dismissible one anyway (bottom corner, one line
of text, one button, remembers your visitor's choice) so you're covered the moment you add
Google Analytics or similar. If you never add tracking, you can turn the banner off entirely in
the CMS (`sections.cookieBanner.visible`).

## 7. Fonts

You asked for Google Sans — it isn't distributed as a public web font, so the site tries it first
(if a visitor happens to have it installed) and falls back to Inter, which is visually very close
and loads from Google Fonts. If you'd rather commit to one look for everyone, say the word and
I'll drop the fallback and just use Inter everywhere.

## 8. Local preview

Opening `index.html` directly by double-clicking it will show the site with its last-saved
defaults, but the CMS-driven content (content.json) won't load — browsers block that kind of
local file fetch for security reasons. To preview it properly with live content, run a tiny local
server from this folder, e.g. `python3 -m http.server` then visit `localhost:8000` — or just trust
the Netlify deploy preview, which behaves exactly like production.
