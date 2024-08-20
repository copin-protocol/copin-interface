import useBacktestWarningModal from 'hooks/store/useBacktestWarningModal'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'

export enum WarningType {
  REMOVE_TRADER = 'remove_trader',
  REMOVE_LAST_TRADER = 'remove_last_trader',
  CLEAR_GROUP = 'clear_group',
  CLEAR_RESULT = 'clear_result',
}
export default function BacktestWarningModal() {
  const { isOpen, type, confirmFunction, dismissModal } = useBacktestWarningModal()
  let title = ''
  let content = ''
  switch (type) {
    case WarningType.REMOVE_TRADER:
      title = 'Are you sure to remove this trader from the list?'
      content = 'This trader will be removed from the selected list'
      break
    case WarningType.REMOVE_LAST_TRADER:
      title = 'Are you sure to remove this trader from the list?'
      content = 'Your selected traders and backtest results will be clear after you remove them.'
      break
    case WarningType.CLEAR_GROUP:
      title = 'Are you sure to reset this backtest list?'
      content = 'Your selected traders and backtest results will be clear after you remove them.'
      break
    case WarningType.CLEAR_RESULT:
      title = 'Are you sure to close this tab?'
      content = 'Your back test result will be clear after the tab is closed.'
      break
    default:
      break
  }
  return (
    <Modal isOpen={isOpen} onDismiss={dismissModal} hasClose={false}>
      <Box p={3}>
        <Type.BodyBold mb={12} textAlign="center" width="100%">
          {title}
        </Type.BodyBold>
        {content && (
          <Type.Caption mb={24} textAlign="center" width="100%" color="neutral2">
            {content}
          </Type.Caption>
        )}
        <Flex sx={{ gap: 3 }}>
          <Button variant="outlineDanger" onClick={() => confirmFunction && confirmFunction()} sx={{ flex: 1 }}>
            Confirm
          </Button>
          <Button variant="outline" onClick={dismissModal} sx={{ flex: 1 }}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}
