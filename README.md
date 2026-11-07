# Izzy Moonbow: A Little World of Wonder

A static, in-world creative portfolio. The application has seven main routes, nine individual creation journals, a found-object worktable, a bracelet builder saved in the current browser, a scrapbook, five postcards, and a branded not-found page. No character artwork is included or fetched remotely. All images are optional local files supplied by the site owner.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
npx tsc --noEmit
npm run build
npm run preview
```

The production output is `dist/`. `npm run preview` is a local preview, not a production server. The existing Vite setup in this project produces a single HTML file with inlined application code, styles, and local fonts. Route components are separated in source, but that inherited single-file build means they are not separate network chunks. The latest checked build was approximately 633 kB uncompressed / 276 kB gzip without owner art; these are build measurements, not field performance claims. Re-measure with optimized owner images and actual hosting before making Core Web Vitals claims.

## Add artwork

1. Put a rights-cleared image under `public/assets/characters`, `public/assets/creations`, or `public/assets/places`. WebP or AVIF is recommended; PNG and JPEG also work.
2. Add exactly one entry to the `sources` object at the top of `src/content/media.ts`, for example:

   ```ts
   homeIzzy: 'assets/characters/izzy-portrait.webp',
   ```

3. If the supplied image differs from the intended subject, update that slot's `alt` text in the same manifest. Paths are relative to `public/`; do not put a leading repository name in the path. The configured site base is applied automatically.

The site renders a labeled paper mat for every empty or broken path. The scrapbook's picture viewer only appears after a local image loads successfully. No placeholder depicts Izzy or another character. The suggested paths below are examples, not existing image files.

### Artwork inventory

| Slot ID | Recommended subject | Ratio / suggested minimum | Suggested local source path | Used on |
| --- | --- | --- | --- | --- |
| `homeIzzy` | Izzy portrait | 4:5 / 1200 x 1500 | `public/assets/characters/izzy-portrait.webp` | Home |
| `aboutIzzy` | Izzy close-up | 4:5 / 1200 x 1500 | `public/assets/characters/izzy-close.webp` | About |
| `bridlewoodScene` | Bridlewood scene | 16:9 / 1600 x 900 | `public/assets/places/bridlewood.webp` | Reserved for About |
| `maretimeScene` | Maretime Bay scene | 16:9 / 1600 x 900 | `public/assets/places/maretime.webp` | Reserved for About |
| `izzyCart` | Izzy Does It cart | 4:3 / 1200 x 900 | `public/assets/creations/cart.webp` | Home, Creations, detail |
| `izzyCartProcess` | Cart in progress | 4:3 / 1200 x 900 | `public/assets/creations/cart-process.webp` | Cart detail |
| `izzyCartDetail` | Cart detail | 1:1 / 900 x 900 | `public/assets/creations/cart-detail.webp` | Cart detail |
| `sunnysLantern` | Sunny's lantern | 4:3 / 1200 x 900 | `public/assets/creations/lantern.webp` | Home, Creations, detail |
| `sunnysLanternProcess` | Lantern repair | 4:3 / 1200 x 900 | `public/assets/creations/lantern-process.webp` | Lantern detail |
| `sunnysLanternDetail` | Lantern detail | 1:1 / 900 x 900 | `public/assets/creations/lantern-detail.webp` | Lantern detail |
| `friendshipBracelets` | Friendship bracelets | 4:3 / 1200 x 900 | `public/assets/creations/bracelets.webp` | Creations, detail |
| `friendshipBraceletsProcess` | Bracelet making | 4:3 / 1200 x 900 | `public/assets/creations/bracelets-process.webp` | Bracelets detail |
| `friendshipBraceletsDetail` | Bracelet detail | 1:1 / 900 x 900 | `public/assets/creations/bracelets-detail.webp` | Bracelets detail |
| `bridlewoodDisguises` | Bridlewood disguises | 4:3 / 1200 x 900 | `public/assets/creations/disguises.webp` | Creations, detail |
| `bridlewoodDisguisesProcess` | Disguises in progress | 4:3 / 1200 x 900 | `public/assets/creations/disguises-process.webp` | Disguises detail |
| `bridlewoodDisguisesDetail` | Disguise detail | 1:1 / 900 x 900 | `public/assets/creations/disguises-detail.webp` | Disguises detail |
| `macaroniCrown` | Improvised crown | 4:3 / 1200 x 900 | `public/assets/creations/crown.webp` | Creations, detail |
| `macaroniCrownProcess` | Crown in progress | 4:3 / 1200 x 900 | `public/assets/creations/crown-process.webp` | Crown detail |
| `macaroniCrownDetail` | Crown detail | 1:1 / 900 x 900 | `public/assets/creations/crown-detail.webp` | Crown detail |
| `mareStream` | Mare Stream | 4:3 / 1200 x 900 | `public/assets/creations/mare-stream.webp` | Creations, detail |
| `mareStreamProcess` | Tram conversion | 4:3 / 1200 x 900 | `public/assets/creations/mare-stream-process.webp` | Mare Stream detail |
| `mareStreamDetail` | Mare Stream detail | 1:1 / 900 x 900 | `public/assets/creations/mare-stream-detail.webp` | Mare Stream detail |
| `mistysBracelet` | Misty's bracelet | 4:3 / 1200 x 900 | `public/assets/creations/misty-bracelet.webp` | Creations, detail |
| `mistysBraceletProcess` | Charm bracelet in progress | 4:3 / 1200 x 900 | `public/assets/creations/misty-process.webp` | Misty detail |
| `mistysBraceletDetail` | Bracelet charm detail | 1:1 / 900 x 900 | `public/assets/creations/misty-detail.webp` | Misty detail |
| `flowerCorsages` | Flower corsages | 4:3 / 1200 x 900 | `public/assets/creations/corsages.webp` | Creations, detail |
| `flowerCorsagesProcess` | Corsage making | 4:3 / 1200 x 900 | `public/assets/creations/corsages-process.webp` | Corsages detail |
| `flowerCorsagesDetail` | Corsage detail | 1:1 / 900 x 900 | `public/assets/creations/corsages-detail.webp` | Corsages detail |
| `seasideBraids` | Braids | 4:3 / 1200 x 900 | `public/assets/creations/braids.webp` | Creations, detail |
| `seasideBraidsProcess` | Learning to braid | 4:3 / 1200 x 900 | `public/assets/creations/braids-process.webp` | Braids detail |
| `seasideBraidsDetail` | Braid detail | 1:1 / 900 x 900 | `public/assets/creations/braids-detail.webp` | Braids detail |
| `noteLantern` | Lantern message | 4:3 / 1200 x 900 | `public/assets/places/note-message.webp` | Scrapbook: Maretime Bay |
| `noteHome` | Bridlewood home | 4:3 / 1200 x 900 | `public/assets/places/note-home.webp` | Scrapbook: Bridlewood |
| `noteBloom` | Lumi-Bloom | 4:3 / 1200 x 900 | `public/assets/places/note-bloom.webp` | Scrapbook: Bridlewood |
| `noteWishiehoof` | Wishiehoof memory | 4:3 / 1200 x 900 | `public/assets/places/note-wishiehoof.webp` | Scrapbook: Bridlewood |
| `noteRing` | Ring for the lantern | 4:3 / 1200 x 900 | `public/assets/places/note-ring.webp` | Scrapbook: Maretime Bay |
| `noteRoommates` | Shared Brighthouse room | 4:3 / 1200 x 900 | `public/assets/places/note-roommates.webp` | Scrapbook: Maretime Bay |
| `noteHomesick` | Bridlewood reminder | 4:3 / 1200 x 900 | `public/assets/places/note-homesick.webp` | Scrapbook: Bridlewood |
| `noteBlock` | Craft supplies | 4:3 / 1200 x 900 | `public/assets/places/note-ideas.webp` | Scrapbook: Ideas Wander |
| `noteButterscotch` | Butterscotch memento | 4:3 / 1200 x 900 | `public/assets/places/note-butterscotch.webp` | Scrapbook: Ideas Wander |
| `noteBraid` | Braided gift | 4:3 / 1200 x 900 | `public/assets/places/note-braid.webp` | Scrapbook: Ideas Wander |
| `friendSunny` | Sunny | 1:1 / 900 x 900 | `public/assets/characters/sunny.webp` | Friends |
| `friendPipp` | Pipp | 1:1 / 900 x 900 | `public/assets/characters/pipp.webp` | Friends |
| `friendZipp` | Zipp | 1:1 / 900 x 900 | `public/assets/characters/zipp.webp` | Friends |
| `friendHitch` | Hitch | 1:1 / 900 x 900 | `public/assets/characters/hitch.webp` | Friends |
| `friendMisty` | Misty | 1:1 / 900 x 900 | `public/assets/characters/misty.webp` | Friends |

The two place slots are reserved in the manifest for future use; the current About letter does not render them. Other slots render immediately when their route or selected scrapbook note is visible. Project and scrapbook frames use `object-fit: cover`, so leave room for cropping.

## Content maintenance

- Edit creation records in `src/content/projects.ts`. Add a complete project record, a unique slug, relevant filters, and three corresponding manifest slots before linking it. Previous and next links follow the array order.
- Edit scrapbook notes in `src/content/notes.ts`, and friend postcards in `src/content/friends.ts`.
- `src/content/canon-map.ts` is a private editorial cross-reference and is not rendered.
- Bracelet storage uses the `izzy-bracelet-v1` key and a validated version-1 schema. Starting again removes that key; storage failures are caught locally.
- The legal footer is deliberately separate from Izzy's in-world writing. The owner is responsible for the rights and attribution of any images they add.

## Deploy

### Cloudflare Pages

Connect the repository as a Pages project. Build command: `npm run build`. Build output directory: `dist`. Use the default root base `/`. Do **not** add a top-level `404.html` to this artifact: Cloudflare Pages serves the root app for unmatched paths when that file is absent. The React router then renders the requested route or the in-app not-found page. Verify a hard refresh on `/creations/mare-stream` after deployment.

### GitHub Pages

In repository settings, choose **Pages > Build and deployment > GitHub Actions**. The included `.github/workflows/deploy.yml` builds on pushes to `main` or manual dispatch. It derives `/<repo>/` as the site base for a project site, uses `/` for an account site, and copies the built `index.html` to `404.html` only inside the GitHub artifact. GitHub may return HTTP 404 for that fallback response, but the browser loads the app and resolves the requested route. For a custom domain at the root, change the workflow's base to `/`.

For a local project-path build, use `VITE_SITE_BASE=/your-repo/ npm run build -- --base=/your-repo/`. The inherited single-file plugin forces Vite's `BASE_URL` to `./`, so `VITE_SITE_BASE` explicitly supplies the mount path to both the router and local artwork URLs. Without it, the app defaults to `/` when that plugin is active; a normal absolute Vite `BASE_URL` is otherwise honored. After deploying, hard-refresh `/your-repo/creations/izzy-does-it` and `/your-repo/creations/mare-stream`, and check any owner-added image paths. No repository, domain, or deployment credentials are preconfigured. The GitHub-only fallback must not be copied into a Cloudflare artifact.

## Verification notes

With a local dev server running, the supplied Playwright checks can be repeated after `npx playwright install chromium`; Linux may also need `npx playwright install-deps chromium`:

```sh
node scripts/smoke.mjs
node scripts/accessibility.mjs
node scripts/art-check.mjs
node scripts/deployment-check.mjs
```

The implementation was checked with `npm ci`, `npx tsc --noEmit`, `npm run build`, `npm audit --audit-level=low`, and the scripts above. The browser checks cover the routes, all nine project journals, five viewport sizes, responsive overflow, workshop assemblies, bracelet storage and errors, scrapbook tabs, postcards, letter, mobile navigation, and reduced motion. The accessibility script runs automated WCAG A/AA checks on routes and several interactive states; automated checks are not a substitute for a complete accessibility review. Screenshots are written to `/tmp/izzy-qa` by default. The art check expects the empty manifest and the Vite dev server. The deployment check temporarily rebuilds for a test subpath and restores the root build afterward.

A root-based production preview and a simulated GitHub-style 404 response at `/test-repo/` were tested with hard refreshes on the two flagship creation routes. A temporary in-memory test image was used to check the scrapbook lightbox, focus return, and broken-image fallback. No live GitHub or Cloudflare deployment was performed, and field performance with owner-supplied art has not been measured. Verify both on the actual host after deployment.