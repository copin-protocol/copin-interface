import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'

import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import { UserActivityData } from 'entities/user'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'

import { ExternalSource, activityTitles, renderProps } from './configs'

type LayoutType = 'normal' | 'lite'
export default function ListActivityMobile({
  data,
  isLoading,
  externalSource,
  layoutType = 'normal',
}: {
  data: UserActivityData[] | undefined
  externalSource: ExternalSource
  isLoading: boolean
  layoutType?: LayoutType
}) {
  const { md } = useResponsive()
  if (isLoading) return <Loading />
  if (!isLoading && !data?.length) return <NoDataFound message={<Trans>No Activity Found</Trans>} />
  return (
    <Flex sx={{ width: '100%', height: '100%', overflow: 'auto', flexDirection: 'column', gap: 3 }}>
      {!md &&
        data?.map((value, index) => (
          <MobileItem key={index} data={value} externalSource={externalSource} layoutType={layoutType} />
        ))}
      {md &&
        data?.map((value, index) => (
          <TabletItem key={index} data={value} externalSource={externalSource} layoutType={layoutType} />
        ))}
    </Flex>
  )
}

export function MobileItem({
  data,
  externalSource,
  layoutType,
}: {
  data: UserActivityData
  externalSource: ExternalSource
  layoutType: LayoutType
}) {
  return (
    <Box sx={{ p: 3, bg: 'neutral6' }}>
      <Flex flexWrap="wrap" sx={{ gap: 3 }}>
        <Property label={activityTitles.time} value={renderProps.time?.(data, undefined, externalSource)} />
        <Property label={activityTitles.copy} value={renderProps.copy?.(data)} />
        <Property label={activityTitles.status} value={renderProps.status?.(data)} sx={{ textAlign: 'center' }} />
      </Flex>
      <Divider color="neutral5" my={2} />
      <Flex flexWrap="wrap" sx={{ gap: 3 }}>
        <Property label={activityTitles.sourceTrader} value={renderProps.sourceTrader?.(data)} />
        <Property
          label={activityTitles.sourceAction}
          value={renderProps.sourceAction?.(data)}
          sx={{ textAlign: 'center' }}
        />
      </Flex>
      <Divider color="neutral5" my={2} />
      <Flex flexWrap="wrap" sx={{ gap: 3 }}>
        {layoutType === 'normal' && (
          <Property label={activityTitles.targetWallet} value={renderProps.targetWallet?.(data)} />
        )}
        <Property
          label={activityTitles.targetAction}
          value={renderProps.targetAction?.(data, undefined, externalSource)}
        />
      </Flex>
    </Box>
  )
}

export function TabletItem({
  data,
  externalSource,
  layoutType,
}: {
  data: UserActivityData
  externalSource: ExternalSource
  layoutType: LayoutType
}) {
  return (
    <Box sx={{ p: 3, bg: 'neutral6' }}>
      <Box mb={3} sx={{ display: 'grid', gridTemplateColumns: '180px 180px 1fr', gap: 3 }}>
        <Property label={activityTitles.time} value={renderProps.time?.(data, undefined, externalSource)} />
        <Property label={activityTitles.copy} value={renderProps.copy?.(data)} />
        <Property label={activityTitles.status} value={renderProps.status?.(data)} />
      </Box>
      <Box mb={3} sx={{ display: 'grid', gridTemplateColumns: '180px 180px 1fr', gap: 3 }}>
        <Property label={activityTitles.sourceTrader} value={renderProps.sourceTrader?.(data)} />
        <Property label={activityTitles.sourceAction} value={renderProps.sourceAction?.(data)} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 3 }}>
        {layoutType === 'normal' && (
          <Property label={activityTitles.targetWallet} value={renderProps.targetWallet?.(data)} />
        )}
        <Property
          label={activityTitles.targetAction}
          value={renderProps.targetAction?.(data, undefined, externalSource)}
        />
      </Box>
    </Box>
  )
}

function Property({ label, value, sx }: { label: ReactNode; value: ReactNode; sx?: any }) {
  return (
    <Box sx={sx}>
      <Type.Caption color="neutral3" mb={2} display="block">
        {label}
      </Type.Caption>
      {value}
    </Box>
  )
}
