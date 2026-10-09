# Stride vs SL-RDL (offline web app)

A small, fully self-contained app (fonts embedded, no external requests). `index.html` is the stride vs SL-RDL page and `workouts.html` is the running workout map. Once loaded, both work offline.

## Host it
Service workers need **https** (or `localhost`), so `file://` will not install it.

- **GitHub Pages:** push the *contents* of this folder to a repo (files at the repo root, or in `/docs`), then Settings > Pages > deploy from that branch/folder. Open `https://<user>.github.io/<repo>/`.
- **Any static host** (Netlify, Cloudflare Pages, S3, etc.): upload the folder as is.
- **Local test:** `python3 -m http.server 8000` in this folder, open `http://localhost:8000/`.

Visit once while online so the service worker can cache everything.

## Install
- **iPhone/iPad:** open the URL in Safari > Share > Add to Home Screen.
- **Desktop Chrome/Edge:** click the install icon in the address bar (or menu > Install).
- **Android Chrome:** menu > Install app.

## After editing files
Page loads (navigations) are network-first, so edits to `index.html` show up on the next online visit without any cache bump. Other files (icons, manifest) are cache-first. If you change those, or add files to the precache list, bump `CACHE_VERSION` in `sw.js` (e.g. `stride-rdl-v2` to `stride-rdl-v3`) and redeploy. The new worker takes over immediately (`skipWaiting` and `clients.claim`) and old caches are deleted on activate. Each page is cached under its own URL. Offline, a page is served from that copy, and `index.html` is the fallback for anything else.
