import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

import ReferralList from './ReferralList'
import ReferralOverview from './ReferralOverview'

const Referral = () => {
  return (
    <Box sx={{ height: '100%', overflow: 'hidden auto' }}>
      <Flex justifyContent={'center'} alignItems={'center'} minHeight="100%">
        <Box>
          <Flex
            flexDirection={['column', 'row']}
            sx={{
              border: 'small',
              borderColor: 'neutral4',
              margin: 'auto',
            }}
          >
            <ReferralOverview />
            <ReferralList />
          </Flex>
          <Box bg={'neutral5'} px={3} py={2}>
            <Type.Caption color={'neutral3'}>
              To learn more about referral program. Please access{' '}
              <a href={LINKS.referralProgram} target="_blank" rel="noreferrer">
                Copin docs
              </a>
            </Type.Caption>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

export default Referral
