import { useEffect, useState } from 'react'

import { checkUserApproveBuilderFees } from 'apis/hyperliquid'

import useCopyWalletContext from './useCopyWalletContext'

const useCheckHyperliquidBuilderFees = ({ enable = true, apiKey }: { enable?: boolean; apiKey?: string }) => {
  const { hlWallets } = useCopyWalletContext()
  const [isValidFees, setIsValidFees] = useState<boolean>(true)

  const checkFees = async (key: string) => {
    const data = await checkUserApproveBuilderFees(key)
    if (data !== 100) {
      setIsValidFees(false)
    }
  }

  useEffect(() => {
    if (!enable) return

    const checkAllFees = async () => {
      if (apiKey) {
        await checkFees(apiKey)
        return
      }

      if (!hlWallets || hlWallets.length === 0) return

      for (const wallet of hlWallets) {
        if (wallet.hyperliquid?.apiKey) {
          await checkFees(wallet.hyperliquid.apiKey)
        }
      }
    }

    checkAllFees()
  }, [apiKey, enable, hlWallets])

  return { isValidFees }
}

export default useCheckHyperliquidBuilderFees
