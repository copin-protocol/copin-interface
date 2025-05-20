export default function reorderArray<T = Record<string, any>>({
  source,
  target,
  getValue,
}: {
  source: string[] | undefined
  target: T[]
  getValue: (data: T) => any
}) {
  if (source == null) return target
  return [...target].sort((a, b) => {
    const aInArray1 = source.includes(getValue(a))
    const bInArray1 = source.includes(getValue(b))

    if (aInArray1 && !bInArray1) {
      return -1 // a comes before b
    } else if (!aInArray1 && bInArray1) {
      return 1 // b comes before a
    }
    return 0 // maintain original order when both are in or both are not in array1
  })
}
