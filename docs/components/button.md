# Button

Source: `src/components/Button.astro`

## What It Does

`Button` renders either an `<a>` or a `<button>` with consistent sizing, hierarchy, focus state, and optional icon support.

## What It Is For

Use `Button` for navigation calls to action, form submits, secondary actions, and compact tertiary text actions. It should be the default for all visible button-like commands.

## Attributes

| Attribute | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `href` | `string` | none | No | When present, renders an anchor. When absent, renders a button. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | No | Native button type used only when `href` is absent. |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | No | Visual hierarchy. Primary is the main action, secondary is lower weight, tertiary is text-like. |
| `tone` | `'default' \| 'light'` | `'default'` | No | Use `light` on dark backgrounds. |
| `size` | `'default' \| 'large'` | `'default'` | No | Controls height and minimum width. |
| `icon` | `boolean \| IconName` | `false` | No | `true` uses `move-right`. A specific icon name uses that approved icon. |
| `fullWidth` | `boolean \| 'true' \| 'false'` | `false` | No | Makes the button fill its parent width. String support exists for content-driven usage. |
| `target` | `string` | none | No | Anchor target, such as `_blank`. Used only when `href` is present. |
| `rel` | `string` | none | No | Anchor rel attribute. Use `noreferrer` for new-tab external links. |
| `class` | `string` | `''` | No | Extra Tailwind classes for local composition. |

## Slots

| Slot | Description |
| --- | --- |
| default | Button label. Keep it short enough to fit on mobile. |

## Rules

- Do not add one-off colour variants.
- Do not create hover states that move the button or shift layout.
- Use `icon` where an icon improves scanning.
- For external links, use `target="_blank"` and `rel="noreferrer"`.
- Icon-only buttons need an accessible label on the rendered button or link.

## Example

```astro
<Button href="/contact/" icon="arrow-right">Start Enquiry</Button>
<Button variant="secondary" type="submit">Submit</Button>
<Button variant="tertiary" href="/learn-more/" icon={true}>Learn more</Button>
```
