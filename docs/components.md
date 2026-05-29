# Component Reference

This document is the first stop before creating or modifying reusable components. Each component also has its own detailed Markdown file with purpose, attributes, rules, and examples.

## Component Principles

- Components should be boring, predictable, and easy to compose.
- Prefer Astro components for static markup.
- Use Preact islands only for client-side state, animation, forms, search, menus, carousels, maps, or other interaction.
- Use Astro's native image pipeline for images. Prefer `OptimizedImage.astro` for default WebP/high-quality output.
- Styling belongs in Tailwind classes, with shared tokens and primitives in `src/styles/global.css`.
- Keep props explicit. Do not add broad `variant` options until there is a repeated design need.
- Every component should accept `class` when extra composition is useful.
- Do not add inline `style` attributes or component `<style>` blocks.

## Component Files

- [BaseLayout](components/base-layout.md)
- [Button](components/button.md)
- [Card](components/card.md)
- [Footer](components/footer.md)
- [Icon](components/icon.md)
- [OptimizedImage](components/optimized-image.md)
- [Section](components/section.md)
- [SiteHeader](components/site-header.md)
- [Typography](components/typography.md)

## Adding A New Reusable Component

Before adding a new reusable component:

1. Confirm the pattern appears at least twice or has clear future reuse.
2. Check whether it can be composed from existing primitives.
3. Define its goal, attributes, variants, and modification rules in a dedicated file under `docs/components/`.
4. Keep styling in Tailwind classes and shared tokens.
5. Run `npm run validate`.

If the component is domain-specific, name it by domain purpose, such as `ProductCard`, `ArticleCard`, or `EnquiryForm`, rather than broad names like `Panel2`.
