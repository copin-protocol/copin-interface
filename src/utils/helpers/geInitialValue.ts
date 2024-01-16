import { ParsedQs } from 'qs'

export const getInitNumberValue = (searchParams: ParsedQs, key: string, defaultValue?: number) => {
  const value = searchParams[key] as string
  if (!value) return defaultValue ?? 0
  const parsedNumber = Number(value)
  if (isNaN(parsedNumber)) return defaultValue ?? 0
  return parsedNumber
}
