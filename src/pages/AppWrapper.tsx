import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import FavoriteNoteTooltip from 'components/FavoriteButton/FavoriteNoteTooltip'
import SubscriptionRestrictModal from 'components/SubscriptionRestrictModal'
import useModifyStorage from 'hooks/features/useModifyStorage'
import useGlobalDialog from 'hooks/store/useGlobalDialog'
import useSubscriptionRestrictStore from 'hooks/store/useSubscriptionRestrictStore'
import { useInitTraderCopying } from 'hooks/store/useTraderCopying'
import { useInitTraderFavorites } from 'hooks/store/useTraderFavorites'
import { usePollingUsdPrice } from 'hooks/store/useUsdPrices'
import useChainRestrict from 'hooks/web3/useChainRestrict'
import useEagerConnect from 'hooks/web3/useEagerConnect'
import Footer from 'pages/@layouts/Footer'
import Navbar from 'pages/@layouts/Navbar'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { FOOTER_HEIGHT, NAVBAR_HEIGHT } from 'utils/config/constants'
import { ELEMENT_IDS } from 'utils/config/keys'

const AppWrapper = ({ children }: { children: ReactNode }) => {
  useChainRestrict()
  useInitTraderFavorites()
  useInitTraderCopying()
  useEagerConnect()
  usePollingUsdPrice()
  useModifyStorage()
  const dialog = useGlobalDialog((state) => state.dialog)
  const restrictState = useSubscriptionRestrictStore((state) => state.state)

  return (
    <>
      <Flex flexDirection="column" width="100vw" height="100vh" margin="0px auto" maxHeight="100%">
        <Navbar height={NAVBAR_HEIGHT} />
        <Box id={ELEMENT_IDS.APP_MAIN_WRAPPER} width="100%" flex="1" sx={{ position: 'relative', overflowY: 'auto' }}>
          {children}
          <FavoriteNoteTooltip />
          <ToastContainer theme="dark" limit={3} autoClose={5000} />
        </Box>
        <Footer height={FOOTER_HEIGHT} />
      </Flex>
      {restrictState && <SubscriptionRestrictModal />}
      {dialog && (
        <Flex
          justifyContent="center"
          alignItems="center"
          variant="shadow"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10000,
          }}
        >
          <Box
            variant="card"
            width="fit-content"
            height="fit-content"
            textAlign="center"
            sx={{ border: 'normal', borderColor: 'neutral6' }}
          >
            {dialog.hasLoading && <Loading />}
            <Type.BodyBold display="block">{dialog.title}</Type.BodyBold>
            {!!dialog.description && <Type.Caption color="neutral3">{dialog.description}</Type.Caption>}
            <Box>{dialog.body}</Box>
          </Box>
        </Flex>
      )}
    </>
  )
}

export default AppWrapper
