import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import React, { useCallback } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import { searchPositionsApi } from 'apis/positionApis'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoDataFound from 'components/@ui/NoDataFound'
import SearchPositionResultItem from 'components/@ui/SearchPositionResult'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

const MAX_WIDTH = 550
const SearchTxHash = () => {
  const { sm } = useResponsive()
  const history = useHistory()
  const { txHash } = useParams<{ txHash: string }>()
  const { data, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.SEARCH_TX_HASH, txHash],
    () =>
      searchPositionsApi({
        txHash,
        limit: DEFAULT_LIMIT,
      }),
    {
      enabled: !!txHash,
    }
  )

  const handleClickPosition = useCallback(
    (data: PositionData) => {
      history.push(generatePositionDetailsRoute(data, { highlightTxHash: txHash }))
    },
    [history, txHash]
  )

  return (
    <>
      <CustomPageTitle title={`Search results for ${addressShorten(txHash, 6)}`} />
      <Flex
        sx={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Flex
          width="100%"
          p={3}
          mb={[0, 0, 0, 3, 3]}
          sx={{ gap: 2, border: 'small', borderColor: 'neutral4', borderTop: 'none' }}
          alignItems="center"
          flexWrap="wrap"
        >
          <Type.LargeBold>
            All results for <Type.LargeBold color="primary1">{addressShorten(txHash, 6)}</Type.LargeBold>
          </Type.LargeBold>
        </Flex>
        <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            width="100%"
            maxWidth={['100%', '100%', MAX_WIDTH, MAX_WIDTH]}
            px={3}
            py={2}
            sx={{ border: 'small', borderBottom: 'none', borderColor: 'neutral4' }}
          >
            <Type.CaptionBold>
              <Trans>Position List</Trans> ({formatNumber(data?.length ?? 0)})
            </Type.CaptionBold>
          </Box>
          <Box
            mb={[0, 0, 0, 3, 3]}
            width="100%"
            maxWidth={['100%', '100%', MAX_WIDTH, MAX_WIDTH]}
            sx={{
              flex: '1 0 0',
              overflowX: 'auto',
              ...(sm
                ? {}
                : {
                    '& *': {
                      fontSize: '13px !important',
                      lineHeight: '18px !important',
                    },
                  }),
              border: 'small',
              borderTop: 'none',
              borderColor: 'neutral4',
            }}
          >
            {isLoading && <Loading />}
            {!isLoading && data && data.length > 0 && (
              <Box width="100%" height="100%">
                {data.map((positionData) => (
                  <SearchPositionResultItem
                    isShowPnl
                    key={positionData.id}
                    data={positionData}
                    handleClick={handleClickPosition}
                  />
                ))}
              </Box>
            )}
            {!isLoading && (!data || data.length === 0) && (
              <NoDataFound message={<Trans>No Transactions Found</Trans>} />
            )}
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default SearchTxHash
