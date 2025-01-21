import { useResponsive } from 'ahooks'
import { useCallback } from 'react'

import useSearchParams from 'hooks/router/useSearchParams'
import { ELEMENT_IDS } from 'utils/config/keys'

export default function useLiteClickDepositFund() {
  const { setSearchParams } = useSearchParams()
  const { lg } = useResponsive()
  const handleClickDeposit = useCallback(() => {
    if (!lg) {
      setSearchParams({ dtab: '1' })
    } else {
      const element = document.getElementById(ELEMENT_IDS.LITE_DEPOSIT_QRCODE)
      if (!element) return
      element.removeAttribute('data-animation-shake')
      setTimeout(() => {
        element.setAttribute('data-animation-shake', '1')
      }, 100)
    }
  }, [lg, setSearchParams])
  return handleClickDeposit
}
