import { Trans } from '@lingui/macro'
import { Pulse } from '@phosphor-icons/react'
import { ComponentProps, useState } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import CopyOpeningPositions from 'components/@position/CopyOpeningPositions'
import { LayoutType } from 'components/@position/types'
import SectionTitle from 'components/@ui/SectionTitle'
import { CopyPositionData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import Badge from 'theme/Badge'
import { Button } from 'theme/Buttons'
import { Box, Flex } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { CopyTradePlatformEnum, PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import OnchainPositions from './OnchainPositions'
import SettingConfigs from './SettingConfigs'
import { OnchainPositionData } from './schema'

export default function OpeningPositions({
  activeWallet,
  copyWallets,
  hasLabel = true,
  onSuccess,
  onSelectPosition,
  limit = DEFAULT_LIMIT,
  restrictHeight = true,
  layoutType = 'normal',
  tableProps,
  traders,
  excludingColumnKeys,
  bg,
}: {
  activeWallet: CopyWalletData | null
  copyWallets: CopyWalletData[] | undefined
  traders?: string[]
  hasLabel?: boolean
  onSuccess?: (data: CopyPositionData[] | undefined) => void
  onSelectPosition?: (data: OnchainPositionData | undefined) => void
  limit?: number
  restrictHeight?: boolean
  layoutType?: LayoutType
  tableProps?: Partial<ComponentProps<typeof CopyOpeningPositions>>['tableProps']
  lite?: boolean
  excludingColumnKeys?: (keyof CopyPositionData)[]
  bg?: string
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
    traders,
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
  const title = <Trans>OPENING POSITIONS</Trans>

  const [isOnchainSelected, setOnchainSelected] = useState(false)

  return (
    <Box
      width="100%"
      display={restrictHeight ? 'flex' : 'block'}
      height={restrictHeight ? '100%' : 'auto'}
      flexDirection="column"
      bg={bg ?? 'neutral5'}
    >
      {hasLabel && (
        <Box px={3} pt={16}>
          <SectionTitle
            icon={Pulse}
            title={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                {title}
                {totalOpening > 0 && <Badge count={totalOpening} />}
              </Flex>
            }
            iconColor="primary1"
            suffix={<SettingConfigs activeWallet={activeWallet ?? null} copyWallets={copyWallets} />}
          />
        </Box>
      )}
      {activeWallet?.exchange === CopyTradePlatformEnum.GNS_V8 && activeWallet.smartWalletAddress && (
        <Flex>
          <Button
            onClick={() => setOnchainSelected(false)}
            variant="ghost"
            sx={{ color: !isOnchainSelected ? undefined : 'neutral3' }}
          >
            Copy Positions
          </Button>
          <Button
            onClick={() => setOnchainSelected(true)}
            variant="ghost"
            sx={{ color: isOnchainSelected ? undefined : 'neutral3' }}
          >
            Onchain Positions
          </Button>
        </Flex>
      )}
      <Box
        height={
          activeWallet?.exchange === CopyTradePlatformEnum.GNS_V8 && activeWallet.smartWalletAddress
            ? 'calc(100% - 36px)'
            : '100%'
        }
      >
        <Box display={isOnchainSelected ? 'none' : 'block'} height="100%">
          <CopyOpeningPositions
            data={data?.data}
            tableProps={tableProps}
            isLoading={isLoading}
            layoutType={layoutType}
            onClosePositionSuccess={refetch}
            excludingColumnKeys={excludingColumnKeys}
          />
        </Box>
        {activeWallet?.exchange === CopyTradePlatformEnum.GNS_V8 && activeWallet.smartWalletAddress && (
          <Box display={isOnchainSelected ? 'block' : 'none'} height="100%" sx={{ overflow: 'auto' }}>
            <OnchainPositions activeWallet={activeWallet} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
