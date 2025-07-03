import { Trans } from '@lingui/macro'
import { ArrowsIn, ArrowsOutSimple, HardDrives } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Link } from 'react-router-dom'

import ActiveDot from 'components/@ui/ActiveDot'
import Divider from 'components/@ui/Divider'
import SectionTitle from 'components/@ui/SectionTitle'
import Icon from 'components/@widgets/IconGroup/Icon'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import useGetProtocolStatus from 'hooks/features/systemConfig/useGetProtocolStatus'
import useSearchParams from 'hooks/router/useSearchParams'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum, SystemStatusTypeEnum } from 'utils/config/enums'
import { getSystemStatusTypeColor } from 'utils/helpers/format'
import { generatePerpDEXDetailsRoute } from 'utils/helpers/generateRoute'
import { parseChainImage, parsePlainProtocolImage } from 'utils/helpers/transform'

import { RENDER_COLUMN_DATA_MAPPING } from '../configs'
import { renderTableTitleWithTooltip } from '../helpers/renderHelper'
import { DESKTOP_LEFT_AREA_WIDTH } from './configs/constants'
import { GENERAL_INFO_FIELD, METRIC_FIELD } from './configs/field'

export default function InfoDesktopView({
  data,
  eventCount,
  isExpanded,
  handleExpand,
}: {
  data: PerpDEXSourceResponse | undefined
  eventCount: number
  isExpanded: boolean
  handleExpand: () => void
}) {
  if (!data) return null
  return (
    <Box
      sx={{
        bg: 'neutral7',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
      }}
    >
      {!isExpanded && !!eventCount && <Divider />}
      <Box sx={{ width: '100%', flexShrink: 0 }}>
        <Flex
          sx={{
            width: '100%',
            height: 48,
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            px: 3,
            pr: !!eventCount ? 3 : 24,
            justifyContent: 'space-between',
          }}
        >
          <InfoTitle />
          <IconBox
            role="button"
            icon={isExpanded ? <ArrowsIn size={18} /> : <ArrowsOutSimple size={18} />}
            sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
            onClick={handleExpand}
          />
        </Flex>
      </Box>
      {isExpanded && <Divider />}
      <Flex sx={{ width: '100%', height: 'calc(100% - 48px)' }}>
        <Box
          sx={{
            px: 3,
            overflow: 'auto',
            width: DESKTOP_LEFT_AREA_WIDTH,
            height: '100%',
            borderRight: isExpanded ? 'small' : 'none',
            borderRightColor: 'neutral4',
            '& > *': { borderBottom: '1px dashed', borderBottomColor: 'neutral4' },
            '& > *:last-child': { borderBottom: 'none' },
          }}
        >
          <GeneralInfo data={data} />
        </Box>
        <Box display={isExpanded ? 'block' : 'none'} sx={{ flex: '1', height: '100%', overflow: 'hidden' }}>
          <Flex px={3} py={2} sx={{ width: '100%', alignItems: 'center', color: 'neutral3' }}>
            <Type.Caption flex="1.2">
              <Trans>METRICS</Trans>
            </Type.Caption>
            <Type.Caption flex="1" textAlign="right" pr={3}>
              <Trans>DAILY</Trans>
            </Type.Caption>
            <Type.Caption flex="1" textAlign="right" pr={3}>
              <Trans>WEEKLY</Trans>
            </Type.Caption>
            <Type.Caption flex="1" textAlign="right" pr={3}>
              <Trans>MONTHLY</Trans>
            </Type.Caption>
            <Type.Caption flex="1" textAlign="right">
              <Trans>ALL-TIME</Trans>
            </Type.Caption>
          </Flex>
          <Divider />
          <Flex
            sx={{
              flexDirection: 'column',
              width: '100%',
              height: 'calc(100% - 44px)',
              overflow: 'hidden auto',
              // '.custom_react_tooltip_css': { display: 'none' },
            }}
          >
            {METRIC_FIELD.map((config, index) => {
              return (
                <Flex
                  key={index}
                  px={3}
                  height={40}
                  sx={{ flexShrink: 0, width: '100%', alignItems: 'center', color: 'neutral3' }}
                >
                  <Type.Caption flex="1.2">{config.title}</Type.Caption>

                  {config.fields.map((field) => {
                    return (
                      <Flex
                        key={field}
                        flex="1"
                        sx={{
                          justifyContent: 'end',
                          pr: 3,
                          '&:last-child': { pr: 0 },
                          '.long_ratio__wrapper': { '& > *': { width: '100%' } },
                        }}
                      >
                        {RENDER_COLUMN_DATA_MAPPING[field]?.({ data })}
                      </Flex>
                    )
                  })}
                </Flex>
              )
            })}
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
export function InfoTitle() {
  return <SectionTitle icon={HardDrives} title={<Trans>GENERAL INFO </Trans>} sx={{ mb: 0 }} />
}
export function GeneralInfo({ data }: { data: PerpDEXSourceResponse | undefined }) {
  const { searchParams } = useSearchParams()
  const selectedProtocol = searchParams.protocol
  const { protocolDataStatusMapping, getProtocolMessage } = useGetProtocolStatus()
  const { md } = useResponsive()
  if (!data) return null

  return (
    <>
      {!!data.protocolInfos?.length && (
        <Box>
          <Type.Caption mb={2} color="neutral3">
            Intergrators
          </Type.Caption>
          <Flex
            sx={{
              columnGap: 3,
              pb: 2,
              rowGap: 1,
              flexWrap: 'wrap',
            }}
          >
            {data.protocolInfos.map((protocolData) => {
              const isActive =
                !!selectedProtocol && (selectedProtocol as string).toLowerCase() === protocolData.protocol.toLowerCase()
              const protocolKey = protocolData.protocol as ProtocolEnum
              const protocolStatus = (() => {
                if (!protocolKey) return undefined
                return protocolDataStatusMapping[protocolKey as ProtocolEnum]
              })()
              const shouldShowDot = protocolStatus && protocolStatus !== SystemStatusTypeEnum.STABLE

              return (
                <Flex
                  as={Link}
                  to={generatePerpDEXDetailsRoute({
                    perpdex: data.perpdex.toLowerCase(),
                    params: { protocol: protocolData?.protocol?.toLowerCase() },
                  })}
                  key={protocolData.protocol}
                  sx={{
                    alignItems: 'center',
                    gap: 1,
                    color: 'inherit',
                    '&:hover': { '.text': { textDecoration: 'underline' } },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Icon iconName={protocolData.protocol} iconUriFactory={parsePlainProtocolImage} size={24} />
                    <Box sx={{ position: 'absolute', left: 18, top: 18 }}>
                      {shouldShowDot && (
                        <ActiveDot
                          color={getSystemStatusTypeColor(protocolStatus)}
                          tooltipContent={getProtocolMessage(protocolKey as ProtocolEnum)}
                          tooltipId={`status_indicator_${protocolKey}`}
                          size={6}
                        />
                      )}
                    </Box>
                  </Box>

                  <Type.Caption className="text" sx={{ textDecoration: isActive ? 'underline' : undefined }}>
                    {protocolData.name}
                  </Type.Caption>
                  <Icon iconName={protocolData.chain} iconUriFactory={parseChainImage} size={16} />
                </Flex>
              )
            })}
          </Flex>
        </Box>
      )}
      {GENERAL_INFO_FIELD.map((fields, index) => {
        return (
          <Flex key={index} sx={{ py: 2, width: '100%', flexDirection: 'column', gap: 2 }}>
            {fields.map((field) => {
              return (
                <Flex key={field} sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Type.Caption color="neutral3">
                    {renderTableTitleWithTooltip({ valueKey: field, upperCase: false, combineField: true })}
                  </Type.Caption>
                  <Flex sx={{ alignItems: 'center', gap: 2 }}>{RENDER_COLUMN_DATA_MAPPING[field]?.({ data })}</Flex>
                </Flex>
              )
            })}
          </Flex>
        )
      })}
    </>
  )
}
