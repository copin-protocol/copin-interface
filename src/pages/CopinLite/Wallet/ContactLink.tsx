import { Lifebuoy } from '@phosphor-icons/react'
import React from 'react'

import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

const ContactLink = () => {
  return (
    <Flex color="neutral2" justifyContent="center" alignItems="center" py={1} sx={{ gap: 1 }}>
      <IconBox icon={<Lifebuoy size={16} />} />
      <Type.Caption>Need To Help?</Type.Caption>
      <Box as="a" href={LINKS.support} target="_blank" rel="noreferrer" sx={{ fontSize: '12px', lineHeight: '18px' }}>
        Contact Our Support
      </Box>
    </Flex>
  )
}

export default ContactLink
