import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import ReverseTag from 'components/@ui/ReverseTag'
import Table from 'components/@ui/Table'
import { ColumnData, TableSortProps } from 'components/@ui/Table/types'
import { TraderCopyVolumeCheckingData } from 'components/TraderCopyVolumeWarningIcon'
import { CopyTradeData } from 'entities/copyTrade'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { TOOLTIP_KEYS } from 'utils/config/keys'

import { CopyTradeRenderProps } from './useCopyTradeColumns'

export type CopyTradeWithCheckingData = CopyTradeData & TraderCopyVolumeCheckingData

export function CopyTable({
  sortedData,
  columns,
  isLoading,
  currentSort,
  changeCurrentSort,
}: {
  sortedData: CopyTradeWithCheckingData[] | undefined
  columns: ColumnData<CopyTradeWithCheckingData>[]
  isLoading: boolean
  currentSort: TableSortProps<CopyTradeWithCheckingData> | undefined
  changeCurrentSort: (sort: TableSortProps<CopyTradeWithCheckingData> | undefined) => void
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
        tableHeadSx={{
          '& th': {
            border: 'none',
          },
        }}
        tableBodySx={{
          borderSpacing: '0px 4px',
          '& td': {
            bg: 'neutral6',
          },
          '& tr:hover td': {
            bg: 'neutral5',
          },
        }}
      />
      <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE} place="top" type="dark" effect="solid">
        <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
          <Trans>Reverse Copy</Trans>
        </Type.Caption>
      </Tooltip>
    </>
  )
}

export function ListCopy({
  sortedData,
  isLoading,
  renderProps,
}: {
  sortedData: CopyTradeWithCheckingData[] | undefined
  isLoading: boolean
  renderProps: CopyTradeRenderProps
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
              <ListCopyRowItem label={<Trans>Trader</Trans>} value={renderProps.renderTraderAccount(data)} />
              <ListCopyRowItem label={<Trans>Vol/Order</Trans>} value={renderProps.renderVolume(data)} />
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
