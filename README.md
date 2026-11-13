# ninepatch-vue

Vue 3 component that renders Android nine-patch images with CSS `border-image`.

Built on top of [`ninepatch-core`](https://github.com/midi-zeng/ninepatch-core),
which supports both AAPT-compiled nine-patch PNGs (with an `npTc` chunk) and raw
nine-patch sources (with black guide borders).

## Installation

```sh
pnpm add ninepatch-vue
```

## Usage

```vue
<script setup lang="ts">
import { NinePatch } from 'ninepatch-vue'
</script>

<template>
  <!-- The image is parsed automatically -->
  <NinePatch src="/images/btn.9.png">
    <button>Click me</button>
  </NinePatch>

  <!-- Or provide the values manually (the image is not parsed) -->
  <NinePatch
    :custom-options="{
      padding: { top: 10, right: 20, bottom: 10, left: 20 },
      borderImageSlice: { top: 14, right: 151, bottom: 91, left: 14 },
      clipPath: 0
    }"
  >
    <button>Click me</button>
  </NinePatch>
</template>
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `src` | `string` | Nine-patch image URL (raw or compiled). |
| `customOptions` | `object` | Manual `padding` / `borderImageSlice` / `borderInset`; skips parsing. |

Anything else (`class`, `style`, listeners) falls through to the wrapper div,
and content goes into the default slot. The wrapper fills its parent height
(`height: 100%`), so size the container.

## Development

```sh
pnpm install
pnpm dev            # demo playground (same as pnpm demo:dev)
pnpm test           # vitest + @vue/test-utils
pnpm run lint       # oxlint
pnpm run typecheck  # vue-tsc (library + demo)
pnpm run build      # vite build (es/cjs + d.ts)
pnpm run release    # build, bumpp (version + commit + tag + push), publish to npm
```

### Demo

A runnable playground lives in [`demo/`](./demo), built with the dedicated
[`vite.config.demo.ts`](./vite.config.demo.ts) at the repo root; it resolves
the library sources directly, so it always runs the latest local code.

```sh
pnpm demo:dev     # vite dev server
pnpm demo:build   # production build into demo/dist
pnpm demo:preview # serve the build
```

## Migrating from 1.x

- Requires Vue 3; the component is now `<script setup lang="ts">` instead of
  `vue-property-decorator` class components.
- Same props (`src`, `customOptions`) and slot; class/style now fall through
  via attribute inheritance.

## License

MIT
