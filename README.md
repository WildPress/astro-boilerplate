# Astro Boilerplate

A strict starter for new Astro static sites. It includes a small set of reusable components, Tailwind CSS, Preact islands, image optimisation, validation scripts, and optional Bunny.net deployment support.

## What's Included

- Astro 6
- Tailwind CSS 4 with Tailwind Typography
- Preact for interactive islands
- Shared components for layout, buttons, cards, typography, icons, and images
- Astro native image optimisation through `OptimizedImage.astro`
- Pagefind search indexing after build
- Sitemap generation
- ESLint and project standards verification
- Optional Bunny.net deployment script with IndexNow support

## Getting Started

```bash
npm install
npm run dev
```

Update these first for a real project:

- `package.json` project name
- `astro.config.mjs` site URL
- `src/components/SiteHeader.astro`
- `src/components/Footer.astro`
- `src/pages/index.astro`
- `public/favicon.svg`
- Theme choices in `src/styles/global.css`

## Commands

```bash
npm run dev
npm run validate
npm run build
npm run preview
```

`npm run validate` runs standards verification, ESLint, and the production build.

Bunny deployment is available for downstream projects, either locally with `.env` or through the manual GitHub Actions workflow:

```bash
npm run deploy:bunny
```

Configure it only in the project repo that will actually deploy. See [docs/deployment.md](docs/deployment.md).

## Documentation

- [Component reference](docs/components.md)
- [Theme setup](docs/theme.md)
- [MCP setup](docs/mcp.md)
- [Deployment setup](docs/deployment.md)
- [Agent instructions](AGENTS.md)

Component examples live in `src/examples/components/`. They are outside `src/pages/`, so they are not routed or deployed unless you import them into a preview route during development.

## Before Shipping

Run:

```bash
npm run validate
```

Keep the output clean before committing or deploying a site built from this boilerplate.
