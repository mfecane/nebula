import { init as singleShaderInit, animate as singleShaderAnimate } from 'ts/components/single-shader'

import squareVert from 'shaders/nebula.vert'
import fractalFrag from 'shaders/fractal.frag'

import nebulaPlaneFrag from 'shaders/nebula2.frag'

import 'css/config.scss'
import 'css/null.scss'
import 'css/global.scss'

let canvasContainer: HTMLDivElement

const raymarchGyroid = function(canvasContainer) {
  singleShaderInit(canvasContainer, squareVert, fractalFrag)
  singleShaderAnimate()
}

const raymarchNebula = function(canvasContainer) {
  // should actually add background
  singleShaderInit(canvasContainer, squareVert, nebulaPlaneFrag)
  singleShaderAnimate()
}

window.onload = () => {
  canvasContainer = document.getElementById('canvas-container')

  raymarchNebula(canvasContainer)
}


