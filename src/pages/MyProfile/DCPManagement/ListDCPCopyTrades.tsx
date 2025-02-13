import { Trans } from '@lingui/macro'

import ListCopyTrade from 'components/@copyTrade/ListCopyTrade'
import { Box, Flex } from 'theme/base'

import NoDataOrSelect from '../NoDataOrSelect'
import useDCPManagementContext from './useDCPManagementContext'

export default function ListDCPCopyTrades({ expanded }: { expanded: boolean }) {
  const {
    listTraderAddresses,
    selectedTraders,
    copyTrades,
    isLoadingCopyTrades,
    handleSelectAllTraders,
    isLoadingTraders,
    handleAddTrader,
    activeWallet,
  } = useDCPManagementContext()
  const hasSelectedTraders = !!selectedTraders.length

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <Box flex="1 0 0" overflow="hidden">
        {hasSelectedTraders && (
          <ListCopyTrade
            expanded={expanded}
            type={'dex'}
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
