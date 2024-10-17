import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { Fragment, ReactNode, useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

import { searchPositionsApi } from 'apis/positionApis'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import NoDataFound from 'components/@ui/NoDataFound'
import SearchPositionResultItem from 'components/@widgets/SearchPositionResultItem'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT, NO_TX_HASH_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

const MAX_WIDTH = 550
const PositionTxResults = ({
  txHash,
  protocol,
  account,
  title = <Trans>Position List</Trans>,
}: {
  txHash: string
  protocol?: ProtocolEnum
  account?: string
  title?: ReactNode
}) => {
  const { sm } = useResponsive()
  const history = useHistory()
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.SEARCH_TX_HASH, txHash, protocol],
    () =>
      searchPositionsApi({
        txHash,
        protocol,
        limit: DEFAULT_LIMIT,
      }),
    {
      enabled: !!txHash,
    }
  )

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
      history.push(
        generatePositionDetailsRoute(
          {
            protocol: data.protocol,
            txHash: data.txHashes?.[0],
            account: data.account,
            logId: data.logId,
            id: data.id,
          },
          { highlightTxHash: txHash }
        )
      )
    },
    [history, txHash]
  )

  return (
    <Flex mt={[0, 0, 0, 3, 3]} sx={{ width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        width="100%"
        maxWidth={['100%', '100%', MAX_WIDTH, MAX_WIDTH]}
        px={3}
        py={2}
        sx={{ border: 'small', borderBottom: 'none', borderColor: 'neutral4' }}
      >
        <Flex alignItems="center" sx={{ gap: 2 }}>
          <Type.CaptionBold>
            {title} ({formatNumber(data?.length ?? 0)})
          </Type.CaptionBold>
          {protocols &&
            protocols.length > 0 &&
            protocols.map((protocol) => {
              if (NO_TX_HASH_PROTOCOLS.includes(protocol)) return <Fragment key={protocol} />
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
            {!isLoading && !!account && data && data.length > 0 && (
              <Box px={[3, 4]} sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
                <NoDataFound
                  message={
                    <Trans>
                      Maybe you are missing a trader address or have incorrect logs, you can refer to &quot;Recommend
                      Results&quot; section.
                    </Trans>
                  }
                />
              </Box>
            )}
          </Box>
        )}
        {!isLoading && (!data || data.length === 0) && <NoDataFound message={<Trans>No Transactions Found</Trans>} />}
      </Box>
    </Flex>
  )
}

export default PositionTxResults
