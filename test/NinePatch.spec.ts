import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import NinePatchVue from '../src/NinePatch.vue'

const { getRenderData } = vi.hoisted(() => ({
  // Never resolves by default so tests that parse must set an explicit result
  getRenderData: vi.fn(() => new Promise(() => {}))
}))

vi.mock('ninepatch-core', () => ({
  NinePatchCore: class {
    constructor(public src: string) {}
    getRenderData = getRenderData
  }
}))

const GOLDEN_RENDER_DATA = {
  padding: { left: 10, right: 20, top: 10, bottom: 20 },
  xDivs: { start: 14, stop: 29 },
  yDivs: { start: 14, stop: 29 },
  xDivsList: [{ start: 14, stop: 29 }],
  yDivsList: [{ start: 14, stop: 29 }],
  width: 180,
  height: 120
}

function styleOf(wrapper: { element: Element }): CSSStyleDeclaration {
  return (wrapper.element as HTMLElement).style
}

async function flush(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('NinePatchVue', () => {
  test('renders the default slot', () => {
    const wrapper = mount(NinePatchVue, { props: { src: '/btn.png' }, slots: { default: 'hello' } })
    expect(wrapper.text()).toBe('hello')
  })

  test('applies parsed chunk data as border-image styles', async () => {
    getRenderData.mockResolvedValue(GOLDEN_RENDER_DATA)

    const wrapper = mount(NinePatchVue, { props: { src: '/btn.png' } })
    await flush()

    const style = styleOf(wrapper)
    expect(style.borderImageSource).toContain('/btn.png')
    expect(style.borderImageSlice).toBe('14 151 91 14 fill')
    expect(style.borderImageWidth).toBe('14px 151px 91px 14px')
    expect(style.paddingTop).toBe('10px')
    expect(style.paddingRight).toBe('20px')
    expect(style.paddingBottom).toBe('20px')
    expect(style.paddingLeft).toBe('10px')
  })

  test('custom options skip image parsing entirely', async () => {
    getRenderData.mockClear()

    const wrapper = mount(NinePatchVue, {
      props: {
        src: '/btn.png',
        customOptions: { padding: { top: 5 }, borderImageSlice: { left: 2, right: 3 }, borderInset: 1 }
      }
    })
    await flush()

    expect(getRenderData).not.toHaveBeenCalled()
    const style = styleOf(wrapper)
    expect(style.paddingTop).toBe('5px')
    expect(style.paddingRight).toBe('0px')
    expect(style.borderImageSlice).toBe('0 3 0 2 fill')
    expect(style.clipPath).toBe('inset(1px)')
  })

  test('custom options drop previously parsed chunk data', async () => {
    getRenderData.mockResolvedValue(GOLDEN_RENDER_DATA)

    const wrapper = mount(NinePatchVue, { props: { src: '/btn.png' } })
    await flush()
    await wrapper.setProps({ src: '/btn.png', customOptions: { padding: { left: 7 } } })
    await flush()

    const style = styleOf(wrapper)
    expect(style.paddingLeft).toBe('7px')
    expect(style.borderImageSlice).not.toContain('14')
  })

  test('ignores stale responses after src changes', async () => {
    let resolveA: (value: unknown) => void = () => {}
    getRenderData.mockImplementation(function (this: { src: string }) {
      if (this.src === '/a.png') {
        return new Promise(resolve => {
          resolveA = resolve
        })
      }
      return Promise.resolve({ ...GOLDEN_RENDER_DATA, borderInset: 9 })
    })

    const wrapper = mount(NinePatchVue, { props: { src: '/a.png' } })
    await wrapper.setProps({ src: '/b.png' })
    await flush()
    expect(styleOf(wrapper).clipPath).toBe('inset(9px)')

    resolveA({ ...GOLDEN_RENDER_DATA, borderInset: 1 })
    await flush()

    // the late response for /a.png must not overwrite /b.png
    expect(styleOf(wrapper).clipPath).toBe('inset(9px)')
  })

  test('parse failures render without border-image data', async () => {
    getRenderData.mockRejectedValue(new Error('network down'))

    const wrapper = mount(NinePatchVue, { props: { src: '/broken.png' } })
    await flush()

    expect(styleOf(wrapper).paddingTop).toBe('0px')
  })
})
