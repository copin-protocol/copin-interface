import { Trans } from '@lingui/macro'
import { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
import { v4 as uuid } from 'uuid'

import NoDataFound from 'components/@ui/NoDataFound'
import { HlHistoricalOrderData } from 'entities/hyperliquid'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { IGNORED_REASON_HL_ORDER_STATUS } from 'utils/config/constants'
import { HlOrderStatusEnum } from 'utils/config/enums'
import { HYPERLIQUID_ORDER_STATUS_TRANS } from 'utils/config/translations'
import { getSymbolFromPair } from 'utils/helpers/transform'

import {
  renderDirection,
  renderOpenTime,
  renderOrderStatus,
  renderOrderType,
  renderOriginalSizeInToken,
  renderPrice,
  renderSize,
  renderSizeInToken,
  renderSymbol,
  renderTriggerCondition,
} from '../configs/hlHistoricalOrderRenderProps'

type Props = {
  isLoading: boolean
  data?: HlHistoricalOrderData[]
  scrollDep: any
  sx?: any
}

export default function HLHistoricalOrderListView({ data, isLoading, scrollDep }: Props) {
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
      {!isLoading && data?.length === 0 && <NoDataFound message={<Trans>No order was found</Trans>} />}
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
        const tooltipId = uuid()
        return (
          <Box sx={{ p: [2, 3] }} key={tooltipId + index}>
            <RowWrapper>
              <RowItem label={<Trans>Pair</Trans>} value={renderSymbol(item)} />
              <RowItem label={<Trans>Time</Trans>} value={renderOpenTime(item)} />
              <RowItem label={<Trans>Type</Trans>} value={renderOrderType(item)} />
            </RowWrapper>
            <RowWrapper mt={2}>
              <RowItem label={<Trans>Direction</Trans>} value={renderDirection(item)} />
              <RowItem label={<Trans>Price</Trans>} value={renderPrice(item)} />
              <RowItem label={<Trans>Trigger Condition</Trans>} value={renderTriggerCondition(item)} />
            </RowWrapper>
            <RowWrapper mt={2}>
              <RowItem
                label={<Trans>Size</Trans>}
                value={
                  item.status === HlOrderStatusEnum.FILLED ? renderOriginalSizeInToken(item) : renderSizeInToken(item)
                }
              />
              <RowItem label={<Trans>Value</Trans>} value={renderSize(item)} />
              <RowItem label={<Trans>Status</Trans>} value={renderOrderStatus(item)} />
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
