import { init as singleShaderInit, animate as singleShaderAnimate } from 'ts/components/single-shader'
import { init as dualShaderInit, animate as dualShaderAnimate } from 'ts/components/dual-shader'

import squareVert from 'shaders/nebula.vert'
import fractalFrag from 'shaders/fractal.frag'

import nebulaPlaneFrag from 'shaders/nebula2.frag'
import starbgFrag from 'shaders/space-texture/space-texture.frag'

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

const nebulaWithBg = function(canvasContainer) {
  // should actually add background
  const options = {
    mainVert: squareVert,
    mainFrag: nebulaPlaneFrag,
    bgVert: squareVert,
    bgFrag: starbgFrag
  }

  dualShaderInit(canvasContainer, options)
  dualShaderAnimate()
}

window.onload = () => {
  canvasContainer = document.getElementById('canvas-container')

  nebulaWithBg(canvasContainer)
}


