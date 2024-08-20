import { Contract } from '@ethersproject/contracts'
import { Trans } from '@lingui/macro'
import { ArrowSquareOut, HandWaving } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

import Divider from 'components/@ui/Divider'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DELAY_SYNC } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { COPY_WALLET_TRANS } from 'utils/config/translations'
import delay from 'utils/helpers/delay'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { getCopyTradePlatformChain } from 'utils/web3/dcp'

const CreateSmartWalletModal = ({
  isOpen,
  platform,
  onDismiss,
  onSuccess,
}: {
  isOpen: boolean
  platform: CopyTradePlatformEnum
  onDismiss: () => void
  onSuccess?: () => void
}) => {
  const chainId = getCopyTradePlatformChain(platform)
  const { isValid, alert } = useRequiredChain({
    chainId,
  })
  const { walletProvider, publicProvider, walletAccount } = useWeb3()
  const [submitting, setSubmitting] = useState(false)
  const factory = useMemo(
    () =>
      new Contract(
        CONTRACT_ADDRESSES[chainId][CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY],
        CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_COPYWALLET_FACTORY],
        walletProvider ? walletProvider.getSigner(walletAccount?.address).connectUnchecked() : publicProvider
      ),
    [walletAccount, walletProvider, publicProvider]
  )
  const factoryMutation = useContractMutation(factory)

  const createAccount = async () => {
    setSubmitting(true)
    await factoryMutation.mutate(
      {
        method: 'newCopyWallet',
        params: [CONTRACT_ADDRESSES[chainId][CONTRACT_QUERY_KEYS.EXECUTOR]],
      },
      {
        onSuccess: async () => {
          await delay(DELAY_SYNC)
          onDismiss()
          onSuccess?.()
          setSubmitting(false)
        },
        onError: () => setSubmitting(false),
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onDismiss={() => onDismiss()}>
      <Box sx={{ p: 3 }}>
        <Flex mb={2} sx={{ alignItems: 'center', gap: 2 }}>
          <IconBox color="primary1" icon={<HandWaving size={32} />} />
          <Type.Caption color="primary2">
            <Trans>Hi! Copier</Trans>
          </Type.Caption>
        </Flex>
        <Type.BodyBold mb={2}>
          <Trans>To start, you need to create a smart wallet.</Trans>
        </Type.BodyBold>
        <Type.Caption color="neutral2">
          <Trans>The process of creating a wallet is quick and only costs a small amount in gas fees.</Trans>
        </Type.Caption>
        <Divider my={20} />
        <Flex mb={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Type.CaptionBold>
            <Trans>What is smart wallet?</Trans>
          </Type.CaptionBold>
          <Flex as="a" href={'#'} target="_blank" sx={{ alignItems: 'center', gap: 2 }}>
            <Type.Caption>
              <Trans>View more</Trans>
            </Type.Caption>
            <IconBox icon={<ArrowSquareOut size={20} />} />
          </Flex>
        </Flex>
        <Type.Caption mb={20} color="neutral3">
          <Trans>
            Smart wallets are a unique Copin offering that allows copiers to copytrade at {COPY_WALLET_TRANS[platform]}{' '}
            platform.
          </Trans>
        </Type.Caption>
        {isValid ? (
          <Button variant="primary" block onClick={createAccount} isLoading={submitting} disabled={submitting}>
            <Trans>Create Smart Wallet</Trans>
          </Button>
        ) : (
          alert
        )}
      </Box>
    </Modal>
  )
}

export default CreateSmartWalletModal
