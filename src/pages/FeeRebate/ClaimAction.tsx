import React, { ReactNode, useState } from 'react'
import styled from 'styled-components/macro'

import ArbitrumLogo from 'components/@ui/ArbitrumLogo'
import { useClickLoginButton } from 'components/LoginAction'
import { useAuthContext } from 'hooks/web3/useAuth'
import { useFeeRebateContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { DELAY_SYNC } from 'utils/config/constants'
import delay from 'utils/helpers/delay'
import { formatNumber } from 'utils/helpers/format'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'

export default function ClaimButton({
  availableClaim,
  buttonSx,
  disabled = false,
  onSuccess,
}: {
  availableClaim: number | undefined
  buttonSx?: any
  disabled?: boolean
  onSuccess?: () => void
}) {
  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const [openModal, setOpenModal] = useState(false)

  const { isValid, alert } = useRequiredChain({ chainId: ARBITRUM_CHAIN })
  const feeRebateContract = useFeeRebateContract(ARBITRUM_CHAIN)
  const feeRebateMutation = useContractMutation(feeRebateContract)

  const handleSubmit = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!isValid) {
      setOpenModal(true)
      return
    }

    feeRebateMutation.mutate(
      { method: 'claim', params: [] },
      {
        onSuccess: async () => {
          await delay(DELAY_SYNC * 2)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <>
      <Button
        variant="outlinePrimary"
        block
        sx={{ width: ['100%', 170], height: 40, ...buttonSx }}
        py="6px"
        disabled={!availableClaim || disabled || feeRebateMutation.isLoading}
        isLoading={feeRebateMutation.isLoading}
        onClick={handleSubmit}
      >
        {feeRebateMutation.isLoading ? (
          'Claiming'
        ) : (
          <Flex alignItems="center" justifyContent="center" sx={{ gap: 1 }}>
            <Type.CaptionBold textAlign="center">Claim All - {formatNumber(availableClaim, 2)}</Type.CaptionBold>
            <ArbitrumLogo size={16} />
          </Flex>
        )}
      </Button>
      {!isValid && openModal && <SwitchChainModal alert={alert} onDismiss={() => setOpenModal(false)} />}
    </>
  )
}

function SwitchChainModal({ alert, onDismiss }: { alert: ReactNode; onDismiss: () => void }) {
  return (
    <Modal isOpen hasClose onDismiss={onDismiss}>
      <Box p={3}>{alert}</Box>
    </Modal>
  )
}

function Decorators({ bgType = '1' }: { bgType: '1' | '2' }) {
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
          background:
            bgType === '1'
              ? 'radial-gradient(75.94% 115.68% at 73.2% 6.65%, #FFF 0%, #3EA2F4 27.6%, #423EF4 100%)'
              : 'radial-gradient(84.44% 102.83% at 80.14% -10.29%, #FFFFFF 0%, #32424F 27.6%, #393869 100%)',
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
          // background:
          //   bgType === '1' ? 'linear-gradient(180deg, rgba(62, 162, 244, 0.05) 0%, rgba(66, 62, 244, 0.05) 100%)' : '',
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
