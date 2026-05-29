# Card

Source: `src/components/Card.astro`

## What It Does

`Card` renders a simple framed container with optional border, rounded clipping, padding, semantic element choice, and local class composition.

## What It Is For

Use `Card` for repeated items, result cards, feature tiles, callouts, modal panels, and genuinely grouped content.

## Attributes

| Attribute | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `as` | `keyof HTMLElementTagNameMap` | `'div'` | No | Semantic HTML element to render, such as `article`, `li`, or `aside`. |
| `border` | `boolean \| 'true' \| 'false'` | `true` | No | Keeps or removes the default border. String support exists for content-driven usage. |
| `rounded` | `boolean \| 'true' \| 'false'` | `false` | No | Applies `rounded-card` and `overflow-hidden`. |
| `padded` | `boolean \| 'true' \| 'false'` | `false` | No | Applies standard internal padding. |
| `class` | `string` | `''` | No | Extra Tailwind classes for local composition. |
| `...attributes` | HTML attributes | none | No | Any other attributes are forwarded to the rendered element. |

## Slots

| Slot | Description |
| --- | --- |
| default | Card content. |

## Rules

- Do not nest cards inside cards.
- Do not use cards to frame entire page sections.
- Keep card styling minimal and token-driven.
- If repeated card internals become complex, create a named component that uses `Card`.

## Example

```astro
<Card as="article" rounded={true} padded={true}>
  <Typography as="h3" variant="title">Reusable Card</Typography>
  <Typography variant="meta">A compact repeated item.</Typography>
</Card>
```
