# Icon

Source: `src/components/Icon.astro`

## What It Does

`Icon` exposes a controlled list of Lucide icons as inline SVG. It keeps icon imports centralized and prevents random SVGs from spreading through the project.

## What It Is For

Use `Icon` inside buttons, tool controls, small feature markers, and compact UI affordances.

## Attributes

| Attribute | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `IconName` | none | Yes | Approved icon name from `src/lib/icon-names.ts`. |
| `size` | `'compact' \| 'default' \| 'md'` | `'default'` | No | Controls icon dimensions. |
| `filled` | `boolean` | `false` | No | Uses `currentColor` fill instead of `none`. Use sparingly. |
| `class` | `string` | `''` | No | Extra Tailwind classes for colour or positioning. |

Approved names:

- `arrow-right`
- `badge-check`
- `chevron-down`
- `chevron-right`
- `external-link`
- `mail`
- `menu`
- `move-right`
- `search`
- `shield-check`
- `star`
- `x`

## Slots

`Icon` exposes no slots.

## Rules

- Add icons to both `src/lib/icon-names.ts` and the `icons` map in `Icon.astro`.
- Prefer an existing Lucide icon over custom SVG.
- Icons are `aria-hidden` by default because adjacent text should label the action.
- Icon-only controls must provide an accessible label on the parent button or link.

## Example

```astro
<Icon name="search" size="md" class="text-neutral-700" />
```
