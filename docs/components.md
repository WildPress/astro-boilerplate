# Component Reference

This document is the first stop before creating or modifying reusable components. It defines the purpose, props, allowed options, and extension rules for each boilerplate primitive.

## Component Principles

- Components should be boring, predictable, and easy to compose.
- Prefer Astro components for static markup.
- Use Preact islands only for client-side state, animation, forms, search, menus, carousels, maps, or other interaction.
- Styling belongs in Tailwind classes, with shared tokens and primitives in `src/styles/global.css`.
- Keep props explicit. Do not add broad `variant` options until there is a repeated design need.
- Every component should accept `class` when extra composition is useful.
- Do not add inline `style` attributes or component `<style>` blocks.

## `BaseLayout.astro`

Goal: Own the HTML shell, metadata, global stylesheet, font loading, shared header, and shared footer.

Use for: Every normal page route.

Props:

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | required | Browser title, Open Graph title, and Twitter title. |
| `description` | `string` | required | Meta description and social description. |
| `noindex` | `boolean` | `false` | Adds `noindex, nofollow` robots meta for private or utility pages. |
| `hideFooter` | `boolean` | `false` | Removes the shared footer for full-screen tools or focused flows. |

Slots:

| Slot | Purpose |
| --- | --- |
| default | Main page content. |
| `head` | Page-specific safe head additions, such as canonical overrides or structured data. |

Modification rules:

- Keep global CSS imported here only.
- Keep font preloads aligned with the fonts imported at the top of the layout.
- Add analytics, cookie scripts, or structured data only when the project explicitly needs them.
- Do not put page-specific layout decisions in `BaseLayout`.

Example:

```astro
<BaseLayout title="Page title" description="Clear page description.">
  <Section>
    <h1>Page content</h1>
  </Section>
</BaseLayout>
```

## `Section.astro`

Goal: Provide consistent full-width page bands, spacing, background, borders, and optional constrained inner width.

Use for: Major page regions, not repeated cards.

Props:

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `id` | `string` | undefined | Anchor target for navigation. |
| `shell` | `boolean` | `true` | Wraps content in a constrained width container. |
| `disableXPadding` | `boolean` | `false` | Removes horizontal padding from the inner container. |
| `border` | `boolean` | `false` | Adds top and bottom borders. |
| `borderTop` | `boolean` | `false` | Adds top border only. |
| `borderBottom` | `boolean` | `false` | Adds bottom border only. |
| `background` | `'transparent' \| 'white' \| 'paper' \| 'dark'` | `'transparent'` | Sets section background and, for dark, text colour. |
| `top` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Top padding scale. |
| `bottom` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'none'` | Bottom padding scale. |

Modification rules:

- Add spacing options only if used across multiple sections.
- Keep section backgrounds token-based.
- Do not turn `Section` into a card. Framed content belongs in `Card`.
- Avoid inline scroll margin or layout styles. Use classes.

Example:

```astro
<Section id="features" background="white" top="xl" bottom="lg" border={true}>
  <Typography as="h2" variant="heading">Features</Typography>
</Section>
```

## `Card.astro`

Goal: Provide a simple framed container for repeated items, modals, or genuinely grouped content.

Use for: Feature tiles, result cards, pricing options, callouts, repeated list items.

Props:

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `as` | `keyof HTMLElementTagNameMap` | `'div'` | Semantic element to render. |
| `border` | `boolean \| 'true' \| 'false'` | `true` | Keeps or removes the default border. |
| `rounded` | `boolean \| 'true' \| 'false'` | `false` | Applies `rounded-card` and overflow clipping. |
| `padded` | `boolean \| 'true' \| 'false'` | `false` | Applies standard internal padding. |
| `class` | `string` | `''` | Adds Tailwind classes for composition. |

Modification rules:

- Do not nest cards inside cards.
- Do not use cards to frame whole page sections.
- Keep card styling minimal and token-driven.
- If a card needs a repeated internal layout, create a named domain component that uses `Card`.

Example:

```astro
<Card as="article" rounded={true} padded={true}>
  <Typography as="h3" variant="title">Reusable Card</Typography>
  <Typography variant="meta">A compact repeated item.</Typography>
