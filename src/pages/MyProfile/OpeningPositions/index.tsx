import { Trans } from '@lingui/macro'
import { Pulse } from '@phosphor-icons/react'
import { ComponentProps } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import SectionTitle from 'components/@ui/SectionTitle'
import { CopyPositionData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

import PositionTable from '../PositionTable'
import { openingColumns, simpleOpeningColumns } from '../PositionTable/ListPositions'
import { ExternalSource } from '../PositionTable/PositionsContainer'
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
  tableProps?: Partial<ComponentProps<typeof PositionTable>>
}) {
  const { prices } = useGetUsdPrices()
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

  const externalSource: ExternalSource = {
    prices,
  }

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
      {!data?.data.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">Your {title} Is Empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once you have a position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {!!data?.data.length && (
        <Box flex="1 0 0" overflow="hidden">
          <PositionTable
            {...tableProps}
            data={data?.data}
            columns={layoutType === 'normal' ? openingColumns : simpleOpeningColumns}
            isLoading={isLoading}
            onClosePositionSuccess={refetch}
            externalSource={externalSource}
            restrictHeight={restrictHeight}
            layoutType={layoutType}
          />
        </Box>
      )}
    </Box>
  )
}
