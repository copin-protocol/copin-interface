import { Trans } from '@lingui/macro'
import { Pulse } from '@phosphor-icons/react'
import { ComponentProps } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import CopyOpeningPositions from 'components/@position/CopyOpeningPositions'
import SectionTitle from 'components/@ui/SectionTitle'
import { CopyPositionData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { Box } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

import SettingConfigs from './SettingConfigs'

export default function OpeningPositions({
  activeWallet,
  copyWallets,
  hasLabel = true,
  onSuccess,
  limit = DEFAULT_LIMIT,
  restrictHeight = true,
  layoutType = 'normal',
  tableProps,
}: {
  activeWallet: CopyWalletData | null
  copyWallets: CopyWalletData[] | undefined
  hasLabel?: boolean
  onSuccess?: (data: CopyPositionData[] | undefined) => void
  limit?: number
  restrictHeight?: boolean
  layoutType?: 'simple' | 'normal'
  tableProps?: Partial<ComponentProps<typeof CopyOpeningPositions>>['tableProps']
}) {
  const _queryParams: GetMyPositionsParams = {
    limit,
    offset: 0,
    identifyKey: undefined,
    status: [PositionStatusEnum.OPEN],
    copyWalletId: activeWallet?.id,
  }
  const _queryBody: GetMyPositionRequestBody = {
    copyWalletIds: activeWallet?.id ? [activeWallet.id] : copyWallets?.map((e) => e.id),
  }
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody],
    () => getMyCopyPositionsApi(_queryParams, _queryBody),
    {
      retry: 0,
      keepPreviousData: true,
      onSuccess: (data) => onSuccess?.(data.data),
    }
  )

  const totalOpening = data?.data?.length ?? 0
  const title = <Trans>Opening Positions</Trans>

  return (
    <Box
      width="100%"
      display={restrictHeight ? 'flex' : 'block'}
      height={restrictHeight ? '100%' : 'auto'}
      flexDirection="column"
      bg="neutral5"
    >
      {hasLabel && (
        <Box px={3} pt={16}>
          <SectionTitle
            icon={<Pulse size={24} />}
            title={
              <>
                {title}
                {totalOpening > 0 ? ` (${formatNumber(totalOpening)})` : ''}
              </>
            }
            iconColor="primary1"
            suffix={<SettingConfigs activeWallet={activeWallet ?? null} copyWallets={copyWallets} />}
          />
        </Box>
      )}
      <CopyOpeningPositions
        data={data?.data}
        tableProps={tableProps}
        isLoading={isLoading}
        layoutType={layoutType}
        onClosePositionSuccess={refetch}
      />
    </Box>
  )
}
