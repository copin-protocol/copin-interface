import { Trans } from '@lingui/macro'
import { Trophy } from '@phosphor-icons/react'

import TopLeaderboard from 'components/@trader/TraderLeaderboardTableView'
import PageHeader from 'components/@widgets/PageHeader'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import useGlobalStore from 'hooks/store/useGlobalStore'
import { Box, Flex } from 'theme/base'

import SearchRanking from './SearchRanking'
import SelectSeason from './SelectSeason'
import SwitchLeaderboardType from './SwitchLeaderboardType'
import { LeaderboardProvider } from './useLeaderboardProvider'

const LeaderboardPage = () => {
  const protocol = useGlobalStore((s) => s.protocol)
  return (
    <SafeComponentWrapper>
      <LeaderboardProvider>
        <Flex
          sx={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <PageHeader
            pageTitle={`Trader Board on ${protocol}`}
            headerText={<Trans>TRADER BOARD</Trans>}
            icon={Trophy}
            routeSwitchProtocol
            showOnMobile
          />
          <Flex
            // px={[0, 0, 3, 3]}
            sx={{ borderBottom: 'small', borderColor: 'neutral4', width: '100%', mb: 0 }}
            alignItems="center"
            // flexDirection={['column', 'column', 'row', 'row']}
            flexWrap="wrap"
            // pb={[3, 3, 0, 0]}
          >
            <Flex width="100%" alignItems="center" flex={1} flexWrap="wrap">
              <Flex flex="auto">
                <SwitchLeaderboardType
                  sx={{ width: 'fit-content', borderBottom: ['small', 'small', 'none'], borderColor: 'neutral4' }}
                />
                <SelectSeason />
              </Flex>

              <SearchRanking />
            </Flex>
          </Flex>
          <Box sx={{ flex: '1 0 0' }}>
            <TopLeaderboard />
          </Box>
        </Flex>
      </LeaderboardProvider>
    </SafeComponentWrapper>
  )
}

export default LeaderboardPage
