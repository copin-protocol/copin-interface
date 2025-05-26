import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'

import { useLocalDetection } from 'hooks/helpers/useLocalDetection'
import useMyProfile from 'hooks/store/useMyProfile'
import Dropdown from 'theme/Dropdown'
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
import FeedbackButton from './FeedbackButton'

const Footer = ({ height }: { height: number }) => {
  const { myProfile } = useMyProfile()
  const { sm } = useResponsive()

  const { isVN } = useLocalDetection()

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
      <Flex width="100%" height="100%" alignItems="center">
        <GettingStarted />
        <Box height="100%" width="1px" bg="neutral4" />
        <Type.Caption pl={2} color="neutral3" display={['none', 'none', 'none', 'block']}>
          <Trans>© {new Date().getFullYear()} Copin.</Trans>
        </Type.Caption>
        <Flex pl={3} flex="1" sx={{ alignItems: 'center', justifyContent: ['end'], gap: [2, 3] }}>
          <Box>
            <Box sx={{ transform: 'translateX(10px)' }}>
              <DropDownMobile />
            </Box>
            <Box
              sx={{
                gap: ['12px', 3],
                fontSize: '12px',
                alignItems: 'center',
              }}
              color="neutral3"
              display={['none', 'none', 'none', 'flex']}
            >
              {links.map((link, index) => (
                <a key={index} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
              <FeedbackButton />
            </Box>
          </Box>
          <Box display={['block']} sx={{ width: '1px', height: '24px', bg: 'neutral4' }} />
          <Flex color="neutral3" sx={{ alignItems: 'center', gap: [2, 3] }}>
            {channels
              .filter((_d) => (isVN ? _d.href !== LINKS.telegram : true))
              .map((_d, index) => (
                <Box
                  key={index}
                  as="a"
                  href={_d.href}
                  target="_blank"
                  sx={{ lineHeight: 0 }}
                  onClick={() => logEventRoutes(_d.event)}
                >
                  <_d.Icon variant="Bold" size={20} />
                </Box>
              ))}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

const links = [
  { label: <Trans>HOME</Trans>, href: LINKS.website },
  { label: <Trans>UPGRADE</Trans>, href: ROUTES.SUBSCRIPTION.path },
  { label: <Trans>BLOG</Trans>, href: LINKS.blog },
  { label: <Trans>DOCS</Trans>, href: LINKS.docs },
  { label: <Trans>TERMS & POLICY</Trans>, href: LINKS.policy },
]

const linksMobile = [
  { label: <Trans>UPGRADE</Trans>, href: ROUTES.SUBSCRIPTION.path },
  { label: <Trans>DOCS</Trans>, href: LINKS.docs },
  { label: <Trans>POLICY</Trans>, href: LINKS.policy },
]

const channels = [
  { Icon: DiscordIcon, href: LINKS.discord, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_DISCORD },
  { Icon: TelegramIcon, href: LINKS.telegram, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_TELEGRAM },
  { Icon: TwitterIcon, href: LINKS.twitter, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_TWITTER },
  { Icon: GithubIcon, href: LINKS.github, event: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_GITHUB },
]

export default Footer

function DropDownMobile() {
  return (
    <Box display={['block', 'block', 'block', 'none']}>
      <Dropdown
        placement="bottomRight"
        dismissible
        hasArrow={true}
        buttonSx={{ pt: '7px', pr: '9px' }}
        buttonVariant="ghost"
        menu={
          <Flex
            p={'0 12px'}
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            {links.map((link, index) => (
              <Box
                width="100%"
                key={index}
                p={2}
                sx={{
                  textAlign: 'start',
                  color: 'white',
                }}
              >
                <Box as="a" href={link.href} target="_blank" rel="noreferrer" sx={{ color: 'inherit' }}>
                  {link.label}
                </Box>
              </Box>
            ))}
            <Box width="100%" py={2} px={2}>
              <FeedbackButton />
            </Box>
          </Flex>
        }
      >
        <Type.Caption>
          <Trans>More</Trans>
        </Type.Caption>
      </Dropdown>
    </Box>
  )
}
