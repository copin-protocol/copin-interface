import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { parseEther } from 'ethers/lib/utils'
import React, { useMemo, useState } from 'react'

import Num from 'entities/Num'
import { CopyPositionData } from 'entities/copyTrade'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { useContract, useSmartWalletContract, useSnxV2PerpsMarketContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useContractQuery from 'hooks/web3/useContractQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { DELAY_SYNC } from 'utils/config/constants'
import { SmartWalletCommand } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import delay from 'utils/helpers/delay'
import { formatNumber } from 'utils/helpers/format'
import { OPTIMISM_CHAIN } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { calculateAcceptablePrice } from 'utils/web3/perps'

const ClosePositionSnxV2 = ({
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
  const smartWalletContract = useSmartWalletContract(smartWallet, true)
  const smartWalletMutation = useContractMutation(smartWalletContract)

  // const market =
  //   DEFAULT_CHAIN_ID === OPTIMISM_MAINNET ? copyPosition.indexToken : MARKET_SYNTHETIX[copyPosition.indexToken].testnet

  const market = copyPosition.indexToken

  const marketContract = useSnxV2PerpsMarketContract(market ?? '', false)

  const marketSettingsContract = useContract({
    contract: {
      address: CONTRACT_ADDRESSES[OPTIMISM_CHAIN][CONTRACT_QUERY_KEYS.SNX_PERPS_MARKET_V2_SETTINGS],
      abi: [
        {
          constant: true,
          inputs: [],
          name: 'minKeeperFee',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ],
    },
    withSignerIfPossible: false,
  })

  const sizeDelta = parseEther((copyPosition.sizeDelta ?? 0).toString()).mul(-1)

  const { data: priceInfo } = useContractQuery<BigNumber[]>(marketContract, 'assetPrice', [])
  const { data: minKeeperFee } = useContractQuery<BigNumber>(marketSettingsContract, 'minKeeperFee', [])
  const { data: orderFeeInfo } = useContractQuery<BigNumber[]>(marketContract, 'orderFee', [sizeDelta, 2])

  const { data: positions, refetch: refetchPosition } = useContractQuery<BigNumber[]>(marketContract, 'positions', [
    smartWallet,
  ])

  // console.log('positions', positions)

  const price = useMemo(() => {
    if (!priceInfo) return

    const desiredFillPrice = calculateAcceptablePrice(priceInfo[0], !copyPosition.isLong)
    return new Num(desiredFillPrice)
  }, [priceInfo, sizeDelta])

  const keeperDepositFee = useMemo(() => {
    if (!minKeeperFee) return
    return new Num(minKeeperFee)
  }, [minKeeperFee])

  const orderFee = useMemo(() => {
    if (!orderFeeInfo) return
    return new Num(orderFeeInfo[0])
  }, [orderFeeInfo])

  const onConfirm = async () => {
    if (submitting || !price) return
    setSubmitting(true)
    const commands = [SmartWalletCommand.PERP_CLOSE_ORDER]
    const inputs: any[] = [
      defaultAbiCoder.encode(['address', 'address', 'uint256'], [copyPosition.copyAccount, market, price.bn]),
    ]

    const delayedOrder: BigNumber[] = await marketContract.delayedOrders(smartWallet)

    // console.log(delayedOrder)
    if (!delayedOrder[1].eq(0)) {
      commands.unshift(SmartWalletCommand.PERP_CANCEL_ORDER)
      inputs.unshift(defaultAbiCoder.encode(['address'], [market]))
    }
    smartWalletMutation.mutate(
      {
        method: 'execute',
        params: [commands, inputs],
        // gasLimit: 2500000,
      },
      {
        onSuccess: async () => {
          await delay(DELAY_SYNC * 2)
          setSubmitting(false)
          refetchPosition()
          onDismiss()
        },
        onError: () => {
          setSubmitting(false)
        },
      }
    )
  }

  return positions?.[4].eq(0) ? (
    <Alert variant="primary" message="This position has been closed & waiting for sync" />
  ) : (
    <>
      <Flex flexDirection="column" alignItems="center" bg="neutral6" mb={3} p={12} sx={{ gap: 2 }}>
        <Box width="fit-content">
          <Type.CaptionBold width={180}>Acceptable Fill Price:</Type.CaptionBold>
          <Type.Caption width={90}>${formatNumber(price?.num)}</Type.Caption>
        </Box>
        <Box width="fit-content">
          <Type.CaptionBold width={180}>Synthetix Execution Fee:</Type.CaptionBold>
          <Type.Caption width={90}>${formatNumber(keeperDepositFee?.num)}</Type.Caption>
        </Box>
        <Box width="fit-content">
          <Type.CaptionBold width={180}>Synthetix Order Fee:</Type.CaptionBold>
          <Type.Caption width={90}>${formatNumber(orderFee?.num)}</Type.Caption>
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
    chainId: OPTIMISM_CHAIN,
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

export default ClosePositionSnxV2
