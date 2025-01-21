import { ArrowSquareOut, CrownSimple } from '@phosphor-icons/react'

import useMyProfile from 'hooks/store/useMyProfile'
import { VipPlanIcon2 } from 'theme/Icons/VipPlanIcon'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'

const PremiumTag = () => {
  const { myProfile } = useMyProfile()
  let Icon: any = CrownSimple
  let label = 'Basic'
  let color = 'neutral2'
  switch (myProfile?.plan) {
    case SubscriptionPlanEnum.PREMIUM:
      color = 'orange1'
      label = 'Premium'
      break
    case SubscriptionPlanEnum.VIP:
      color = 'violet'
      label = 'VIP'
      Icon = VipPlanIcon2
      break
  }
  const isBasic = myProfile?.plan === SubscriptionPlanEnum.BASIC

  return myProfile ? (
    <Box>
      <Flex
        alignItems="center"
        sx={{ gap: 1 }}
        data-tip="React-tooltip"
        data-tooltip-id={`tt-premium`}
        data-tooltip-delay-show={360}
      >
        <IconBox icon={<Icon weight="fill" size={16} />} color={color} />
        <Type.Caption lineHeight="13px" color={color}>
          {label}
        </Type.Caption>
      </Flex>
      {isBasic && (
        <Tooltip id={`tt-premium`} place="bottom" noArrow={true} clickable={true}>
          <Type.Small maxWidth={300}>
            Your account is <b>Basic Plan</b>.{' '}
            <a href={LINKS.upgradePremium} target="_blank" rel="noreferrer">
              <Flex alignItems="center" sx={{ gap: 1 }}>
                <Type.Small>Read more</Type.Small>
                <ArrowSquareOut weight="fill" />
              </Flex>
            </a>
          </Type.Small>
        </Tooltip>
      )}
    </Box>
  ) : (
    <></>
  )
}

export default PremiumTag
