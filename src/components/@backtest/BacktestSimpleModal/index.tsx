import { Trans } from '@lingui/macro'
import { WarningCircle } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'react-toastify'

import BacktestFormSimple from 'components/@backtest/BacktestFormSimple'
import CopyTraderButton from 'components/@copyTrade/CopyTraderButton'
import { AccountInfo } from 'components/@ui/AccountInfo'
import Divider from 'components/@ui/Divider'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import ToastBody from 'components/@ui/ToastBody'
import { BackTestResultData, RequestBackTestData } from 'entities/backTest'
import useBacktestRequest from 'hooks/features/backtest/useBacktestRequest'
import Alert from 'theme/Alert'
import RcDrawer, { DrawerTitle } from 'theme/RcDrawer'
import { levelTwoStyles } from 'theme/RcDrawer/styles'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { Z_INDEX } from 'utils/config/zIndex'
import { logEventBacktest } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

import BacktestSimpleResult from '../BacktestSimpleResult'

export default function BacktestSimpleModal({
  isOpen,
  onDismiss,
  account,
  protocol,
  timeOption,
}: {
  isOpen: boolean
  onDismiss: () => void
  account: string | undefined
  protocol: ProtocolEnum | undefined
  timeOption: TimeFilterProps
}) {
  const [_timeOption, setTimeOption] = useState(timeOption)

  const [openResult, setOpenResult] = useState(false)
  const [backtestData, setBacktestData] = useState<{
    result: BackTestResultData
    settings: RequestBackTestData
  } | null>(null)
  const { onSubmit, isSubmitting } = useBacktestRequest(protocol, {
    onSuccess: ({ result, settings }) => {
      if (!!result?.length) {
        setBacktestData({ result: result[0], settings })
        setOpenResult(true)

        logEventBacktest({ event: EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_SUCCESS_SINGLE, username: account })
      } else setBacktestData(null)
    },
    onError: () => {
      setBacktestData(null)
      toast.error(
        <ToastBody title={<Trans>Error</Trans>} message={<Trans>Something went wrong, please try later.</Trans>} />
      )

      logEventBacktest({ event: EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_FAILED_SINGLE, username: account })
    },
  })
  const handleClearResult = () => {
    setOpenResult(false)
    setBacktestData(null)
  }

  return (
    <RcDrawer width={300} open={isOpen} onClose={onDismiss} push={{ distance: 350 }} zIndex={Z_INDEX.THEME_MODAL}>
      <Box p={3}>
        <DrawerTitle
          title={
            <Type.BodyBold>
              <Trans>Backtest</Trans>
            </Type.BodyBold>
          }
          onClose={onDismiss}
        />
        <Divider my={3} />
        {!!account && !!protocol && (
          <AccountInfo address={account} protocol={protocol} avatarSize={24} textSx={{ color: 'neutral1' }} />
        )}
        <Box mb={20} />
        {protocol && account && (
          <BacktestFormSimple
            protocol={protocol}
            onSubmit={onSubmit({ accounts: [account] })}
            isSubmitting={isSubmitting}
            timeOption={_timeOption}
            onChangeTimeOption={(option) => {
              setTimeOption(option)

              logEventBacktest({ event: option.id, username: account })
            }}
          />
        )}
      </Box>
      <RcDrawer
        width={400}
        open={openResult}
        onClose={handleClearResult}
        zIndex={Z_INDEX.THEME_MODAL + 1}
        styles={levelTwoStyles()}
      >
        <Box p={3}>
          <Flex sx={{ alignItems: 'center', gap: 3 }}>
            <DrawerTitle
              onBack={handleClearResult}
              title={
                <Type.BodyBold sx={{ textTransform: 'uppercase' }}>
                  <Trans>Backtest result in {_timeOption.text}</Trans>
                </Type.BodyBold>
              }
              onClose={() => {
                handleClearResult()
                onDismiss()
              }}
            />
          </Flex>
          <Divider my={3} />

          {!!account && !!protocol && (
            <AccountInfo address={account} protocol={protocol} avatarSize={24} textSx={{ color: 'neutral1' }} />
          )}
          <Box mb={20} />

          {backtestData && <BacktestSimpleResult {...backtestData} />}

          <Box mb={20} />
          <Alert
            variant="primary"
            message={
              <Flex sx={{ gap: 2, alignItems: 'center' }}>
                <IconBox icon={<WarningCircle size={16} />} />
                <Box as="span">
                  <Trans>Notice:</Trans>
                </Box>
              </Flex>
            }
            description={
              <Trans>
                This is the result of a calculation based on past data, not a prediction of future results. Please think
                twice before making a decision.
              </Trans>
            }
            sx={{ textAlign: 'left' }}
          />
          <Box mb={24} />
          {!!account && !!protocol && (
            <CopyTraderButton
              source={EventSource.HOME_BACKTEST}
              protocol={protocol}
              account={account}
              buttonSx={{ width: '100%', borderRadius: 'sm' }}
            />
          )}
        </Box>
      </RcDrawer>
    </RcDrawer>
  )
}
