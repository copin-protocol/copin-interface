type DifferenceResult<T, U> = {
  [K in keyof (T & U)]?: {
    obj1Value: K extends keyof T ? T[K] : undefined
    obj2Value: K extends keyof U ? U[K] : undefined
  }
}

/**
 * Compares two objects and returns an object containing their differences
 * @param obj1 - First object to compare
 * @param obj2 - Second object to compare
 * @returns Object containing the differences between obj1 and obj2
 */
export function findObjectDifferences<T extends object, U extends object>(obj1: T, obj2: U): DifferenceResult<T, U> {
  const differences: DifferenceResult<T, U> = {}

  // Helper function to recursively track differences
  function trackDifferences(val1: any, val2: any, path = ''): void {
    // Check if values are exactly the same
    if (val1 === val2) return

    // Handle arrays
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) {
        ;(differences as any)[path] = {
          obj1Value: val1,
          obj2Value: val2,
        }
        return
      }

      // Compare each array element
      val1.forEach((item, index) => {
        trackDifferences(item, val2[index], path ? `${path}[${index}]` : `[${index}]`)
      })
      return
    }

    // Handle objects
    if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
      // Get keys from both objects
      const keys1 = Object.keys(val1)
      const keys2 = Object.keys(val2)

      // Check for keys in obj1 not in obj2
      keys1.forEach((key) => {
        const newPath = path ? `${path}.${key}` : key

        if (!keys2.includes(key)) {
          ;(differences as any)[newPath] = {
            obj1Value: val1[key],
            obj2Value: undefined,
          }
          return
        }

        // Recursively check nested objects
        trackDifferences(val1[key], val2[key], newPath)
      })

      // Check for keys in obj2 not in obj1
      keys2.forEach((key) => {
        const newPath = path ? `${path}.${key}` : key

        if (!keys1.includes(key)) {
          ;(differences as any)[newPath] = {
            obj1Value: undefined,
            obj2Value: val2[key],
          }
        }
      })

      return
    }

    // For primitive types and other cases, record the difference
    ;(differences as any)[path] = {
      obj1Value: val1,
      obj2Value: val2,
    }
  }

  // Start the comparison
  trackDifferences(obj1, obj2)

  return differences
}
