import { Trans } from '@lingui/macro'
import { Copy, Icon, PersonSimpleRun } from '@phosphor-icons/react'
import { ComponentProps, ReactNode } from 'react'

import { CopyPositionData } from 'entities/copyTrade'
import DashedArrow from 'theme/Icons/DashedArrow'
import HyperLiquidIcon from 'theme/Icons/HyperliquidIcon'
import { Box, Flex, IconBox, Type } from 'theme/base'

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
      <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
        <Type.Body color="neutral3" display="block" mb={3} textAlign="center">
          <Trans>All of your opening positions will be shown here</Trans>
        </Type.Body>
        <Flex sx={{ width: '100%', maxWidth: 450, alignItems: 'stretch', justifyContent: 'space-between' }}>
          <IconWrapper icon={PersonSimpleRun} description={<Trans>Trader places an order</Trans>} />
          <Box pt={3}>
            <DashedArrow />
          </Box>
          <IconWrapper icon={Copy} description={<Trans>System creates a copy order</Trans>} />
          <Box pt={3}>
            <DashedArrow />
          </Box>
          <IconWrapper icon={HyperLiquidIcon as Icon} description={<Trans>Your order will be executed</Trans>} />
        </Flex>
      </Flex>
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

function IconWrapper({ icon: Icon, description }: { icon: Icon; description: ReactNode }) {
  return (
    <Flex sx={{ flexShrink: 0, width: 85, flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <IconBox
        icon={<Icon size={24} />}
        sx={{
          color: 'neutral3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          bg: 'neutral5',
          borderRadius: '6px',
        }}
      />
      <Type.Small color="neutral3" textAlign="center">
        {description}
      </Type.Small>
    </Flex>
  )
}
