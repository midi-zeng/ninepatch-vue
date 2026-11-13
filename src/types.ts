/** Box edges (px) shared by padding and border-image-slice */
export interface NinePatchBoxEdges {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

/**
 * Manual overrides; when set, the image is not parsed at all.
 */
export interface NinePatchCustomOptions {
  padding?: NinePatchBoxEdges
  borderImageSlice?: NinePatchBoxEdges
  clipPath?: number
}
