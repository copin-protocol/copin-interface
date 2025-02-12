import { Trans } from '@lingui/macro'
import { ComponentProps, ReactNode, useState } from 'react'

import useCopyTradePermission from 'hooks/features/copyTrade/useCopyTradePermission'
import { useCheckCopyTradeAction } from 'hooks/features/subscription/useSubscriptionRestrict'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { DCP_SUPPORTED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { EventSource } from 'utils/tracking/types'

import ModalContactUs from '../CopyTraderButton/ModalContactUs'
import CopyVaultModal from './CopyVaultModal'

export default function CopyVaultButton({
  protocol,
  account,
  onForceReload,
  buttonText = <Trans>Copy Vault</Trans>,
  buttonSx = {},
  modalStyles,
  source = EventSource.TRADER_PROFILE,
}: {
  protocol: ProtocolEnum
  account: string
  onForceReload?: () => void
  buttonText?: ReactNode
  buttonSx?: any
  modalStyles?: ComponentProps<typeof CopyVaultModal>['modalStyles']
  source?: EventSource
}) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenContactModal, setIsOpenContactModal] = useState(false)

  const { profile } = useAuthContext()
  const { checkIsEligible } = useCheckCopyTradeAction()
  const handleCloseModal = () => {
    setIsOpenModal(false)
    onForceReload?.()
  }

  const hasCopyPermission = useCopyTradePermission()

  const disabledCopy = !DCP_SUPPORTED_PROTOCOLS.includes(protocol)
  const disabledCopyTooltipId = `tt_copy_trade_${account}_${protocol}`

  return (
    <>
      <Button
        sx={{
          borderRadius: 0,
          height: '100%',
          width: ['100%', '100%', '100%', 150],
          ...buttonSx,
        }}
        disabled={disabledCopy}
        variant="primary"
        onClick={(e) => {
          e.preventDefault()
          if (!checkIsEligible()) return
          hasCopyPermission ? setIsOpenModal(true) : setIsOpenContactModal(true)
        }}
        data-tooltip-id={disabledCopy ? disabledCopyTooltipId : undefined}
      >
        {buttonText}
      </Button>
      {disabledCopy && (
        <Tooltip id={disabledCopyTooltipId} place="bottom">
          <Trans>Coming soon!</Trans>
        </Tooltip>
      )}
      {!disabledCopy && isOpenModal && !!profile && (
        <CopyVaultModal
          protocol={protocol}
          account={account}
          isOpen={isOpenModal}
          onClose={handleCloseModal}
          onSuccess={onForceReload}
          modalStyles={modalStyles}
          source={source}
        />
      )}
      {isOpenContactModal && <ModalContactUs onDismiss={() => setIsOpenContactModal(false)} />}
    </>
  )
}
