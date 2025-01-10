import React from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import CopyOpeningPositions from 'components/@position/CopyOpeningPositions'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

const LiteOpeningPositions = () => {
  const { embeddedWallet, loadingEmbeddedWallets } = useCopyWalletContext()

  const _queryParams: GetMyPositionsParams = {
    limit: 500,
    offset: 0,
    identifyKey: undefined,
    status: [PositionStatusEnum.OPEN],
    copyWalletId: embeddedWallet?.id,
  }
  const _queryBody: GetMyPositionRequestBody = {
    copyWalletIds: embeddedWallet ? [embeddedWallet.id] : [],
  }

  const { data, refetch } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody],
    () => getMyCopyPositionsApi(_queryParams, _queryBody),
    {
      retry: 0,
      keepPreviousData: true,
      refetchInterval: 5000,
    }
  )

  return (
    <Box height="100%">
      {loadingEmbeddedWallets ? (
        <Loading />
      ) : (
        <CopyOpeningPositions
          data={data?.data}
          isLoading={false}
          layoutType="lite"
          onClosePositionSuccess={refetch}
          tableProps={{
            wrapperSx: {
              '& td': {
                pt: '6px!important',
                pb: '6px!important',
              },
            },
          }}
        />
      )}
    </Box>
  )
}

export default LiteOpeningPositions
