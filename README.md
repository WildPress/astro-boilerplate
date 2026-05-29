# Astro Boilerplate

Strict Astro starter for new static site builds. It combines reusable primitives with a verification process designed to prevent drift across new Astro projects.

## Stack

- Astro 6
- Preact islands by default
- Tailwind CSS 4
- `@floating-ui/dom` for popovers, menus, and positioned UI
- Swiper for carousels
- Lucide icon nodes through the shared `Icon.astro` component
- Pagefind for static search indexing
- Sitemap integration
- Fontsource for local font loading
- Astro native image optimization through `astro:assets`

React is intentionally not part of the default stack. Add it only for a project that has a clear React-only requirement.

## Commands

```bash
npm install
npm run dev
npm run validate
npm run preview
```

`npm run validate` is the build gate for every project:

1. `npm run verify:standards`
2. `npm run lint`
3. `npm run build`

`npm run build` also runs `verify:standards` before `astro build`.

## Component Rules

Reusable components live in `src/components/`.

- `Button.astro` for links and buttons with strict variants.
- `Card.astro` for repeated items, modals, or genuinely framed content.
- `Section.astro` for full-width page bands and consistent spacing.
- `Typography.astro` for display, heading, title, body, meta, and label text.
- `Icon.astro` for approved Lucide icons.
- `SiteHeader.astro` and `Footer.astro` are replaceable project shells.
- `OptimizedImage.astro` wraps Astro's native `<Image />` and defaults to `format="webp"` and `quality="high"`.

Rules:

- Use Tailwind utility classes for styling.
- No component-scoped `<style>` blocks.
- No inline `style` attributes.
- No CSS files outside `src/styles/global.css`.
- No raw `<img>` elements in Astro files. Use `OptimizedImage.astro`, or Astro's native `Image`/`Picture` components for documented exceptions.
- Use `class:list` for conditional Astro classes.
- Avoid template-generated class strings.
- Keep component APIs narrow and reusable.

Full component options, goals, attributes, and examples live in `docs/components.md` and the per-component files under `docs/components/`.

## Global CSS Policy

`src/styles/global.css` is allowed to contain:

- Tailwind imports and plugins
- `@theme` design tokens
- `:root` token aliases
- Base element defaults
- Shared primitives such as `.shell`, `.card`, `.type-*`, `.field`, and `.eyebrow`

Do not place one-off page styling in global CSS. Use Tailwind classes in the page or component.

## Creating A New Site From This Boilerplate

1. Copy or fork the boilerplate.
2. Update `package.json` name and `astro.config.mjs` site URL.
3. Replace header, footer, homepage content, fonts, colours, and favicon.
4. Keep the component and verification contracts intact.
5. Run `npm run validate` before first commit.

## Verification Checklist

Before shipping any build:

- `npm run validate` passes.
- There are no component `<style>` blocks or inline styles.
- Global CSS contains only tokens, base rules, and shared primitives.
- Components use Tailwind classes and stable responsive dimensions.
- New interactive UI uses Preact islands unless React is explicitly approved.
- Pages have title and description metadata.
