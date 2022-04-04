import { init as singleShaderInit, animate as singleShaderAnimate } from 'ts/components/single-shader'
import { init as dualShaderInit, animate as dualShaderAnimate } from 'ts/components/dual-shader'

import squareVert from 'shaders/nebula.vert'
import raymarchGeo from 'shaders/raymarch-geo.frag'
import particlesFrag from 'shaders/particles.frag'

import nebulaPlaneFrag from 'shaders/nebula2.frag'
import starbgFrag from 'shaders/space-texture/space-texture.frag'
import background2 from 'shaders/background2.frag'

import 'css/config.scss'
import 'css/null.scss'
import 'css/global.scss'

let canvasContainer: HTMLDivElement

const raymarchParticles = function(canvasContainer) {
  singleShaderInit(canvasContainer, squareVert, particlesFrag)
  singleShaderAnimate()
}

const raymarchGyroid = function(canvasContainer) {
  singleShaderInit(canvasContainer, squareVert, raymarchGeo)
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
    bgFrag: background2
  }

  dualShaderInit(canvasContainer, options)
  dualShaderAnimate()
}

window.onload = () => {
  canvasContainer = document.getElementById('canvas-container')

  raymarchParticles(canvasContainer)
}


