<template>
  <div
    :style="`
      border-image-source: url(${src});
      padding: ${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;
      border-image-slice: ${borderImageData.top} ${borderImageData.right} ${borderImageData.bottom} ${borderImageData.left} fill;
      border-image-width: ${borderImageData.top}px ${borderImageData.right}px ${borderImageData.bottom}px ${borderImageData.left}px;
      clip-path: inset(${clipPath}px);
    `"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component, Watch } from 'vue-property-decorator'
import { NinePatchCore } from 'ninepatch-core'

@Component
export default class NinePatchVue extends Vue {
  padding: Record<string, any> = { top: 0, right: 0, bottom: 0, left: 0 }
  borderImageData: Record<string, any> = { top: 0, right: 0, bottom: 0, left: 0 }
  clipPath = 0

  @Prop({ type: String, required: true, default: '' }) readonly src!: string
  @Prop({ type: Object, default: () =>  null }) readonly customOptions?: {
    padding?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
    borderImageSlice?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
    clipPath?: number
  }

  @Watch('src', { immediate: true, deep: true })
  async getNinePatchData() {
    if (this.src === '' || this.src === undefined) {
      return false
    }

    // 自定义传入border-image参数的不用去解析图片
    if (this.customOptions) {
      this.padding = this.customOptions?.padding ?? {}
      this.borderImageData = this.customOptions?.borderImageSlice ?? {}
      this.clipPath = this.customOptions?.clipPath ?? 0
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
}
</script>
