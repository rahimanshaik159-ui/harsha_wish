# Harsha thammudu Birthday Website

A guided, eight-scene birthday surprise in HTML5, CSS3 and vanilla JavaScript. Minimal Monochrome design, no frameworks, no backend.

Scenes: Welcome → Wishes → Letter → Cake & music → Candles → Fireworks → Cake cutting → Finale (with Replay).

## Run
1. Extract the ZIP.
2. Open the `harsha-thammudu-birthday` folder in VS Code.
3. Install the **Live Server** extension, right-click `index.html`, choose **Open with Live Server**.
   (Opening `index.html` directly also works; some browsers are stricter about audio from `file://`, so Live Server is recommended.)

## Customize
- Text: edit `index.html` (always keep the exact name "Harsha thammudu").
- Colours and fonts: CSS variables at the top of `css/style.css`.
- Timings (candle, fireworks, cutting): the `after(...)` / `T(...)` calls in `js/script.js`.
- Photos and song: replace files in `assets/` keeping the same filenames (`main_image.jpg`, `img1.jpg`, `img2.jpg`, `img3.jpg`, `audio.mp3`).
- `assets/prototype.png` is the design reference only; the site does not use it.
- Fonts (Inter, Caveat) load from Google Fonts with system fallbacks, so the site still works offline.

## Deploy
**GitHub Pages:** push the folder to a repo, then Settings → Pages → Deploy from branch → `main` / root. Your site appears at `https://<user>.github.io/<repo>/`.

**Firebase Hosting:** `npm i -g firebase-tools`, `firebase login`, `firebase init hosting` (public directory `.`, single-page app: No), then `firebase deploy`.

## Notes
- Music starts when someone taps "Click to Start" (required by mobile browsers) and continues across every scene. Replay returns to the welcome screen without restarting or changing the current playback state.
- Honors `prefers-reduced-motion`; fireworks use fewer particles on phones.
