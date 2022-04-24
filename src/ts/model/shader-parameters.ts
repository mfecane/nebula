interface IHash {
  [details: string]: number
}

const values: IHash = {}

export const getShaderParameter = (name: string): number => {
  return values[name] || 0
}

export const setShaderParameter = (name: string, value: number): void => {
  values[name] = value
}
