import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import CopyOpeningPositions from 'components/@position/CopyOpeningPositions'
import LiteFilterOpeningPositionTrader from 'components/@position/CopyOpeningPositions/LiteOpeningFilterTrader'
import {
  convertPairHL,
  getHLCopyPositionIdentifyKey,
  parseHLCopyPositionData,
} from 'components/@position/helpers/hyperliquid'
import { CopyPositionData } from 'entities/copyTrade'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import NoDataOrSelect from 'pages/MyProfile/NoDataOrSelect'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS } from 'utils/config/keys'

import SwitchLayoutButtons from '../SwitchLayoutButtons'
import useMobileLayoutHandler from '../useMobileLayoutHandler'
import { useLiteOpeningPositionsContext } from './useOpeningPositionsContext'

const LiteOpeningPositions = () => {
  const { embeddedWallet, loadingEmbeddedWallets, embeddedWalletInfo } = useCopyWalletContext()
  const { selectedTraders, isSelectedAllTrader, handleToggleAllTrader } = useLiteOpeningPositionsContext()

  const _queryParams: GetMyPositionsParams = {
    limit: 500,
    offset: 0,
    identifyKey: undefined,
    status: [PositionStatusEnum.OPEN],
    copyWalletId: embeddedWallet?.id,
  }
  const _queryBody: GetMyPositionRequestBody = {
    copyWalletIds: embeddedWallet ? [embeddedWallet.id] : [],
    traders: !!selectedTraders ? selectedTraders : undefined,
  }

  const { data, isLoading, refetch } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody],
    () => getMyCopyPositionsApi(_queryParams, _queryBody),
    {
      retry: 0,
      keepPreviousData: true,
      refetchInterval: 5000,
    }
  )

  const hasSelectedTraders = selectedTraders == null || !!selectedTraders.length

  const { lg } = useResponsive()
  const { layoutType: mobileLayoutType, handleChangeLayout } = useMobileLayoutHandler({
    storageKey: STORAGE_KEYS.LITE_OPENING_LAYOUT,
    mobileBreakpoint: lg,
  })
  const { getSymbolByIndexToken } = useMarketsConfig()
  const _data = useMemo(() => {
    const hlCopyPositions = parseHLCopyPositionData({ data: embeddedWalletInfo?.assetPositions })
    const hlPositionMapping = hlCopyPositions.reduce<Record<string, CopyPositionData>>((result, hlPosition) => {
      const key = getHLCopyPositionIdentifyKey(hlPosition)
      return { ...result, [key]: { ...hlPosition } }
    }, {})
    const _openingPositions = data?.data?.map((v) => {
      const symbol = getSymbolByIndexToken?.({ indexToken: v.indexToken, protocol: v.protocol })
      const pair = v.pair ? v.pair : symbol ? convertPairHL(symbol) : undefined
      if (!pair) {
        const result: CopyPositionData = { ...v, openingPositionType: 'liveBoth' }
        return result
      }
      const key = getHLCopyPositionIdentifyKey({ ...v, pair })
      const hlPosition = hlPositionMapping[key]
      const result: CopyPositionData = { ...v, openingPositionType: hlPosition ? 'liveBoth' : 'onlyLiveApp' }
      return result
    })

    return _openingPositions ?? []
  }, [data?.data, embeddedWalletInfo?.assetPositions, getSymbolByIndexToken])

  return (
    <Flex flexDirection="column" height="100%" width="100%">
      {loadingEmbeddedWallets ? (
        <Loading />
      ) : (
        <>
          {!lg && (
            <Flex
              sx={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 'small',
                borderBottomColor: 'neutral4',
                px: 3,
              }}
            >
              <LiteFilterOpeningPositionTrader type="textAndIcon" />
              <SwitchLayoutButtons layoutType={mobileLayoutType} onChangeType={handleChangeLayout} />
            </Flex>
          )}
          <Box flex="1 0 0" overflow="hidden" pt={1} sx={{ position: 'relative' }}>
            <CopyOpeningPositions
              hasFilter={!!selectedTraders && !isSelectedAllTrader}
              data={_data as any}
              isLoading={isLoading}
              layoutType="lite"
              mobileLayoutType={mobileLayoutType}
              onClosePositionSuccess={refetch}
              tableProps={{
                wrapperSx: {
                  '& td': {
                    pt: '6px!important',
                    pb: '6px!important',
                  },
                },
              }}
              noDataComponent={
                !hasSelectedTraders ? (
                  <NoDataOrSelect
                    type="noSelectTradersInOpening"
                    handleClickActionButton={() => handleToggleAllTrader(true)}
                    actionButtonText={<Trans>Select All Traders</Trans>}
                    isLoading={isLoading}
                  />
                ) : undefined
              }
            />
          </Box>
        </>
      )}
    </Flex>
  )
}

export default LiteOpeningPositions
