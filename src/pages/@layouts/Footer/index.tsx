import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'

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

import GettingStarted from '../GettingStarted'

const Footer = ({ height }: { height: number }) => {
  const { myProfile } = useMyProfile()

  const logEventRoutes = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.ROUTES,
      action,
    })
  }

  const { sm } = useResponsive()

  return (
    <Box
      as="footer"
      height={height}
      display="block"
      pr={3}
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
          height: '100%',
          width: '100%',
          // width: ['fit-content', 'fit-content', '100%'],
        }}
      >
        <GettingStarted />
        <Box height="100%" width="1px" bg="neutral4" />
        <Type.Caption pl={2} color="neutral3" display={['none', 'none', 'none', 'block']}>
          <Trans>© {new Date().getFullYear()} Copin.</Trans>
        </Type.Caption>
        <Flex pl={3} flex="1" sx={{ alignItems: 'center', justifyContent: ['space-between', 'end'], gap: [2, 3] }}>
          <Box>
            <Box
              sx={{
                gap: ['12px', 3],
              }}
              color="neutral3"
              display={['none', 'none', 'none', 'flex']}
            >
              {(sm ? links : linksMobile).map((_d, index) => {
                return (
                  <a
                    key={index}
                    href={_d.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      lineHeight: '16px',
                      fontSize: '12px',
                    }}
                  >
                    {_d.label}
                  </a>
                )
              })}
            </Box>
          </Box>
          <Box display={['none', 'block']} sx={{ width: '1px', height: '24px', bg: 'neutral4' }} />
          <Flex color="neutral3" sx={{ alignItems: ['flex-start', 'center'], gap: ['12px', 3] }}>
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
  { label: <Trans>HOME</Trans>, href: LINKS.website },
  { label: <Trans>UPGRADE</Trans>, href: ROUTES.SUBSCRIPTION.path },
  { label: <Trans>BLOG</Trans>, href: LINKS.blog },
  { label: <Trans>DOCS</Trans>, href: LINKS.docs },
  { label: <Trans>TERMS & POLICY</Trans>, href: LINKS.policy },
  { label: <Trans>FEEDBACK</Trans>, href: LINKS.feedback },
]
const linksMobile = [
  { label: <Trans>UPGRADE</Trans>, href: ROUTES.SUBSCRIPTION.path },
  { label: <Trans>DOCS</Trans>, href: LINKS.docs },
  { label: <Trans>POLICY</Trans>, href: LINKS.policy },
  { label: <Trans>FEEDBACK</Trans>, href: LINKS.feedback },
]
const channels = [
  { Icon: DiscordIcon, href: LINKS.discord, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_DISCORD },
  { Icon: TelegramIcon, href: LINKS.telegram, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_TELEGRAM },
  { Icon: TwitterIcon, href: LINKS.twitter, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_TWITTER },
  { Icon: GithubIcon, href: LINKS.github, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_GITHUB },
]

export default Footer
