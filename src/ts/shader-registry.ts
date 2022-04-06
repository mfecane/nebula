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
  name: 'Stars shader v0.1',
  description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
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
