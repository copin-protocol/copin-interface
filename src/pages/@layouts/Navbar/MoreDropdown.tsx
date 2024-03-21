import { Trans } from '@lingui/macro'
import { BookBookmark, ChartBar, CrownSimple } from '@phosphor-icons/react'
import { ComponentType, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import Accordion from 'theme/Accordion'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'

export default function MoreDropdown() {
  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        '& .dropdown-title': {
          color: 'neutral1',
        },
        '&:hover': {
          '.dropdown-title': { color: 'primary1' },
          '.dropdown-content': { display: 'block' },
          background: 'linear-gradient(0deg, #303963 0.16%, rgba(11, 13, 23, 0) 102.34%)',
          backgroundSize: '100% 16px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          borderBottom: 'small',
          borderBottomColor: 'primary1',
        },
      }}
    >
      <Flex className="dropdown-title" sx={{ alignItems: 'center', justifyContent: 'center', height: '100%', px: 2 }}>
        <Type.Caption>
          <Trans>More</Trans>
        </Type.Caption>
      </Flex>
      <Box
        className="dropdown-content"
        sx={{ position: 'absolute', pt: 1, display: 'none', left: '50%', transform: 'translateX(-50%)' }}
      >
        <Box sx={{ p: 2, width: 140, bg: 'neutral8', border: 'small', borderColor: 'neutral4' }}>
          <Flex sx={{ flexDirection: 'column', gap: 12 }}>
            {configs.map((config, index) => {
              return <MoreItem key={index} {...config} />
            })}
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}
export function MoreDropdownMobile({ onClickItem }: { onClickItem: (() => void) | undefined }) {
  return (
    <Accordion
      defaultOpen
      header={
        <Type.CaptionBold>
          <Trans>More</Trans>
        </Type.CaptionBold>
      }
      body={
        <Flex py={3} sx={{ flexDirection: 'column', gap: 3, '& *': { fontWeight: 'bold' } }} onClick={onClickItem}>
          {configs.map((config, index) => {
            return <MoreItem key={index} {...config} />
          })}
        </Flex>
      }
    />
  )
}

const configs = [
  {
    icon: ChartBar,
    text: <Trans>Stats</Trans>,
    route: ROUTES.STATS.path,
  },
  {
    icon: BookBookmark,
    text: <Trans>Document</Trans>,
    link: LINKS.docs,
  },
  {
    icon: CrownSimple,
    text: <Trans>Subscription</Trans>,
    route: ROUTES.SUBSCRIPTION.path,
  },
]

function MoreItem({
  icon: Icon,
  text,
  link,
  route,
}: {
  icon: ComponentType<any>
  text: ReactNode
  link?: string
  route?: string
}) {
  return (
    <Flex
      {...(!!link
        ? ({ as: 'a', href: link, target: '_blank' } as any)
        : !!route
        ? ({ as: Link, to: route } as any)
        : {})}
      sx={{ alignItems: 'center', gap: 2, color: 'neutral1', '&:hover': { color: 'primary1' } }}
    >
      <IconBox icon={<Icon size={16} />} />
      <Type.Caption>{text}</Type.Caption>
    </Flex>
  )
}
