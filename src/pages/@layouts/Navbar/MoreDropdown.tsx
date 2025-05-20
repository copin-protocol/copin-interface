import { Trans } from '@lingui/macro'
import {
  BookBookmark,
  CaretDown,
  ChartBar,
  CircleHalfTilt,
  CrownSimple,
  Medal,
  PresentationChart,
  ThermometerSimple,
  Trophy,
  Users,
  Vault,
} from '@phosphor-icons/react'
import { ComponentType, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import useInternalRole from 'hooks/features/useInternalRole'
import Accordion from 'theme/Accordion'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { Z_INDEX } from 'utils/config/zIndex'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

export default function MoreDropdown({ hasEvents }: { hasEvents?: boolean }) {
  const isInternal = useInternalRole()
  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        borderBottom: 'small',
        borderBottomColor: 'transparent',
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
      <Flex
        className="dropdown-title"
        sx={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 1, px: 2 }}
      >
        <Type.Caption sx={{ textTransform: 'uppercase' }}>
          <Trans>MORE</Trans>
        </Type.Caption>
        <IconBox icon={<CaretDown size={16} />} color="neutral1" />
      </Flex>
      <Box
        className="dropdown-content"
        sx={{
          position: 'absolute',
          pt: 1,
          display: 'none',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: Z_INDEX.THEME_DROPDOWN,
        }}
      >
        <Box sx={{ p: 2, width: 140, bg: 'neutral8', border: 'small', borderColor: 'neutral4' }}>
          <Flex sx={{ flexDirection: 'column', gap: 12 }}>
            {[
              ...(isInternal ? internalConfigs : configs),
              ...(!hasEvents
                ? [
                    {
                      icon: Trophy,
                      text: <Trans>EVENTS</Trans>,
                      route: ROUTES.EVENTS.path,
                    },
                  ]
                : []),
            ].map((config, index) => {
              return <MoreItem key={index} {...config} />
            })}
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}
export function MoreDropdownMobile({
  onClickItem,
  hasEvents,
}: {
  onClickItem: (() => void) | undefined
  hasEvents?: boolean
}) {
  const isInternal = useInternalRole()
  return (
    <Accordion
      defaultOpen
      header={
        <Type.CaptionBold>
          <Trans>MORE</Trans>
        </Type.CaptionBold>
      }
      body={
        <Flex py={3} sx={{ flexDirection: 'column', gap: 3, '& *': { fontWeight: 'bold' } }} onClick={onClickItem}>
          {[
            ...(isInternal ? internalConfigs : configs),
            ...(!hasEvents
              ? [
                  {
                    icon: Trophy,
                    text: <Trans>EVENTS</Trans>,
                    route: ROUTES.EVENTS.path,
                  },
                ]
              : []),
          ].map((config, index) => {
            return <MoreItem key={index} {...config} />
          })}
        </Flex>
      }
    />
  )
}

const configs = [
  {
    icon: CrownSimple,
    text: <Trans>SUBSCRIPTION</Trans>,
    route: ROUTES.SUBSCRIPTION.path,
  },
  {
    icon: ChartBar,
    text: <Trans>STATS</Trans>,
    route: ROUTES.STATS.path,
  },
  {
    icon: Medal,
    text: <Trans>COPIER RANKING</Trans>,
    route: ROUTES.COPIER_RANKING.path,
  },
  // {
  //   icon: Users,
  //   text: <Trans>REFERRAL</Trans>,
  //   route: ROUTES.REFERRAL_MANAGEMENT.path,
  // },
  {
    icon: ThermometerSimple,
    text: <Trans>SYSTEM STATUS</Trans>,
    route: ROUTES.SYSTEM_STATUS.path,
  },
  {
    icon: PresentationChart,
    text: <Trans>CEX DEPTH</Trans>,
    route: ROUTES.STATS_CEX.path,
  },
  {
    icon: BookBookmark,
    text: <Trans>DOCUMENT</Trans>,
    link: LINKS.docs,
  },
  {
    icon: CircleHalfTilt,
    text: <Trans>DUNE DASHBOARD</Trans>,
    link: LINKS.duneUrl,
  },
  // {
  //   icon: Swap,
  //   text: <Trans>FEE REBATE</Trans>,
  //   route: ROUTES.FEE_REBATE.path,
  // },
]

const internalConfigs = [
  {
    icon: Vault,
    text: <Trans>VAULT</Trans>,
    route: `${ROUTES.VAULT_DETAILS.path_prefix}/${
      CONTRACT_ADDRESSES[ARBITRUM_CHAIN][CONTRACT_QUERY_KEYS.COPIN_VAULT_DETAILS]
    }`,
  },
  ...configs,
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
