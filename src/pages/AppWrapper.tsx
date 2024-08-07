import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import FavoriteNoteTooltip from 'components/FavoriteButton/FavoriteNoteTooltip'
import SubscriptionRestrictModal from 'components/SubscriptionRestrictModal'
import useModifyStorage from 'hooks/features/useModifyStorage'
import useResetSearchParams from 'hooks/helpers/useResetSearchParams'
import useGlobalDialog, { DialogContent } from 'hooks/store/useGlobalDialog'
import useSubscriptionRestrictStore from 'hooks/store/useSubscriptionRestrictStore'
import { useInitTraderCopying } from 'hooks/store/useTraderCopying'
import { useInitTraderFavorites } from 'hooks/store/useTraderFavorites'
import { usePollingUsdPrice } from 'hooks/store/useUsdPrices'
import useChainRestrict from 'hooks/web3/useChainRestrict'
import useEagerConnect from 'hooks/web3/useEagerConnect'
import Footer from 'pages/@layouts/Footer'
import Navbar from 'pages/@layouts/Navbar'
import { Box, Flex } from 'theme/base'
import { FOOTER_HEIGHT, NAVBAR_HEIGHT } from 'utils/config/constants'
import { ELEMENT_IDS } from 'utils/config/keys'

import Notification from './@layouts/EventsNotification'
import SubscriptionExpiredWarning from './@layouts/SubscriptionExpiredWarning'

const AppWrapper = ({ children }: { children: ReactNode }) => {
  useChainRestrict()
  useInitTraderFavorites()
  useInitTraderCopying()
  useEagerConnect()
  usePollingUsdPrice()
  useModifyStorage()
  useResetSearchParams()
  const dialog = useGlobalDialog((state) => state.dialog)
  const restrictState = useSubscriptionRestrictStore((state) => state.state)

  return (
    <>
      <Flex flexDirection="column" width="100vw" height="100vh" margin="0px auto" maxHeight="100%">
        {/*<WarningBetaVersion />*/}
        <Navbar height={NAVBAR_HEIGHT} />
        <Box id={ELEMENT_IDS.APP_MAIN_WRAPPER} width="100%" flex="1" sx={{ position: 'relative', overflowY: 'auto' }}>
          {children}
          <FavoriteNoteTooltip />
          <ToastContainer theme="dark" limit={3} autoClose={5000} position="bottom-right" />
        </Box>
        <Footer height={FOOTER_HEIGHT} />
      </Flex>
      <SubscriptionExpiredWarning />
      {restrictState && <SubscriptionRestrictModal />}
      {dialog && <DialogContent data={dialog} />}
      <Notification />
    </>
  )
}

export default AppWrapper
