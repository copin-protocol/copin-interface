import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { getReferralListApi } from 'apis/userApis'
import NoDataFound from 'components/@ui/NoDataFound'
import Loading from 'theme/Loading'
import { PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, Type } from 'theme/base'
import { DATE_FORMAT } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatLocalDate } from 'utils/helpers/format'
import { pageToOffset } from 'utils/helpers/transform'

const LIMIT = 10
const ReferralList = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_REFERRAL_LIST, currentPage],
    () =>
      getReferralListApi({
        limit: LIMIT,
        offset: pageToOffset(currentPage, LIMIT),
      }),
    {
      retry: 0,
      keepPreviousData: true,
    }
  )

  return (
    <Box
      sx={{
        borderLeft: ['none', 'small'],
        borderTop: ['small', 'none'],
        borderColor: ['neutral4', 'neutral4'],
        position: 'relative',
      }}
      p={3}
      width={['100%', 350]}
    >
      <Type.BodyBold color={'neutral1'}>
        <Trans>Referral List</Trans>
      </Type.BodyBold>
      <Box mt={3} textAlign={'center'}>
        {isLoading && <Loading />}
        {data && data.data.length == 0 && <NoDataFound message={<Trans>You do not have any referral</Trans>} />}
      </Box>

      <Box>
        {data &&
          data.data &&
          data.data.length > 0 &&
          data.data.map((ref) => (
            <Flex key={ref.username} justifyContent={'space-between'} alignItems={'center'} mb={2}>
              <Type.Caption color={'neutral2'}>{ref.username}</Type.Caption>
              <Type.Caption color={'neutral3'}>{formatLocalDate(ref.createdAt ?? '', DATE_FORMAT)}</Type.Caption>
            </Flex>
          ))}
      </Box>
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <PaginationWithSelect
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          apiMeta={data?.meta}
          sx={{
            width: '100%',
            justifyContent: 'end',
            py: 1,
            px: 2,
            borderTop: 'small',
            borderColor: 'neutral4',
          }}
        />
      </Box>
    </Box>
  )
}

export default ReferralList
