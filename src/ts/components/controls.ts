let control1: HTMLInputElement
let control2: HTMLInputElement
let control3: HTMLInputElement
let control4: HTMLInputElement
let control5: HTMLInputElement
let controls: HTMLElement
const values: number[] = [50, 50, 50, 50, 50]

const handleInput = function (index: number, e: InputEvent): void {
  values[index] = e.target.value
  e.stopPropagation()
}

export const getValue = function (index: number): number {
  return values[index]
}

export const init = function (): void {
  control1 = document.getElementById('sliderValue1')
  control2 = document.getElementById('sliderValue2')
  control3 = document.getElementById('sliderValue3')
  control4 = document.getElementById('sliderValue4')
  control5 = document.getElementById('sliderValue5')

  controls = document.querySelector('.controls')
  controls.addEventListener('mousedown', (e) => {
    e.stopPropagation()
  })

  control1.addEventListener('input', handleInput.bind(null, 1))
  control2.addEventListener('input', handleInput.bind(null, 2))
  control3.addEventListener('input', handleInput.bind(null, 3))
  control4.addEventListener('input', handleInput.bind(null, 4))
  control5.addEventListener('input', handleInput.bind(null, 5))
}
