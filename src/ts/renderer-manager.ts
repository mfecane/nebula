import { getShaderList } from 'ts/shader-registry'
import { Renderer } from './renderers/renderer-base'

let renderer: Renderer = null
let canvasContainer: HTMLDivElement
let shaderList

export const setShader = function (id) {
  if (!shaderList) {
    return
  }

  const shaderOptions = shaderList.find(
    ({ id: id1 }: { id: string }) => id1 === id
  )

  if (!shaderOptions) {
    return
  }

  if (renderer && renderer?.options.id !== id) {
    renderer.destroy()
    renderer = null
  }

  renderer = new Renderer(canvasContainer, shaderOptions)
  renderer.animate()
}

export const setParameter = function (key, value) {
  renderer.parameters[key] = value
}

export const getFps = function () {
  if (renderer.fps) {
    return renderer.fps
  }
  return NaN
}

window.onload = () => {
  shaderList = getShaderList()
  canvasContainer = document.getElementById('canvas-container')

  setShader(shaderList[0].id)
}
