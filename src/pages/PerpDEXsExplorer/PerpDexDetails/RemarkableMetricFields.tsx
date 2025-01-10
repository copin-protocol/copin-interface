import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import { Box, Flex, Type } from 'theme/base'

import { RENDER_COLUMN_DATA_MAPPING } from '../configs'
import { renderTableTitleWithTooltip } from '../helpers/renderHelper'
import { REMARKABLE_METRIC_FIELD } from './configs/field'

export default function RemarkableMetricFields({ data }: { data: PerpDEXSourceResponse | undefined }) {
  if (!data) return null
  return (
    <>
      {REMARKABLE_METRIC_FIELD.map((field) => {
        return (
          <Box key={field}>
            <Type.Caption mb="2px" color="neutral3" sx={{ textTransform: 'uppercase' }}>
              {renderTableTitleWithTooltip({ valueKey: field, upperCase: false })}
            </Type.Caption>
            <Flex sx={{ height: 24 }}>{RENDER_COLUMN_DATA_MAPPING[field]?.({ data })}</Flex>
          </Box>
        )
      })}
    </>
  )
}
