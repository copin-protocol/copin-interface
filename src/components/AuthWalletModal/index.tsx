import { ArrowRight } from '@phosphor-icons/react'
import React from 'react'

// import useIsMobile from 'hooks/helpers/useIsMobile'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Modal from 'theme/Modal'
import { Box, Flex, Image, Type } from 'theme/base'
import { SUPPORTED_WALLETS } from 'utils/web3/providers'

const WalletModal = ({
  isOpen,
  onDismiss,
  onConnect,
}: {
  isOpen: boolean
  onDismiss: () => void
  onConnect: (connector: 'injected' | 'walletconnect') => void
}) => {
  // const isMobile = useIsMobile()
  return (
    <Modal isOpen={isOpen} title="Connect Wallet" hasClose onDismiss={onDismiss}>
      <Box>
        {Object.keys(SUPPORTED_WALLETS)
          // .filter((w) => !isMobile || !!SUPPORTED_WALLETS[w].mobile)
          .map((w, i) => (
            <ButtonWithIcon
              variant="black"
              direction="right"
              width="100%"
              onClick={() => onConnect(SUPPORTED_WALLETS[w].connectorName)}
              key={w}
              height={60}
              sx={{
                border: 'small',
                borderColor: 'neutral6',
                bg: 'neutral7',
                px: 12,
                '&:hover': { bg: 'neutral6' },
                borderRadius: 'sm',
              }}
              icon={<ArrowRight size={20} />}
              mt={i === 0 ? 0 : 12}
            >
              <Flex alignItems="center">
                <Image src={SUPPORTED_WALLETS[w].iconURL} width={40} />
                <Type.CaptionBold color="neutral1" ml={16}>
                  {' '}
                  {SUPPORTED_WALLETS[w].name}
                </Type.CaptionBold>
              </Flex>
            </ButtonWithIcon>
          ))}
      </Box>
    </Modal>
  )
}

export default WalletModal
