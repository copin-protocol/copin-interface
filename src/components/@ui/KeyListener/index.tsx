import { useEffect } from 'react'

import { KeyNameEnum } from 'utils/config/enums'

export default function KeyListener({ keyName, onFire }: { keyName?: KeyNameEnum; onFire?: () => void }) {
  useEffect(() => {
    if (!keyName || !onFire) return
    const handleKeyEvent = (event: any) => {
      if (event.key === keyName) {
        onFire()
      }
    }
    window.addEventListener('keydown', handleKeyEvent)

    return () => {
      window.removeEventListener('keydown', handleKeyEvent)
    }
  }, [keyName, onFire])

  return <></>
}
