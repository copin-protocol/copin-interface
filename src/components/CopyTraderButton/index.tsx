import { Trans } from '@lingui/macro'
import { ComponentProps, ReactNode, useState } from 'react'

import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import useInternalRole from 'hooks/features/useInternalRole'
import { useCheckCopyTradeAction } from 'hooks/features/useSubscriptionRestrict'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { ProtocolEnum } from 'utils/config/enums'
import { logEventCopyTrade } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

import CopyTraderModal from './CopyTraderModal'
import ModalContactUs from './ModalContactUs'

// TODO: Check when add new protocol
const ALLOWED_LIST = [ProtocolEnum.GMX, ProtocolEnum.GMX_V2, ProtocolEnum.KWENTA, ProtocolEnum.POLYNOMIAL]

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

  const isInternal = useInternalRole()
  const { profile } = useAuthContext()
  const { checkIsEligible } = useCheckCopyTradeAction()
  const handleCloseModal = () => {
    setIsOpenModal(false)
    onForceReload?.()
  }

  const hasCopyPermission = useCopyTradePermission()

  const allowList = isInternal ? [...ALLOWED_LIST, ProtocolEnum.GNS] : ALLOWED_LIST
  const disabledCopy = !allowList.includes(protocol)
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
          e.stopPropagation()
          if (!checkIsEligible()) return

          hasCopyPermission ? setIsOpenModal(true) : setIsOpenContactModal(true)

          switch (source) {
            case EventSource.HOME:
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
