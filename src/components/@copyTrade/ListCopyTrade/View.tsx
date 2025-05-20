import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import { CopyTradeWithCheckingData } from 'components/@copyTrade/types'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import ReverseTag from 'components/@ui/ReverseTag'
import useCopyTradePermission from 'hooks/features/subscription/useCopyTradePermission'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import Loading from 'theme/Loading'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { TOOLTIP_KEYS } from 'utils/config/keys'

import SelectCopyTradeCheckbox from './SelectCopyTradeCheckbox'
import { ExternalResource } from './types'
import { ListCopyTradeRenderProps } from './useListCopyTradeConfig'

export function CopyTable({
  sortedData,
  columns,
  isLoading,
  currentSort,
  changeCurrentSort,
  externalSource,
  bg,
}: {
  sortedData: CopyTradeWithCheckingData[] | undefined
  columns: ColumnData<CopyTradeWithCheckingData, ExternalResource>[]
  isLoading: boolean
  currentSort: TableSortProps<CopyTradeWithCheckingData> | undefined
  changeCurrentSort: (sort: TableSortProps<CopyTradeWithCheckingData> | undefined) => void
  externalSource?: ExternalResource
  bg?: string
}) {
  return (
    <>
      <Table
        restrictHeight
        data={sortedData}
        columns={columns}
        isLoading={isLoading}
        currentSort={currentSort}
        changeCurrentSort={changeCurrentSort}
        externalSource={externalSource}
        tableBodySx={{
          borderSpacing: '0px 4px',
          '& td': {
            bg: bg ?? 'neutral6',
          },
          '& tr:hover td': {
            bg: 'neutral5',
          },
        }}
      />
      <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE}>
        <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
          <Trans>Reverse Copy</Trans>
        </Type.Caption>
      </Tooltip>
    </>
  )
}

export function ListCopyCEX({
  sortedData,
  isLoading,
  renderProps,
}: {
  sortedData: CopyTradeWithCheckingData[] | undefined
  isLoading: boolean
  renderProps: ListCopyTradeRenderProps
}) {
  const { userPermission } = useCopyTradePermission()
  const { userPermission: userProtocolPermission } = useProtocolPermission()
  if (isLoading) return <Loading />
  if (!isLoading && !sortedData?.length) return <NoDataFound />
  return (
    <Flex py={2} sx={{ flexDirection: 'column', gap: 2, width: '100%', height: '100%', overflow: 'hidden auto' }}>
      {sortedData?.map((data) => {
        return (
          <Box key={data.id} sx={{ bg: 'neutral6', px: 3, py: 2, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, left: 8 }}>{data.reverseCopy && <ReverseTag />}</Box>
            <Flex sx={{ gap: 1, alignItems: 'center', width: '100%' }}>
              <Flex flex="1" sx={{ ...(data.reverseCopy ? { pl: 2 } : {}), gap: 1 }} alignItems="center">
                <SelectCopyTradeCheckbox type="copyTrade" data={data} />
                {renderProps.renderTitle(data)}
              </Flex>
              <Flex sx={{ alignItems: 'center', gap: 3 }}>
                {renderProps.renderToggleRunning(data)}
                {renderProps.renderOptions(data, { placement: 'bottomRight' })}
              </Flex>
            </Flex>
            <Divider my={2} color="neutral5" />
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <ListCopyRowItem
                label={<Trans>Trader</Trans>}
                value={renderProps.renderCopyTrader({
                  data,
                  options: {
                    protocolNotAllowed: !userProtocolPermission?.protocolAllowed?.includes(data.protocol),
                    exchangeNotAllowed: !userPermission?.exchangeAllowed?.includes(data.exchange),
                  },
                })}
              />
              <ListCopyRowItem label={<Trans>Max Margin/Order</Trans>} value={renderProps.renderVolume(data)} />
              <ListCopyRowItem label={<Trans>Leverage</Trans>} value={renderProps.renderLeverage(data)} />
              <ListCopyRowItem label={<Trans>Trading Pairs</Trans>} value={renderProps.renderMarkets(data)} />
              <ListCopyRowItem label={<Trans>Advance</Trans>} value={renderProps.renderRiskControl(data)} />
              <ListCopyRowItem label={<Trans>SL/TP</Trans>} value={renderProps.renderSLTP(data)} />
            </Flex>
            <Flex
              mt={2}
              sx={{ alignItems: 'center', justifyContent: 'space-between', columnGap: 12, rowGap: 2, flexWrap: 'wrap' }}
            >
              <ListPNLItem label={<Trans>7D Pnl</Trans>} value={renderProps.render7DPNL(data)} />
              <ListPNLItem label={<Trans>30D Pnl</Trans>} value={renderProps.render30DPNL(data)} />
              <ListPNLItem label={<Trans>Total Pnl</Trans>} value={renderProps.renderTotalPNL(data)} />
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}

export function ListCopyDEX({
  sortedData,
  isLoading,
  renderProps,
}: {
  sortedData: CopyTradeWithCheckingData[] | undefined
  isLoading: boolean
  renderProps: ListCopyTradeRenderProps
}) {
  if (isLoading) return <Loading />
  if (!isLoading && !sortedData?.length) return <NoDataFound />
  return (
    <Flex py={2} sx={{ flexDirection: 'column', gap: 2, width: '100%', height: '100%', overflow: 'hidden auto' }}>
      {sortedData?.map((data) => {
        return (
          <Box key={data.id} sx={{ bg: 'neutral6', px: 3, py: 2, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, left: 8 }}>{data.reverseCopy && <ReverseTag />}</Box>
            <Flex sx={{ gap: 1, alignItems: 'center', width: '100%' }}>
              <Box flex="1" sx={data.reverseCopy ? { pl: 2 } : {}}>
                {renderProps.renderTitle(data)}
              </Box>
              <Flex sx={{ alignItems: 'center', gap: 3 }}>
                {renderProps.renderToggleRunning(data)}
                {renderProps.renderOptions(data, { placement: 'bottomRight' })}
              </Flex>
            </Flex>
            <Divider my={2} color="neutral5" />
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <ListCopyRowItem label={<Trans>Trader</Trans>} value={renderProps.renderCopyTrader({ data })} />
              <ListCopyRowItem label={<Trans>Max Margin/Order</Trans>} value={renderProps.renderVolume(data)} />
              <ListCopyRowItem label={<Trans>Leverage</Trans>} value={renderProps.renderLeverage(data)} />
              <ListCopyRowItem label={<Trans>Trading Pairs</Trans>} value={renderProps.renderMarkets(data)} />
              <ListCopyRowItem label={<Trans>Advance</Trans>} value={renderProps.renderRiskControl(data)} />
              <ListCopyRowItem label={<Trans>SL/TP</Trans>} value={renderProps.renderSLTP(data)} />
            </Flex>
            <Flex
              mt={2}
              sx={{ alignItems: 'center', justifyContent: 'space-between', columnGap: 12, rowGap: 2, flexWrap: 'wrap' }}
            >
              <ListPNLItem label={<Trans>7D Pnl</Trans>} value={renderProps.render7DPNL(data)} />
              <ListPNLItem label={<Trans>30D Pnl</Trans>} value={renderProps.render30DPNL(data)} />
              <ListPNLItem label={<Trans>Total Pnl</Trans>} value={renderProps.renderTotalPNL(data)} />
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}

function ListCopyRowItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
      <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
        {label}
      </Type.Caption>
      {value}
    </Flex>
  )
}

function ListPNLItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: '4px' }}>
      <Type.Caption color="neutral3">{label}:</Type.Caption>
      {value}
    </Flex>
  )
}
