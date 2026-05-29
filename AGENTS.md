# Agent Notes

## Project

This repository is the reusable Astro boilerplate for new WildPress-style static builds. Treat it as the source of truth for component structure, dependency choices, and verification guardrails.

## Working Preferences

- Use Tailwind utility classes for page and component styling.
- Do not add component-level `<style>` blocks or inline `style` attributes.
- Keep custom CSS restricted to `src/styles/global.css`, and use it only for Tailwind setup, design tokens, base element rules, and shared primitives.
- Prefer Astro components for static UI and Preact islands only where client interactivity is required.
- Do not add React by default. If a project needs a React-only dependency, document the reason and update the dependency allowlist deliberately.
- Run `npm run validate` after code changes where practical.
- Use conventional commits when committing, and keep commits atomic. Each commit should cover one coherent change.

## Boilerplate Contract

- Shared primitives live in `src/components/`.
- Component goals, props, allowed options, and modification rules are documented in `docs/components.md`; read it before changing shared primitives.
- `BaseLayout.astro` owns metadata, font loading, header/footer placement, and the global stylesheet import.
- `Section.astro`, `Card.astro`, `Typography.astro`, `Button.astro`, and `Icon.astro` are the first-choice building blocks.
- Component props should stay narrow and composable. Add variants only when a pattern is reused in more than one place.
- Components should expose `class` for local composition, but styling must still be Tailwind utility classes.
- Use `class:list` in Astro when classes are conditional.
- Avoid template-string class generation because it is hard to audit and easy for Tailwind extraction to miss.

## Dependency Policy

Default approved dependencies are:

- Astro 6
- Preact via `@astrojs/preact` for islands
- Tailwind CSS 4 via `@tailwindcss/vite`
- `@tailwindcss/typography`
- `@astrojs/sitemap`
- `@floating-ui/dom`
- `swiper`
- `lucide`
- `pagefind`
- `@fontsource/inter` and `@fontsource/newsreader`

Any dependency outside the allowlist must be justified in README and added to `scripts/verify-standards.mjs`.

## Verification

Run the full build gate:

```bash
npm run validate
```

This runs:

- `npm run verify:standards` for project-specific guardrails
- `npm run lint` for ESLint, Astro, TypeScript, and accessibility checks
- `npm run build` for Astro production build and Pagefind indexing

`npm run build` also runs `verify:standards` first, so standards failures block production builds.

## Design Rules

- Use restrained, content-first layouts unless a specific project brief calls for a more expressive style.
- Cards are for repeated items, framed tools, or grouped content. Do not nest cards inside cards.
- Keep border radii at 8px or below unless a project design system explicitly changes it.
- Use icons in buttons where an icon makes the action clearer.
- Do not use visible instructional copy to explain controls or internal implementation.
- Do not create CSS themes dominated by one colour family.
- Keep headings, buttons, and cards sized for their container. Text must not overlap or overflow at mobile widths.

## Content Tone

- Use British English by default.
- Keep copy direct and useful.
- Do not use em dashes, semicolons, exclamation marks, generic filler, or copy written only to hit length.
- Do not leave scaffold, prototype, or internal implementation notes in public-facing copy.
