import { ArrowSquareOut, CrownSimple } from '@phosphor-icons/react'

import useMyProfile from 'hooks/store/useMyProfile'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { PLANS } from 'utils/config/subscription'

const PremiumTag = () => {
  const { myProfile } = useMyProfile()
  const Icon: any = CrownSimple

  const currentPlan = PLANS.find((plan) => plan.title === myProfile?.subscription?.plan)

  return myProfile ? (
    <Box>
      <Flex
        alignItems="center"
        sx={{ gap: 1 }}
        data-tip="React-tooltip"
        data-tooltip-id={`tt-premium`}
        data-tooltip-delay-show={360}
      >
        <IconBox icon={<Icon weight="fill" size={16} />} color={currentPlan?.color} />
        <Type.Caption lineHeight="13px" color={currentPlan?.color} sx={{ textTransform: 'capitalize' }}>
          {currentPlan?.title?.toLowerCase()}
        </Type.Caption>
      </Flex>
      {!currentPlan ||
        (currentPlan.title === SubscriptionPlanEnum.FREE && (
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
        ))}
    </Box>
  ) : (
    <></>
  )
}

export default PremiumTag
