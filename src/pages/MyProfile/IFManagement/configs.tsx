import React from 'react'

import {
  collateralColumn,
  entryColumn,
  fundingColumn,
  pnlColumn,
  roiColumn,
  sizeOpeningColumn,
} from 'components/@position/configs/hlPositionRenderProps'
import { PositionData } from 'entities/trader'
import { Button } from 'theme/Buttons'
import Popconfirm from 'theme/Popconfirm'
import { ColumnData } from 'theme/Table/types'
import { Box, Type } from 'theme/base'

import { ExternalSourceHlPosition } from './types'

export function renderAction(data: PositionData | undefined, externalSource?: any) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Popconfirm
        action={
          <Button
            variant="textPrimary"
            isLoading={externalSource?.submitting && data?.id === externalSource?.currentId}
            disabled={externalSource?.submitting && data?.id === externalSource?.currentId}
            onClick={(e) => e.stopPropagation()}
          >
            <Type.Caption>Close</Type.Caption>
          </Button>
        }
        title="Are you sure you want to close this position?"
        onConfirm={() => externalSource?.handleClosePosition?.(data)}
        confirmButtonProps={{ variant: 'ghostDanger' }}
      />
    </Box>
  )
}

export const actionColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: ' ',
  dataIndex: 'id',
  key: 'id',
  style: { width: '80px', textAlign: 'right', flex: '0 0 80px' },
  render: (item, _, externalSource) => renderAction(item, externalSource),
}

export const hlOpeningColumns: ColumnData<PositionData, ExternalSourceHlPosition>[] = [
  { ...entryColumn, style: { minWidth: 150 } },
  { ...sizeOpeningColumn, style: { minWidth: 200 } },
  collateralColumn,
  fundingColumn,
  roiColumn,
  { ...pnlColumn, style: { minWidth: 100, textAlign: 'right' } },
  { ...actionColumn, style: { minWidth: 80, textAlign: 'right' } },
]
