import { useMemo } from 'react'

import { HlAccountVaultData } from 'entities/hyperliquid'

const useHyperliquidVaultEquities = ({ hlAccountVaultData }: { hlAccountVaultData?: HlAccountVaultData[] }) => {
  return useMemo(() => {
    if (!hlAccountVaultData?.length) return 0

    return hlAccountVaultData.reduce((sum, current) => sum + Number(current.equity), 0)
  }, [hlAccountVaultData])
}

export default useHyperliquidVaultEquities
