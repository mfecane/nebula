import { getShaderList } from 'ts/shader-registry'
import Renderer from 'ts/renderers/renderer-base'
import RendererBG from 'ts/renderers/renderer-bg'

let renderer: Renderer = null
let canvasContainer: HTMLDivElement
let shaderList: []
let errorCallback = (e: Error) => console.error(e)

const defaults = {
  type: 'single',
}

const createRenderer = function (options) {
  switch (options.type) {
    case 'single':
      return Renderer
    case 'bg':
      return RendererBG
    default:
      return Renderer
  }
}

export const setRenderer = function (id: number): void {
  if (!shaderList) {
    return
  }

  let shaderOptions = shaderList.find(
    ({ id: id1 }: { id: number }) => id1 === id
  )

  shaderOptions = { ...defaults, ...shaderOptions }

  if (!shaderOptions) {
    return
  }

  if (renderer && renderer.options.id !== id) {
    renderer.destroy()
    renderer = null
  }

  if (!renderer) {
    try {
      localStorage.setItem('renderer_id', id + '')
      const Ctor = createRenderer(shaderOptions)
      renderer = new Ctor(canvasContainer, shaderOptions)
      renderer.init()
      renderer.animate()
    } catch (e) {
      errorCallback(e)
    }
  }
}

export const setParameter = function (key: string, value: number): void {
  renderer.parameters[key] = value
}

export const setErrorCallback = function (fn: (e: Error) => void): void {
  errorCallback = fn
}

export const getFps = function (): number {
  if (renderer?.fps) {
    return renderer.fps
  }
  return NaN
}

export const init = function (): void {
  shaderList = getShaderList()
  canvasContainer = document.getElementById('canvas-container')
}
