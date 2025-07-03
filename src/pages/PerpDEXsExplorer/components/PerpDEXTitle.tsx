import { CaretDown } from '@phosphor-icons/react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import ActiveDot from 'components/@ui/ActiveDot'
import PerpDexLogo from 'components/@ui/PerpDexLogo'
import IconGroup from 'components/@widgets/IconGroup'
import Icon from 'components/@widgets/IconGroup/Icon'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import useGetProtocolStatus from 'hooks/features/systemConfig/useGetProtocolStatus'
import SocialLinkItems from 'pages/PerpDEXsExplorer/components/SocialLinkItems'
import useTriggerRenderTableBg from 'pages/PerpDEXsExplorer/hooks/useTriggerRenderTableBg'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum, SystemStatusTypeEnum } from 'utils/config/enums'
import { getSystemStatusTypeColor } from 'utils/helpers/format'
import { generatePerpDEXDetailsRoute } from 'utils/helpers/generateRoute'
import { parseChainImage, parsePlainProtocolImage } from 'utils/helpers/transform'

function PerpDEXTitle({ data, isChildren }: { data: PerpDEXSourceResponse; isChildren: boolean }) {
  const { changeTriggerKey } = useTriggerRenderTableBg()
  const { protocolDataStatusMapping, getProtocolMessage } = useGetProtocolStatus()

  const handleClick = () => {
    const caretIcon = document.getElementById(`protocol_info_caret_${data.perpdex}`)
    if (caretIcon) {
      if (caretIcon.classList.contains('rotated')) {
        caretIcon.style.rotate = '0deg'
        caretIcon.classList.remove('rotated')
      } else {
        caretIcon.style.rotate = '180deg'
        caretIcon.classList.add('rotated')
      }
    }
    data.protocolInfos.forEach((protocolData) => {
      const element = document.querySelector(`[data-children-key="${protocolData.protocol}"]`) as HTMLTableRowElement
      const visible = !element.classList.contains('row__hidden')
      if (visible) {
        element.classList.add('row__hidden')
      } else {
        element.classList.remove('row__hidden')
      }
    })
    changeTriggerKey()
  }

  function checkHasLink(data: PerpDEXSourceResponse | undefined) {
    const { websiteUrl, discordUrl, telegramUrl, xUrl, githubUrl, duneUrl } = data ?? {}
    return !!websiteUrl || !!discordUrl || !!telegramUrl || !!xUrl || !!githubUrl || !!duneUrl
  }

  const hasLink = checkHasLink(data)
  const url = generatePerpDEXDetailsRoute({ perpdex: data.perpdex?.toLowerCase() })
  const protocolUrl = generatePerpDEXDetailsRoute({
    perpdex: data.perpdex?.toLowerCase(),
    //@ts-ignore
    params: { protocol: data.protocol?.toLowerCase() },
  })
  //@ts-ignore
  const protocolKey = isChildren ? data.protocol : data.perpdex
  const protocolStatus = (() => {
    if (!protocolKey) return undefined
    return protocolDataStatusMapping[protocolKey as ProtocolEnum]
  })()

  const shouldShowDot = protocolStatus && protocolStatus !== SystemStatusTypeEnum.STABLE

  return (
    <Flex sx={{ alignItems: 'center', gap: 2, pl: isChildren ? 3 : 0 }}>
      {!isChildren && (
        <>
          <Box
            as={Link}
            to={url}
            sx={{
              position: 'relative',
              '&:hover': {
                filter: 'brightness(150%)',
                '& + *': { '*': { textDecoration: 'underline' } },
              },
            }}
          >
            <PerpDexLogo perpDex={data.perpdex} size={32} />
            {shouldShowDot && (
              <Box sx={{ position: 'absolute', top: 20, left: 25 }}>
                <ActiveDot
                  color={getSystemStatusTypeColor(protocolStatus)}
                  tooltipContent={getProtocolMessage(protocolKey as ProtocolEnum)}
                  tooltipId={`status_indicator_${protocolKey}`}
                  size={6}
                />
              </Box>
            )}
          </Box>
          <Box as={Link} to={url} sx={{ '&:hover .hover-underline': { textDecoration: 'underline' } }}>
            <Flex sx={{ alignItems: 'center', gap: 1 }}>
              <Type.Caption
                className="hover-underline"
                color="neutral1"
                flexShrink={0}
                data-tooltip-id={hasLink ? `${data.perpdex}_name` : undefined}
                data-tooltip-delay-show={360}
              >
                {data.name}
              </Type.Caption>
            </Flex>
          </Box>
          {hasLink && (
            <Tooltip id={`${data.perpdex}_name`} clickable>
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <SocialLinkItems data={data} />
              </Flex>
            </Tooltip>
          )}
          <IconGroup iconNames={data.chains ?? []} iconUriFactory={parseChainImage} size={16} />
          {!!data.protocolInfos && (
            <>
              <Box flex={1} />
              <IconBox
                id={`protocol_info_caret_${data.perpdex}`}
                className="normal"
                onClick={(e: any) => {
                  e?.stopPropagation()
                  handleClick()
                }}
                icon={<CaretDown size={16} />}
                sx={{
                  cursor: 'pointer',
                  flexShrink: 0,
                  color: 'neutral3',
                  '&:hover': { color: 'neutral2' },
                  transition: '0.3s',
                }}
              />
            </>
          )}
        </>
      )}
      {isChildren && (
        <>
          <Box
            as={Link}
            to={protocolUrl}
            sx={{
              '&:hover': { filter: 'brightness(150%)', '& + *': { '*': { textDecoration: 'underline' } } },
            }}
          >
            <Icon
              // @ts-ignore
              iconName={data.protocol}
              iconUriFactory={parsePlainProtocolImage}
              size={32}
              hasBorder={false}
            />
            <Box sx={{ transform: 'translateY(-10px) translateX(25px)' }}>
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
          <Box as={Link} to={protocolUrl} sx={{ '&:hover.hover-underline': { textDecoration: 'underline' } }}>
            <Flex sx={{ alignItems: 'center', gap: 1 }}>
              <Type.Caption color="neutral1" flexShrink={0} className="hover-underline">
                {/* @ts-ignore */}
                {data.name}
              </Type.Caption>
            </Flex>
          </Box>
          <Icon
            // @ts-ignore
            iconName={data.chain}
            iconUriFactory={parseChainImage}
            size={16}
          />
        </>
      )}
    </Flex>
  )
}

export default PerpDEXTitle
