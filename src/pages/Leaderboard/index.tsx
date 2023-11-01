import CustomPageTitle from 'components/@ui/CustomPageTitle'
import TopLeaderboard from 'components/TopLeadboard'
import { useProtocolStore } from 'hooks/store/useProtocols'
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
          px={3}
          sx={{ borderBottom: 'small', borderColor: 'neutral4', width: '100%', mb: 0 }}
          alignItems="center"
          flexDirection={['column', 'column', 'row', 'row']}
          flexWrap="wrap"
          py={[3, 3, 0, 0]}
        >
          <SwitchLeaderboardType />
          <Flex width="100%" alignItems="center" flex={1} flexWrap="wrap">
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
