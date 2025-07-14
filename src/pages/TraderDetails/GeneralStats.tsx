import { useResponsive } from 'ahooks'
import React from 'react'

import { BalanceText } from 'components/@ui/DecoratedText/ValueText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import { TraderData } from 'entities/trader'
import useHyperliquidAccountSummary from 'hooks/features/trader/useHyperliquidAccountSummary'
import { useHyperliquidTraderContext } from 'hooks/features/trader/useHyperliquidTraderContext'
import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SxProps } from 'theme/types'
import { MarginModeEnum, ProtocolEnum } from 'utils/config/enums'
import { formatLeverage, formatNumber, formatRelativeDate } from 'utils/helpers/format'

export default function GeneralStats({
  traderData,
  account,
  protocol,
  isDrawer,
  apiMode,
  handleApiMode,
  sx,
}: {
  traderData: TraderData | undefined
  account: string
  protocol: ProtocolEnum
  isDrawer?: boolean
  apiMode?: boolean
  handleApiMode?: () => void
} & SxProps) {
  const { xl } = useResponsive()
  return (
    <Flex
      alignItems={['flex-start', 'center']}
      sx={{
        py: [1, 1],
        width: '100%',
        // overflow: 'auto hidden',
        borderBottom: 'small',
        borderColor: 'neutral4',
        position: 'relative',
        ...(sx ?? {}),
      }}
    >
      <Flex
        px={12}
        sx={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          gap: xl ? 24 : 2,
          // mt: [0, 40, 40, 0],
        }}
      >
        {protocol === ProtocolEnum.HYPERLIQUID ? (
          apiMode ? (
            <HyperliquidStats />
          ) : (
            <HyperliquidCommonStats traderData={traderData} account={account} protocol={protocol} />
          )
        ) : (
          <CommonStats traderData={traderData} account={account} protocol={protocol} />
        )}
      </Flex>
      {!isDrawer && protocol === ProtocolEnum.HYPERLIQUID && (
        <Flex
          alignItems="center"
          sx={{
            gap: 1,
            minWidth: 'max-content',
            px: 12,
            py: 1,
            position: ['absolute', 'relative'],
            top: [1, 0],
            right: 0,
          }}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => apiMode && handleApiMode?.()}
            px={1}
            py="2px"
            sx={{
              minWidth: 'max-content',
              color: apiMode ? 'neutral1' : 'primary1',
              backgroundColor: apiMode ? 'transparent' : '#4EAEFD2E',
              '&:hover': { color: 'primary2', backgroundColor: `#4EAEFD2E` },
            }}
          >
            <Type.Caption>STANDARD</Type.Caption>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => !apiMode && handleApiMode?.()}
            px={1}
            py="2px"
            sx={{
              minWidth: 'max-content',
              color: apiMode ? 'primary1' : 'neutral1',
              backgroundColor: apiMode ? '#4EAEFD2E' : 'transparent',
              '&:hover': { color: 'primary2', backgroundColor: `#4EAEFD2E` },
            }}
          >
            <Type.Caption>HYPERLIQUID</Type.Caption>
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

const CommonStats = ({
  traderData,
  account,
  protocol,
}: {
  traderData: TraderData | undefined
  account: string
  protocol: ProtocolEnum
}) => {
  const { lastTradeAt, runTimeDays, smartAccount } = traderData ?? {}
  return (
    <Flex
      width="100%"
      sx={{
        alignItems: 'center',
        gap: [1, 2, 2, 2, 24],
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}
    >
      <Box minWidth="fit-content" textAlign="left" color="neutral3" flex={['1', 'none']}>
        <LabelWithTooltip
          id="tt_balance"
          sx={{
            display: ['block', 'inline-block'],
            mr: [0, 2],
          }}
          tooltip="Total value of collateral"
        >
          Balance:
        </LabelWithTooltip>
        <Type.Caption color="neutral1">
          <BalanceText protocol={protocol} account={account} smartAccount={smartAccount} maxDigit={0} minDigit={0} />
        </Type.Caption>
      </Box>
      <Box minWidth="fit-content" textAlign="left" flex={['1', 'none']}>
        <Type.Caption mr={[0, 2]} color="neutral3" display={['block', 'inline-block']}>
          Last Trade:
        </Type.Caption>
        <Type.Caption>{lastTradeAt ? formatRelativeDate(lastTradeAt) : '--'}</Type.Caption>
      </Box>
      <Box textAlign="left" flex={['1', 'none']}>
        <Type.Caption mr={[0, 2]} color="neutral3" display={['block', 'inline-block']}>
          Runtime:
        </Type.Caption>
        <Type.Caption>{runTimeDays ? `${runTimeDays} days` : '--'}</Type.Caption>
      </Box>
    </Flex>
  )
}

const HyperliquidCommonStats = ({
  traderData,
  account,
  protocol,
}: {
  traderData: TraderData | undefined
  account: string
  protocol: ProtocolEnum
}) => {
  const { xl } = useResponsive()
  const { lastTradeAt, runTimeDays, smartAccount } = traderData ?? {}
  return (
    <Flex
      sx={{
        width: '100%',
        alignItems: 'center',
        gap: xl ? 24 : 1,
        flexWrap: 'wrap',
      }}
    >
      <Flex
        width={['30%', 'auto']}
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
        sx={{ gap: [0, 2] }}
      >
        <LabelWithTooltip
          id="tt_balance"
          sx={{
            color: 'neutral3',
          }}
          tooltip="Total value of collateral"
        >
          Balance:
        </LabelWithTooltip>
        <Type.Caption color="neutral1">
          <BalanceText protocol={protocol} account={account} smartAccount={smartAccount} maxDigit={0} minDigit={0} />
        </Type.Caption>
      </Flex>
      <Flex
        width={['30%', 'auto']}
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
        sx={{ gap: [0, 2] }}
      >
        <Type.Caption color="neutral3" display={['block', 'inline-block']}>
          Last Trade:
        </Type.Caption>
        <Type.Caption>{lastTradeAt ? formatRelativeDate(lastTradeAt) : '--'}</Type.Caption>
      </Flex>
      <Flex flexDirection={['column', 'row']} alignItems={['flex-start', 'center']} sx={{ gap: [0, 2] }}>
        <Type.Caption color="neutral3" display={['block', 'inline-block']}>
          Runtime:
        </Type.Caption>
        <Type.Caption>{runTimeDays ? `${runTimeDays} days` : '--'}</Type.Caption>
      </Flex>
    </Flex>
  )
}

const HyperliquidStats = () => {
  const { xl } = useResponsive()
  const { hlAccountData, hlAccountSpotData } = useHyperliquidTraderContext()
  const { totalValue, spotValue, accountValue, withdrawable, withdrawablePercent, totalPosValue, leverage } =
    useHyperliquidAccountSummary({
      hlAccountData,
      hlAccountSpotData,
    })
  let textColor = 'green1'
  let bgColor = `${themeColors.green1}20`
  if (leverage > 5) {
    textColor = 'red2'
    bgColor = `${themeColors.red2}20`
  } else if (leverage > 3) {
    textColor = 'orange1'
    bgColor = `${themeColors.orange1}20`
  }
  return (
    <Flex
      sx={{
        width: '100%',
        alignItems: 'center',
        gap: xl ? 24 : 1,
        flexWrap: 'wrap',
      }}
    >
      <Flex
        width={['100%', 'auto']}
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
        sx={{ gap: [0, 2] }}
      >
        <LabelWithTooltip
          id="tt_total_value"
          sx={{
            color: 'neutral3',
          }}
          tooltip={
            <Flex flexDirection="column" sx={{ gap: 1 }}>
              <Flex alignItems="center" sx={{ gap: 1 }}>
                <Type.Caption color="neutral3">Perp:</Type.Caption>
                <Type.Caption>${formatNumber(accountValue, 0)}</Type.Caption>
              </Flex>
              <Flex alignItems="center" sx={{ gap: 1 }}>
                <Type.Caption color="neutral3">Spot:</Type.Caption>
                <Type.Caption>${formatNumber(spotValue, 0)}</Type.Caption>
              </Flex>
            </Flex>
          }
        >
          Total Value:
        </LabelWithTooltip>
        <Type.Caption color="neutral1">{totalValue ? `$${formatNumber(totalValue, 0)}` : '--'}</Type.Caption>
      </Flex>
      <Flex
        width={['50%', 'auto']}
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
        sx={{ gap: [0, 2] }}
      >
        <LabelWithTooltip
          id="tt_withdrawable"
          sx={{
            color: 'neutral3',
          }}
          tooltip={<Type.Caption color="neutral1">Free margin available</Type.Caption>}
        >
          Withdrawable:
        </LabelWithTooltip>
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.Caption>{withdrawable ? `$${formatNumber(withdrawable, 0)}` : '--'}</Type.Caption>
          {!!withdrawablePercent && (
            <Flex
              alignItems="center"
              justifyContent="center"
              sx={{
                px: 1,
                borderRadius: '4px',
                bg: 'neutral5',
                color: 'neutral2',
              }}
            >
              <Type.Caption>{formatNumber(withdrawablePercent, 2, 2)}%</Type.Caption>
            </Flex>
          )}
        </Flex>
      </Flex>
      <Flex flexDirection={['column', 'row']} alignItems={['flex-start', 'center']} sx={{ gap: [0, 2] }}>
        <LabelWithTooltip
          id="tt_leverage"
          sx={{
            color: 'neutral3',
          }}
          tooltip={<Type.Caption color="neutral1">Total position value</Type.Caption>}
        >
          Leverage:
        </LabelWithTooltip>
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.Caption>{totalPosValue ? `$${formatNumber(totalPosValue, 0)}` : '--'}</Type.Caption>
          {!!leverage && (
            <Flex
              alignItems="center"
              justifyContent="center"
              sx={{
                px: 1,
                borderRadius: '4px',
                bg: bgColor,
                color: textColor,
              }}
            >
              <Type.Caption>{formatLeverage(MarginModeEnum.ISOLATED, leverage)}</Type.Caption>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
