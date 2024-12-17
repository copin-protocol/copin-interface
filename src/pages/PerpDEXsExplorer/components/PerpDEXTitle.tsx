import { CaretDown } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

import PerpDexLogo from 'components/@ui/PerpDexLogo'
import IconGroup from 'components/@widgets/IconGroup'
import Icon from 'components/@widgets/IconGroup/Icon'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import SocialLinkItems from 'pages/PerpDEXsExplorer/components/SocialLinkItems'
import useTriggerRenderTableBg from 'pages/PerpDEXsExplorer/hooks/useTriggerRenderTableBg'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { generatePerpDEXDetailsRoute } from 'utils/helpers/generateRoute'
import { parseChainImage, parsePlainProtocolImage } from 'utils/helpers/transform'

function PerpDEXTitle({ data, isChildren }: { data: PerpDEXSourceResponse; isChildren: boolean }) {
  const { changeTriggerKey } = useTriggerRenderTableBg()

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

  return (
    <Flex sx={{ alignItems: 'center', gap: 2, pl: isChildren ? 3 : 0 }}>
      {!isChildren && (
        <>
          <Box
            as={Link}
            to={url}
            sx={{ '&:hover': { filter: 'brightness(150%)', '& + *': { '*': { textDecoration: 'underline' } } } }}
          >
            <PerpDexLogo perpDex={data.perpdex} size={32} />
          </Box>
          <Box as={Link} to={url} sx={{ '&:hover *': { textDecoration: 'underline' } }}>
            <Type.Caption
              color="neutral1"
              flexShrink={0}
              data-tooltip-id={hasLink ? `${data.perpdex}_name` : undefined}
              data-tooltip-delay-show={360}
            >
              {data.name}
            </Type.Caption>
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
            sx={{ '&:hover': { filter: 'brightness(150%)', '& + *': { '*': { textDecoration: 'underline' } } } }}
          >
            <Icon
              // @ts-ignore
              iconName={data.protocol}
              iconUriFactory={parsePlainProtocolImage}
              size={32}
              hasBorder={false}
            />
          </Box>
          <Box as={Link} to={protocolUrl} sx={{ '&:hover *': { textDecoration: 'underline' } }}>
            <Type.Caption color="neutral1" flexShrink={0}>
              {/* @ts-ignore */}
              {data.name}
            </Type.Caption>
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
