import { ReactNode } from 'react'

import NoDataFound from 'components/@ui/NoDataFound'
import { TableProps } from 'components/@ui/Table/types'
import { CopyPositionData } from 'entities/copyTrade.d'
import Loading from 'theme/Loading'

import { ListForm, SimpleTableForm, TableForm } from './ListPositions'
import PositionsContainer, { ExternalSource } from './PositionsContainer'

export default function PositionTable({
  onClosePositionSuccess,
  layoutType = 'normal',
  ...tableProps
}: {
  onClosePositionSuccess: () => void
  layoutType?: 'simple' | 'normal'
} & TableProps<CopyPositionData, ExternalSource>) {
  return layoutType === 'normal' ? (
    <PositionsContainer onClosePositionSuccess={onClosePositionSuccess}>
      <TableForm tableProps={tableProps} />
    </PositionsContainer>
  ) : (
    <PositionsContainer onClosePositionSuccess={onClosePositionSuccess}>
      <SimpleTableForm tableProps={tableProps} />
    </PositionsContainer>
  )
}
export function ListPositionMobile({
  data,
  isLoading,
  onClosePositionSuccess,
  noDataMessage,
}: {
  data: CopyPositionData[] | undefined
  isLoading: boolean
  onClosePositionSuccess: () => void
  noDataMessage?: ReactNode
}) {
  if (isLoading) return <Loading />
  if (!isLoading && !data?.length) return <NoDataFound message={noDataMessage} />
  return (
    <PositionsContainer onClosePositionSuccess={onClosePositionSuccess}>
      <ListForm data={data} />
    </PositionsContainer>
  )
}
