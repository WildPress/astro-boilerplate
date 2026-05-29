# Theme Setup

This boilerplate should not ship a project-specific colour palette. Every new Astro project must define its own visual theme deliberately.

## Where Theme Styling Lives

- `src/styles/global.css` loads Tailwind and the Tailwind Typography plugin.
- Project-specific theme tokens can be added in `src/styles/global.css` with Tailwind 4 `@theme`.
- Font family tokens such as `--font-sans` and `--font-serif` are useful and encouraged because they let components use Tailwind classes like `font-sans` and `font-serif`.
- Component typography should be expressed as Tailwind classes in component class maps, not as custom text-size CSS variables.
- One-off page styling belongs in Tailwind classes on the page or component.

## Tailwind Typography

Tailwind Typography is part of the default stack and is loaded with:

```css
@plugin "@tailwindcss/typography";
```

Use the `prose` classes for long-form content, then tune them per project with Tailwind utilities.

## Colour Palette Process

Before building a project UI:

1. Define the project personality and audience.
2. Choose a restrained palette with clear roles: page background, surface, text, muted text, border, primary action, secondary accent, success, warning, and error.
3. Add project-specific colour tokens in `@theme` only after the palette is chosen.
4. Use those tokens through Tailwind utility classes, such as `bg-brand-950`, `text-brand-950`, or `border-line`.
5. Avoid relying on the boilerplate's neutral placeholder classes as the final brand system.

Example project theme:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-brand-50: #f2f7f8;
  --color-brand-600: #2d6f7a;
  --color-brand-950: #102a30;
  --color-accent-500: #b58a3a;
  --color-surface: #ffffff;
  --color-page: #f6f7f5;
  --color-line: #dce2df;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Newsreader', Georgia, serif;
}
```

Then use the tokens directly:

```astro
<section class="bg-page text-brand-950">
  <a class="bg-brand-950 text-white hover:bg-brand-600" href="/contact/">Contact</a>
</section>
```

## Typography Process

Keep responsive typography in component Tailwind class maps. This is easier to audit and more flexible than custom text-size CSS variables. Font family tokens are still appropriate because they are design tokens consumed by Tailwind utility classes.

Example:

```ts
const classes = {
  display: 'font-serif text-5xl leading-[1.02] sm:text-7xl sm:leading-none',
  heading: 'font-serif text-3xl leading-tight sm:text-5xl',
  body: 'text-base leading-7 text-neutral-600',
};
```

For a new project:

1. Choose fonts and install the relevant packages if needed.
2. Define font families in `@theme`, such as `--font-sans` and `--font-serif`.
3. Update `Typography.astro` class maps for the project hierarchy.
4. Keep letter spacing at `tracking-normal` unless the type system has a specific reason.
5. Check mobile and desktop viewports for overflow and hierarchy.

## Agent Rules

- Do not hardcode a finished brand palette in the boilerplate.
- Do not create typography scale CSS variables for component text roles.
- Use Tailwind classes for responsive typography.
- Keep `@theme` for project-level design tokens only.
- Run `npm run validate` after theme changes.
