# ski-trip-2027

Website for the St. Anton am Arlberg ski trip, 30 Jan &ndash; 7 Feb 2027.

## Enabling the site (GitHub Pages)

1. Go to **Settings &rarr; Pages** in this repo.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Pick the branch this content lives on (e.g. `main`) and folder `/ (root)`.
4. Save &mdash; GitHub will publish the site at `https://neilq1810.github.io/ski-trip-2027/`.

## RSVP tab

The RSVP tab reads its list live from this repo's **GitHub Issues** &mdash; no
backend or secrets needed. Each RSVP button opens a pre-filled "new issue"
page titled `RSVP: [Your Name] - YES/NO/MAYBE`; the site parses open issues
matching that title pattern and lists them, grouped by status.

To add someone who doesn't have a GitHub account, just open an issue for them
yourself with the same title format, e.g. `RSVP: Jane Doe - YES`.

## Editing content

- `index.html` &mdash; all page content (Overview & Flights, Cost, Train, RSVP tabs)
- `style.css` &mdash; styling
- `app.js` &mdash; tab switching + RSVP-from-GitHub-Issues logic
