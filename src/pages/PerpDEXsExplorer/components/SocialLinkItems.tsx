import { GlobeSimple } from '@phosphor-icons/react'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import DiscordIcon from 'theme/Icons/DiscordIcon'
import DuneIcon from 'theme/Icons/DuneIcon'
import GithubIcon from 'theme/Icons/GithubIcon'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import TwitterIcon from 'theme/Icons/TwitterIcon'
import { Box } from 'theme/base'

function SocialLinkItems({ data }: { data: PerpDEXSourceResponse | undefined }) {
  const links = [
    { Icon: GlobeSimple, href: data?.websiteUrl },
    { Icon: DiscordIcon, href: data?.discordUrl },
    { Icon: TelegramIcon, href: data?.telegramUrl },
    { Icon: TwitterIcon, href: data?.xUrl },
    { Icon: GithubIcon, href: data?.githubUrl },
    { Icon: DuneIcon, href: data?.duneUrl },
  ]
  return (
    <>
      {links
        .filter((v) => !!v.href)
        .map((_d, index) => {
          return (
            <Box
              key={index}
              as="a"
              href={_d.href}
              target="_blank"
              sx={{ lineHeight: 0, flexShrink: 0, color: 'neutral3', '&:hover': { filter: 'brightness(150%)' } }}
              onClick={(e) => e.stopPropagation()}
            >
              <_d.Icon size={16} />
            </Box>
          )
        })}
    </>
  )
}

export default SocialLinkItems
