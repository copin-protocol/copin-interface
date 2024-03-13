import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import PositionStatus from 'components/@ui/PositionStatus'
import { renderEntry, renderSize, renderSizeOpeningWithPrices } from 'components/@ui/Table/renderProps'
import { PositionData } from 'entities/trader'
import { UsdPrices, useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { Box, Flex, Type } from 'theme/base'
import { OrderTypeEnum, PositionStatusEnum } from 'utils/config/enums'
import { formatDuration, formatNumber } from 'utils/helpers/format'

import SharePosition from './SharePosition'

interface PositionStatsProps {
  data: PositionData
  prices: UsdPrices
  hasFundingFee: boolean
  hasLiquidate: boolean
  isOpening: boolean
}

export default function PositionStats({ data }: { data: PositionData }) {
  const { md } = useResponsive()
  const { prices } = useRealtimeUsdPricesStore()
  const hasFundingFee = !!data?.funding
  const isOpening = data?.status === PositionStatusEnum.OPEN
  const hasLiquidate = (data?.orders?.filter((e) => e.type === OrderTypeEnum.LIQUIDATE) ?? []).length > 0

  return (
    <Box py={[2, 3]} sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
      {md ? (
        <DesktopLayout
          data={data}
          prices={prices}
          hasFundingFee={hasFundingFee}
          hasLiquidate={hasLiquidate}
          isOpening={isOpening}
        />
      ) : (
        <MobileLayout
          data={data}
          prices={prices}
          hasFundingFee={hasFundingFee}
          hasLiquidate={hasLiquidate}
          isOpening={isOpening}
        />
      )}
    </Box>
  )
}

const DesktopLayout = ({ data, prices, hasFundingFee, hasLiquidate, isOpening }: PositionStatsProps) => {
  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 3 }}>
        <Flex alignItems="center" sx={{ gap: 3, flexWrap: 'wrap' }}>
          <Type.Caption>
            <RelativeTimeText date={data.openBlockTime} />
          </Type.Caption>
          {renderEntry(data)}
          <Flex width={240}>
            {isOpening ? renderSizeOpeningWithPrices(data, prices) : renderSize(data, hasLiquidate)}
          </Flex>
        </Flex>
        <Flex alignItems="center" sx={{ gap: 3 }}>
          <PositionStatus
            status={hasLiquidate ? PositionStatusEnum.LIQUIDATE : isOpening ? PositionStatusEnum.OPEN : data.status}
          />
          <SharePosition isOpening={isOpening} stats={data} />
        </Flex>
      </Flex>
      <Flex mt={3} alignItems="center" justifyContent="space-between" sx={{ gap: [2, 24], flexWrap: 'wrap' }}>
        <Flex alignItems="center" sx={{ gap: [2, 24], flexWrap: 'wrap' }}>
          <DesktopItemInfo label={<Trans>Duration:</Trans>} value={formatDuration(data.durationInSecond)} />
          <DesktopItemInfo
            label={<Trans>Total Collateral:</Trans>}
            value={data.collateral ? `$${formatNumber(data.collateral, 0)}` : '--'}
          />
          <DesktopItemInfo
            label={<Trans>Paid Fees:</Trans>}
            value={<SignedText value={-data.fee} maxDigit={0} prefix="$" />}
          />
          <DesktopItemInfo
            label={<Trans>Funding:</Trans>}
            value={hasFundingFee ? <SignedText value={-data.funding} maxDigit={0} prefix="$" /> : '--'}
          />
        </Flex>
      </Flex>
    </Box>
  )
}

const MobileLayout = ({ data, prices, hasFundingFee, hasLiquidate, isOpening }: PositionStatsProps) => {
  return (
    <Flex flexDirection="column" sx={{ gap: 2 }}>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 3 }}>
        <Flex alignItems="center" sx={{ gap: 12, flexWrap: 'wrap' }}>
          <Type.Caption>
            <RelativeTimeText date={data.openBlockTime} />
          </Type.Caption>
          {renderEntry(data)}
        </Flex>
        <SharePosition isOpening={isOpening} stats={data} />
      </Flex>
      <Flex width="100%" mb={1}>
        {isOpening ? renderSizeOpeningWithPrices(data, prices) : renderSize(data)}
      </Flex>
      <Flex width="100%" alignItems="center" sx={{ gap: 3, flexWrap: 'wrap' }}>
        <MobileItemInfo
          label={<Trans>Total Collateral:</Trans>}
          value={data.collateral ? `$${formatNumber(data.collateral, 0)}` : '--'}
        />
        <MobileItemInfo label={<Trans>Duration:</Trans>} value={formatDuration(data.durationInSecond)} />
        <MobileItemInfo
          label={<Trans>Status:</Trans>}
          value={
            <PositionStatus
              status={hasLiquidate ? PositionStatusEnum.LIQUIDATE : isOpening ? PositionStatusEnum.OPEN : data.status}
            />
          }
        />
      </Flex>
      <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
        <MobileItemInfo
          label={<Trans>Paid Fees:</Trans>}
          value={<SignedText value={-data.fee} maxDigit={0} prefix="$" />}
        />
        <MobileItemInfo
          label={<Trans>Funding:</Trans>}
          value={hasFundingFee ? <SignedText value={-data.funding} maxDigit={0} prefix="$" /> : '--'}
        />
        <MobileItemInfo label={''} value={''} />
      </Flex>
    </Flex>
  )
}

const DesktopItemInfo = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
    <Type.Caption color="neutral3">{label}</Type.Caption>
    <Type.Caption textAlign="right">{value}</Type.Caption>
  </Flex>
)

const MobileItemInfo = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  <Flex flex={1} flexDirection="column">
    <Type.Caption color="neutral3">{label}</Type.Caption>
    <Type.Caption>{value}</Type.Caption>
  </Flex>
)
