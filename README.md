# Stride vs SL-RDL (offline web app)

A single-page, fully self-contained app (fonts embedded, no external requests). Once loaded, it works offline.

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
The service worker is cache-first, so changes will not appear until the cache name changes. In `sw.js`, bump `CACHE_VERSION` (e.g. `stride-rdl-v1` to `stride-rdl-v2`) and redeploy. Old caches are deleted on activate; reload twice (or close and reopen the app) to pick up the new version.
