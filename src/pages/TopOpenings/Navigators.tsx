import { Trans } from '@lingui/macro'
import { CaretRight, CrownSimple } from '@phosphor-icons/react'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { Flex, IconBox, Type } from 'theme/base'
import { generateOIMarketsRoute, generateOIRoute } from 'utils/helpers/generateRoute'

export function MarketLink({ text }: { text: ReactNode }) {
  const protocol = useProtocolStore((state) => state.protocol)
  return <LinkItem text={text} link={generateOIMarketsRoute({ protocol })} isPremiumFeature={false} />
}

export function TopOpenLink() {
  const protocol = useProtocolStore((state) => state.protocol)
  return <LinkItem text={<Trans>Overall</Trans>} link={generateOIRoute({ protocol })} isPremiumFeature={false} />
}

function LinkItem({ text, link, isPremiumFeature }: { text: ReactNode; link: string; isPremiumFeature: boolean }) {
  const { checkIsPremium } = useIsPremiumAndAction()
  return (
    <Flex
      as={Link}
      to={link}
      onClick={(e) => {
        if (isPremiumFeature && !checkIsPremium()) {
          e.preventDefault()
          return
        }
      }}
      sx={{
        color: 'inherit',
        gap: 1,
        alignItems: 'center',
        '&:hover': { '.navigator_icon': { color: 'neutral1' } },
      }}
    >
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <Type.Caption>{text}</Type.Caption>
        {isPremiumFeature && <IconBox color="orange1" icon={<CrownSimple size={16} weight="fill" />} />}
      </Flex>
      <IconBox className="navigator_icon" color="neutral3" icon={<CaretRight size={16} />} />
    </Flex>
  )
}
