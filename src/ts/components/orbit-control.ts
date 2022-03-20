let mouseDown
let mouseXprev = 0
let mouseYprev = 0
let mouseX = 0
let mouseY = 0
let speedX = 0
let speedY = 0

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

export const getMouseControl = function (): [number, number] {
  return [mouseX, mouseY]
}

export const init = function (): void {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mouseup', handleMouseUp)
}

export const animate = function (): void {
  handleMouse()
  requestAnimationFrame(animate)
}
