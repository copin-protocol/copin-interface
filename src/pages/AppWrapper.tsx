import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import OnboardingModal from 'components/@copinLite/OnboardingModal'
import UpgradeBenefitModal from 'components/@subscription/UpgradeBenefitModal'
import FavoriteNoteTooltip from 'components/@widgets/FavoriteButton/FavoriteNoteTooltip'
import LinkBotAlertModal from 'components/@widgets/LinkBotAlertModal'
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
import EagerConnect from './@helpers/EagerConnect'
import EventNotification from './@helpers/EventNotification'
import GlobalDialog from './@helpers/GlobalDialog'
import SubscriptionRestrict from './@helpers/SubscriptionRestrict'
import SubscriptionExpiredWarning from './@layouts/SubscriptionExpiredWarning'
import WarningBanner from './@layouts/WarningBanner'

const AppWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Flex flexDirection="column" width="100vw" height="100vh" margin="0px auto" maxHeight="100%">
        <Navbar height={NAVBAR_HEIGHT} />
        <WarningBanner />
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
      {/* <ChainRestrict /> */}
      <TraderDetailsDrawer />
      <InitTraderCopying />
      <InitVaultCopying />
      <InitTraderFavorites />
      <PollingUsdPrice />
      <OnboardingModal />
      <LinkBotAlertModal />
      <UpgradeBenefitModal />
    </>
  )
}

export default AppWrapper
