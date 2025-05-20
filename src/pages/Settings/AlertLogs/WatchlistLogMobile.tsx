import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import { AlertLogData } from 'entities/alertLog'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'

import { ExternalSource, Property, alertLogTitles, renderProps } from './configs'

export default function WatchlistLogMobile({
  data,
  isLoading,
  externalSource,
  noDataComponent,
}: {
  data: AlertLogData[] | undefined
  externalSource?: ExternalSource
  isLoading: boolean
  noDataComponent?: ReactNode
}) {
  if (isLoading) return <Loading />
  if (!isLoading && !data?.length)
    return noDataComponent ? <>{noDataComponent}</> : <NoDataFound message={<Trans>No Activity Found</Trans>} />
  return (
    <Flex sx={{ width: '100%', height: '100%', overflow: 'auto', flexDirection: 'column', gap: 3 }}>
      {data?.map((value, index) => (
        <MobileItem key={index} data={value} externalSource={externalSource} />
      ))}
    </Flex>
  )
}

export function MobileItem({ data, externalSource }: { data: AlertLogData; externalSource?: ExternalSource }) {
  return (
    <Box sx={{ p: 3, bg: 'neutral6' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 3 }}>
        <Property label={alertLogTitles.time} value={renderProps.time?.(data, undefined, externalSource)} />
        <Property label={alertLogTitles.sourceAction} value={renderProps.sourceAction?.(data)} />
      </Box>
      <Divider color="neutral5" my={2} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 3 }}>
        <Property label={alertLogTitles.sourceTrader} value={renderProps.sourceTrader?.(data)} />
        <Property label={alertLogTitles.sourceDetails} value={renderProps.sourceDetails?.(data)} />
      </Box>
      <Divider color="neutral5" my={2} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 3 }}>
        <Property label={alertLogTitles.channel} value={renderProps.channel?.(data)} />
        <Property label={alertLogTitles.channelName} value={renderProps.channelName?.(data)} />
      </Box>
      <Divider color="neutral5" my={2} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 3 }}>
        <Property label={alertLogTitles.status} value={renderProps.status?.(data)} />
        <Property
          label={alertLogTitles.reason}
          value={renderProps.reason?.(data)}
          sx={{ '& > *': { maxWidth: '100%', overflow: 'hidden' } }}
        />
      </Box>
    </Box>
  )
}
