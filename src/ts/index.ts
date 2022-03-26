import { init, animate } from 'ts/components/render-texture2'

import 'css/config.scss'
import 'css/null.scss'
import 'css/global.scss'

let canvasContainer: HTMLDivElement

window.onload = () => {
  canvasContainer = document.getElementById('canvas-container')

  init(canvasContainer)
  animate()
}
