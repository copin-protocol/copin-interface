import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import OnboardingModal from 'components/@copinLite/OnboardingModal'
import FavoriteNoteTooltip from 'components/@widgets/FavoriteButton/FavoriteNoteTooltip'
import LinkBotAlertModal from 'components/@widgets/LinkBotAlertModal'
// import useCheckHyperliquidBuilderFees from 'hooks/features/useCheckHyperliquidBuilderFees'
import useResetSearchParams from 'hooks/helpers/useResetSearchParams'
import { InitTraderCopying } from 'hooks/store/useTraderCopying'
import { InitTraderFavorites } from 'hooks/store/useTraderFavorites'
import { PollingUsdPrice } from 'hooks/store/useUsdPrices'
import Footer from 'pages/@layouts/Footer'
import Navbar from 'pages/@layouts/Navbar'
import { Box, Flex } from 'theme/base'
import { FOOTER_HEIGHT, NAVBAR_HEIGHT } from 'utils/config/constants'
import { ELEMENT_IDS } from 'utils/config/keys'

import TraderDetailsDrawer from '../components/@trader/TraderDetailsDrawer'
import { InitVaultCopying } from '../hooks/store/useVaultCopying'
import ChainRestrict from './@helpers/ChainRestrict'
import EagerConnect from './@helpers/EagerConnect'
import EventNotification from './@helpers/EventNotification'
import GlobalDialog from './@helpers/GlobalDialog'
import SubscriptionRestrict from './@helpers/SubscriptionRestrict'
import LiteWalletNotice from './@layouts/LiteWalletNotice'
import SubscriptionExpiredWarning from './@layouts/SubscriptionExpiredWarning'

// import WarningBetaVersion from './@layouts/WarningBetaVersion'

const AppWrapper = ({ children }: { children: ReactNode }) => {
  useResetSearchParams()
  // const { isValidFees } = useCheckHyperliquidBuilderFees({ enable: true })

  return (
    <>
      <Flex flexDirection="column" width="100vw" height="100vh" margin="0px auto" maxHeight="100%">
        {/* {!isValidFees && <WarningBetaVersion />} */}
        <Navbar height={NAVBAR_HEIGHT} />
        <LiteWalletNotice />
        <Box id={ELEMENT_IDS.APP_MAIN_WRAPPER} width="100%" flex="1" sx={{ position: 'relative', overflowY: 'auto' }}>
          {children}
          <FavoriteNoteTooltip />
          <ToastContainer theme="dark" limit={3} autoClose={5000} position="bottom-right" />
        </Box>
        <Footer height={FOOTER_HEIGHT} />
      </Flex>
      <EagerConnect />
      <SubscriptionExpiredWarning />
      <EventNotification />
      <GlobalDialog />
      <SubscriptionRestrict />
      <ChainRestrict />
      <TraderDetailsDrawer />
      <InitTraderCopying />
      <InitVaultCopying />
      <InitTraderFavorites />
      <PollingUsdPrice />
      <OnboardingModal />
      <LinkBotAlertModal />
    </>
  )
}

export default AppWrapper
