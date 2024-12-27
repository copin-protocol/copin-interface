import { Warning } from '@phosphor-icons/react'
import React from 'react'

import HLRealtimeChart from 'components/@charts/ChartHLPositionRealtime'
import { AmountText, PercentText } from 'components/@ui/DecoratedText/ValueText'
import { HlOrderData } from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'
import { TOOLTIP_CONTENT } from 'utils/config/options'
import { PROTOCOLS_CROSS_MARGIN } from 'utils/config/protocols'

export default function HLChartPositionComponent({
  data,
  orders,
}: {
  data: PositionData | undefined
  orders?: HlOrderData[]
}) {
  const isOpening = data?.status === PositionStatusEnum.OPEN

  return (
    <>
      {data && (
        <Box>
          <Flex
            mt={[20, 4]}
            mb={3}
            width="100%"
            alignItems="center"
            justifyContent="center"
            sx={{ gap: 2, position: 'relative' }}
          >
            <Flex>
              <Type.H5 color={data.pnl > 0 ? 'green1' : data.pnl < 0 ? 'red2' : 'inherit'}>
                <AmountText amount={data.pnl} maxDigit={0} suffix="$" />
              </Type.H5>
            </Flex>
            {!!data.roi && (
              <Flex alignItems="center">
                <Type.H5 color="neutral3">(</Type.H5>
                <Type.H5 color={data.roi > 0 ? 'green1' : data.roi < 0 ? 'red2' : 'inherit'}>
                  <PercentText percent={data.roi} digit={2} />
                </Type.H5>
                <Type.H5 color="neutral3">)</Type.H5>
              </Flex>
            )}
            {!isOpening && PROTOCOLS_CROSS_MARGIN.includes(data.protocol) && (
              <>
                <IconBox
                  icon={<Warning size={20} />}
                  color="orange"
                  sx={{ ml: 1 }}
                  data-tooltip-id={TOOLTIP_CONTENT.POSITION_CROSS_ROI.id + 'trader_position'}
                  data-tooltip-delay-show={260}
                />
                <Tooltip id={TOOLTIP_CONTENT.POSITION_CROSS_ROI.id + 'trader_position'}>
                  {TOOLTIP_CONTENT.POSITION_CROSS_ROI.content}
                </Tooltip>
              </>
            )}
          </Flex>
          {/*<RealtimeChart position={data} orders={data.orders} />*/}
          <HLRealtimeChart position={data} orders={orders} />
        </Box>
      )}
    </>
  )
}
