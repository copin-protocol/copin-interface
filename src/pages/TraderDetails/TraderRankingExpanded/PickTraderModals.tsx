// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/macro'

import { getFavoritesApi } from 'apis/favoriteApis'
import NoDataFound from 'components/@ui/NoDataFound'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { CopyTradeData } from 'entities/copyTrade'
import { FavoritedTrader } from 'entities/trader'
import useAllCopyTrades from 'hooks/features/useAllCopyTrades'
import { renderTrader } from 'pages/MyProfile/renderProps'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import Drawer from 'theme/Modal/Drawer'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import { FindAndSelectTraderProps } from './FindAndSelectTrader'
import { filterFoundData } from './helpers'
import useSelectTrader from './useSelectTrader'

export function PickFromFavoritesModal({
  onSelect,
  ignoreSelectTraders,
  onDismiss,
  timeOption,
}: FindAndSelectTraderProps & { onDismiss: () => void }) {
  const { data: tradersGMX, isLoading: isLoadingTradersGMX } = useQuery(
    ['favorites', ignoreSelectTraders, ProtocolEnum.GMX],
    () => getFavoritesApi(ProtocolEnum.GMX),
    {
      retry: 0,
      select: (data) => filterFoundData(data, ignoreSelectTraders),
    }
  )
  const { data: tradersKWENTA, isLoading: isLoadingTradersKWENTA } = useQuery(
    ['favorites', ignoreSelectTraders, ProtocolEnum.KWENTA],
    () => getFavoritesApi(ProtocolEnum.KWENTA),
    {
      retry: 0,
      select: (data) => filterFoundData(data, ignoreSelectTraders),
    }
  )

  const [selectedTrader, setSelectedTrader] = useState<FavoritedTrader>()
  const {
    isLoading: isSelecting,
    error,
    setError,
  } = useSelectTrader({
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
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
          {!traders.length && <NoDataFound />}
          {traders.map((data) => {
            return (
              <ModalItemWrapper key={data.id} role="button" onClick={() => setSelectedTrader(data)}>
                {renderTrader(data.account, data.protocol ?? ProtocolEnum.GMX, {
                  isLink: false,
                  size: 32,
                  textSx: { width: 80 },
                })}
                {data.note && <ModalItemTag className="favorite_note">{data.note}</ModalItemTag>}
              </ModalItemWrapper>
            )
          })}
        </Box>
        <SelectTraderState isLoading={isSelecting} error={error} timeOption={timeOption} setError={setError} />
      </Box>
    </Drawer>
  )
}

export function PickFromCopyTradesModal({
  onSelect,
  ignoreSelectTraders,
  onDismiss,
  timeOption,
}: FindAndSelectTraderProps & { onDismiss: () => void }) {
  const [selectedCopyTrade, setSelectedCopyTrade] = useState<CopyTradeData>()
  const {
    isLoading: isSelecting,
    error,
    setError,
  } = useSelectTrader({
    account: selectedCopyTrade?.account,
    protocol: selectedCopyTrade?.protocol,
    onSuccess: (data) => {
      onSelect(data)
      onDismiss()
    },
    timeOption,
  })

  const { allCopyTrades } = useAllCopyTrades()
  const checkerMapping: Record<string, { [protocol: string]: boolean }> = {}
  const _allCopyTrades = filterFoundData(allCopyTrades, ignoreSelectTraders).filter((data) => {
    if (!data.account || !data.protocol) return false
    if (checkerMapping[data.account]?.[data.protocol]) return false
    checkerMapping[data.account] = { [data.protocol]: true }
    return true
  })

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
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
          {!_allCopyTrades?.length && <NoDataFound />}
          {_allCopyTrades?.map((data) => {
            return (
              <ModalItemWrapper key={data.id} role="button" onClick={() => setSelectedCopyTrade(data)}>
                {renderTrader(data.account, data.protocol, { isLink: false, size: 32, textSx: { width: 80 } })}
                {data.title && <ModalItemTag className="favorite_note">{data.title}</ModalItemTag>}
              </ModalItemWrapper>
            )
          })}
        </Box>
        <SelectTraderState isLoading={isSelecting} error={error} timeOption={timeOption} setError={setError} />
      </Box>
    </Drawer>
  )
}
function SelectTraderState({
  isLoading,
  error,
  timeOption,
  setError,
}: {
  isLoading: boolean
  error: boolean
  timeOption: TimeFilterProps
  setError: (error: boolean) => void
}) {
  if (!isLoading && !error) return <></>
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
      {error && (
        <Flex sx={{ width: '100%', p: 3, alignItems: 'center', flexDirection: 'column' }}>
          <Type.Caption mb={3} textAlign="center" maxWidth={230}>
            <Trans>No trader data was found to compare in the past {timeOption.text}</Trans>
          </Type.Caption>
          <Button variant="outlinePrimary" onClick={() => setError(false)}>
            <Trans>Select Other Trader</Trans>
          </Button>
        </Flex>
      )}
      {isLoading && <Loading />}
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
