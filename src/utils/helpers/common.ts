export const compareTwoArrays = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return false

  const set1 = new Set(arr1)
  const set2 = new Set(arr2)

  if (set1.size !== set2.size) return false

  return [...set1].every((item) => set2.has(item))
}
