# Astro Boilerplate

Strict Astro starter for new static site builds. It combines reusable primitives from the West End, Battersea Property Guide, and Catelier projects with a verification process designed to prevent drift.

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

Rules:

- Use Tailwind utility classes for styling.
- No component-scoped `<style>` blocks.
- No inline `style` attributes.
- No CSS files outside `src/styles/global.css`.
- Use `class:list` for conditional Astro classes.
- Avoid template-generated class strings.
- Keep component APIs narrow and reusable.

Full component options, goals, examples, and modification rules live in `docs/components.md`. Read that file before changing shared primitives.

## Global CSS Policy

`src/styles/global.css` is allowed to contain:

- Tailwind imports and plugins
- `@theme` design tokens
- `:root` token aliases
- Base element defaults
- Shared primitives such as `.shell`, `.card`, `.type-*`, `.field`, and `.eyebrow`

Do not place one-off page styling in global CSS. Use Tailwind classes in the page or component.

## Dependency Guardrails

`scripts/verify-standards.mjs` enforces the approved dependency allowlist. If a new project needs another dependency, make the decision explicit:

1. Add the package.
2. Document why it belongs in README.
3. Add it to the allowlist in `scripts/verify-standards.mjs`.
4. Run `npm run validate`.

## Creating A New Site From This Boilerplate

1. Copy or fork the boilerplate.
2. Update `package.json` name and `astro.config.mjs` site URL.
3. Replace header, footer, homepage content, fonts, colours, and favicon.
4. Keep the component and verification contracts intact.
5. Run `npm run validate` before first commit.

## Verification Checklist

Before shipping any build:

- `npm run validate` passes.
- There are no unapproved dependencies.
- There are no component `<style>` blocks or inline styles.
- Global CSS contains only tokens, base rules, and shared primitives.
- Components use Tailwind classes and stable responsive dimensions.
- New interactive UI uses Preact islands unless React is explicitly approved.
- Pages have title and description metadata.
