import { ReactNode } from 'react'

import NoDataFound from 'components/@ui/NoDataFound'
import { TableProps } from 'components/@ui/Table/types'
import { CopyPositionData } from 'entities/copyTrade.d'
import Loading from 'theme/Loading'

import { ListForm, TableForm } from './ListPositions'
import PositionsContainer, { ExternalSource } from './PositionsContainer'

export default function PositionTable({
  onClosePositionSuccess,
  ...tableProps
}: {
  onClosePositionSuccess: () => void
} & TableProps<CopyPositionData, ExternalSource>) {
  return (
    <PositionsContainer onClosePositionSuccess={onClosePositionSuccess}>
      <TableForm tableProps={tableProps} />
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
