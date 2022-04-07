import { easeOutCubic } from 'ts/lib/easing-functions'

let mouseDown
let mouseXprev = 0
let mouseYprev = 0
let mouseX = 0
let mouseY = 0
let speedX = 0
let speedY = 0

let scrollValue = 1
let scrollValueMin = 0
let scrollValueMax = 1
let scrollStep = 0.125
let scrollSpeed = 0

let inited = false

let targetScrollValue = 1

const handleMouseDown = function (e: MouseEvent) {
  mouseDown = true
  mouseXprev = e.screenX
  mouseYprev = e.screenY
}

const handleMouseUp = function () {
  mouseDown = false
}

const handleMouseMove = function (e: MouseEvent) {
  if (mouseDown) {
    const speedFactor = 0.01

    speedX += (e.screenX - mouseXprev) * speedFactor
    speedY += (e.screenY - mouseYprev) * speedFactor

    mouseXprev = e.screenX
    mouseYprev = e.screenY
  }
}

const updateSpeed = function (speed: number) {
  const dampeningFactor = 0.01
  if (Math.abs(speed) > 0.1) {
    return (speed *= 1 - dampeningFactor)
  }
  return 0
}

const handleMouse = function () {
  if (!mouseDown) {
    speedX = updateSpeed(speedX)
    speedY = updateSpeed(speedY)
  }

  mouseX += speedX
  mouseY += speedY

  if (mouseX < -2000) mouseX = -2000
  if (mouseX > 2000) mouseX = 2000

  if (mouseY < -2000) mouseY = -2000
  if (mouseY > 2000) mouseY = 2000
}

const handleScroll = function (e) {
  const value = e.deltaY
  if (value > 0 && targetScrollValue < scrollValueMax) {
    targetScrollValue += scrollStep
  } else if (value < 0 && targetScrollValue > scrollValueMin) {
    targetScrollValue -= scrollStep
  }
}

const updateScroll = function () {
  if (Math.abs(scrollValue - targetScrollValue) < 0.01) {
    scrollSpeed = 0
    return
  }

  const frictionCoefficient = 0.001
  const accel =
    (targetScrollValue - scrollValue) * frictionCoefficient - scrollSpeed * 0.08

  scrollSpeed += accel
  scrollValue += scrollSpeed
}

export const getMouseControl = function (): [number, number, number] {
  return [mouseX, mouseY, scrollValue]
}

export const init = function (): void {
  if (!inited) {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('wheel', handleScroll)
  }
}

export const animate = function (): void {
  handleMouse()
  updateScroll()
  requestAnimationFrame(animate)
}
