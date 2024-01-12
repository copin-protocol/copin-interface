import { useState } from 'react'

import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import { useCheckCopyTradeAction } from 'hooks/features/useSubscriptionRestrict'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import { ProtocolEnum } from 'utils/config/enums'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import CopyTraderModal from './CopyTraderModal'
import ModalContactUs from './ModalContactUs'

const CopyTraderAction = ({
  protocol,
  account,
  onForceReload,
}: {
  protocol: ProtocolEnum
  account: string
  onForceReload: () => void
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenContactModal, setIsOpenContactModal] = useState(false)

  const { profile } = useAuthContext()
  const { checkIsEligible } = useCheckCopyTradeAction()
  const handleCloseModal = () => {
    setIsOpenModal(false)
  }

  const hasCopyPermission = useCopyTradePermission()

  return (
    <>
      <Button
        width={['100%', '100%', '100%', 150]}
        sx={{
          borderRadius: 0,
          height: '100%',
        }}
        variant="primary"
        onClick={() => {
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
        Copy Trader
      </Button>
      {isOpenModal && !!profile && (
        <CopyTraderModal
          protocol={protocol}
          account={account}
          isOpen={isOpenModal}
          onClose={handleCloseModal}
          onSuccess={onForceReload}
        />
      )}
      {isOpenContactModal && <ModalContactUs onDismiss={() => setIsOpenContactModal(false)} />}
      {/*{!hasCopyPermission && (*/}
      {/*  <Tooltip id="tt-kwenta_copytrade" place="top" type="dark" effect="solid" clickable>*/}
      {/*    <Flex flexDirection="column" maxWidth={350}>*/}
      {/*      <Type.CaptionBold>Kwenta copy-trading is coming soon</Type.CaptionBold>*/}
      {/*      <Type.Caption color="neutral2">*/}
      {/*        Any ideas or support, reach us{' '}*/}
      {/*        <a href={LINKS.telegram} target="_blank" rel="noreferrer">*/}
      {/*          here*/}
      {/*        </a>*/}
      {/*      </Type.Caption>*/}
      {/*    </Flex>*/}
      {/*  </Tooltip>*/}
      {/*)}*/}
    </>
  )
}

export default CopyTraderAction
