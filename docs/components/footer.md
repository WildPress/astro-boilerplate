# Footer

Source: `src/components/Footer.astro`

## What It Does

`Footer` renders a simple shared footer with a homepage link, footer navigation, and current year text.

## What It Is For

Use `Footer` as the default end-of-page shell for normal pages. Replace its links and wordmark for each new project.

## Attributes

`Footer` currently accepts no public attributes.

Internal values:

| Value | Type | Description |
| --- | --- | --- |
| `currentYear` | `number` | Generated at build/render time from `new Date().getFullYear()`. |
| Footer links | static array in markup | Update per project to include key pages and legal links. |

## Slots

`Footer` currently exposes no slots.

## Rules

- Keep footer links useful and compact.
- Add legal links when the project has legal pages.
- Use `hideFooter` on `BaseLayout` for full-screen tools.
- Do not add page-specific promotional content to the shared footer.

## Example

`Footer` is normally rendered by `BaseLayout`:

```astro
<BaseLayout title="Page" description="Description.">
  <slot />
</BaseLayout>
```
