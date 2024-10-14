import CopierLeaderBoardTableView from 'components/@copier/CopierLeaderboardTableView'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { CopierLeaderboardProvider } from 'hooks/features/useCopierLeaderboardProvider'
import RankingIcon from 'theme/Icons/RankingIcon'
import { Box, Flex, Type } from 'theme/base'

import ExchangeFilterSection from './ExchangeFilterSection'
import SearchRanking from './SearchRanking'
import TimeFilterSection from './TimeFilterSection'

const CopierLeaderboard = () => {
  return (
    <>
      <CustomPageTitle title="Copier Ranking" />
      <CopierLeaderboardProvider>
        <Flex
          sx={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <Flex
            height={48}
            color="neutral1"
            sx={{ alignItems: 'center', px: 3, gap: 2, borderBottom: 'small', borderBottomColor: 'neutral4' }}
          >
            <RankingIcon />
            <Type.Body>COPIER RANKING</Type.Body>
          </Flex>
          <Flex
            sx={{
              position: 'relative',
              zIndex: 9,
              height: ['auto', 'auto', 'auto', 62],
              px: 3,
              py: [12, 12, 12, 0],
              width: '100%',
              flexDirection: ['column', 'column', 'column', 'row'],
              alignItems: ['start', 'start', 'start', 'center'],
              justifyContent: ['start', 'start', 'start', 'center'],
              gap: 3,
              borderBottom: ['small', 'small', 'start', 'small'],
              maxWidth: 1000,
              mx: 'auto',
              borderLeft: ['none', 'none', 'none', 'small'],
              borderRight: ['none', 'none', 'none', 'small'],
              borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
            }}
          >
            <Box flex={['auto', 'auto', 1]}>
              <TimeFilterSection />
            </Box>
            <Flex sx={{ alignItems: 'center', gap: 3, height: [44, 44, '100%'] }}>
              <Flex
                sx={{
                  flexShrink: 0,
                  alignItems: 'center',
                  height: '100%',
                  width: 'max-content',
                  borderLeft: 'small',
                  borderRight: 'small',
                  borderTop: ['small', 'small', 'small', 'none'],
                  borderBottom: ['small', 'small', 'small', 'none'],
                  borderColor: ['neutral4', 'neutral4', 'neutral4', 'none'],
                  borderRadius: ['4px', '4px', 0],
                }}
              >
                <ExchangeFilterSection />
              </Flex>
              <SearchRanking />
            </Flex>
          </Flex>
          <Box sx={{ flex: '1 0 0' }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                maxWidth: 1000,
                mx: 'auto',
                borderLeft: ['none', 'none', 'none', 'small'],
                borderRight: ['none', 'none', 'none', 'small'],
                borderColor: ['none', 'none', 'none', 'neutral4'],
                py: [3, 3, 0],
              }}
            >
              <CopierLeaderBoardTableView />
            </Box>
          </Box>
          {/* <BottomTabWrapperMobile>
            <BottomTabItemMobile icon={<Trophy size={24} weight="fill" />} text={<Trans>Copier Leaderboard</Trans>} />
          </BottomTabWrapperMobile> */}
        </Flex>
      </CopierLeaderboardProvider>
    </>
  )
}

export default CopierLeaderboard
