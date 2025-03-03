import { Trans } from '@lingui/macro'
import { Exclude } from '@phosphor-icons/react'
import { useId } from 'react'

import { useFilterPairs } from 'hooks/features/useFilterPairs'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

import PairGroup, { PairGroupFull } from './PairGroup'

export function SelectedMarkets({ pairs, excludedPairs }: { pairs: string[]; excludedPairs: string[] }) {
  const { isCopyAll, hasExcludingPairs } = useFilterPairs({ pairs, excludedPairs })
  const tooltipId = 'market_filter' + useId()
  return (
    <>
      {/* TODO: Change this later */}
      {isCopyAll ? (
        <Flex width="100%" justifyContent="flex-start" alignItems="center" sx={{ gap: 1 }}>
          {hasExcludingPairs && (
            <Exclude color={`${themeColors.red1}80`} data-tooltip-id={hasExcludingPairs ? tooltipId : undefined} />
          )}
          <Trans>All pairs</Trans>
        </Flex>
      ) : (
        <PairGroup pairs={pairs} />
      )}

      {hasExcludingPairs && (
        <Tooltip id={tooltipId} clickable>
          <Box>
            <Type.Caption mb={1} width="100%" color="neutral3" textAlign="left">
              Excluding pairs:
            </Type.Caption>
            <PairGroupFull
              pairs={excludedPairs}
              hasName
              sx={{
                maxWidth: 400,
                maxHeight: 350,
                overflowY: 'auto',
                justifyContent: 'flex-start',
              }}
            />
          </Box>
        </Tooltip>
      )}
    </>
  )
}
