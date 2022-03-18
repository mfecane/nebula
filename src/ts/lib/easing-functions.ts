export function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

export function easeInCubic(x: number): number {
  return Math.pow(x, 3)
}

export function easeOutSquare(x: number): number {
  return 1 - Math.pow(1 - x, 2)
}

export function easeInSquare(x: number): number {
  return Math.pow(x, 2)
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}

export function easeOutBack(x: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
