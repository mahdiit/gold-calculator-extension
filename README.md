# Gold Price Calculator (Chrome Extension)

A Chrome Extension that calculates gold price analytics on supported e-commerce pages. With one click, it shows:

- Percentage above raw gold price (profit/markup)
- Per-gram price including making/wage (اجرت)

Description (FA): محاسبه درصد سود و قیمت هر گرم طلا با کلیک روی دکمه افزونه.

## Features

- Manifest V3 (background service worker + scripting API)
- One-click action injects a content script into the active tab
- Persian/Arabic digits normalization for robust parsing
- Configurable CSS selectors per website

## Supported sites (default)

- gold.khanoumi.com
- digizargar.com

You can add more (see Customize site config).

## How it works

1. Clicking the extension action runs `content.js` on the current page.
2. The content script reads product price, weight, and the current gold price using site-specific selectors.
3. It normalizes Persian/Arabic digits, performs calculations, and injects a small info box under the product price:
   - Percentage above raw gold
   - Per-gram price including making/wage

## Quick start (use existing build)

If the `dist/` folder already exists (it does in this repo):

1. Open Chrome and go to `chrome://extensions`.
2. Enable Developer mode (top-right).
3. Click "Load unpacked" and select the `dist` folder of this project.
4. Navigate to a supported product page, then click the extension icon.

## Build from source

Requirements:
- Node.js 16+ (recommended 18+)

Install dependencies and build:

```bash
npm install
npm run build
```

What `npm run build` does:
- Bundles `src/background.js` and `src/content.js` using esbuild into `dist/`
- Copies icons and `manifest.json` to `dist/`
- Creates `gold-price-extension-built.zip` for distribution

Notes for Windows users:
- The `clean` script in `package.json` uses Unix commands. Either avoid it or clean manually by deleting `dist/`.

## Load in Chrome (from your local build)

1. After building, open `chrome://extensions` in Chrome.
2. Enable Developer mode.
3. Click "Load unpacked" and select the `dist` folder.
4. Open a supported site product page and click the extension icon.

## Customize site config

To add or adjust site support, edit `src/content.js` and modify `window.__GOLD_SITE_CONFIGS__`:

```js
window.__GOLD_SITE_CONFIGS__ = window.__GOLD_SITE_CONFIGS__ || {
  "gold.khanoumi.com": {
    productPrice: ".price-with-toman span",
    weight: ".c-select-btn span.filled",
    goldPrice: 'span[style="font-weight: 600; color: rgb(219, 39, 119);"]',
  },
  "digizargar.com": {
    goldPrice: "div[class='header-center-current-price d-flex'] p",
    weight: "span[class='vs__selected']",
    productPrice: "div[class='price-box'] div",
  },
  // Add more hosts here
};
```

Selectors should match the page elements for:
- `productPrice` (total product price in Toman)
- `weight` (grams, can be decimal like 0.3)
- `goldPrice` (current per-gram raw gold price)

The script normalizes Persian/Arabic digits and extracts integers/floats reliably.

## Folder structure

- `src/` – extension source (background and content scripts)
- `public/` – icons
- `dist/` – build output ready to load in Chrome
- `scripts/` – build helpers (copy static assets, zip build)
- `manifest.json` – extension manifest (MV3)

## Permissions

- `activeTab` – to run on the current tab after user action
- `scripting` – to inject `content.js` when the action button is clicked

## Troubleshooting

- No info box appears:
  - Ensure you are on a supported domain.
  - Verify selectors in `src/content.js` still match the site’s DOM.
  - Open DevTools Console for errors (look for "no product/weight/gold price found").
- Build fails on Windows when running `clean`:
  - Delete `dist/` manually or replace the script with a cross-platform tool (e.g., `rimraf`, `shx`).

## License

license (MIT)
