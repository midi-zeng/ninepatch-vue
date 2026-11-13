<template>
  <div :style="containerStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { NinePatchCore } from 'ninepatch-core'
import type { NinePatchData } from 'ninepatch-core'
import type { NinePatchBoxEdges, NinePatchCustomOptions } from './types'

const props = defineProps<{
  /** Nine-patch image URL (raw source or AAPT-compiled) */
  src?: string
  /** Manual overrides; skips image parsing entirely */
  customOptions?: NinePatchCustomOptions
}>()

const renderData = ref<NinePatchData | null>(null)

const DEFAULT_EDGES: Required<NinePatchBoxEdges> = { top: 0, right: 0, bottom: 0, left: 0 }

function resolveEdges(edges: NinePatchBoxEdges | undefined): Required<NinePatchBoxEdges> {
  return { ...DEFAULT_EDGES, ...edges }
}

function edgesToCss(edges: Required<NinePatchBoxEdges>, unit: 'px' | ''): string {
  const suffix = unit === 'px' ? 'px' : ''
  return `${edges.top}${suffix} ${edges.right}${suffix} ${edges.bottom}${suffix} ${edges.left}${suffix}`
}

/**
 * Derive border-image-slice values from parsed render data.
 *
 * The vertical insets come from yDivs and the horizontal ones from xDivs,
 * matching the CSS border-image-slice (top right bottom left) order.
 */
function renderDataToSlice(value: NinePatchData): Required<NinePatchBoxEdges> {
  const width = value.width ?? 0
  const height = value.height ?? 0
  return {
    top: value.yDivs.start,
    right: width - value.xDivs.stop,
    bottom: height - value.yDivs.stop,
    left: value.xDivs.start
  }
}

watch(
  () => [props.src, props.customOptions] as const,
  async ([src, customOptions], _previous, onCleanup) => {
    // Manual options win; drop any previously parsed data
    if (!src || customOptions) {
      renderData.value = null
      return
    }

    // Guard against races: only the latest src may update the state
    let cancelled = false
    onCleanup(() => {
      cancelled = true
    })

    try {
      const data = await new NinePatchCore(src).getRenderData()
      if (!cancelled) renderData.value = data
    } catch {
      if (!cancelled) renderData.value = null
    }
  },
  { immediate: true }
)

const padding = computed(() => resolveEdges(props.customOptions?.padding ?? renderData.value?.padding))
const slice = computed(() =>
  resolveEdges(props.customOptions?.borderImageSlice ?? (renderData.value ? renderDataToSlice(renderData.value) : undefined))
)
const borderInset = computed(() => props.customOptions?.borderInset ?? renderData.value?.borderInset ?? 0)

const containerStyle = computed<CSSProperties>(() => ({
  height: '100%',
  borderImageSource: props.src ? `url(${props.src})` : undefined,
  borderImageSlice: `${edgesToCss(slice.value, '')} fill`,
  borderImageWidth: edgesToCss(slice.value, 'px'),
  // Longhands avoid lossy shorthand normalization for partial values
  paddingTop: `${padding.value.top}px`,
  paddingRight: `${padding.value.right}px`,
  paddingBottom: `${padding.value.bottom}px`,
  paddingLeft: `${padding.value.left}px`,
  clipPath: borderInset.value ? `inset(${borderInset.value}px)` : undefined
}))
</script>
