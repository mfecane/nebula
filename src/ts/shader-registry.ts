import squareVert from 'shaders/nebula.vert'
import raymarchGeo from 'shaders/raymarch-geo.frag'
const shaderList = []

const addShader = (sh) => {
  shaderList.push({ ...sh, id: shaderList.length + 1 })
}

export const getShaderList = () => {
  return shaderList
}

addShader({
  name: 'Burning filament strings',
  description: '',
  vertexSource: squareVert,
  fragmentSource: raymarchGeo,
  parameters: [
    { id: 'spiraNoise', label: 'Spiral noise', default: 0.5 },
    { id: 'gyroidOffset', label: 'Gyroid offset', default: 0.5 },
    { id: 'pixelate', label: 'Pixelate', default: 0.5 },
  ],
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

import fractal from 'shaders/fractal.frag'

addShader({
  name: 'Pillars',
  description: 'Simple raymarcher',
  vertexSource: squareVert,
  fragmentSource: fractal,
  parameters: [{ id: 'thick', label: 'Thickness', default: 0.2 }],
})

import nebulaPlane from 'shaders/nebula-plane.frag'

addShader({
  name: 'Twisted mess',
  description: 'nebulaPlane',
  vertexSource: squareVert,
  fragmentSource: nebulaPlane,
  parameters: [],
})

import fads7fa7 from 'shaders/string-gyroid.frag'

addShader({
  name: 'String gyroid',
  description: '',
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
  description: 'Basic raymarcher',
  vertexSource: squareVert,
  fragmentSource: sh003,
  parameters: [
    { id: 'control3', label: 'Volume', default: 0.5 },
    { id: 'control4', label: 'Volume2', default: 0.5 },
    { id: 'control1', label: 'Volume3', default: 0.5 },
    { id: 'control5', label: 'Light', default: 0.5 },
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

import sh005 from 'shaders/nebula-3.frag'
import sh006 from 'shaders/background2.frag'

addShader({
  name: 'Nebula with bg',
  description: 'Caution! Heavy.',
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

import sh007 from 'shaders/raymarch-reflections.frag'

addShader({
  name: 'Raymarch with reflections',
  description: '',
  vertexSource: squareVert,
  fragmentSource: sh007,
  parameters: [],
})
