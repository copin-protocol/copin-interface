import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import Container from 'components/@ui/Container'
import { useSmartWalletContract } from 'hooks/web3/useContract'
import useContractQuery from 'hooks/web3/useContractQuery'
import useMulticallQuery from 'hooks/web3/useMulticallQuery'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import { Type } from 'theme/base'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { SYNTHETIX_V3_MARKET_IDS } from 'utils/config/trades'
import { BASE_CHAIN } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'

const markets = Object.entries(SYNTHETIX_V3_MARKET_IDS).map(([k, v]: [string, number]) => ({
  id: v,
  symbol: k,
}))

export default function OnchainPositionsDrawer({
  isOpen,
  onDismiss,
  smartWalletAddress,
}: {
  isOpen: boolean
  onDismiss: () => void
  smartWalletAddress: string
}) {
  const { lg, md } = useResponsive()
  const smartWalletContract = useSmartWalletContract(smartWalletAddress, true)

  const { data: numOfAccounts } = useContractQuery<BigNumber, any, number | undefined>(
    smartWalletContract,
    'numOfAccounts',
    [],
    {
      select: (data) => (data ? data.toNumber() : undefined),
    }
  )
  const { data: accounts } = useMulticallQuery<BigNumber[][]>(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_COPYWALLET],
    Array(numOfAccounts)
      .fill(1)
      .map((e, i) => ({
        address: smartWalletAddress,
        name: 'accountIds',
        params: [i],
      })),
    BASE_CHAIN,
    {
      enabled: !!numOfAccounts,
    }
  )
  const arr = (accounts ?? [])
    .map((account) =>
      markets.map((m) => ({
        ...m,
        account: account[0],
      }))
    )
    .flat()

  const { data: openPositions } = useMulticallQuery(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V3],
    arr.map((e) => ({
      address: CONTRACT_ADDRESSES[BASE_CHAIN][CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V3],
      name: 'getOpenPosition',
      params: [e.account, e.id],
    })),
    BASE_CHAIN,
    {
      enabled: !!accounts,
    }
  )

  return (
    <Drawer
      isOpen={isOpen}
      onDismiss={onDismiss}
      mode="right"
      size={lg ? '60%' : md ? '80%' : '100%'}
      background="neutral5"
    >
      <Container p={3} sx={{ position: 'relative', height: '100%' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
          onClick={onDismiss}
        />
        <Type.H5>
          <Trans>Onchain Positions</Trans>
        </Type.H5>
      </Container>
    </Drawer>
  )
}
