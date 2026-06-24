# HAAPI React SDK docs

Docusaurus site for the HAAPI React SDK. Most content is **generated** from the SDK source, so you rarely
edit pages by hand — you edit the SDK (README + TSDoc) and the example files, and the build assembles the site.

## Run it

```bash
npm run docs          # dev server on http://localhost:3220
npm run docs:build    # production build (fails on broken links)
```

Both run the generators first (`predocs`): `docs:gen → docs:split → docs:apiref → docs:examples`.

## Where content comes from

| Sidebar section | Source | How |
|---|---|---|
| **Overview** | SDK `README.md` | `docs:gen` → `_overview.mdx`, `docs:split` → one page per `##` |
| **API Reference** | component **TSDoc** | `docs:apiref` extracts the TSDoc (`scripts/extract-tsdoc.mjs`) and emits a Markdown page per entry in `api-reference.entries.mjs` |
| **Examples** | `examples/*.tsx` | `docs:examples` emits a playground page per entry in `examples.entries.mjs` |

Generated folders (`docs/_overview.mdx`, `docs/overview/`, `docs/api-reference/`, `docs/examples/`) are
**gitignored** — don't edit them; change the source instead.

## Examples = live playgrounds

An example is a self-contained `examples/<Name>.tsx` (default `App`, wrapped in `<ExamplePreviewer>`).
`docs:gen` bundles every example into `examples.json` (keyed by basename). You reference it by **name**
(its filename, no `.tsx`) in one of two ways — both get rewritten, at generation time, into the same
`<DocExample id="<Name>" />` runtime tag, which looks the source up in `examples.json` by that `id`:

- **A markdown link to the file** — `[label](…/examples/<Name>.tsx)`, in the SDK `README.md` (→ Overview).
  It stays a clickable link on GitHub; the build derives `<Name>` from the link and converts it to a
  playground (`build-sandpack-sdk.mjs`).
- **A `{@see_example docs/examples/<Name>.tsx Label}` marker** — inside a component's TSDoc, so the
  playground renders inline on its API Reference page (`emit-api-reference.mjs`).

(The Examples section pages are emitted from `examples.entries.mjs`. You don't hand-write `<DocExample>` —
it's the generated tag underlying all of these.) Each mounts the example in Sandpack against the **mocked**
HAAPI driver (no backend) using the shared closure in `src/sandpack/closure.ts`.

```
examples/<Name>.tsx ──(docs:gen)──▶ examples.json[<Name>]
        │
        ├─ [label](…/examples/<Name>.tsx)   (README markdown)  ─┐
        ├─ {@see_example …<Name>.tsx Label}  (component TSDoc)  ─┤─(generate)─▶ <DocExample id="<Name>"/>
        └─ entry in examples.entries.mjs     (Examples section) ─┘                        │
        ▼                                                                                 ▼
   examples.json[<Name>] ──▶ SandpackPlayer( SDK + mocked driver + <Name>.tsx )  ──▶  live playground
```

## Add an example

1. Create `examples/MyExample.tsx` — a default `App`, wrapped in `<ExamplePreviewer>`.
2. Surface it by **name**: a markdown link `[label](…/examples/MyExample.tsx)` in the README, **or** an
   entry in `examples.entries.mjs` (Examples section), **or** a `{@see_example …MyExample.tsx Label}`
   marker in a component's TSDoc.
3. `npm run docs` — it's picked up automatically; no registry edit needed for `examples.json`.
