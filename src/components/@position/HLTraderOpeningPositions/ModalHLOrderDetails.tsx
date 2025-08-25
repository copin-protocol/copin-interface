import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/macro'

import { getHlOrderDetailsByOid } from 'apis/hyperliquid'
import {
  renderDirection,
  renderOpenTime,
  renderOriginalSizeInToken,
  renderPrice,
  renderReduceOnly,
  renderSymbol,
  renderTif,
  renderTriggerCondition,
  renderType,
} from 'components/@position/configs/hlOrderRenderProps'
import { parseHLOrderData } from 'components/@position/helpers/hyperliquid'
import NoDataFound from 'components/@ui/NoDataFound'
import { GroupedFillsData } from 'entities/hyperliquid'
import Loading from 'theme/Loading'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'

export default function ModalHLOrderDetails({ order, onDismiss }: { order: GroupedFillsData; onDismiss: () => void }) {
  const { data: orderDetails, isLoading } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_ORDER_DETAILS, order.account, order.orderId],
    () =>
      getHlOrderDetailsByOid({
        user: order.account,
        oid: order.orderId,
      }),
    {
      enabled: !!order.account && !!order.orderId,
      retry: 0,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderData({ account: order.account, data: !!data ? [data] : [] })?.[0]
      },
    }
  )

  return (
    <Modal isOpen maxWidth="350px" title={<Trans>DETAILS</Trans>} onDismiss={() => onDismiss()} hasClose>
      {isLoading ? (
        <Loading />
      ) : !!orderDetails ? (
        <Flex flexDirection="column" p={3} sx={{ gap: 2 }}>
          <RowItem label={<Trans>Time</Trans>} value={renderOpenTime(orderDetails)} />
          <RowItem label={<Trans>Type</Trans>} value={renderType(orderDetails)} />
          <RowItem label={<Trans>Pair</Trans>} value={renderSymbol(orderDetails)} />
          <RowItem label={<Trans>Direction</Trans>} value={renderDirection(orderDetails)} />
          <RowItem label={<Trans>Original Size</Trans>} value={renderOriginalSizeInToken(orderDetails)} />
          <RowItem label={<Trans>Price</Trans>} value={renderPrice(orderDetails)} />
          <RowItem label={<Trans>Reduce Only</Trans>} value={renderReduceOnly(orderDetails)} />
          <RowItem label={<Trans>Trigger Condition</Trans>} value={renderTriggerCondition(orderDetails)} />
          <RowItem label={<Trans>Tif</Trans>} value={renderTif(orderDetails)} />
        </Flex>
      ) : (
        <NoDataFound />
      )}
    </Modal>
  )
}

const RowWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
`
function RowItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Type.Caption color="neutral3" display="block">
        {label}
      </Type.Caption>
      <Type.Caption color="neutral1">{value}</Type.Caption>
    </Flex>
  )
}
