import { Pulse } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

import { default as OpeningsTable } from 'components/TopOpeningPositions/TopOpeningsWindow'
import useQueryTopOpenings from 'hooks/router/useQueryTopOpenings'
import useMyProfile from 'hooks/store/useMyProfile'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { RELOAD_TOP_OPENING_POSITIONS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

const LIMIT = 10
export default function TopOpeningsSection({ protocol }: { protocol: ProtocolEnum }) {
  const { myProfile } = useMyProfile()
  const { data, isLoading } = useQueryTopOpenings({
    protocol,
    defaultLimit: LIMIT,
    intervalRequest: RELOAD_TOP_OPENING_POSITIONS,
    queryKey: 'topOpeningWindow',
  })
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', bg: 'neutral5' }}>
      <Flex
        sx={{ width: '100%', pl: 28, pr: 20, py: 12, alignItems: 'center', gap: 3, justifyContent: 'space-between' }}
      >
        <Flex sx={{ gap: 2, alignItems: 'center' }}>
          <IconBox color="primary1" icon={<Pulse size={24} />} />
          <Type.BodyBold>Top Opening Positions</Type.BodyBold>
        </Flex>
        <Box
          as={Link}
          to={ROUTES.TOP_OPENINGS.path}
          target="_blank"
          onClick={() => {
            logEvent({
              category: EventCategory.ROUTES,
              action: EVENT_ACTIONS[EventCategory.ROUTES].TOP_OPENING_POSITIONS_ALL,
              label: getUserForTracking(myProfile?.username),
            })
          }}
        >
          <Type.Caption
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View All
          </Type.Caption>
        </Box>
      </Flex>
      <Box sx={{ flex: '1 0 0', overflowX: 'auto', overflowY: 'hidden' }}>
        <OpeningsTable data={data?.data} isLoading={isLoading} page={1} />
      </Box>
    </Flex>
  )
}
