import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import React, { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import { searchPositionsApi } from 'apis/positionApis'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import NoDataFound from 'components/@ui/NoDataFound'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import SearchPositionResultItem from 'components/@widgets/SearchPositionResultItem'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

const MAX_WIDTH = 550
const SearchTxHashPage = () => {
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

  // TODO: Check when add new protocol
  const protocols = useMemo(() => {
    const uniqueProtocols = new Set(data?.map((item) => item.protocol))
    if (uniqueProtocols && uniqueProtocols.size > 0) {
      const listProtocols = Array.from(uniqueProtocols)
      if (listProtocols.includes(ProtocolEnum.KWENTA) && listProtocols.includes(ProtocolEnum.POLYNOMIAL)) {
        return listProtocols.filter((protocol) => protocol !== ProtocolEnum.POLYNOMIAL)
      }
      return listProtocols
    }
    return
  }, [data])

  const handleClickPosition = useCallback(
    (data: PositionData) => {
      history.push(generatePositionDetailsRoute({ ...data, txHash }, { highlightTxHash: txHash }))
    },
    [history, txHash]
  )

  return (
    <SafeComponentWrapper>
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
          {protocols &&
            protocols.length > 0 &&
            protocols.map((protocol) => {
              return (
                <ExplorerLogo
                  key={protocol}
                  protocol={protocol}
                  explorerUrl={`${PROTOCOL_PROVIDER[protocol]?.explorerUrl}/tx/${txHash}`}
                  size={18}
                />
              )
            })}
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
                    hasArrow
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
    </SafeComponentWrapper>
  )
}

export default SearchTxHashPage
