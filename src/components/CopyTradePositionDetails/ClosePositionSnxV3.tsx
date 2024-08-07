import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import React, { useEffect, useMemo, useState } from 'react'

import Num from 'entities/Num'
import { CopyPositionData } from 'entities/copyTrade'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { useSmartWalletContract, useSnxV3PerpsMarketContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useContractQuery from 'hooks/web3/useContractQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'
import { BASE_CHAIN } from 'utils/web3/chains'
import { calculateAcceptablePrice } from 'utils/web3/perps'

const ClosePositionSnxV3 = ({
  copyPosition,
  copyWalletId,
}: {
  copyPosition: CopyPositionData
  copyWalletId: string
}) => {
  const { walletProvider } = useWeb3()
  const { copyWallets } = useCopyWalletContext()
  const [opening, setOpening] = useState(false)
  const smartWallet = copyWallets?.find((wallet) => wallet.id === copyWalletId)?.smartWalletAddress
  return (
    <>
      <Button
        variant="outlineDanger"
        size="xs"
        disabled={!walletProvider || !smartWallet}
        onClick={() => setOpening(true)}
      >
        Close
      </Button>
      {!!walletProvider && !!smartWallet && (
        <ClosePositionModal
          isOpen={opening}
          onDismiss={() => setOpening(false)}
          copyPosition={copyPosition}
          smartWallet={smartWallet}
        />
      )}
    </>
  )
}

const ClosePositionHandler = ({
  copyPosition,
  smartWallet,
  onDismiss,
}: {
  copyPosition: CopyPositionData
  smartWallet: string
  onDismiss: () => void
}) => {
  // console.log('copyPosition', copyPosition)
  const [submitting, setSubmitting] = useState(false)
  const [fee, setFee] = useState<Num>()
  const smartWalletContract = useSmartWalletContract(smartWallet, true)
  const smartWalletMutation = useContractMutation(smartWalletContract)

  const marketContract = useSnxV3PerpsMarketContract(BASE_CHAIN, false)

  const marketId = useMemo(() => null, [copyPosition]) // TODO handle market id later

  const { data: openPosition } = useContractQuery<BigNumber[]>(smartWalletContract, 'getOpenPosition', [
    copyPosition.copyAccount,
    marketId,
  ])

  const accountId = openPosition ? openPosition[0] : null
  const closedSize = openPosition ? openPosition[1].mul(-1) : null

  const { data: orderFeeInfo } = useContractQuery<BigNumber[]>(
    marketContract,
    'computeOrderFees',
    [marketId, closedSize],
    {
      enabled: !!closedSize && !closedSize.isZero(),
    }
  )

  // const orderFee = useMemo(() => {
  //   if (!orderFeeInfo) return
  //   return new Num(orderFeeInfo[0])
  // }, [orderFeeInfo])

  const price = useMemo(() => {
    if (!orderFeeInfo || !closedSize) return
    const acceptablePrice = calculateAcceptablePrice(orderFeeInfo[1], closedSize.gt(0))
    return new Num(acceptablePrice)
  }, [orderFeeInfo, closedSize])

  useEffect(() => {
    if (!price || !accountId) return
    const simulate = async () => {
      const result: [BigNumber[], BigNumber] = await smartWalletContract.callStatic.closePosition(
        accountId,
        marketId,
        price.bn
      )
      if (result?.[1]) setFee(new Num(result[1]))
    }
    simulate()
  }, [accountId, marketId, price])

  const onConfirm = async () => {
    if (submitting || !price || !accountId) return
    setSubmitting(true)
    // const commands = [SmartWalletCommand.PERP_CLOSE_ORDER]
    // const inputs: any[] = [
    //   defaultAbiCoder.encode(
    //     ['address', 'uint256', 'uint256', 'address'],
    //     [copyPosition.copyAccount, marketId, price.bn, AddressZero]
    //   ),
    // ]

    // console.log('inputs', inputs)

    smartWalletMutation.mutate(
      // {
      //   method: 'execute',
      //   params: [commands, inputs],
      // },
      {
        method: 'closePosition',
        params: [accountId, marketId, price.bn],
      },
      {
        onSuccess: async () => {
          // await delay(DELAY_SYNC * 2)
          setSubmitting(false)
          onDismiss()
        },
        onError: () => {
          setSubmitting(false)
        },
      }
    )
  }
  return closedSize?.eq(0) ? (
    <Alert variant="primary" message="This position has been closed & waiting for sync" />
  ) : (
    <>
      <Flex flexDirection="column" alignItems="center" bg="neutral6" mb={3} p={12} sx={{ gap: 2 }}>
        <Box width="fit-content">
          <Type.CaptionBold width={180}>Acceptable Fill Price:</Type.CaptionBold>
          <Type.Caption width={90}>${formatNumber(price?.num)}</Type.Caption>
        </Box>
        {/* <Box width="fit-content">
          <Type.CaptionBold width={180}>Synthetix Order Fee:</Type.CaptionBold>
          <Type.Caption width={90}>${formatNumber(orderFee?.num)}</Type.Caption>
        </Box> */}
        <Box width="fit-content">
          <Type.CaptionBold width={180}>Synthetix Fee:</Type.CaptionBold>
          <Type.Caption width={90}>${formatNumber(fee?.num)}</Type.Caption>
        </Box>
      </Flex>

      <Flex sx={{ gap: 3 }}>
        <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} sx={{ flex: 1 }} disabled={submitting} isLoading={submitting}>
          Confirm
        </Button>
      </Flex>
    </>
  )
}

const ClosePositionModal = ({
  isOpen,
  onDismiss,
  copyPosition,
  smartWallet,
}: {
  isOpen: boolean
  onDismiss: () => void
  copyPosition: CopyPositionData
  smartWallet: string
}) => {
  const { isValid, alert } = useRequiredChain({
    chainId: BASE_CHAIN,
  })
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} hasClose title={<Trans>Manually Close Position</Trans>}>
      <Box p={3}>
        {isValid ? (
          <ClosePositionHandler copyPosition={copyPosition} smartWallet={smartWallet} onDismiss={onDismiss} />
        ) : (
          alert
        )}
      </Box>
    </Modal>
  )
}

export default ClosePositionSnxV3
