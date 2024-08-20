import { Trans } from '@lingui/macro'
import { Trophy } from '@phosphor-icons/react'

import TopLeaderboard from 'components/@trader/TraderLeaderboardTableView'
import PageHeader from 'components/@widgets/PageHeader'
import { RouteSwitchProtocol } from 'components/@widgets/SwitchProtocols'
import { LeaderboardProvider } from 'hooks/features/useLeaderboardProvider'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { BottomTabItemMobile, BottomTabWrapperMobile } from 'pages/@layouts/Components'
import { Box, Flex } from 'theme/base'

import SearchRanking from './SearchRanking'
import SelectSeason from './SelectSeason'
import SwitchLeaderboardType from './SwitchLeaderboardType'

const Leaderboard = () => {
  const { protocol } = useProtocolStore()
  return (
    <>
      <LeaderboardProvider>
        <Flex
          sx={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <PageHeader
            pageTitle={`Leaderboard on ${protocol}`}
            headerText={<Trans>LEADERBOARD</Trans>}
            icon={Trophy}
            routeSwitchProtocol
          />
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
              <Box display={['block', 'block', 'none']}>
                <RouteSwitchProtocol
                  componentProps={{
                    buttonSx: { height: 40, px: '8px !important', borderLeft: 'small', borderLeftColor: 'neutral4' },
                    showIcon: true,
                  }}
                />
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
          <BottomTabWrapperMobile>
            <BottomTabItemMobile icon={<Trophy size={24} weight="fill" />} text={<Trans>Traders explorer</Trans>} />
          </BottomTabWrapperMobile>
        </Flex>
      </LeaderboardProvider>
    </>
  )
}

export default Leaderboard
