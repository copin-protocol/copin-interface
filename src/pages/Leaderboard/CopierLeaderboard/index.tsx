import CopierLeaderBoardTableView from 'components/@copier/CopierLeaderboardTableView'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { CopierLeaderboardProvider } from 'hooks/features/useCopierLeaderboardProvider'
import RankingIcon from 'theme/Icons/RankingIcon'
import { Box, Flex, Type } from 'theme/base'
import { PAGE_TITLE_HEIGHT } from 'utils/config/constants'

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
            justifyContent="space-between"
            alignItems="center"
            sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}
          >
            <Flex height={48} color="neutral1" sx={{ alignItems: 'center', px: 3, gap: 2 }}>
              <RankingIcon />
              <Type.Body>COPIER RANKING</Type.Body>
            </Flex>
            <Box
              display={['block', 'block', 'block', 'none']}
              sx={{
                flexShrink: 0,
                alignItems: 'center',
                // height: '100%',
                width: 'max-content',
              }}
            >
              <ExchangeFilterSection />
            </Box>
          </Flex>

          <Flex
            sx={{
              position: 'relative',
              zIndex: 9,
              height: ['auto', 'auto', 'auto', PAGE_TITLE_HEIGHT],
              width: '100%',
              flexDirection: ['column', 'column', 'column', 'row'],
              alignItems: ['start', 'start', 'start', 'center'],
              justifyContent: ['start', 'start', 'start', 'center'],
              gap: [0, 0, 0, 3],
              borderBottom: ['small', 'small', 'start', 'small'],
              maxWidth: 1000,
              mx: 'auto',
              borderLeft: ['none', 'none', 'none', 'small'],
              borderRight: ['none', 'none', 'none', 'small'],
              borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
            }}
          >
            <Box
              display={['none', 'none', 'none', 'flex']}
              sx={{
                flexShrink: 0,
                alignItems: 'center',
                // height: '100%',
                width: 'max-content',
                borderRight: 'small',
                borderColor: 'neutral4',
                height: 48,
              }}
            >
              <ExchangeFilterSection />
            </Box>
            <Flex
              flex="auto"
              justifyContent="center"
              width={['100%', '100%', '100%', 'fit-content']}
              sx={{
                borderBottom: ['small', 'small', 'small', 'none'],
                borderColor: ['neutral4', 'neutral4', 'neutral4', 'none'],
              }}
            >
              <TimeFilterSection />
            </Flex>
            <Flex
              sx={{
                alignItems: 'center',
                height: [PAGE_TITLE_HEIGHT, PAGE_TITLE_HEIGHT, '100%'],
                borderLeft: ['none', 'none', 'none', 'small'],
                borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
              }}
            >
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
                // py: [3, 3, 0],
              }}
            >
              <CopierLeaderBoardTableView />
            </Box>
          </Box>
          {/* <BottomWrapperMobile>
            <BottomTabItemMobile icon={<Trophy size={24} weight="fill" />} text={<Trans>Copier Leaderboard</Trans>} />
          </BottomWrapperMobile> */}
        </Flex>
      </CopierLeaderboardProvider>
    </>
  )
}

export default CopierLeaderboard
