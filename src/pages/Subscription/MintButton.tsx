/* eslint-disable react/jsx-key */
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { Warning } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'
import styled from 'styled-components/macro'

import Divider from 'components/@ui/Divider'
import ETHPriceInUSD from 'components/ETHPriceInUSD'
import { useClickLoginButton } from 'components/LoginAction'
import useSubscriptionContract from 'hooks/features/useSubscriptionContract'
import { useAuthContext } from 'hooks/web3/useAuth'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { GOERLI } from 'utils/web3/chains'

import CopinIcon from './CopinIcon'

export default function MintButton({
  planPrice,
  buttonType = 'gradient',
  buttonSx,
  buttonText = <Trans>Mint NFT</Trans>,
}: {
  planPrice: BigNumber | undefined
  buttonType?: 'primary' | 'gradient'
  buttonSx?: any
  buttonText?: ReactNode
}) {
  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    setOpenModal(true)
  }
  const handleDismiss = () => setOpenModal(false)

  return (
    <>
      <StyledButton
        variant={buttonType === 'primary' ? 'primary' : undefined}
        sx={{
          width: ['100%', 246],
          height: 48,
          position: 'relative',
          // overflow: 'hidden',
          ...(buttonType === 'gradient'
            ? {
                borderRadius: '4px',
                '&:hover': {
                  '.light': {
                    width: 240,
                  },
                },
              }
            : {}),
          ...(buttonSx ?? {}),
        }}
        onClick={handleOpenModal}
      >
        {buttonType === 'gradient' && <Decorators />}
        <Type.BodyBold color={buttonType === 'gradient' ? 'neutral1' : 'neutral8'} sx={{ position: 'relative' }}>
          {buttonText}
        </Type.BodyBold>
      </StyledButton>
      <MintModal isOpen={openModal} onDismiss={handleDismiss} planPrice={planPrice} />
    </>
  )
}

const MINT_DURATION = 1 // month
const MINT_TIER = 1 // premium

function MintModal({
  isOpen,
  onDismiss,
  planPrice,
}: {
  isOpen: boolean
  onDismiss: () => void
  planPrice: BigNumber | undefined
}) {
  const { isValid, alert } = useRequiredChain({ chainId: GOERLI })
  const subscriptionContract = useSubscriptionContract()
  const subscriptionMutation = useContractMutation(subscriptionContract)
  const [submitting, setSubmitting] = useState(false)

  const handleMint = () => {
    setSubmitting(true)
    subscriptionMutation.mutate(
      { method: 'mint', params: [MINT_TIER, MINT_DURATION], value: planPrice },
      {
        onSuccess: async () => {
          onDismiss()
          setSubmitting(false)
        },
        onError: () => setSubmitting(false),
      }
    )
  }
  return (
    <Modal
      isOpen={isOpen}
      title={<Trans>Mint New Subscription</Trans>}
      hasClose
      onDismiss={onDismiss}
      background="neutral5"
    >
      {!isValid && <Box p={3}>{alert}</Box>}
      {isValid && (
        <>
          {planPrice && (
            <Box p={3}>
              <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
                <CopinIcon />
                <Type.Caption my={2} color="neutral1">
                  <Trans>
                    You will receive{' '}
                    <Box as="span" color="primary1">
                      30 days
                    </Box>{' '}
                    Premium NFT Plan
                  </Trans>
                </Type.Caption>
                <Type.H5>
                  <Box as="span" color="orange1">
                    <ETHPriceInUSD value={planPrice} />$
                  </Box>
                  <Box as="span" color="neutral1" sx={{ fontSize: '13px', fontWeight: 400 }}>
                    {' '}
                    (~{formatEther(planPrice)}ETH)
                  </Box>
                </Type.H5>
              </Flex>
              <Divider my={20} />
              <Alert
                variant="cardWarning"
                message={
                  <Flex sx={{ gap: 2, alignItems: 'center' }}>
                    <IconBox icon={<Warning size={16} />} />
                    <Box as="span">
                      <Trans>Caution !!!</Trans>
                    </Box>
                  </Flex>
                }
                description={
                  <Trans>
                    After minting, please wait about 3 minutes for system updates to access all features. We appreciate
                    your patience!
                  </Trans>
                }
              />
              <Button mt={3} variant="primary" block onClick={handleMint} disabled={submitting} isLoading={submitting}>
                <Trans>Mint Now</Trans>
              </Button>
            </Box>
          )}
          {!planPrice && (
            <Type.Body>
              <Trans>Cannot interact with contract at this moment</Trans>
            </Type.Body>
          )}
        </>
      )}
    </Modal>
  )
}

function Decorators() {
  return (
    <>
      <Box
        className="light"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 210,
          height: 40,
          transform: 'translateX(-50%) translateY(-50%)',
          borderRadius: '40px',
          background: 'radial-gradient(75.94% 115.68% at 73.2% 6.65%, #FFF 0%, #3EA2F4 27.6%, #423EF4 100%)',
          backdropFilter: 'blur(16px)',
          transition: '0.3s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '2px',
          border: '0.5px solid #DCBFF280',
          background: 'linear-gradient(180deg, rgba(62, 162, 244, 0.05) 0%, rgba(66, 62, 244, 0.05) 100%)',
          boxShadow: '1px 1px 0px 0px #3D7AF0',
          backdropFilter: 'blur(20px)',
        }}
      />
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(180deg)' }}>
        <Box as="svg" className="dash_1">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2 dash_3">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2 dash_4">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Box as="svg" className="dash_1">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2 dash_3">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2 dash_4">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
      </Box>
    </>
  )
}

const StyledButton = styled(Button)`
  &:hover {
    .dash_1 {
      animation: light_ani 1s ease-in-out;
    }
  }
  .dash_1 {
    display: block;
    position: absolute;
    inset: 0px;
    overflow: visible;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    fill: none;
    stroke: rgb(248, 252, 255);
    stroke-width: 2px;
    stroke-dasharray: 2, 10;
    stroke-dashoffset: 14;
    opacity: 0;
  }
  .dash_2 {
    stroke-width: 6px;
    filter: blur(20px);
    stroke: rgb(201, 233, 255);
  }
  .dash_3 {
    filter: blur(6px);
  }
  .dash_4 {
    filter: blur(56px);
  }
  @keyframes light_ani {
    30%,
    55% {
      opacity: 1;
    }
    100% {
      stroke-dashoffset: 4;
      opacity: 0;
    }
  }
`
