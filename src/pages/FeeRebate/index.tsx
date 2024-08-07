import { Calendar, Trophy } from '@phosphor-icons/react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getListEvent } from 'apis/event'
import { TradingEventStatusEnum } from 'entities/event'
import { Box, Flex, IconBox, Li, Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { formatDate, formatNumber } from 'utils/helpers/format'

export default function FeeRebatePage() {
  const { data: events } = useQuery([QUERY_KEYS.GET_EVENT_COMPETITION, 'allEvents'], getListEvent)
  if (!events?.length) return null
  return (
    <Box sx={{ p: 3 }}>
      {events?.map((_e) => {
        let statusColor = 'neutral3'
        switch (_e.status) {
          case TradingEventStatusEnum.ONGOING:
            statusColor = 'green1'
            break
          case TradingEventStatusEnum.UPCOMING:
            statusColor = 'primary1'
            break
        }
        return (
          <Box
            key={_e.id}
            mb={3}
            as={Link}
            to={`${ROUTES.EVENT_DETAILS.path_prefix}/${_e.id}`}
            sx={{ display: 'block', p: 3, bg: 'neutral6' }}
          >
            <Li mb={2} signcolor={statusColor}>
              <Type.CaptionBold>{_e.title}</Type.CaptionBold>
            </Li>
            <Flex mb={2} sx={{ alignItems: 'center', gap: 2 }}>
              <IconBox icon={<Trophy size={20} />} color="primary1" />
              <Type.Caption color="primary1">${formatNumber(_e.maxReward)}</Type.Caption>
            </Flex>
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <IconBox icon={<Calendar size={20} />} color="neutral3" />
              <Type.Caption color="neutral3">
                {formatDate(_e.registerDate)} - {formatDate(_e.endDate)}
              </Type.Caption>
            </Flex>
          </Box>
        )
      })}
    </Box>
  )
}
