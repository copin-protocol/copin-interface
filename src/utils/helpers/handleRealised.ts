import { capitalizeFirstLetter, lowerFirstLetter } from './transform'

export const encodeRealised = (key: string, keys: string[]) => {
  let normalizedKey = key
  if (keys.includes(key)) {
    normalizedKey = 'realised' + capitalizeFirstLetter(normalizedKey)
  }
  return normalizedKey
}

export const decodeRealised = (key: string): string => {
  let normalizedKey = key
  if (key.includes('realised')) {
    normalizedKey = key.replace('realised', '')
    normalizedKey = lowerFirstLetter(normalizedKey)
  }
  return normalizedKey
}

export const encodeRealisedData = (obj: { [key: string]: number }, keys: string[]) => {
  return Object.entries(obj)
    .map(([key, value]) => {
      return { key: encodeRealised(key, keys), value }
    })
    .reduce((prev, cur) => ({ ...prev, [cur.key]: cur.value }), {})
}
export const decodeRealisedData = (obj: { [key: string]: number }): { [key: string]: number } => {
  return Object.entries(obj)
    .map(([key, value]) => {
      return { key: decodeRealised(key), value }
    })
    .reduce((prev, cur) => ({ ...prev, [cur.key]: cur.value }), {})
}
