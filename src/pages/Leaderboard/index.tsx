import CustomPageTitle from 'components/@ui/CustomPageTitle'
import TopLeaderboard from 'components/TopLeadboard'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { HomeSwitchProtocols } from 'pages/Home/SwitchProtocols'
import { Box, Flex } from 'theme/base'

import SearchRanking from './SearchRanking'
import SelectSeason from './SelectSeason'
import SwitchLeaderboardType from './SwitchLeaderboardType'

const Leaderboard = () => {
  const { protocol } = useProtocolStore()
  return (
    <>
      <CustomPageTitle title={`Leaderboard on ${protocol}`} />
      <Flex
        sx={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <Flex
          px={[0, 0, 3, 3]}
          sx={{ borderBottom: 'small', borderColor: 'neutral4', width: '100%', mb: 0 }}
          alignItems="center"
          flexDirection={['column', 'column', 'row', 'row']}
          flexWrap="wrap"
          pb={[3, 3, 0, 0]}
        >
          <Flex
            width={['100%', '100%', 'fit-content', 'fit-content']}
            alignItems="center"
            justifyContent="space-between"
            sx={{
              gap: 3,
              borderBottom: ['small', 'small', 'none', 'none'],
              borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
            }}
          >
            <SwitchLeaderboardType sx={{ pl: [3, 3, 0, 0], pr: [0, 0, 3, 3] }} />
            <Box display={['block', 'block', 'none', 'none']}>
              <HomeSwitchProtocols buttonSx={{ borderRight: 'none', borderBottom: 'none' }} />
            </Box>
          </Flex>
          <Flex px={[3, 3, 0, 0]} width="100%" alignItems="center" flex={1} flexWrap="wrap">
            <SelectSeason />
            <SearchRanking />
          </Flex>
        </Flex>
        <Box sx={{ flex: '1 0 0' }}>
          <TopLeaderboard />
        </Box>
      </Flex>
    </>
  )
}

export default Leaderboard
