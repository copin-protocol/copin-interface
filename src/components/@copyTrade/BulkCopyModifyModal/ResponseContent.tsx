import { Trans } from '@lingui/macro'
import { Fragment } from 'react'

import SuccessImage from 'components/@ui/SuccessImage'
import { BulkUpdateResponseData } from 'entities/copyTrade'
import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'
import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'

import { renderCopyTrader, renderTitle } from '../renderProps/copyTradeColumns'

export default function ResponseContent({
  onComplete,
  responseData,
}: {
  onComplete: () => void
  responseData: BulkUpdateResponseData
}) {
  const { listCopyTrade, prevListCopyTrade } = useSelectCopyTrade()
  const _listCopyTrade = listCopyTrade?.length ? listCopyTrade : prevListCopyTrade
  return (
    <Box p={3}>
      {responseData.status === 'SUCCESS' && (
        <Flex flexDirection="column" alignItems="center">
          <SuccessImage height={200} />
          <Type.Body textAlign="center">
            <Trans>Copy trades update successful</Trans>
          </Type.Body>
        </Flex>
      )}
      {responseData.status === 'PARTIAL_FAILURE' && (
        <>
          <Type.Caption mb={2}>
            <Trans>Errors:</Trans>
          </Type.Caption>
          <Box sx={{ maxHeight: 400, overflow: 'hidden auto' }}>
            {responseData.errors.map((v) => {
              const copyTrade = _listCopyTrade.find((c) => c.id === v.id)
              if (!copyTrade) return <Fragment key={v.id} />
              return (
                <Box mb={3} key={v.id} sx={{ bg: 'neutral6', p: 2, borderRadius: '4px' }}>
                  <Flex py={1} key={copyTrade.id} sx={{ gap: 3 }}>
                    <Flex sx={{ width: 150, flexShrink: 0 }}>
                      {renderCopyTrader({ data: copyTrade, options: { enabledQuickView: false } })}
                    </Flex>
                    <Flex sx={{ alignItems: 'center', gap: 2 }}>
                      <Type.Caption>
                        <Trans>Label:</Trans>
                      </Type.Caption>
                      {renderTitle(copyTrade)}
                    </Flex>
                  </Flex>
                  <Type.Caption>{v.error}</Type.Caption>
                </Box>
              )
            })}
          </Box>
        </>
      )}
      <Button mx={'auto'} display="block" width={200} mt={24} variant="primary" onClick={onComplete}>
        <Trans>Done</Trans>
      </Button>
    </Box>
  )
}
