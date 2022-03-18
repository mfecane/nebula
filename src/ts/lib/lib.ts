export function mapclamp(
  x: number,
  in_start: number,
  in_end: number,
  out_start: number,
  out_end: number
): number {
  x = x === undefined ? in_end : x
  x = x > in_end ? in_end : x
  x = x < in_start ? in_start : x
  return mapplain(x, in_start, in_end, out_start, out_end)
}

export function mapplain(
  x: number,
  in_start: number,
  in_end: number,
  out_start: number,
  out_end: number
): number {
  let out =
    out_start + ((out_end - out_start) / (in_end - in_start)) * (x - in_start)
  return out
}

export function map01(x: number, min: number, max: number): number {
  return min + x * (max - min)
}

export function hexToRgb(hex: string): string {
  var bigint = parseInt(hex, 16)
  var r = (bigint >> 16) & 255
  var g = (bigint >> 8) & 255
  var b = bigint & 255

  return r + ',' + g + ',' + b
}

export function dist(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}
