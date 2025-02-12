import ListCopyTrade from 'components/@copyTrade/ListCopyTrade'
import { LayoutType } from 'components/@copyTrade/types'
import { CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import NoDataOrSelect from 'pages/MyProfile/NoDataOrSelect'
import { Box, Flex } from 'theme/base'

export default function LiteCopyTrades({
  copyWallet,
  copyTrades,
  loading,
  layoutType,
}: {
  copyWallet: CopyWalletData
  copyTrades: CopyTradeData[] | undefined
  loading: boolean
  layoutType: LayoutType
}) {
  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <Box flex="1 0 0" overflow="hidden">
        {!loading && !!copyTrades?.length && (
          <ListCopyTrade
            type={'lite'}
            layoutType={layoutType}
            copyTrades={copyTrades}
            isLoadingCopyTrades={loading}
            activeWallet={copyWallet}
          />
        )}
        {!loading && !copyTrades?.length && <NoDataOrSelect type="noTraders" />}
      </Box>
    </Flex>
  )
}
