# SiteHeader

Source: `src/components/SiteHeader.astro`

## What It Does

`SiteHeader` renders the default project header with a homepage wordmark, primary navigation, and desktop call-to-action button.

## What It Is For

Use `SiteHeader` as the starting point for each new project's shared header. Replace the wordmark, navigation items, and CTA to match the project.

## Attributes

`SiteHeader` currently accepts no public attributes.

Internal values:

| Value | Type | Description |
| --- | --- | --- |
| `navItems` | `{ href: string; label: string }[]` | Primary navigation links. Keep this focused. |
| Wordmark link | anchor | Links to `/` and labels the homepage. |
| CTA | `Button` | Desktop call to action. |

## Slots

`SiteHeader` currently exposes no slots.

## Rules

- Keep the wordmark as the homepage link.
- Keep primary navigation focused.
- Use restrained active and hover states.
- Add mobile menu behaviour as a Preact island only when needed.
- Do not put page-specific content in the shared header.

## Example

`SiteHeader` is normally rendered by `BaseLayout`:

```astro
<BaseLayout title="Page" description="Description.">
  <slot />
</BaseLayout>
```
