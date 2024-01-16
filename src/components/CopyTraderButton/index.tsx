import { Trans } from '@lingui/macro'
import { ComponentProps, ReactNode, useState } from 'react'

import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import { useCheckCopyTradeAction } from 'hooks/features/useSubscriptionRestrict'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import { ProtocolEnum } from 'utils/config/enums'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import CopyTraderModal from './CopyTraderModal'
import ModalContactUs from './ModalContactUs'

export default function CopyTraderButton({
  protocol,
  account,
  onForceReload,
  buttonText = <Trans>Copy Trader</Trans>,
  buttonSx = {},
  modalStyles,
}: {
  protocol: ProtocolEnum
  account: string
  onForceReload?: () => void
  buttonText?: ReactNode
  buttonSx?: any
  modalStyles?: ComponentProps<typeof CopyTraderModal>['modalStyles']
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

  return (
    <>
      <Button
        sx={{
          borderRadius: 0,
          height: '100%',
          width: ['100%', '100%', '100%', 150],
          ...buttonSx,
        }}
        variant="primary"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!checkIsEligible()) return

          hasCopyPermission ? setIsOpenModal(true) : setIsOpenContactModal(true)

          logEvent({
            label: getUserForTracking(profile?.username),
            category: EventCategory.COPY_TRADE,
            action: EVENT_ACTIONS[EventCategory.COPY_TRADE].OPEN_COPY_TRADE,
          })
        }}
        data-tooltip-id={`tt-kwenta_copytrade`}
      >
        {buttonText}
      </Button>
      {isOpenModal && !!profile && (
        <CopyTraderModal
          protocol={protocol}
          account={account}
          isOpen={isOpenModal}
          onClose={handleCloseModal}
          modalStyles={modalStyles}
        />
      )}
      {isOpenContactModal && <ModalContactUs onDismiss={() => setIsOpenContactModal(false)} />}
    </>
  )
}
