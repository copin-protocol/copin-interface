import { RefObject, useEffect, useState } from 'react'

export default function useVisibleOnView({ targetRef }: { targetRef: RefObject<HTMLDivElement> }) {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    // If disabled, always show the content

    const currentRef = targetRef.current
    if (!currentRef) return

    // Create an Intersection Observer instance with TypeScript types
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        // Update state when intersection status changes
        if (entry.isIntersecting) {
          // React 18 uses automatic batching, so these will be batched
          setIsVisible(true)

          // Once visible, no need to observe anymore
          observer.unobserve(currentRef)
        }
      }
      // {
      //   threshold: 0.1,
      //   rootMargin: '0px',
      // }
    )

    // Start observing the target element
    observer.observe(currentRef)

    // Cleanup function
    return () => {
      observer.disconnect()
    }
  }, [])
  return { isVisible, setIsVisible }
}
