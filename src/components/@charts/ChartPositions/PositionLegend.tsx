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
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import { Button } from 'theme/Buttons'
import SkullIcon from 'theme/Icons/SkullIcon'
import { Box, Flex, Type } from 'theme/base'
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
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: data.protocol })
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
        isLong: data.isLong,
        nextHours: nextHoursParam,
      })
    )
  }

  const handleDismiss = useCallback(() => {
    setTimeout(() => setOpenDrawer(false), 0)
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
  }, [])

  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)
  const pnl = pnlWithFeeEnabled ? data.pnl : data.realisedPnl
  const roi = pnlWithFeeEnabled ? data.roi : data.realisedRoi

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
        bg: 'neutral6',
        border: 'none',
        borderBottom: 'small',
        borderBottomColor: 'neutral4',
        '&:hover:not(:disabled),&:active:not(:disabled)': {
          bg: 'neutral5',
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
          <Type.Caption color="neutral3">
            <RelativeShortTimeText date={isOpening ? data.openBlockTime : data.closeBlockTime} />
          </Type.Caption>
        </Flex>
        {isExpanded && (
          <Flex minWidth="100px" flexDirection="column" alignItems="flex-start" sx={{ gap: 2 }}>
            <Type.Small>Entry</Type.Small>
            <Type.Caption color="neutral1">{renderEntry(data)}</Type.Caption>
          </Flex>
        )}
        <Flex minWidth="110px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
          <Type.Small>Size</Type.Small>
          <Type.Caption color="neutral1">
            ${formatNumber(data.size, 0)} | {formatLeverage(data.marginMode, data.leverage)}
          </Type.Caption>
        </Flex>

        <Flex minWidth="70px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
          <Type.Small>PnL</Type.Small>
          {isOpening ? (
            prices ? (
              renderOpeningPnLWithPrices(data, prices, true)
            ) : (
              '--'
            )
          ) : (
            <Flex alignItems="center" sx={{ gap: '1px' }}>
              {data.isLiquidate && <SkullIcon />}
              <SignedText value={pnl} maxDigit={0} sx={{ textAlign: 'right', width: '100%' }} />
            </Flex>
          )}
        </Flex>
        {isExpanded && (
          <Flex minWidth="70px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
            <Type.Small>ROI</Type.Small>
            {isOpening ? (
              renderOpeningRoiWithPrices(data, prices, false)
            ) : (
              <Flex alignItems="center" sx={{ gap: '1px' }}>
                {data.isLiquidate && <SkullIcon />}
                <Type.Caption>
                  <SignedText
                    value={roi}
                    maxDigit={2}
                    minDigit={2}
                    suffix="%"
                    sx={{ textAlign: 'right', width: '100%' }}
                    fontInherit={true}
                  />
                </Type.Caption>
              </Flex>
            )}
          </Flex>
        )}

        <Flex minWidth="60px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
          <Type.Small>Fee</Type.Small>
          <Type.Caption color="neutral1">
            <SignedText value={-data.fee} maxDigit={0} fontInherit={true} sx={{ textAlign: 'right', width: '100%' }} />
          </Type.Caption>
        </Flex>

        <Flex minWidth="20px" flexDirection="column" alignItems="flex-end" sx={{ gap: 2 }}>
          <Box sx={{ position: 'relative', top: '2px' }}>
            <CaretRight />
          </Box>
        </Flex>
      </Flex>
      {openDrawer && (
        <TraderPositionDetailsDrawer
          isOpen={openDrawer}
          onDismiss={handleDismiss}
          protocol={data.protocol}
          id={data.id}
          chartProfitId="chart-positions"
        />
      )}
    </Button>
  )
}
