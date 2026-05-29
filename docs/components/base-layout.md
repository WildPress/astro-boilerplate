# BaseLayout

Source: `src/layouts/BaseLayout.astro`

## What It Does

`BaseLayout` owns the document shell for normal pages. It sets the HTML structure, page metadata, social metadata, font imports and preloads, global stylesheet import, shared header, shared footer, and main content slot.

## What It Is For

Use `BaseLayout` for every page route unless the route is a deliberately isolated endpoint or tool shell. It keeps metadata and site-wide wrappers consistent across new projects.

## Attributes

| Attribute | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | none | Yes | Sets the browser title, Open Graph title, and Twitter title. |
| `description` | `string` | none | Yes | Sets the meta description, Open Graph description, and Twitter description. |
| `canonicalUrl` | `string \| URL` | current path on `Astro.site` | No | Overrides the generated canonical URL and Open Graph URL for deliberate duplicate-content cases. |
| `noindex` | `boolean` | `false` | No | Adds `noindex, nofollow` robots metadata for private, temporary, or utility pages. |
| `hideFooter` | `boolean` | `false` | No | Removes the shared footer. Use for full-screen maps, focused tools, or conversion flows. |

## Slots

| Slot | Description |
| --- | --- |
| default | Page content rendered inside `<main>`. |
| `head` | Optional page-specific head content, such as structured data or safe canonical overrides. |

## Rules

- Import `src/styles/global.css` here and nowhere else.
- Keep font preloads aligned with imported Fontsource files.
- Keep analytics, consent scripts, and structured data deliberate and project-specific.
- Keep `site` in `astro.config.mjs` set to the canonical public origin because `BaseLayout` uses it for canonical and Open Graph URLs.
- Do not add page-specific layout rules to `BaseLayout`.

## Example

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Section from '../components/Section.astro';
---

<BaseLayout title="Page title" description="Clear page description.">
  <Section>
    <h1>Page content</h1>
  </Section>
</BaseLayout>
```
