import { Trans } from '@lingui/macro'

import useMyProfile from 'hooks/store/useMyProfile'
import DiscordIcon from 'theme/Icons/DiscordIcon'
import GithubIcon from 'theme/Icons/GithubIcon'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import TwitterIcon from 'theme/Icons/TwitterIcon'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

const Footer = ({ height }: { height: number }) => {
  const { myProfile } = useMyProfile()
  const logEventRoutes = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.ROUTES,
      action,
    })
  }

  return (
    <Box
      as="footer"
      height={height}
      display="block"
      px={3}
      sx={{
        borderTop: 'small',
        borderColor: 'neutral4',
        '& a': {
          color: 'inherit',
          '&:hover': {
            color: 'neutral1',
          },
        },
        zIndex: 10,
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          gap: 3,
          height: '100%',
          width: ['fit-content', 'fit-content', '100%'],
        }}
      >
        <Type.Caption color="neutral3" display={['none', 'none', 'block']}>
          <Trans>© 2024 Copin. All rights reserved. Data has been updated since Nov 2022</Trans>
        </Type.Caption>
        <Flex flex="1" sx={{ alignItems: 'center', justifyContent: 'end', gap: [2, 3] }}>
          <Flex
            sx={{
              gap: [2, 3],
            }}
            color="neutral3"
          >
            {links.map((_d, index) => {
              return (
                <a
                  key={index}
                  href={_d.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    lineHeight: '16px',
                    fontSize: '13px',
                  }}
                >
                  {_d.label}
                </a>
              )
            })}
          </Flex>
          <Box sx={{ width: '1px', height: '24px', bg: 'neutral4' }} />
          <Flex color="neutral3" sx={{ alignItems: ['flex-start', 'center'], gap: [2, 3] }}>
            {channels.map((_d, index) => {
              return (
                <Box
                  key={index}
                  as="a"
                  href={_d.href}
                  target="_blank"
                  sx={{ lineHeight: 0 }}
                  onClick={() => logEventRoutes(EVENT_ACTIONS[EventCategory.ROUTES].JOIN_DISCORD)}
                >
                  <_d.Icon variant="Bold" size={20} />
                </Box>
              )
            })}
          </Flex>
        </Flex>
      </Flex>
      {/* Links */}
    </Box>
  )
}

const links = [
  { label: <Trans>Home</Trans>, href: LINKS.website },
  { label: <Trans>Upgrade</Trans>, href: ROUTES.SUBSCRIPTION.path },
  { label: <Trans>Blog</Trans>, href: LINKS.blog },
  { label: <Trans>Docs</Trans>, href: LINKS.docs },
  { label: <Trans>Terms & Policy</Trans>, href: LINKS.policy },
]
const channels = [
  { Icon: DiscordIcon, href: LINKS.discord, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_DISCORD },
  { Icon: TelegramIcon, href: LINKS.telegram, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_TELEGRAM },
  { Icon: TwitterIcon, href: LINKS.twitter, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_TWITTER },
  { Icon: GithubIcon, href: LINKS.github, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_GITHUB },
]

export default Footer
