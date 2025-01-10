import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'

import CopyTradeEditForm from 'components/@copyTrade/CopyTradeEditForm'
import { CopyTradeData } from 'entities/copyTrade.d'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'

export default function CopyTradeEditDrawer({
  isOpen,
  onDismiss,
  onSuccess,
  copyTradeData,
  isLite = false,
}: {
  isOpen: boolean
  onDismiss: () => void
  onSuccess: () => void
  copyTradeData: CopyTradeData | undefined
  isLite?: boolean
}) {
  return (
    <Modal
      maxWidth="520px"
      mode="bottom"
      // background="neutral5"
      hasClose={false}
      // zIndex={105}
      // direction="bottom"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <Box sx={{ position: 'relative', width: '100%', mx: 'auto' }}>
        <Flex
          mb={24}
          px={3}
          pt={3}
          sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}
        >
          <Type.H5>
            <Trans>Edit Copytrade Settings</Trans>
          </Type.H5>
          <IconBox
            role="button"
            icon={<XCircle size={24} />}
            sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
            onClick={onDismiss}
          />
        </Flex>
        <CopyTradeEditForm copyTradeData={copyTradeData} onDismiss={onDismiss} onSuccess={onSuccess} isLite={isLite} />
      </Box>
    </Modal>
  )
}
