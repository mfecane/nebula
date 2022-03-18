type Color = [number, number, number]

export const hexToRgb = function (hex: string): Color {
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return [r, g, b]
}

export const rgbToHex = function (r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export const hslToRgb = function (
  h: number,
  s: number,
  l: number
): Color {
  let r: number
  let g: number
  let b: number

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

export const rgbToHsl = function (
  r: number,
  g: number,
  b: number
): Color {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number
  let s: number
  const l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, l]
}

export const blendHslColors = function (
  c1: Color,
  c2: Color,
  v: number
): Color {
  let h
  if (Math.abs(c1[0] - c2[0]) > 0.5) {
    h =
      c1[0] < c2[0]
        ? (c1[0] + 1) * v + c2[0] * (1 - v)
        : c1[0] * v + (c2[0] + 1) * (1 - v)
  } else {
    h = c1[0] * v + c2[0] * (1 - v)
  }
  h = h - Math.floor(h)
  return [h, c1[1] * v + c2[1] * (1 - v), c1[2] * v + c2[2] * (1 - v)]
}

export const blendHslColorsArr = function (
  arr: Array<Color>,
  v: number,
  max: number
): Color {
  const index = Math.floor((v / max) * (arr.length - 1))
  const rest = (v / max) * (arr.length - 1) - index
  // console.log(index)
  return blendHslColors(arr[index], arr[index + 1], rest)
}
