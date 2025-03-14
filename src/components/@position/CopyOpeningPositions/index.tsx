import { Trans } from '@lingui/macro'
import { Copy, PersonSimpleRun } from '@phosphor-icons/react'
import { ComponentProps, ReactNode } from 'react'

import { IconMessageBox } from 'components/@ui/IconMessageBox'
import { CopyPositionData } from 'entities/copyTrade'
import HyperLiquidIcon from 'theme/Icons/HyperliquidIcon'
import { Flex, Type } from 'theme/base'

import CopyPositionsListView from '../CopyPositionsListView'
import CopyPositionsTableView from '../CopyPositionsTableView'
import { LayoutType, MobileLayoutType } from '../types'
import { getColumns } from './configs'

export default function CopyOpeningPositions({
  data,
  isLoading,
  layoutType,
  tableProps = {},
  onClosePositionSuccess,
  hasFilter = false,
  mobileLayoutType,
  noDataComponent,
  excludingColumnKeys,
}: {
  data: CopyPositionData[] | undefined
  isLoading: boolean
  layoutType: LayoutType
  tableProps?: Partial<ComponentProps<typeof CopyPositionsTableView>>
  onClosePositionSuccess: () => void
  hasFilter?: boolean
  mobileLayoutType?: MobileLayoutType
  noDataComponent?: ReactNode
  excludingColumnKeys?: (keyof CopyPositionData)[]
}) {
  const title = <Trans>Opening Positions</Trans>

  const isGrid = mobileLayoutType === 'GRID' && layoutType === 'lite'

  return (
    <>
      {!hasFilter && !data?.length && !isLoading && <NoOpeningPositionMessage layoutType={layoutType} title={title} />}

      {(!!data?.length || hasFilter) &&
        (isGrid ? (
          <CopyPositionsListView
            layoutType={layoutType}
            data={data ?? []}
            isLoading={isLoading}
            onClosePositionSuccess={onClosePositionSuccess}
            isOpening
            noDataComponent={noDataComponent}
          />
        ) : (
          <CopyPositionsTableView
            {...tableProps}
            data={data ?? []}
            columns={getColumns({ type: layoutType, excludingColumnKeys })}
            isLoading={isLoading}
            onClosePositionSuccess={onClosePositionSuccess}
            layoutType={layoutType}
            noDataComponent={noDataComponent}
          />
        ))}
    </>
  )
}

function NoOpeningPositionMessage({ title, layoutType }: { title: ReactNode; layoutType: LayoutType }) {
  if (layoutType === 'lite')
    return (
      <IconMessageBox
        message="All of your opening positions will be shown here"
        icons={[
          { icon: <PersonSimpleRun size={24} />, description: 'Trader places an order' },
          { icon: <Copy size={24} />, description: 'System creates a copy order' },
          { icon: <HyperLiquidIcon size={24} />, description: 'Your order will be executed' },
        ]}
      />
    )

  return (
    <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
      <Type.CaptionBold display="block">
        <Trans>Your {title} Is Empty</Trans>
      </Type.CaptionBold>
      <Type.Caption mt={1} color="neutral3" display="block">
        <Trans>Once you have a position, you’ll see it listed here</Trans>
      </Type.Caption>
    </Flex>
  )
}
