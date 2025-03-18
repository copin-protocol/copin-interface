import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useMemo } from 'react'

import CopyOpeningPositions from 'components/@position/CopyOpeningPositions'
import LiteFilterOpeningPositionTrader from 'components/@position/CopyOpeningPositions/LiteOpeningFilterTrader'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import NoDataOrSelect from 'pages/MyProfile/NoDataOrSelect'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { STORAGE_KEYS } from 'utils/config/keys'

import SwitchLayoutButtons from '../SwitchLayoutButtons'
import useMobileLayoutHandler from '../useMobileLayoutHandler'
import { LiteOpeningPositionsContextValues } from './useOpeningPositionsContext'

const LiteOpeningPositions = ({
  isStuckPositionsView,
  ...contextValues
}: { isStuckPositionsView?: boolean } & LiteOpeningPositionsContextValues) => {
  const { loadingEmbeddedWallets, reloadEmbeddedWalletInfo } = useCopyWalletContext()
  const {
    selectedTraders,
    isSelectedAllTrader,
    handleToggleAllTrader,
    openingPositions,
    stuckPositions,
    refetchOpeningPositions,
    isLoadingOpeningPositions,
    reloadStuckPositions,
  } = contextValues

  const hasSelectedTraders = selectedTraders == null || !!selectedTraders.length

  const { lg } = useResponsive()
  const { layoutType: mobileLayoutType, handleChangeLayout } = useMobileLayoutHandler({
    storageKey: STORAGE_KEYS.LITE_OPENING_LAYOUT,
    mobileBreakpoint: lg,
  })

  const scrollDeps = useMemo(() => [selectedTraders], [selectedTraders])
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
              {isStuckPositionsView ? <div /> : <LiteFilterOpeningPositionTrader type="textAndIcon" />}
              <SwitchLayoutButtons layoutType={mobileLayoutType} onChangeType={handleChangeLayout} />
            </Flex>
          )}
          <Box flex="1 0 0" overflow="hidden" pt={1} sx={{ position: 'relative' }}>
            <CopyOpeningPositions
              hasFilter={!isStuckPositionsView && !!selectedTraders && !isSelectedAllTrader}
              data={isStuckPositionsView ? stuckPositions : openingPositions?.data}
              isLoading={isLoadingOpeningPositions}
              layoutType="lite"
              excludingColumnKeys={isStuckPositionsView ? ['createdAt', 'copyAccount'] : undefined}
              mobileLayoutType={mobileLayoutType}
              onClosePositionSuccess={() => {
                reloadStuckPositions()
                reloadEmbeddedWalletInfo?.()
                refetchOpeningPositions?.()
              }}
              tableProps={{
                scrollToTopDependencies: scrollDeps,
                wrapperSx: {
                  '& td': {
                    pt: '6px!important',
                    pb: '6px!important',
                  },
                },
              }}
              isStuckPositionsView={isStuckPositionsView}
              noDataComponent={
                !isStuckPositionsView && !hasSelectedTraders ? (
                  <NoDataOrSelect
                    type="noSelectTradersInOpening"
                    handleClickActionButton={() => handleToggleAllTrader(true)}
                    actionButtonText={<Trans>Select All Traders</Trans>}
                    isLoading={isLoadingOpeningPositions}
                  />
                ) : null
              }
            />
          </Box>
        </>
      )}
    </Flex>
  )
}

export default LiteOpeningPositions
