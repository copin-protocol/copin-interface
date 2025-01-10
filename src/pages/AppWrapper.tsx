import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import OnboardingModal from 'components/@copinLite/OnboardingModal'
import FavoriteNoteTooltip from 'components/@widgets/FavoriteButton/FavoriteNoteTooltip'
import SubscriptionRestrictModal from 'components/@widgets/SubscriptionRestrictModal'
import { TradingEventStatusEnum } from 'entities/event'
// import useCheckHyperliquidBuilderFees from 'hooks/features/useCheckHyperliquidBuilderFees'
import useModifyStorage from 'hooks/features/useModifyStorage'
import { useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import useResetSearchParams from 'hooks/helpers/useResetSearchParams'
import useGlobalDialog, { DialogContent } from 'hooks/store/useGlobalDialog'
import useSubscriptionRestrictStore from 'hooks/store/useSubscriptionRestrictStore'
import { InitTraderCopying } from 'hooks/store/useTraderCopying'
import { InitTraderFavorites } from 'hooks/store/useTraderFavorites'
import { PollingUsdPrice } from 'hooks/store/useUsdPrices'
import useChainRestrict from 'hooks/web3/useChainRestrict'
import useEagerConnect from 'hooks/web3/useEagerConnect'
import Footer from 'pages/@layouts/Footer'
import Navbar from 'pages/@layouts/Navbar'
import { Box, Flex } from 'theme/base'
import { FOOTER_HEIGHT, NAVBAR_HEIGHT } from 'utils/config/constants'
import { ELEMENT_IDS } from 'utils/config/keys'

import TraderDetailsDrawer from '../components/@trader/TraderDetailsDrawer'
import { InitVaultCopying } from '../hooks/store/useVaultCopying'
import Notification from './@layouts/EventsNotification'
import LiteWalletNotice from './@layouts/LiteWalletNotice'
import SubscriptionExpiredWarning from './@layouts/SubscriptionExpiredWarning'

// import WarningBetaVersion from './@layouts/WarningBetaVersion'

const AppWrapper = ({ children }: { children: ReactNode }) => {
  useChainRestrict()
  useEagerConnect()
  useModifyStorage()
  useResetSearchParams()
  const dialog = useGlobalDialog((state) => state.dialog)
  const restrictState = useSubscriptionRestrictStore((state) => state.state)

  const { events } = useSystemConfigContext()
  const availableEvents = events?.filter((event) => event.status !== TradingEventStatusEnum.ENDED)

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
      <SubscriptionExpiredWarning />

      {restrictState && <SubscriptionRestrictModal />}
      {dialog && <DialogContent data={dialog} />}
      {!!availableEvents?.length && <Notification />}

      <TraderDetailsDrawer />
      <InitTraderCopying />
      <InitVaultCopying />
      <InitTraderFavorites />
      <PollingUsdPrice />
      <OnboardingModal />
    </>
  )
}

export default AppWrapper
