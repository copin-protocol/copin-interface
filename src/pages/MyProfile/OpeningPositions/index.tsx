import { Trans } from '@lingui/macro'
import { Pulse } from '@phosphor-icons/react'
import { useQuery } from 'react-query'

import { GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import SectionTitle from 'components/@ui/SectionTitle'
import { CopyWalletData } from 'entities/copyWallet'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import PositionTable, { openingColumns } from '../PositionTable'
import SettingConfigs from './SettingConfigs'

export default function OpeningPositions({
  activeWallet,
  copyWallets,
}: {
  activeWallet: CopyWalletData | null
  copyWallets: CopyWalletData[] | undefined
}) {
  const _queryParams: GetMyPositionsParams = {
    limit: DEFAULT_LIMIT,
    offset: 0,
    identifyKey: undefined,
    status: [PositionStatusEnum.OPEN],
  }
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useQuery([QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams], () => getMyCopyPositionsApi(_queryParams), {
    retry: 0,
    keepPreviousData: true,
  })

  const title = <Trans>Opening Positions</Trans>

  return (
    <Flex width="100%" height="100%" flexDirection="column" bg="neutral5">
      <Box px={3} pt={16}>
        <SectionTitle
          icon={<Pulse size={24} />}
          title={title}
          iconColor="primary1"
          suffix={<SettingConfigs activeWallet={activeWallet ?? null} copyWallets={copyWallets} />}
        />
      </Box>
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
            data={data?.data}
            columns={openingColumns}
            isLoading={isLoading}
            onClosePositionSuccess={refetch}
          />
        </Box>
      )}
    </Flex>
  )
}
