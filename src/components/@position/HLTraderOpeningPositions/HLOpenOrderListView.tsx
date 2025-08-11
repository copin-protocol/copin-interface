import { Trans } from '@lingui/macro'
import { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import {
  renderDirection,
  renderOpenTime,
  renderPrice,
  renderReduceOnly,
  renderSize,
  renderSizeInToken,
  renderSymbol,
  renderTriggerCondition,
  renderType,
} from 'components/@position/configs/hlOrderRenderProps'
import NoDataFound from 'components/@ui/NoDataFound'
import { HlOrderData } from 'entities/hyperliquid'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'

type Props = {
  isLoading: boolean
  data?: HlOrderData[]
  scrollDep: any
  sx?: any
}

export default function HLOpenOrderListView({ data, isLoading, scrollDep }: Props) {
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
          <Box sx={{ p: [2, 3] }} key={item.timestamp + item.orderId + index}>
            <RowWrapper>
              <RowItem label={<Trans>Pair</Trans>} value={renderSymbol(item)} />
              <RowItem label={<Trans>Time</Trans>} value={renderOpenTime(item)} />
              <RowItem label={<Trans>Type</Trans>} value={renderType(item)} />
            </RowWrapper>
            <RowWrapper mt={2}>
              <RowItem label={<Trans>Direction</Trans>} value={renderDirection(item)} />
              <RowItem label={<Trans>Price</Trans>} value={renderPrice(item)} />
              <RowItem label={<Trans>Trigger Condition</Trans>} value={renderTriggerCondition(item)} />
            </RowWrapper>
            <RowWrapper mt={2}>
              <RowItem label={<Trans>Size</Trans>} value={renderSizeInToken(item)} />
              <RowItem label={<Trans>Value</Trans>} value={renderSize(item)} />
              <RowItem label={<Trans>Reduce Only</Trans>} value={renderReduceOnly(item)} />
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
