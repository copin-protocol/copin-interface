import { Trans } from '@lingui/macro'
import { ComponentProps, ReactNode, useState } from 'react'

import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import { useCheckCopyTradeAction } from 'hooks/features/subscription/useSubscriptionRestrict'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import { ProtocolEnum } from 'utils/config/enums'
import { logEventCopyTrade } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

import CopyTraderModal from './CopyTraderModal'
import ModalContactUs from './ModalContactUs'

export default function CopyTraderButton({
  protocol,
  account,
  onForceReload,
  buttonText = <Trans>Copy Trader</Trans>,
  buttonSx = {},
  modalStyles,
  source = EventSource.TRADER_PROFILE,
}: {
  protocol: ProtocolEnum
  account: string
  onForceReload?: () => void
  buttonText?: ReactNode
  buttonSx?: any
  modalStyles?: ComponentProps<typeof CopyTraderModal>['modalStyles']
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

  const { allowedSelectProtocols, allowedCopyTradeProtocols } = useProtocolPermission()
  const disabledCopy = !allowedSelectProtocols?.includes(protocol) || !allowedCopyTradeProtocols?.includes(protocol)

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

          setIsOpenModal(true)

          switch (source) {
            case EventSource.HOME:
              e.stopPropagation()
              logEventCopyTrade({
                event: EVENT_ACTIONS[EventCategory.COPY_TRADE].HOME_OPEN_COPY_TRADE,
                username: profile?.username,
              })
              break
            case EventSource.HOME_BACKTEST:
              logEventCopyTrade({
                event: EVENT_ACTIONS[EventCategory.COPY_TRADE].HOME_BACKTEST_OPEN_COPY_TRADE,
                username: profile?.username,
              })
              break
            default:
              logEventCopyTrade({
                event: EVENT_ACTIONS[EventCategory.COPY_TRADE].OPEN_COPY_TRADE,
                username: profile?.username,
              })
          }
        }}
      >
        {buttonText}
      </Button>
      {!disabledCopy && isOpenModal && !!profile && (
        <CopyTraderModal
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
