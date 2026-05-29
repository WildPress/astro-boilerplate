# OptimizedImage

Source: `src/components/OptimizedImage.astro`

## What It Does

`OptimizedImage` wraps Astro's native `astro:assets` `<Image />` component and applies the boilerplate defaults for image output.

## What It Is For

Use `OptimizedImage` for local images imported from `src/`, authorized remote images, and public images where consistent authoring and layout stability matter.

## Defaults

- `format="webp"`
- `quality="high"`
- `loading="lazy"`
- `decoding="async"`

## Attributes

`OptimizedImage` accepts Astro's native `Image` props. These are the practical attributes used most often:

| Attribute | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `ImageMetadata \| string` | none | Yes | Local import, configured remote URL, or public URL. |
| `alt` | `string` | none | Yes | Accessible alternative text. Use `""` only for decorative images. |
| `width` | `number` | inferred for local images | Sometimes | Output width. Usually required for remote or public images. |
| `height` | `number` | inferred for local images | Sometimes | Output height. Usually required for remote or public images. |
| `format` | Astro image format | `'webp'` | No | Output format. Keep WebP unless there is a measured project reason. |
| `quality` | Astro image quality | `'high'` | No | Output quality. |
| `loading` | `'eager' \| 'lazy'` | `'lazy'` | No | Use `eager` only for the primary above-the-fold image. |
| `decoding` | `'async' \| 'sync' \| 'auto'` | `'async'` | No | Browser decoding hint. |
| `class` | `string` | `''` | No | Tailwind classes applied to the final image. |
| `sizes` | `string` | none | No | Responsive image slot sizing when using generated widths. |
| `densities` | `number[] \| string[]` | none | No | Pixel density variants supported by Astro's image pipeline. |
| `widths` | `number[]` | none | No | Explicit responsive widths supported by Astro's image pipeline. |
| `fit` | Astro fit option | Astro default | No | Object fitting/cropping option passed to Astro. |
| `position` | string | Astro default | No | Crop position passed to Astro when relevant. |

## Slots

`OptimizedImage` exposes no slots.

## Rules

- Do not use raw `<img>` in Astro files.
- Use Astro's native `Picture` directly only for multi-format output or art direction, and document the exception near the component.
- Keep WebP/high as the default unless a project has measured reasons to change it.
- If a strict package manager cannot resolve image transforms, install `sharp` explicitly.

## Example

```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
import heroImage from '../assets/hero.jpg';
---

<OptimizedImage
  src={heroImage}
  alt="Descriptive image text"
  loading="eager"
  class="aspect-[16/9] w-full rounded-lg object-cover"
/>
```
