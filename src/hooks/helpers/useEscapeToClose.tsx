import { useEffect } from 'react'

interface UseEscapeToCloseOptions {
  isOpen: boolean
  onClose: () => void
  disabled?: boolean
}

export const useEscapeToClose = ({ isOpen, onClose, disabled = false }: UseEscapeToCloseOptions) => {
  useEffect(() => {
    if (disabled || !isOpen) {
      return
    }

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscKey)

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose, disabled])
}
