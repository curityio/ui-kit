# HAAPI React SDK docs

Docusaurus site for the HAAPI React SDK. Almost all content is **generated** from the SDK source: you
edit the SDK (`README.md` + component TSDoc) and the example files, and the build assembles the site.
You rarely touch pages by hand.

## Run it

```bash
npm run docs          # dev server on http://localhost:3220
npm run docs:build    # production build (fails on broken links)
```

Both run the generators first (`predocs`): `docs:gen → docs:split → docs:apiref → docs:examples`.
Everything they emit lands in **`content/`**, which is gitignored — never edit it, change the source.

## Where content comes from

| Sidebar section | Source | How |
|---|---|---|
| **Overview** | SDK `README.md` | `docs:gen` → `content/_overview.mdx`, `docs:split` → one page per `##` |
| **API Reference** | component **TSDoc** | `docs:apiref` extracts the TSDoc and emits a Markdown page per entry in `api-reference.entries.mjs` |
| **Examples** | `examples/*.tsx` | `docs:examples` emits a playground page per entry in `examples.entries.mjs` |

## Examples are live playgrounds

Each `examples/<Name>.tsx` is a self-contained app (a default `App` wrapped in `<ExamplePreviewer>`) that
runs **live** in the docs against a mocked HAAPI backend — readers can edit the code and see it update.

To show an example on a page, reference its file in any of these ways:

- **A markdown link** in the SDK `README.md` — `[label](…/examples/<Name>.tsx)`. Renders as a playground
  on the Overview section, and stays a normal clickable link on GitHub.
- **A `{@see_example docs/examples/<Name>.tsx Label}` marker** in a component's TSDoc — renders the
  playground inline on that component's API Reference page.
- **An entry in `examples.entries.mjs`** — gives the example its own page in the Examples section.

## Add an example

1. Create `examples/MyExample.tsx` — a default `App`, wrapped in `<ExamplePreviewer>`.
2. Reference it one of the three ways above (markdown link, `{@see_example}` marker, or an
   `examples.entries.mjs` entry).
3. `npm run docs` — it's picked up automatically.

