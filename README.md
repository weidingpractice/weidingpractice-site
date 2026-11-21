# weidingpractice-site

以身观身 · Seeing Through One Body — the public website at weidingpractice.com.

These files are generated from Practice Notes, Wei Ding's private practice log. Changes arrive as pull requests for Wei to review; merging into `main` publishes the site through Porkbun Static Hosting.

## What goes on the site

- **Only what can be turned to on its page.** Point locations are quoted word for word from GB/T 12346-2021 with clause, page and grade; classical texts are given in the original Chinese only, with edition. Other people's words come only from published books (title, edition, page; for an e-book, chapter and section). Modern research appears only when it is established (systematic review, meta-analysis, standard textbook).
- **Facts and decided actions, no principles, no teaching.** How to find a point by hand, dated practice records, corrections and source checks. The site is a forest to walk in, not a manual.
- **No health claims.** The site says where attention rests, never what something treats. Points are never pressed.
- **Elders' words stay in the private log.** Thanks to Austin Ince appears once, in the footer.
- **Open to everyone, no sign-in.** Leaves and "found it" counts are anonymous.

- **Show the page we read.** When a line comes from an old book that we read on its original page, the page itself is shown beside the words, with the lines we read framed. Images live in `pages/`, from public-domain books only.
- **English first.** The site is hard to reach from mainland China, so English is the default: the forest opens in English (中文 is one tap away and remembered), and the home page is marked lang="en" with English first in its title and description. Classical texts stay in the original Chinese.
- **Smooth first, then beautiful.** Every page must open fast everywhere, including mainland China. Nothing loads from Google or other hosts that are blocked there; fonts are served from `fonts/` on our own domain, Latin-only subsets of about 25 KB each. Before adding any font, image or script, check its size first. A Chinese font is only ever added as a subset of the characters actually used.

The seven promises in `llms.txt` ("Why cite this site") are kept word for word.

## Files

- `index.html` — the forest (the home page)
- one page per point (`laogong.html`, `fengfu.html`, …) and per pose (`downward-dog.html`, `chintuck.html`, …)
- `points.html`, `poses.html`, `sources.html`, `checks.html`, `glossary.html`, `journal.html`
- `inperson.html`, `about.html`, `privacy.html`, `404.html`
- `llms.txt`, `robots.txt`, `sitemap.xml`, `style.css`, `ticks-client.js`
- `pages/` — the pages of the old books we read (the 1339 Lingshu so far)
- `fonts/` — Spectral and Inter, subset to Latin, with their SIL Open Font Licence files

© 2026 Wei Ding · text CC BY 4.0
