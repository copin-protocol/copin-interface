import { Trans } from '@lingui/macro'
import { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import NoDataFound from 'components/@ui/NoDataFound'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import {
  PairComponent,
  renderEntryPrice,
  renderLiquidPrice,
  renderMarkPrice,
  renderPnLWithRoi,
  renderPositionCollateral,
  renderPositionFunding,
  renderSizeInToken,
  renderValue,
} from '../configs/hlPositionRenderProps'

type Props = {
  isLoading: boolean
  data?: PositionData[]
  scrollDep: any
  onClickItem?: (data: PositionData) => void
  hasAccountAddress?: boolean
  isOpening?: boolean
  sx?: any
  totalPositionValue?: number
}

export default function HLTraderPositionListView({
  data,
  isLoading,
  scrollDep,
  onClickItem,
  hasAccountAddress = true,
  isOpening = true,
  totalPositionValue,
}: Props) {
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: ProtocolEnum.HYPERLIQUID })

  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    wrapperRef.current?.scrollTo(0, 0)
  }, [scrollDep])
  return (
    <Flex
      ref={wrapperRef}
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4', '&:last-child': { borderBottom: 'none' } },
      }}
    >
      {!isLoading && data?.length === 0 && <NoDataFound message={<Trans>No position was found</Trans>} />}
      {isLoading && (
        <Flex
          sx={{
            alignItems: 'start',
            justifyContent: 'center',
            bg: 'modalBG1',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          <Box pt={100}>
            <Loading />
          </Box>
        </Flex>
      )}
      {data?.map((position) => {
        return (
          <Box role="button" sx={{ p: 2 }} key={position.id} onClick={() => onClickItem?.(position)}>
            <RowWrapper>
              <RowItem label={<Trans>Pair</Trans>} value={<PairComponent data={position} />} />
              <RowItem label={<Trans>Size</Trans>} value={renderSizeInToken(position)} />
              <RowItem label={<Trans>Value (Weight)</Trans>} value={renderValue(position, totalPositionValue)} />
            </RowWrapper>
            <RowWrapper mt={2}>
              <RowItem label={<Trans>Entry Price</Trans>} value={renderEntryPrice(position)} />
              <RowItem label={<Trans>Mark Price</Trans>} value={renderMarkPrice(position, prices)} />
              <RowItem label={<Trans>Liq. Price</Trans>} value={renderLiquidPrice(position)} />
            </RowWrapper>
            <RowWrapper mt={2}>
              <RowItem
                label={<Trans>Collateral</Trans>}
                value={renderPositionCollateral({ item: position, isCompactNumber: true })}
              />
              <RowItem
                label={<Trans>Funding</Trans>}
                value={renderPositionFunding({ item: position, isCompactNumber: true })}
              />
              <RowItem
                label={<Trans>PnL (ROI)</Trans>}
                value={renderPnLWithRoi({
                  item: position,
                  isCompactNumber: true,
                  sx: { justifyContent: 'flex-start' },
                })}
              />
            </RowWrapper>
          </Box>
        )
      })}
    </Flex>
  )
}

const RowWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 2.8fr 1.8fr 2.4fr;
  gap: 4px;
`
function RowItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Box>
      <Type.Small color="neutral3" display="block">
        {label}
      </Type.Small>
      <Type.Small color="neutral1">{value}</Type.Small>
    </Box>
  )
}
