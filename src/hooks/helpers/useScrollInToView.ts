import { useRef } from 'react'

export default function useScrollInToView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const handleScroll = () => {
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ block: 'start' })
    }, 100)
  }
  return { viewRef: containerRef, handleScroll }
}
