import { RefObject, useEffect } from 'react'

type Event = MouseEvent | TouchEvent

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: (event: Event) => void) => {
  useEffect(
    () => {
      const listener = (event: Event) => {
        const el = ref?.current
        if (!el || el.contains((event?.target as Node) || null)) {
          return
        }

        handler(event) // Call the handler only if the click is outside of the element passed.
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hooks.
    [ref, handler]
  )
}

export default useOnClickOutside
