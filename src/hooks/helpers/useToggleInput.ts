import { useCallback, useEffect, useState } from 'react'

interface ToggleInputProps {
  defaultActive?: boolean
  onChange?: (value: boolean) => void
  isManual?: boolean
}

const useToggleInput = ({ defaultActive, onChange, isManual = false }: ToggleInputProps) => {
  const [active, setActive] = useState(defaultActive ?? false)
  const [defaultIsActive, setDefaultActive] = useState(defaultActive)

  useEffect(() => {
    if (defaultIsActive === defaultActive) return
    if (defaultActive !== undefined) {
      setActive(defaultActive)
      setDefaultActive(defaultActive)
    }
  }, [defaultActive, defaultIsActive])

  const toggleActive = useCallback(
    (value?: boolean) => {
      if (!isManual) {
        if (value === active) return
        if (onChange) onChange(value ?? !active)
        setActive(value ?? !active)
        return
      }
      if (onChange) onChange(value ?? !active)
      setActive(value ?? !active)
      return
    },
    [onChange, active, isManual]
  )
  return { active, toggleActive }
}

export default useToggleInput
