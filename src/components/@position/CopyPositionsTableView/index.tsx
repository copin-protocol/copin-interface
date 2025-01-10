import { CopyPositionData } from 'entities/copyTrade.d'
import Table from 'theme/Table'
import { TableProps } from 'theme/Table/types'
import { Box } from 'theme/base'

import CopyPositionsContainer from '../CopyPositionsContainer'
import { ExternalSourceCopyPositions } from '../types'

export default function CopyPositionsTableView({
  onClosePositionSuccess,
  layoutType = 'normal',
  ...tableProps
}: {
  onClosePositionSuccess: () => void
  layoutType?: 'simple' | 'normal' | 'lite'
} & TableProps<CopyPositionData, ExternalSourceCopyPositions>) {
  return layoutType === 'normal' || layoutType === 'lite' ? (
    <CopyPositionsContainer onClosePositionSuccess={onClosePositionSuccess}>
      <TableForm tableProps={tableProps} />
    </CopyPositionsContainer>
  ) : (
    <CopyPositionsContainer onClosePositionSuccess={onClosePositionSuccess}>
      <SimpleTableForm tableProps={tableProps} />
    </CopyPositionsContainer>
  )
}

export function TableForm({
  tableProps,
  externalSource,
}: {
  tableProps: TableProps<CopyPositionData, ExternalSourceCopyPositions>
  externalSource?: ExternalSourceCopyPositions
}) {
  return (
    <Box width="100%" height="100%" overflow="hidden">
      <Table
        {...(tableProps ?? {})}
        wrapperSx={{
          table: {
            '& th:last-child, td:last-child': {
              pr: 2,
            },
            '& td:last-child': {
              pr: 2,
            },
          },
          ...(tableProps?.wrapperSx ?? {}),
        }}
        restrictHeight={tableProps?.restrictHeight ?? true}
        externalSource={externalSource}
        onClickRow={externalSource?.handleSelectCopyItem}
      />
    </Box>
  )
}
export function SimpleTableForm({
  tableProps,
  externalSource,
}: {
  tableProps: TableProps<CopyPositionData, ExternalSourceCopyPositions>
  externalSource?: ExternalSourceCopyPositions
}) {
  return (
    <Box width="100%" height="100%" overflow="hidden">
      <Table
        {...(tableProps ?? {})}
        containerSx={{ bg: 'neutral8' }}
        wrapperSx={{
          table: {
            '& th': {
              border: 'none',
              pb: 0,
            },
            '& td': {
              py: 2,
            },
            '& th:last-child, td:last-child': {
              pr: 3,
            },
            '& td:last-child': {
              pr: 3,
            },
            '& th:first-child, td:first-child': {
              pl: 3,
            },
          },
          ...(tableProps?.wrapperSx ?? {}),
        }}
        restrictHeight={tableProps?.restrictHeight ?? true}
        externalSource={externalSource}
        onClickRow={externalSource?.handleSelectCopyItem}
      />
    </Box>
  )
}
