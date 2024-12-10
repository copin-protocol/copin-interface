import { CirclesThreePlus, UniteSquare } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { GridProps } from 'styled-system'

import BacktestSingleButton from 'components/@backtest/BacktestSingleButton'
import CopyTraderButton from 'components/@copyTrade/CopyTraderButton'
import AnalyzeAction from 'components/@ui/AnalyzeButton'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { PositionData, TraderData } from 'entities/trader.d'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { NAVBAR_HEIGHT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'

import AlertAction from './AlertAction'
import ExpandTraderRankingButton from './ExpandTraderRankingButton'

export interface PositionSortPros {
  sortBy: keyof PositionData
  sortType: SortTypeEnum
}
export default function TraderActionButtons({
  account,
  traderData,
  protocol,
  onCopyActionSuccess,
  timeOption,
  onChangeTime,
  isDrawer,
  sx,
}: {
  traderData: TraderData | undefined
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
  account: string
  protocol: ProtocolEnum
  onCopyActionSuccess: () => void
  isDrawer?: boolean
  sx?: SystemStyleObject & GridProps
}) {
  const { lg } = useResponsive()
  return (
    <>
      {lg ? (
        <Box
          sx={{
            alignItems: 'center',
            borderBottom: ['small', 'small', 'small', 'none'],
            borderColor: ['neutral4', 'neutral4', 'neutral4', 'transparent'],
            width: [0, '100%', '100%', 'auto'],
            height: ['40px', '40px', '40px', 'auto'],
            display: ['none', 'flex', 'flex', 'flex'],
            position: [undefined, 'fixed', 'fixed', 'static'],
            top: [undefined, NAVBAR_HEIGHT + 71, NAVBAR_HEIGHT + 71, NAVBAR_HEIGHT + 71],
            zIndex: 10,
            bg: ['neutral7', 'neutral7', 'neutral7', undefined],
            ...sx,
          }}
        >
          {/* <TradeProtocolAction protocol={protocol} /> */}
          <AnalyzeAction />
          <AlertAction protocol={protocol} account={account} />
          {!isDrawer && (
            <ExpandTraderRankingButton traderData={traderData} timeOption={timeOption} onChangeTime={onChangeTime} />
          )}
          <BacktestSingleButton key={protocol + account} protocol={protocol} account={account} />
          <CopyTraderButton
            protocol={protocol}
            account={account}
            onForceReload={onCopyActionSuccess}
            buttonSx={{
              px: 3,
              width: 'auto',
              bg: 'transparent !important',
              color: `${themeColors.primary1} !important`,
              '&:hover:not(:disabled)': { color: `${themeColors.primary2} !important` },
            }}
            buttonText={
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <UniteSquare size={20} />
                <Type.CaptionBold>Copy Trader</Type.CaptionBold>
              </Flex>
            }
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            // position: 'fixed',
            // top: NAVBAR_HEIGHT + 24,
            // right: 12,
            pr: 12,
            zIndex: 10,
          }}
        >
          <Dropdown
            hasArrow={false}
            menuSx={{
              bg: 'neutral7',
              width: 'max-content',
            }}
            menu={
              <>
                {/*<Box height="40px">*/}
                {/*  <TradeProtocolAction protocol={protocol} />*/}
                {/*</Box>*/}
                <Box height="40px">
                  <AnalyzeAction />
                </Box>
                <Box height="40px" sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
                  <AlertAction account={account} protocol={protocol} />
                </Box>
                <Box height="40px" sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
                  <BacktestSingleButton key={protocol + account} account={account} protocol={protocol} />
                </Box>
                <Box height="40px">
                  <CopyTraderButton account={account} protocol={protocol} onForceReload={onCopyActionSuccess} />
                </Box>
              </>
            }
            sx={{}}
            buttonSx={{
              border: 'none',
              height: '100%',
              p: 0,
            }}
            placement={'topRight'}
          >
            <IconButton
              size={24}
              type="button"
              icon={<CirclesThreePlus size={24} weight="fill" />}
              variant="ghost"
              sx={{
                color: 'neutral1',
              }}
            />
          </Dropdown>
        </Box>
      )}
    </>
  )
}
