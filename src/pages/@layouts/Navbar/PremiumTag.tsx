import { ArrowSquareOut, CrownSimple, PushPin } from '@phosphor-icons/react'
import React from 'react'

import useMyProfile from 'hooks/store/useMyProfile'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

const PremiumTag = () => {
  const { myProfile } = useMyProfile()
  const isPremium = myProfile && myProfile.copyTradeQuota > 3

  return myProfile ? (
    <Box>
      <Flex px={3} alignItems="center" sx={{ gap: 1 }} data-tip="React-tooltip" data-tooltip-id={`tt-premium`}>
        <IconBox
          icon={isPremium ? <CrownSimple weight="fill" /> : <PushPin weight="fill" />}
          color={isPremium ? 'orange1' : 'neutral2'}
        />
        <Type.Caption lineHeight="13px" color={isPremium ? 'orange1' : 'neutral2'}>
          {isPremium ? 'Premium' : 'Basic'}
        </Type.Caption>
      </Flex>
      {!isPremium && (
        <Tooltip id={`tt-premium`} place="bottom" type="dark" effect="solid" noArrow={true} clickable={true}>
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
