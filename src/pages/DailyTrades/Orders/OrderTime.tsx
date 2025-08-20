import React from 'react'

import { renderOrderBlockTime } from 'components/@position/TraderPositionDetails/ListOrderTable'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import { OrderData } from 'entities/trader'
import useGlobalStore from 'hooks/store/useGlobalStore'
import { Box, Flex, Type } from 'theme/base'
import { NO_TX_HASH_PROTOCOLS, TIME_FORMAT } from 'utils/config/constants'
import { PROTOCOL_PROVIDER } from 'utils/config/protocolProviderConfig'

function OrderTime({ data }: { data: OrderData }) {
  const [positionTimeType, currentTime] = useGlobalStore((state) => [state.positionTimeType, state.currentTime])
  return positionTimeType === 'absolute' ? (
    <Box>
      <Box display={['none', 'none', 'none', 'block']}>{renderOrderBlockTime(data)}</Box>
      <Box display={['block', 'block', 'block', 'none']}>{renderOrderBlockTime(data, TIME_FORMAT)}</Box>
    </Box>
  ) : (
    <Flex color="neutral2" sx={{ alignItems: 'center', gap: 2 }}>
      {/* // for update new time */}
      <Type.Caption>
        <RelativeTimeText key={currentTime} date={data.blockTime} />
      </Type.Caption>

      {!NO_TX_HASH_PROTOCOLS.includes(data.protocol) && !!data.txHash && (
        <ExplorerLogo
          protocol={data.protocol}
          explorerUrl={`${PROTOCOL_PROVIDER[data.protocol]?.explorerUrl}/tx/${data.txHash}`}
          size={18}
        />
      )}
    </Flex>
  )
}

export default OrderTime
