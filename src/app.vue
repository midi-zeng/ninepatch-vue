<template>
  <div
    :class="$style.container"
    :style="`
      border-image-source: url(${src});
      padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
      border-image-slice: ${borderImageData.top} ${borderImageData.right} ${borderImageData.bottom} ${borderImageData.left} fill;
      border-image-width: ${borderImageData.top}px ${borderImageData.right}px ${borderImageData.bottom}px ${borderImageData.left}px;
      clip-path: inset(${clipPath}px)
    `"
  >
    <slot />
  </div>
</template>

<script>
import { NinePatchCore } from 'nine-patch-core'

export default {
  name: 'nine-patch',
  data () {
    return {
      padding: {},
      borderImageData: {},
      clipPath: 0
    }
  },
  props: {
    src: {
      type: String,
      required: true,
      default: ''
    }
  },
  watch: {
    src: {
      hanlder() {
        this.getNinePatchData()
      },
      immediate: true
    }
  },
  methods: {
    async getNinePatchData() {
      if (this.src === '' || this.src === undefined) {
        return false
      }

      // 自定义传入border-image参数的不用去解析图片
      if (this.customOptions) {
        this.padding = this.customOptions?.padding ?? {}
        this.borderImageData = this.customOptions?.borderImageSlice ?? {}
        this.clipPath = this.customOptions?.clipPath ?? ''
      } else {
        const np = new NinePatchCore(this.src)
        const chunk = await np.getChunkData()
        this.padding = chunk?.padding ?? {}
        this.borderImageData.top = chunk.yDivs.start
        this.borderImageData.right = chunk.width - chunk.xDivs.stop
        this.borderImageData.bottom = chunk.height - chunk.yDivs.stop
        this.borderImageData.left = chunk.xDivs.start
        this.clipPath = chunk?.clipPath ?? 0
      }
    }
  },
}
</script>

<style scoped>
.container {
  color: aqua;
}
</style>