import { Contract } from '@ethersproject/contracts'
import { Trans } from '@lingui/macro'
import { ArrowSquareOut, HandWaving } from '@phosphor-icons/react'
import React, { useMemo, useState } from 'react'

import Divider from 'components/@ui/Divider'
import { useAuthContext } from 'hooks/web3/useAuth'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DELAY_SYNC, LINKS } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { COPY_WALLET_TRANS } from 'utils/config/translations'
import { Z_INDEX } from 'utils/config/zIndex'
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
  const { profile, handleSwitchAccount } = useAuthContext()
  const [submitting, setSubmitting] = useState(false)
  const [agreement, setAgreement] = useState(false)
  const [trigger, setTrigger] = useState(false)

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

  const isInvalidAccount = profile?.username?.toLowerCase() !== walletAccount?.address?.toLowerCase()

  const createAccount = async () => {
    setTrigger(true)
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
    <Modal isOpen={isOpen} onDismiss={() => onDismiss()} zIndex={Z_INDEX.TOASTIFY}>
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

        <Box mb={3}>
          <Checkbox
            onChange={(e) => {
              setAgreement(e.target.checked)
              setTrigger(true)
            }}
          >
            <Type.Caption>
              I have read and I agree to the{' '}
              <a href={LINKS.termOfUse} target="_blank" rel="noreferrer">
                Terms
              </a>{' '}
              &{' '}
              <a href={LINKS.riskDisclaimer} target="_blank" rel="noreferrer">
                Risk Disclaimer
              </a>
            </Type.Caption>
          </Checkbox>
          {trigger && !agreement && (
            <Type.Caption color="red1" display="block" mt={1}>
              You must agree to the agreement before continuing
            </Type.Caption>
          )}
        </Box>
        {isValid ? (
          isInvalidAccount ? (
            <Button variant="primary" block onClick={handleSwitchAccount}>
              <Trans>Switch Account</Trans>
            </Button>
          ) : (
            <Button
              variant="primary"
              block
              onClick={createAccount}
              isLoading={submitting}
              disabled={submitting || !agreement}
            >
              <Trans>Create Smart Wallet</Trans>
            </Button>
          )
        ) : (
          alert
        )}
      </Box>
    </Modal>
  )
}

export default CreateSmartWalletModal
