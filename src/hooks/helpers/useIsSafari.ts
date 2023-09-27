import { useMemo } from 'react'

const useIsSafari = () => {
  return useMemo(
    () =>
      /safari/i.test(navigator.userAgent) &&
      !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(navigator.userAgent),
    []
  )
}

export default useIsSafari
