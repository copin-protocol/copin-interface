import { CaretRight } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'

import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import { renderEntry, renderOpeningPnLWithPrices, renderOpeningRoiWithPrices } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useSearchParams from 'hooks/router/useSearchParams'
import { Button } from 'theme/Buttons'
import SkullIcon from 'theme/Icons/SkullIcon'
import { Box, Flex, Type } from 'theme/base'
import { GAINS_TRADE_PROTOCOLS } from 'utils/config/constants'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { formatLeverage, formatNumber } from 'utils/helpers/format'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

export default function PositionLegend({
  isExpanded,
  isOpening,
  data,
}: {
  isExpanded?: boolean
  isOpening: boolean
  data: PositionData
}) {
  const { prices: pythPrices, gainsPrices } = useGetUsdPrices()
  const prices = GAINS_TRADE_PROTOCOLS.includes(data.protocol) ? gainsPrices : pythPrices
  const [openDrawer, setOpenDrawer] = useState(false)
  const history = useHistory()
  const { searchParams } = useSearchParams()
  const nextHoursParam = searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
    ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
    : undefined

  const handleSelectItem = (data: PositionData) => {
    setOpenDrawer(true)
    window.history.replaceState(
      null,
      '',
      generatePositionDetailsRoute({
        id: data.id,
        txHash: data.txHashes?.[0],
        account: data.account,
        logId: data.logId,
        protocol: data.protocol,
        nextHours: nextHoursParam,
      })
    )
  }

  const handleDismiss = useCallback(() => {
    setOpenDrawer(false)
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
  }, [])

  return (
    <Button
      width="100%"
      variant="info"
      type="button"
      sx={{
        mx: 0,
        px: 12,
        py: 2,
        borderRadius: 0,
        bg: 'neutral4',
        '&:hover:not(:disabled),&:active:not(:disabled)': {
          bg: '#414763',
        },
      }}
      onClick={() => handleSelectItem(data)}
    >
      <Flex
        width="100%"
        justifyContent="space-between"
        color="neutral3"
        alignItems="center"
        sx={{ overflowX: 'auto', py: 1 }}
      >
        <Flex minWidth="30px" flexDirection="column" alignItems="flex-start" sx={{ gap: 2 }}>
          <Type.Small>Time</Type.Small>
          <Type.Small color="neutral3">
            <RelativeShortTimeText date={isOpening ? data.openBlockTime : data.closeBlockTime} />
          </Type.Small>
        </Flex>
        {isExpanded && (
          <Flex minWidth="100px" flexDirection="column" alignItems="flex-start" sx={{ gap: 2 }}>
            <Type.Small>Entry</Type.Small>
            <Type.Small color="neutral1">{renderEntry(data, { fontSize: '12px', lineHeight: '16px' })}</Type.Small>
          </Flex>
        )}
        <Flex minWidth="110px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
          <Type.Small>Size</Type.Small>
          <Type.Small color="neutral1">
            ${formatNumber(data.size, 0)} | {formatLeverage(data.marginMode, data.leverage)}
          </Type.Small>
        </Flex>

        <Flex minWidth="70px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
          <Type.Small>PnL</Type.Small>
          {isOpening ? (
            prices ? (
              renderOpeningPnLWithPrices(data, prices, true, { fontSize: '12px', lineHeight: '16px' })
            ) : (
              '--'
            )
          ) : (
            <Flex alignItems="center" sx={{ gap: '1px' }}>
              {data.isLiquidate && <SkullIcon />}
              <SignedText
                value={data.pnl}
                maxDigit={0}
                sx={{ textAlign: 'right', width: '100%', fontSize: '12px', lineHeight: '16px' }}
              />
            </Flex>
          )}
        </Flex>
        {isExpanded && (
          <Flex minWidth="70px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
            <Type.Small>ROI</Type.Small>
            {isOpening ? (
              renderOpeningRoiWithPrices(data, prices, false, { fontSize: '12px', lineHeight: '16px' })
            ) : (
              <Flex alignItems="center" sx={{ gap: '1px' }}>
                {data.isLiquidate && <SkullIcon />}
                <Type.Small>
                  <SignedText
                    value={data.roi}
                    maxDigit={2}
                    minDigit={2}
                    suffix="%"
                    sx={{ textAlign: 'right', width: '100%', fontSize: '12px', lineHeight: '16px' }}
                    fontInherit={true}
                  />
                </Type.Small>
              </Flex>
            )}
          </Flex>
        )}

        <Flex minWidth="60px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
          <Type.Small>Fee</Type.Small>
          <Type.Small color="neutral1">
            <SignedText
              value={-data.fee}
              maxDigit={0}
              fontInherit={true}
              sx={{ textAlign: 'right', width: '100%', fontSize: '12px', lineHeight: '16px' }}
            />
          </Type.Small>
        </Flex>

        <Flex minWidth="20px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
          <Box sx={{ position: 'relative', top: '2px' }}>
            <CaretRight />
          </Box>
        </Flex>
      </Flex>
      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={data.protocol}
        id={data.id}
        chartProfitId="chart-positions"
      />
    </Button>
  )
}