</Card>
```

## `Button.astro`

Goal: Provide consistent command and link styling with clear variants, sizes, tones, and optional icons.

Use for: Navigation CTAs, form submits, secondary actions, text-link actions.

Props:

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `href` | `string` | undefined | Renders an anchor when provided. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type when `href` is absent. |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual hierarchy. |
| `tone` | `'default' \| 'light'` | `'default'` | Light tone is for dark backgrounds. |
| `size` | `'default' \| 'large'` | `'default'` | Height and width scale. |
| `icon` | `boolean \| IconName` | `false` | `true` uses `move-right`; a string selects a specific approved icon. |
| `fullWidth` | `boolean \| 'true' \| 'false'` | `false` | Makes the button fill its parent width. |
| `target` | `string` | undefined | Anchor target. |
| `rel` | `string` | undefined | Anchor rel attribute. |
| `class` | `string` | `''` | Adds Tailwind classes for composition. |

Variant goals:

| Variant | Goal |
| --- | --- |
| `primary` | Main action on a page or section. |
| `secondary` | Alternative action with lower visual weight. |
| `tertiary` | Inline or text-like action. |

Modification rules:

- Do not add one-off colour variants.
- Do not create hover states that shift layout position.
- Keep button text short enough to fit on mobile.
- Use icons for clear commands where an icon improves scanning.
- For external links, set `target="_blank"` and `rel="noreferrer"`.

Example:

```astro
<Button href="/contact/" icon="arrow-right">Start Enquiry</Button>
<Button variant="secondary" type="submit">Submit</Button>
<Button variant="tertiary" href="/learn-more/" icon={true}>Learn more</Button>
```

## `Typography.astro`

Goal: Apply shared typographic roles without repeating long class strings.

Use for: Headings, labels, supporting copy, metadata, and repeated text patterns.

Props:

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `as` | `keyof HTMLElementTagNameMap` | `'p'` | Semantic element to render. |
| `variant` | `'display' \| 'heading' \| 'title' \| 'body' \| 'meta' \| 'label'` | `'body'` | Typographic style role. |
| `class` | `string` | `''` | Adds Tailwind classes for composition. |

Variant goals:

| Variant | Goal |
| --- | --- |
| `display` | First-viewport hero or major campaign headline. |
| `heading` | Main section headings. |
| `title` | Card, panel, or compact block headings. |
| `body` | Default readable body copy. |
| `meta` | Secondary facts, dates, captions, helper copy. |
| `label` | Short uppercase labels and eyebrows. |

Modification rules:

- Do not use `display` inside cards or compact panels.
- Keep letter spacing at zero unless a project-specific type system deliberately changes it.
- Use semantic `as` values, not visual variants, to define heading order.
- Add new variants only when they are reused across the project.

Example:

```astro
<Typography as="h1" variant="display">A clear hero headline</Typography>
<Typography as="h2" variant="heading">Section title</Typography>
<Typography variant="meta">Updated 29 May 2026</Typography>
```

## `Icon.astro`

Goal: Expose a controlled set of Lucide icons as inline SVG without importing icon nodes throughout the project.

Use for: Button icons, small feature markers, tool controls, and decorative UI markers with hidden semantics.

Props:

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `name` | `IconName` | required | Approved icon name from `src/lib/icon-names.ts`. |
| `size` | `'compact' \| 'default' \| 'md'` | `'default'` | Icon dimensions. |
| `filled` | `boolean` | `false` | Uses `currentColor` fill. Use sparingly. |
| `class` | `string` | `''` | Adds Tailwind classes for colour or positioning. |

Modification rules:

- Add icons to both `src/lib/icon-names.ts` and the `icons` map in `Icon.astro`.
- Prefer an existing Lucide icon over custom SVG.
- Keep icons `aria-hidden` by default when adjacent text labels the action.
- If an icon-only button is needed, the button or link must provide an accessible label.

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

Example:

```astro
<Icon name="search" size="md" class="text-[var(--accent-strong)]" />
```

## `SiteHeader.astro`

Goal: Provide a simple project header that demonstrates wordmark, primary nav, and CTA composition.

Use for: The default shell in `BaseLayout`.

Current internal options:

- `navItems` array with `{ href, label }` pairs.
- Wordmark link to `/`.
- Desktop nav with underline hover treatment.
- CTA using `Button`.

Modification rules:

- Keep the wordmark as the homepage link.
- Keep nav focused. Avoid adding every page to the primary nav.
- Use underline or restrained active states rather than heavy pills by default.
- Add mobile menu behaviour as a Preact island only when the project needs it.
- Do not put page-specific content in the shared header.

## `Footer.astro`

Goal: Provide simple footer navigation, ownership/date text, and a second homepage link.

Use for: The default footer in `BaseLayout`.

Current internal options:

- Current year generated at build time.
- Footer nav links.
- Wordmark/homepage link.

Modification rules:

- Keep footer links useful and compact.
- Add legal links when the project has legal pages.
- Do not hide agency credit with visual tricks unless a project has an explicit footer-credit policy.
- Use `hideFooter` on `BaseLayout` for full-screen tools.

## Adding A New Reusable Component

Before adding a new reusable component:

1. Confirm the pattern appears at least twice or has clear future reuse.
2. Check whether it can be composed from existing primitives.
3. Define its goal, props, variants, and modification rules in this document.
4. Keep styling in Tailwind classes and shared tokens.
5. Run `npm run validate`.

If the component is domain-specific, name it by domain purpose, such as `PropertyCard`, `ShowCard`, or `EnquiryForm`, rather than broad names like `Panel2`.
