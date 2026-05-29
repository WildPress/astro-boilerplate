# Typography

Source: `src/components/Typography.astro`

## What It Does

`Typography` applies shared typographic roles without repeating long class strings.

## What It Is For

Use `Typography` for headings, labels, supporting copy, metadata, and repeated text patterns where the visual role should be consistent across the project.

## Attributes

| Attribute | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `as` | `keyof HTMLElementTagNameMap` | `'p'` | No | Semantic HTML element to render. Use this for correct heading order and document structure. |
| `variant` | `'display' \| 'heading' \| 'title' \| 'body' \| 'meta' \| 'label'` | `'body'` | No | Typographic style role. |
| `class` | `string` | `''` | No | Extra Tailwind classes for local composition. |

## Variant Goals

| Variant | Description |
| --- | --- |
| `display` | Hero or major campaign headline. |
| `heading` | Main section headings. |
| `title` | Card, panel, or compact block headings. |
| `body` | Default readable body copy. |
| `meta` | Secondary facts, dates, captions, and helper copy. |
| `label` | Short uppercase labels and eyebrows. |

## Slots

| Slot | Description |
| --- | --- |
| default | Text or inline content. |

## Rules

- Define typography roles as Tailwind class strings in `Typography.astro`.
- Use responsive Tailwind utilities such as `text-5xl sm:text-7xl`, not custom text-size CSS variables.
- Do not use `display` inside cards or compact panels.
- Keep letter spacing at zero unless a project type system deliberately changes it.
- Use `as` for semantics and `variant` for visual role.
- Add new variants only when reused across the project.

## Example

```astro
<Typography as="h1" variant="display">A clear hero headline</Typography>
<Typography as="h2" variant="heading">Section title</Typography>
<Typography variant="meta">Updated 29 May 2026</Typography>
```
