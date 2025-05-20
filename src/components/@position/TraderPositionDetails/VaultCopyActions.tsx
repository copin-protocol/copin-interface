import { formatUnits, parseUnits } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { manualOpenDcpPositionApi } from 'apis/dcpPositionApis'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import ToastBody from 'components/@ui/ToastBody'
import { CopyTradeData } from 'entities/copyTrade'
import { PositionData } from 'entities/trader'
import useVaultCopyTrades from 'hooks/features/copyTrade/useVaultCopyTrades'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { useAuthContext } from 'hooks/web3/useAuth'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { DELAY_SYNC } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'
import delay from 'utils/helpers/delay'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { calculateAcceptablePrice } from 'utils/web3/perps'
import { signOpenPosition } from 'utils/web3/wallet'

import VaultTradeDataTable from './VaultCopyTradeTable'

export default function VaultCopyActions({ data }: { data: PositionData }) {
  const history = useHistory()
  const { account } = useAuthContext()
  const { walletProvider } = useWeb3()
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: data.protocol })

  const { allVaultCopyTrades, isLoading } = useVaultCopyTrades()
  const filterCopyTrades = allVaultCopyTrades?.filter(
    (trade) => (trade.account === data.account || trade?.accounts?.includes(data.account)) && trade.status === 'RUNNING'
  )
  const [openQuickCopy, setOpenQuickCopy] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [acceptablePrice, setAcceptablePrice] = useState<number | undefined>()

  const { isValid, alert } = useRequiredChain({
    chainId: ARBITRUM_CHAIN,
  })

  const { getSymbolByIndexToken } = useMarketsConfig()
  const symbol = getSymbolByIndexToken?.({ indexToken: data.indexToken })

  useEffect(() => {
    if (!symbol) return
    const price = prices[symbol]
    if (!!price) {
      const _acceptablePrice = calculateAcceptablePrice(parseUnits(price.toFixed(10), 10), !data.isLong)
      setAcceptablePrice(Number(formatUnits(_acceptablePrice, 10)))
    }
  }, [symbol, data.isLong, prices])

  const manualOpenMutation = useMutation(manualOpenDcpPositionApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    async onSuccess() {
      await delay(DELAY_SYNC * 6)
      toast.success(<ToastBody title="Success" message="Your position has been opened" />)
      setOpenQuickCopy(false)
      history.push(ROUTES.USER_VAULT_MANAGEMENT.path)
    },
    onError() {
      toast.error(<ToastBody title="Error" message="Something went wrong. Please try later." />)
    },
  })

  const onConfirm = async (currentCopyTrade: CopyTradeData) => {
    if (submitting || !account || !walletProvider || !symbol) return
    const price = prices[symbol]
    if (price == null) {
      toast.error(<ToastBody title="Fetch price error" message="Can't find the price of this token" />)
      return
    }
    setSubmitting(true)
    const _acceptablePrice = calculateAcceptablePrice(parseUnits(price.toFixed(10), 10), !data.isLong)
    if (data.id) {
      signOpenPosition(account, currentCopyTrade.id, data.id, _acceptablePrice.toString(), walletProvider)
        .then((signature) => {
          if (!signature) {
            setSubmitting(false)
            toast.error(<ToastBody title="Error" message="Can't sign message to open position" />)
            return
          }
          manualOpenMutation.mutate({
            protocol: data.protocol,
            copyTradeId: currentCopyTrade.id,
            positionId: data.id,
            acceptablePrice: _acceptablePrice.toString(),
            signature,
          })
        })
        .catch((error) => {
          if (error.code === 4001) {
            toast.error(<ToastBody title="Error" message="User denied transaction signature" />)
          } else {
            toast.error(<ToastBody title="Error" message="Can't sign message to open position" />)
          }
          setSubmitting(false)
        })
    } else {
      toast.error(<ToastBody title="Error" message="Can't sign message to open position" />)
    }
  }

  return (
    <Box>
      <Dropdown
        menuSx={{
          width: [300, 400],
          bg: 'neutral5',
        }}
        hasArrow={true}
        dismissible={false}
        visible={openQuickCopy}
        setVisible={setOpenQuickCopy}
        menu={
          <Box>
            {isValid ? (
              <Flex flexDirection="column" sx={{ gap: 1 }}>
                <Flex pt={2} px={2} alignItems="center" sx={{ gap: 2 }}>
                  <Type.Caption color="neutral2">
                    <Trans>Acceptable Price:</Trans>{' '}
                  </Type.Caption>
                  {PriceTokenText({
                    value: acceptablePrice,
                    maxDigit: 2,
                    minDigit: 2,
                  })}
                </Flex>
                <Type.Caption px={2} color="neutral2">
                  <Trans>Select the copy you want to open:</Trans>
                </Type.Caption>
                {!!filterCopyTrades?.length && (
                  <VaultTradeDataTable
                    data={filterCopyTrades}
                    isLoading={isLoading}
                    submitting={submitting}
                    onPick={onConfirm}
                  />
                )}
              </Flex>
            ) : (
              <Box p={3}>{alert}</Box>
            )}
          </Box>
        }
        sx={{ height: '100%', justifyContent: 'center' }}
        buttonSx={{
          border: 'none',
          height: '100%',
          p: 0,
          ':hover': {
            filter: 'brightness(140%)',
          },
        }}
        iconColor="primary1"
        iconSize={12}
      >
        <Type.Caption color="neutral1">Quick Copy</Type.Caption>
      </Dropdown>
    </Box>
  )
}
