import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import styled from 'styled-components/macro'

import PositionStatus from 'components/@position/PositionStatus'
import {
  PairComponent,
  renderEntryPrice,
  renderLiquidPrice,
  renderMarkPrice,
  renderPositionCollateral,
  renderPositionFunding,
  renderSizeInToken,
  renderValue,
} from 'components/@position/configs/hlPositionRenderProps'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box, Flex, Type } from 'theme/base'
import { SxProps } from 'theme/types'
import { PositionStatusEnum } from 'utils/config/enums'

export default function HLPositionStats({ data }: { data: PositionData }) {
  const { xl, md } = useResponsive()
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: data.protocol })

  return (
    <Box py={[2, 3]}>
      <Box>
        <Flex alignItems="flex-start" justifyContent="space-between" sx={{ gap: [2, 24] }}>
          {xl ? (
            <Flex alignItems="center" sx={{ gap: 24, flexWrap: 'wrap' }}>
              <ItemInfo label={<Trans>Pair</Trans>} value={<PairComponent data={data} />} />
              <ItemInfo label={<Trans>Size</Trans>} value={renderSizeInToken(data)} />
              <ItemInfo label={<Trans>Value</Trans>} value={renderValue(data)} />
              <ItemInfo label={<Trans>Entry Price</Trans>} value={renderEntryPrice(data)} />
              <ItemInfo label={<Trans>Mark Price</Trans>} value={renderMarkPrice(data, prices)} />
              <ItemInfo label={<Trans>Liq. Price</Trans>} value={renderLiquidPrice(data)} />
              <ItemInfo label={<Trans>Collateral</Trans>} value={renderPositionCollateral({ item: data })} />
              <ItemInfo label={<Trans>Funding</Trans>} value={renderPositionFunding({ item: data })} />
            </Flex>
          ) : md ? (
            <Box>
              <RowWrapper>
                <ItemInfo label={<Trans>Pair</Trans>} value={<PairComponent data={data} />} />
                <ItemInfo label={<Trans>Size</Trans>} value={renderSizeInToken(data)} />
                <ItemInfo label={<Trans>Value</Trans>} value={renderValue(data)} />
                <ItemInfo label={<Trans>Funding</Trans>} value={renderPositionFunding({ item: data })} />
              </RowWrapper>
              <RowWrapper mt={2}>
                <ItemInfo label={<Trans>Collateral</Trans>} value={renderPositionCollateral({ item: data })} />
                <ItemInfo label={<Trans>Entry Price</Trans>} value={renderEntryPrice(data)} />
                <ItemInfo label={<Trans>Mark Price</Trans>} value={renderMarkPrice(data, prices)} />
                <ItemInfo label={<Trans>Liq. Price</Trans>} value={renderLiquidPrice(data)} />
              </RowWrapper>
            </Box>
          ) : (
            <Box>
              <MobileRowWrapper>
                <ItemInfo label={<Trans>Pair</Trans>} value={<PairComponent data={data} />} />
                <ItemInfo label={<Trans>Size</Trans>} value={renderSizeInToken(data)} />
                <ItemInfo label={<Trans>Value</Trans>} value={renderValue(data)} />
              </MobileRowWrapper>
              <MobileRowWrapper my={2}>
                <ItemInfo label={<Trans>Entry Price</Trans>} value={renderEntryPrice(data)} />
                <ItemInfo label={<Trans>Mark Price</Trans>} value={renderMarkPrice(data, prices)} />
                <ItemInfo label={<Trans>Liq. Price</Trans>} value={renderLiquidPrice(data)} />
              </MobileRowWrapper>
              <MobileRowWrapper>
                <ItemInfo label={<Trans>Collateral</Trans>} value={renderPositionCollateral({ item: data })} />
                <ItemInfo label={<Trans>Funding</Trans>} value={renderPositionFunding({ item: data })} />
              </MobileRowWrapper>
            </Box>
          )}

          <Flex minWidth={48} alignItems="center" sx={{ gap: [2, 24] }}>
            <PositionStatus status={PositionStatusEnum.OPEN} />
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}

const ItemInfo = ({ label, value, sx }: { label: ReactNode; value: ReactNode } & SxProps) => (
  <Box sx={{ ...sx }}>
    <Type.Caption color="neutral3" display="block">
      {label}
    </Type.Caption>
    <Type.Caption textAlign="right">{value}</Type.Caption>
  </Box>
)

const RowWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 32px;
`

const MobileRowWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 16px;
`
