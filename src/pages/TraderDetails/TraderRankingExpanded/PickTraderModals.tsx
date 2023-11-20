// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/macro'

import { getFavoritesApi } from 'apis/favoriteApis'
import NoDataFound from 'components/@ui/NoDataFound'
import { CopyTradeData } from 'entities/copyTrade'
import { FavoritedTrader } from 'entities/trader'
import useAllCopyTrades from 'hooks/features/useAllCopyTrades'
import { renderTrader } from 'pages/MyProfile/renderProps'
import Loading from 'theme/Loading'
import Drawer from 'theme/Modal/Drawer'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import { FindAndSelectTraderProps } from './FindAndSelectTrader'
import useSelectTrader from './useSelectTrader'

export function PickFromFavoritesModal({
  onSelect,
  account,
  onDismiss,
  timeOption,
}: FindAndSelectTraderProps & { onDismiss: () => void }) {
  const { data: tradersGMX, isLoading: isLoadingTradersGMX } = useQuery(
    ['favorites', account, ProtocolEnum.GMX],
    () => getFavoritesApi(ProtocolEnum.GMX),
    {
      retry: 0,
      enabled: !!account,
    }
  )
  const { data: tradersKWENTA, isLoading: isLoadingTradersKWENTA } = useQuery(
    ['favorites', account, ProtocolEnum.KWENTA],
    () => getFavoritesApi(ProtocolEnum.KWENTA),
    {
      retry: 0,
      enabled: !!account,
    }
  )

  const [selectedTrader, setSelectedTrader] = useState<FavoritedTrader>()
  const { isLoading: isSelecting } = useSelectTrader({
    account: selectedTrader?.account,
    protocol: selectedTrader?.protocol,
    onSuccess: (data) => {
      onSelect(data)
      onDismiss()
    },
    timeOption,
  })

  if (isLoadingTradersGMX && isLoadingTradersKWENTA) return <Loading />

  const traders = [...(tradersGMX ?? []), ...(tradersKWENTA ?? [])]
  return (
    <Drawer
      mode="right"
      isOpen
      size="350px"
      background="neutral5"
      hasClose
      title={<Trans>Favorite List</Trans>}
      onDismiss={onDismiss}
    >
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {!traders.length && <NoDataFound />}
        {traders.map((data) => {
          if (data.account === account) return <></>
          return (
            <ModalItemWrapper key={data.id} role="button" onClick={() => setSelectedTrader(data)}>
              {renderTrader(data.account, data.protocol ?? ProtocolEnum.GMX, { isLink: false, size: 32 })}
              <ModalItemTag className="favorite_note">{data.note}</ModalItemTag>
            </ModalItemWrapper>
          )
        })}
        {isSelecting && <SelectTraderLoading />}
      </Box>
    </Drawer>
  )
}

export function PickFromCopyTradesModal({
  onSelect,
  account,
  onDismiss,
  timeOption,
}: FindAndSelectTraderProps & { onDismiss: () => void }) {
  const [selectedCopyTrade, setSelectedCopyTrade] = useState<CopyTradeData>()
  const { isLoading: isSelecting } = useSelectTrader({
    account: selectedCopyTrade?.account,
    protocol: selectedCopyTrade?.protocol,
    onSuccess: (data) => {
      onSelect(data)
      onDismiss()
    },
    timeOption,
  })

  const { allCopyTrades } = useAllCopyTrades()

  return (
    <Drawer
      mode="right"
      isOpen
      size="350px"
      background="neutral5"
      hasClose
      title={<Trans>Copytrade List</Trans>}
      onDismiss={onDismiss}
    >
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {!allCopyTrades?.length && <NoDataFound />}
        {allCopyTrades?.map((data) => {
          if (data.account === account) return <></>
          return (
            <ModalItemWrapper key={data.id} role="button" onClick={() => setSelectedCopyTrade(data)}>
              {renderTrader(data.account, data.protocol, { isLink: false, size: 32 })}
              <ModalItemTag className="favorite_note">{data.title}</ModalItemTag>
            </ModalItemWrapper>
          )
        })}
        {isSelecting && <SelectTraderLoading />}
      </Box>
    </Drawer>
  )
}
function SelectTraderLoading() {
  return (
    <Flex
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bg: 'modalBG',
        backdropFilter: 'blur(5px)',
        alignItems: 'center',
      }}
    >
      <Loading />
    </Flex>
  )
}
const ModalItemWrapper = styled(Flex)`
  padding: 8px 16px;
  align-items: center;
  gap: 2;
  justify-content: space-between;
  &:hover {
    & .favorite_note {
      background: ${({ theme }) => theme.colors.neutral6};
    }
  }
  &:hover {
    background: ${({ theme }) => theme.colors.neutral4};
  }
`
const ModalItemTag = styled(Type.Caption)`
  padding: 0 8px;
  max-width: 90px;
  height: 20px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.neutral4};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
