// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/macro'

import { getAllFavoritesApi } from 'apis/favoriteApis'
import UpgradeButton from 'components/@subscription/UpgradeButton'
import NoDataFound from 'components/@ui/NoDataFound'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TraderAddress from 'components/@ui/TraderAddress'
import { CopyTradeData } from 'entities/copyTrade'
import { FavoritedTrader } from 'entities/trader'
import useAllCopyTrades from 'hooks/features/copyTrade/useAllCopyTrades'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import RcDrawer from 'theme/RcDrawer'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import { FindAndSelectTraderProps } from './FindAndSelectTrader'
import { filterFoundData } from './helpers'
import useSelectTrader from './useSelectTrader'

export function PickFromFavoritesModal({
  onSelect,
  ignoreSelectTraders,
  onDismiss,
  timeOption,
  isOpen,
}: FindAndSelectTraderProps & { isOpen: boolean; onDismiss: () => void }) {
  const { allowedSelectProtocols, pagePermission } = useProtocolPermission()

  const myProfile = useMyProfileStore((_s) => _s.myProfile)
  const { data: tradersData, isLoading } = useQuery(
    [QUERY_KEYS.GET_FAVORITE_TRADERS, ignoreSelectTraders, myProfile?.id],
    () => getAllFavoritesApi().then((data) => filterFoundData(data, ignoreSelectTraders)),
    {
      enabled: !!myProfile?.id && isOpen,
      retry: 0,
      // select: (data) =>
      //   data.reduce((result, traders) => {
      //     return [...result, ...traders]
      //   }, [] as FavoritedTrader[]),
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

  return (
    <RcDrawer open={isOpen} width="350px" onClose={onDismiss}>
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <Flex sx={{ height: 60, px: 3, alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Type.H5>
            <Trans>Favorite List</Trans>
          </Type.H5>
          <IconButton icon={<XCircle size={24} />} variant="ghost" onClick={onDismiss} />
        </Flex>
        <Box sx={{ width: '100%', height: 'calc(100% - 60px)', overflow: 'auto' }}>
          {isLoading && <Loading />}
          {!isLoading && !tradersData?.length && <NoDataFound />}
          {!isLoading &&
            tradersData &&
            tradersData.map((data) => {
              const isAllowed = data?.protocol && allowedSelectProtocols?.includes(data.protocol)
              const requiredPlanToProtocol = getRequiredPlan({
                conditionFn: (plan) =>
                  (data?.protocol && pagePermission?.[plan]?.protocolAllowed?.includes(data.protocol)) || false,
              })
              return (
                <ModalItemWrapper
                  key={data.id}
                  role="button"
                  onClick={() => (isAllowed ? setSelectedTrader(data) : undefined)}
                >
                  <TraderAddress
                    address={data.account}
                    protocol={data.protocol ?? DEFAULT_PROTOCOL}
                    options={{
                      isLink: false,
                      size: 32,
                      textSx: { width: 80 },
                    }}
                  />
                  {isAllowed && data.note && <ModalItemTag className="favorite_note">{data.note}</ModalItemTag>}
                  {!isAllowed && (
                    <UpgradeButton
                      requiredPlan={requiredPlanToProtocol}
                      text={
                        <Type.Caption>
                          <Trans>Upgrade</Trans>
                        </Type.Caption>
                      }
                      buttonSx={{ mr: 0 }}
                      target="_blank"
                    />
                  )}
                </ModalItemWrapper>
              )
            })}
        </Box>
        <SelectTraderState isLoading={isSelecting} error={error} timeOption={timeOption} setError={setError} />
      </Box>
    </RcDrawer>
  )
}

export function PickFromCopyTradesModal({
  onSelect,
  ignoreSelectTraders,
  isOpen,
  onDismiss,
  timeOption,
}: FindAndSelectTraderProps & { isOpen: boolean; onDismiss: () => void }) {
  const { allowedSelectProtocols, pagePermission } = useProtocolPermission()
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
    <RcDrawer open={isOpen} width="350px" onClose={onDismiss}>
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <Flex sx={{ height: 60, px: 3, alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Type.H5>
            <Trans>Copytrade List</Trans>
          </Type.H5>
          <IconButton icon={<XCircle size={24} />} variant="ghost" onClick={onDismiss} />
        </Flex>
        <Box sx={{ width: '100%', height: 'calc(100% - 60px)', overflow: 'auto' }}>
          {!_allCopyTrades?.length && <NoDataFound />}
          {_allCopyTrades?.map((data) => {
            const isAllowed = data?.protocol && allowedSelectProtocols?.includes(data.protocol)
            const requiredPlanToProtocol = getRequiredPlan({
              conditionFn: (plan) =>
                (data?.protocol && pagePermission?.[plan]?.protocolAllowed?.includes(data.protocol)) || false,
            })
            return (
              <ModalItemWrapper
                key={data.id}
                role="button"
                onClick={() => (isAllowed ? setSelectedCopyTrade(data) : undefined)}
              >
                <TraderAddress
                  address={data.account}
                  protocol={data.protocol}
                  options={{ isLink: false, size: 32, textSx: { width: 80 } }}
                />
                {isAllowed && data.title && <ModalItemTag className="favorite_note">{data.title}</ModalItemTag>}
                {!isAllowed && (
                  <UpgradeButton
                    requiredPlan={requiredPlanToProtocol}
                    text={
                      <Type.Caption>
                        <Trans>Upgrade</Trans>
                      </Type.Caption>
                    }
                    buttonSx={{ mr: 0 }}
                    target="_blank"
                  />
                )}
              </ModalItemWrapper>
            )
          })}
        </Box>
        <SelectTraderState isLoading={isSelecting} error={error} timeOption={timeOption} setError={setError} />
      </Box>
    </RcDrawer>
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
