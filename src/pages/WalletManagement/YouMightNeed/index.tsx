import { Trans } from '@lingui/macro'
import { Info } from '@phosphor-icons/react'
import React from 'react'

import BingXHelp from 'components/@ui/BingXHelp'
import SectionTitle from 'components/@ui/SectionTitle'
import { Flex } from 'theme/base'

export default function YouMightNeed() {
  return (
    <Flex px={24} py={24} flexDirection="column" height="100%">
      <SectionTitle icon={<Info size={24} />} title={<Trans>You Might Need</Trans>} />
      <BingXHelp mt={2} />
    </Flex>
  )
}
