# Customization

## Branding

Name, logo, accent colour and support contact are environment variables; see [configuration.md](configuration.md). The theme is light by default with automatic dark mode (`prefers-color-scheme`), a system font and a single accent colour.

## Styles

`public/css/app.css` defines design tokens on `:root`. The same file is used by the `/support` page. The accent is overridden by the generated `/brand.css`, so no inline style is ever needed and the CSP keeps `style-src 'self'`.

## Guides

Guides are defined in `public/js/guides.js`: devices (`windows`, `macos`, `ios`, `android`), the apps offered per device, and the steps of each guide (ids such as `ios-profile`, `ios-manual`, `mac-profile`, `mac-manual`, `outlook-new`, `outlook-classic`, `caldavsync`, `thunderbird`, `gmail`, `samsung`, `davx5`).

Mini syntax used in step texts:

| Syntax | Meaning |
|---|---|
| `[[UI label]]` | Interface element (button, menu) |
| `{email}` | Address typed by the user |
| `{brand}` | `BRAND_NAME` |
| `{L:key}` | Link from the `links` settings (e.g. `{L:thunderbird}`) |
| `{F:field}` | Inline copyable value |
| `f: [...]` | List of copyable fields for the step |
| `dl: true` | Download button for the Apple profile |
| `sub: '...'` | Secondary explanatory text |
| `shot: 'folder/file.png'` | Optional screenshot |
| `'[mdaemon] ...'` | Tip prefix: shown only with `DAV_PRESET=mdaemon` |

Copyable values (`f:` and `{F:}`) are defined by `fieldDefs()` in `public/js/app.js`.

## Screenshots

1. Add `shot: 'folder/file.png'` (and optionally `shotCaption`) to a step.
2. Put the image in `public/img/guides/` (PNG recommended, 1200 to 1600 px wide, no real personal data).
3. Rebuild: `docker compose up -d --build`.

The "Voir une capture" link appears only when the file exists; the list is built at startup. `public/img/guides/README.md` lists the expected files.

## Translation

The UI is in French. Translate the texts in `public/js/guides.js` and `public/index.html`, plus the labels in `public/js/app.js` and the `/support` page under `public/support/`.
