import squareVert from 'shaders/nebula.vert'
const shaderList = []

const addShader = (sh) => {
  shaderList.push({ ...sh, id: shaderList.length + 1 })
}

export const getShaderList = () => {
  return shaderList
}

import sh009 from 'shaders/raymarch-reflections3.frag'
import img001 from 'assets/bg.jpg'

import posX01 from 'assets/Yokohama3/posx.jpg'
import negX01 from 'assets/Yokohama3/negx.jpg'
import posY01 from 'assets/Yokohama3/posy.jpg'
import negY01 from 'assets/Yokohama3/negy.jpg'
import posZ01 from 'assets/Yokohama3/posz.jpg'
import negZ01 from 'assets/Yokohama3/negz.jpg'

addShader({
  name: 'Shiny gyroid',
  description: 'Cubemap sampling techniques',
  vertexSource: squareVert,
  fragmentSource: sh009,
  type: 'tex',
  parameters: [
    { id: 'gyrdens1', label: 'Gyroid density', default: 0.5 },
    { id: 'thick', label: 'Thickness', default: 0.3 },
    { id: 'vignette', label: 'Vignette', default: 1.0 },
    { id: 'dim', label: 'Dim', default: 0.0 },
  ],
  texture: { src: img001 },
  textureCube: {
    src: {
      posX: posX01,
      negX: negX01,
      posY: posY01,
      negY: negY01,
      posZ: posZ01,
      negZ: negZ01,
    },
  },
})

import raymarchGeo from 'shaders/strings-burning.frag'

addShader({
  name: 'Burning filament strings',
  description: 'Volumetric raymarcher, researching glow',
  vertexSource: squareVert,
  fragmentSource: raymarchGeo,
  parameters: [
    { id: 'spiraNoise', label: 'Spiral noise', default: 0.5 },
    { id: 'gyroidOffset', label: 'Gyroid offset', default: 0.5 },
    { id: 'pixelate', label: 'Pixelate', default: 0.5 },
  ],
})

import sh008 from 'shaders/raymarch-reflections2.frag'

addShader({
  name: 'Balloon with lights',
  description: 'Playing with reflections',
  vertexSource: squareVert,
  fragmentSource: sh008,
  parameters: [{ id: 'gamma', label: 'Gamma', default: 0.5 }],
})

import raymarchGeo01 from 'shaders/raymarch-geo-01.frag'

addShader({
  name: 'Strings with color splash',
  description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
  vertexSource: squareVert,
  fragmentSource: raymarchGeo01,
  parameters: [{ id: 'pixelate', label: 'Pixelate', default: 0.5 }],
})

import twistGyRSh from 'shaders/rm-twisted-gyroid-spheres.frag'

addShader({
  name: 'Twisted gyroid spheres',
  description: 'Ray marched gyroid spheres with twist',
  vertexSource: squareVert,
  fragmentSource: twistGyRSh,
  parameters: [
    { id: 'control1', label: 'Radius', default: 0.5 },
    { id: 'control2', label: 'Glow', default: 0.5 },
    { id: 'control3', label: 'Gyroid density', default: 0.5 },
    { id: 'control4', label: 'Twist space', default: 0.5 },
  ],
})

import fads7fa7 from 'shaders/string-gyroid.frag'

addShader({
  name: 'String gyroid',
  description: 'infinite gyroid space',
  vertexSource: squareVert,
  fragmentSource: fads7fa7,
  parameters: [],
})

import jhsf76fd from 'shaders/shader-001.frag'

addShader({
  name: 'Sphere + gyroid',
  description: 'Basic raymarcher',
  vertexSource: squareVert,
  fragmentSource: jhsf76fd,
  parameters: [
    { id: 'control1', label: 'Radius', default: 0.5 },
    { id: 'control2', label: 'Gyroid density', default: 0.5 },
    { id: 'control3', label: 'Stretch', default: 0.5 },
    { id: 'control5', label: 'Twist', default: 0.5 },
  ],
})

import sh003 from 'shaders/nebula.frag'

addShader({
  name: 'Nebula',
  description: 'Volumetric nebula',
  vertexSource: squareVert,
  fragmentSource: sh003,
  parameters: [
    { id: 'control3', label: 'Volume', default: 0.5 },
    { id: 'control4', label: 'Volume2', default: 0.5 },
    { id: 'control1', label: 'Volume3', default: 0.5 },
    { id: 'control5', label: 'Light', default: 0.5 },
  ],
})

import nebulaPlane from 'shaders/nebula-plane.frag'

addShader({
  name: 'Nebula: twisted mess',
  description: '',
  vertexSource: squareVert,
  fragmentSource: nebulaPlane,
  parameters: [],
})

