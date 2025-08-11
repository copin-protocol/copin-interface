import { Trans } from '@lingui/macro'
import { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import NoDataFound from 'components/@ui/NoDataFound'
import { GroupedFillsData } from 'entities/hyperliquid'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'

import {
  renderDirection,
  renderFees,
  renderFills,
  renderFillsBlockTime,
  renderPair,
  renderPnl,
  renderPrice,
  renderSizeToken,
  renderSizeUsd,
} from '../configs/hlFillRenderProps'

type Props = {
  isLoading: boolean
  data?: GroupedFillsData[]
  scrollDep: any
  sx?: any
}

export default function HLOrderFilledListView({ data, isLoading, scrollDep }: Props) {
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
      {data?.map((item, index) => {
        return (
          <Box sx={{ p: [2, 3] }} key={index + item.pair + item.orderId + item.txHash + item.timestamp}>
            <RowWrapper>
              <RowItem label={<Trans>Pair</Trans>} value={renderPair(item)} />
              <RowItem label={<Trans>Direction</Trans>} value={renderDirection(item)} />
              <RowItem label={<Trans>Price</Trans>} value={renderPrice(item)} />
            </RowWrapper>
            <RowWrapper mt={2}>
              <RowItem label={<Trans>Time</Trans>} value={renderFillsBlockTime(item)} />
              <RowItem label={<Trans>Size</Trans>} value={renderSizeToken(item)} />
              <RowItem label={<Trans>Value</Trans>} value={renderSizeUsd(item)} />
            </RowWrapper>
            <RowWrapper mt={2}>
              <RowItem label={<Trans>Fill Count</Trans>} value={renderFills(item)} />
              <RowItem label={<Trans>Fees</Trans>} value={renderFees(item)} />
              <RowItem label={<Trans>PnL</Trans>} value={renderPnl(item)} />
            </RowWrapper>
          </Box>
        )
      })}
    </Flex>
  )
}

const RowWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 2fr 3fr;
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
