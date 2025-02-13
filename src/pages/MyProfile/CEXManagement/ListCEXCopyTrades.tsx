import { Trans } from '@lingui/macro'

import ListCopyTrade from 'components/@copyTrade/ListCopyTrade'
import { Box, Flex } from 'theme/base'

import NoDataOrSelect from '../NoDataOrSelect'
import FilterSection from './FilterSection'
import useCEXManagementContext from './useCEXManagementContext'

export default function ListCEXCopyTrades({ expanded, lite = false }: { expanded: boolean; lite?: boolean }) {
  const {
    listTraderAddresses,
    selectedTraders,
    copyTrades,
    isLoadingCopyTrades,
    handleSelectAllTraders,
    isLoadingTraders,
    handleAddTrader,
    activeWallet,
  } = useCEXManagementContext()

  const hasSelectedTraders = !!selectedTraders.length

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      {!lite && <FilterSection />}
      <Box flex="1 0 0" overflow="hidden">
        {hasSelectedTraders && (
          <ListCopyTrade
            expanded={expanded}
            type={lite ? 'lite' : 'cex'}
            copyTrades={copyTrades}
            isLoadingCopyTrades={isLoadingCopyTrades}
            onCloneCopyTradeSuccess={handleAddTrader}
            activeWallet={activeWallet}
            listTraderAddresses={listTraderAddresses}
          />
        )}
        {!isLoadingCopyTrades && !!listTraderAddresses.length && !hasSelectedTraders && (
          <NoDataOrSelect
            type="noSelectTraders"
            handleClickActionButton={() => handleSelectAllTraders(true)}
            actionButtonText={<Trans>Select All Traders</Trans>}
            isLoading={isLoadingTraders}
          />
        )}
      </Box>
      {!isLoadingTraders && !listTraderAddresses.length && <NoDataOrSelect type="noTraders" />}
    </Flex>
  )
}
