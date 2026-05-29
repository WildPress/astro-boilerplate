# Section

Source: `src/components/Section.astro`

## What It Does

`Section` renders a full-width page band with consistent spacing, optional constrained inner width, optional horizontal padding control, token-based backgrounds, and borders.

## What It Is For

Use `Section` for major page regions. It is the page-level layout primitive, not a card or panel.

## Attributes

| Attribute | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | none | No | Adds an anchor target to the section. |
| `shell` | `boolean` | `true` | No | Wraps content in a constrained max-width container. |
| `disableXPadding` | `boolean` | `false` | No | Removes horizontal padding from the inner container. |
| `border` | `boolean` | `false` | No | Adds top and bottom borders. |
| `borderTop` | `boolean` | `false` | No | Adds a top border only. |
| `borderBottom` | `boolean` | `false` | No | Adds a bottom border only. |
| `background` | `'transparent' \| 'white' \| 'paper' \| 'dark'` | `'transparent'` | No | Sets the section background. `dark` also sets text to white. |
| `top` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | No | Top padding scale. |
| `bottom` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'none'` | No | Bottom padding scale. |

## Slots

| Slot | Description |
| --- | --- |
| default | Section content. |

## Rules

- Add spacing options only when used across multiple sections.
- Keep backgrounds token-based.
- Do not use `Section` to frame content like a card.
- Do not add inline layout styles.

## Example

```astro
<Section id="features" background="white" top="xl" bottom="lg" border={true}>
  <Typography as="h2" variant="heading">Features</Typography>
</Section>
```