import sh005 from 'shaders/nebula-3.frag'
import sh006 from 'shaders/background2.frag'

addShader({
  name: 'Nebula 3',
  description: 'Nice volumetric effect. Warning! Very slow shader.',
  vertexSource: squareVert,
  fragmentSource: sh005,
  bgVertexSource: squareVert,
  bgFragmentSource: sh006,
  type: 'bg',
  parameters: [
    { id: 'control1', label: 'Pulse', default: 0.5 },
    { id: 'control2', label: 'Вздръжне эффект', default: 0.5 },
    { id: 'quality', label: 'Quality', default: 0.5 },
  ],
})

import sh002 from 'shaders/squibles.frag'

addShader({
  name: 'Bubbles 1',
  description: '',
  vertexSource: squareVert,
  fragmentSource: sh002,
  parameters: [{ id: 'control1', label: 'Pixelate', default: 0.5 }],
})

import sh004 from 'shaders/bubbles-2.frag'

addShader({
  name: 'Bubbles 2',
  description: 'Translucent bubbles',
  vertexSource: squareVert,
  fragmentSource: sh004,
  parameters: [],
})

import sh010 from 'shaders/raymarch-reflections4.frag'

addShader({
  name: 'Emissive gyroid',
  description: 'Work in progress',
  vertexSource: squareVert,
  fragmentSource: sh010,
  type: 'tex',
  parameters: [{ id: 'control1', label: 'Control1', default: 0.5 }],
  texture: { src: img001 },
  textureCube: {
    src: {
      posX: posX01,
      negX: negX01,
      posY: posY01,
      negY: negY01,
      posZ: posZ01,
      negZ: negZ01,
    },
  },
})

import sh011 from 'shaders/smoke-ball.frag'

addShader({
  name: 'Smoke ball',
  description: 'Volumetric ray march',
  vertexSource: squareVert,
  fragmentSource: sh011,
  parameters: [],
})

import sh013 from 'shaders/smoke-ball-lights.frag'

addShader({
  name: 'Smoke ball 2',
  description: 'With lights',
  vertexSource: squareVert,
  fragmentSource: sh013,
  parameters: [
    { id: 'control1', label: 'Control1', default: 0.5 },
    { id: 'control2', label: 'Control2', default: 0.5 },
    { id: 'control3', label: 'Control3', default: 0.5 },
    { id: 'control4', label: 'Control4', default: 0.5 },
    { id: 'control5', label: 'Control5', default: 0.5 },
    { id: 'control6', label: 'Control6', default: 0.5 },
    { id: 'control7', label: 'Control7', default: 0.5 },
    { id: 'control8', label: 'Control8', default: 0.5 },
  ],
})

import sh012 from 'shaders/sphere-fractal.frag'

addShader({
  name: 'Sphere fractal',
  description: 'Stolen from shadertoy',
  vertexSource: squareVert,
  fragmentSource: sh012,
  parameters: [
    { id: 'control1', label: 'Control1', default: 0.5 },
    { id: 'control2', label: 'Control2', default: 0.5 },
    { id: 'control3', label: 'Control3', default: 0.5 },
    { id: 'control4', label: 'Control4', default: 0.5 },
    { id: 'control5', label: 'Control5', default: 0.5 },
    { id: 'control6', label: 'Control6', default: 0.5 },
    { id: 'control7', label: 'Control7', default: 0.5 },
    { id: 'control8', label: 'Control8', default: 0.5 },
  ],
})

import fractal from 'shaders/fractal.frag'

addShader({
  name: 'Pillars',
  description: 'Infinite bars, simple raymarcher',
  vertexSource: squareVert,
  fragmentSource: fractal,
  parameters: [{ id: 'thick', label: 'Thickness', default: 0.2 }],
})

import sh007 from 'shaders/raymarch-reflections.frag'

addShader({
  name: 'Crazy reflections',
  description: '',
  vertexSource: squareVert,
  fragmentSource: sh007,
  parameters: [],
})

import sh014 from 'shaders/image-effect.frag'
import img002 from 'assets/bg.jpg'

addShader({
  name: 'Image effect',
  description: '',
  vertexSource: squareVert,
  fragmentSource: sh014,
  texture: { src: img002 },
  type: 'tex',
  parameters: [
    { id: 'control1', label: 'Control1', default: 0.5 },
    { id: 'control2', label: 'Control2', default: 0.5 },
    { id: 'control3', label: 'Control3', default: 0.5 },
    { id: 'control4', label: 'Control4', default: 0.5 },
    { id: 'control5', label: 'Control5', default: 0.5 },
    { id: 'control6', label: 'Control6', default: 0.5 },
    { id: 'control7', label: 'Control7', default: 0.5 },
    { id: 'control8', label: 'Control8', default: 0.5 },
  ],
})
