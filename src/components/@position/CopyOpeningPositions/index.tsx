import { Trans } from '@lingui/macro'
import { ComponentProps } from 'react'

import { CopyPositionData } from 'entities/copyTrade'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box, Flex, Type } from 'theme/base'

import CopyPositionsTableView from '../CopyPositionsTableView'
import { ExternalSourceCopyPositions } from '../types'
import { openingColumns, simpleOpeningColumns } from './configs'

export default function CopyOpeningPositions({
  data,
  isLoading,
  layoutType,
  tableProps = {},
  onClosePositionSuccess,
}: {
  data: CopyPositionData[] | undefined
  isLoading: boolean
  layoutType: 'simple' | 'normal'
  tableProps?: Partial<ComponentProps<typeof CopyPositionsTableView>>
  onClosePositionSuccess: () => void
}) {
  const { prices } = useGetUsdPrices()

  const title = <Trans>Opening Positions</Trans>

  const externalSource: ExternalSourceCopyPositions = {
    prices,
  }

  return (
    <>
      {!data?.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">Your {title} Is Empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once you have a position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {!!data?.length && (
        <Box flex="1 0 0" overflow="hidden" height="100%">
          <CopyPositionsTableView
            {...tableProps}
            data={data}
            columns={layoutType === 'normal' ? openingColumns : simpleOpeningColumns}
            isLoading={isLoading}
            onClosePositionSuccess={onClosePositionSuccess}
            externalSource={externalSource}
            layoutType={layoutType}
          />
        </Box>
      )}
    </>
  )
}
