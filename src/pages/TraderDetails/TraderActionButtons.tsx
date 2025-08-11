import { CirclesThreePlus, UniteSquare } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { GridProps } from 'styled-system'

import BacktestSingleButton from 'components/@backtest/BacktestSingleButton'
import CopyTraderButton from 'components/@copyTrade/CopyTraderButton'
import AnalyzeAction from 'components/@ui/AnalyzeButton'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { PositionData, TraderData } from 'entities/trader.d'
import { useIsIF } from 'hooks/features/subscription/useSubscriptionRestrict'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { NAVBAR_HEIGHT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { EventCategory } from 'utils/tracking/types'

import AlertAction from './AlertAction'
import ExpandTraderRankingButton from './ExpandTraderRankingButton'
import NoteAction from './NoteAction'

export interface PositionSortPros {
  sortBy: keyof PositionData
  sortType: SortTypeEnum
}
export type DisabledActionType = 'copy-trade' | 'alert' | 'backtest'

export default function TraderActionButtons({
  account,
  traderData,
  protocol,
  onCopyActionSuccess,
  timeOption,
  onChangeTime,
  isDrawer,
  disabledActions,
  sx,
  eventCategory,
  shoulShowGroupAlerts,
}: {
  traderData: TraderData | undefined
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
  account: string
  protocol: ProtocolEnum
  onCopyActionSuccess: () => void
  isDrawer?: boolean
  sx?: SystemStyleObject & GridProps
  disabledActions?: DisabledActionType[]
  eventCategory?: EventCategory
  shoulShowGroupAlerts?: boolean
}) {
  const { xl } = useResponsive()
  // const { isDA } = useCopyWalletContext()
  const { isAllowedProtocol } = useTraderProfilePermission({ protocol })
  const isIF = useIsIF()
  return (
    <>
      {xl ? (
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
            bg: isDrawer ? 'transparent' : ['neutral7', 'neutral7', 'neutral7', undefined],
            ...sx,
          }}
        >
          {/* <TradeProtocolAction protocol={protocol} /> */}
          {/*{isDA && (*/}
          {/*  <CopyVaultButton*/}
          {/*    protocol={protocol}*/}
          {/*    account={account}*/}
          {/*    onForceReload={onCopyActionSuccess}*/}
          {/*    buttonSx={{*/}
          {/*      px: 3,*/}
          {/*      width: 'auto',*/}
          {/*      bg: 'transparent !important',*/}
          {/*      color: `${themeColors.primary1} !important`,*/}
          {/*      '&:hover:not(:disabled)': { color: `${themeColors.primary2} !important` },*/}
          {/*    }}*/}
          {/*    buttonText={*/}
          {/*      <Flex sx={{ alignItems: 'center', gap: 2 }}>*/}
          {/*        <UniteSquare size={20} />*/}
          {/*        <Type.CaptionBold>Copy Vault</Type.CaptionBold>*/}
          {/*      </Flex>*/}
          {/*    }*/}
          {/*  />*/}
          {/*)}*/}
          {isIF ? (
            <NoteAction account={account} protocol={protocol} />
          ) : (
            <AnalyzeAction forceDisabled={!isAllowedProtocol} />
          )}
          {!disabledActions?.includes('alert') && <AlertAction protocol={protocol} account={account} />}
          {!isDrawer && (
            <ExpandTraderRankingButton
              protocol={protocol}
              traderData={traderData}
              timeOption={timeOption}
              onChangeTime={onChangeTime}
            />
          )}
          {!disabledActions?.includes('backtest') && (
            <BacktestSingleButton
              key={protocol + account}
              protocol={protocol}
              account={account}
              eventCategory={eventCategory}
            />
          )}
          {!disabledActions?.includes('copy-trade') && (
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
          )}
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
            alignItems: 'center',
          }}
        >
          <Box display={{ _: isDrawer ? 'block' : 'none', lg: 'block' }}>
            {isIF && <NoteAction account={account} protocol={protocol} />}
          </Box>

          <Dropdown
            hasArrow={false}
            buttonVariant="ghost"
            inline
            menuSx={{
              bg: 'neutral7',
              width: 'max-content',
            }}
            menu={
              <>
                {/*<Box height="40px">*/}
                {/*  <TradeProtocolAction protocol={protocol} />*/}
                {/*</Box>*/}
                <Flex height="40px" alignItems="center" justifyContent="center">
                  <AnalyzeAction forceDisabled={!isAllowedProtocol} />
                </Flex>
                {!disabledActions?.includes('alert') && (
                  <Flex
                    height="40px"
                    width="100%"
                    justifyContent="center"
                    sx={{ borderTop: 'small', borderColor: 'neutral4' }}
                  >
                    <AlertAction account={account} protocol={protocol} shoulShowGroupAlerts={shoulShowGroupAlerts} />
                  </Flex>
                )}
                {!disabledActions?.includes('backtest') && (
                  <Box height="40px" sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
                    <BacktestSingleButton key={protocol + account} account={account} protocol={protocol} />
                  </Box>
                )}
                {!disabledActions?.includes('copy-trade') && (
                  <Box height="40px">
                    <CopyTraderButton account={account} protocol={protocol} onForceReload={onCopyActionSuccess} />
                  </Box>
                )}
              </>
            }
            sx={{}}
            placement={'topRight'}
          >
            <IconBox icon={<CirclesThreePlus size={24} weight="fill" />} />
          </Dropdown>
        </Box>
      )}
    </>
  )
}
