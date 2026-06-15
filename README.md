# White Pearl Clinics

Marketing website for **White Pearl Clinics**, led by **Prof. Wadih Sassine Nassif** —
Prosthodontics & Endodontics, with clinics in Jounieh (Mount Lebanon) and Akkar (North Lebanon).

> *Transforming lives for more than 25 years.*

## Sections
- **Hero** — full-bleed portrait with the headline.
- **Stats** — 5,000+ patients · 100+ multi-generation families · 25+ years (animated counters).
- **About** — Prof. Nassif's story.
- **Our Work** — interactive before/after sliders (drag the handle).
- **Reviews** — auto-playing patient testimonial carousel.
- **Contact** — free screening call registration: choose Jounieh or Akkar, first name, last name, phone.

## Tech
Plain static site — `index.html`, `styles.css`, `script.js`. No build step.
Design follows the editorial-monochrome reference in `DESIGN.md` (Inter as the free
substitute for the Oracle typeface).

## Run locally
Just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Images
Add the real photos to `assets/` — see `assets/README.md` for the exact filenames.

## Contact form
The form validates and shows a confirmation on the page, but does **not** yet send
anywhere. To deliver submissions, wire the `submit` handler in `script.js` to an
email/CRM endpoint (e.g. Formspree, a serverless function, or your booking system).
