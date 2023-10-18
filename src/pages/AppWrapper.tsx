import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import FavoriteNoteTooltip from 'components/FavoriteButton/FavoriteNoteTooltip'
import useModifyStorage from 'hooks/features/useModifyStorage'
import useGlobalDialog from 'hooks/store/useGlobalDialog'
import { useInitTraderCopying } from 'hooks/store/useTraderCopying'
import { useInitTraderFavorites } from 'hooks/store/useTraderFavorites'
import { usePollingUsdPrice } from 'hooks/store/useUsdPrices'
import useEagerConnect from 'hooks/web3/useEagerConnect'
import Footer from 'pages/@layouts/Footer'
import Navbar from 'pages/@layouts/Navbar'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { FOOTER_HEIGHT, NAVBAR_HEIGHT } from 'utils/config/constants'

const AppWrapper = ({ children }: { children: ReactNode }) => {
  useInitTraderFavorites()
  useInitTraderCopying()
  useEagerConnect()
  usePollingUsdPrice()
  useModifyStorage()
  const dialog = useGlobalDialog((state) => state.dialog)

  return (
    <>
      <Flex flexDirection="column" width="100vw" height="100vh" margin="0px auto" maxHeight="100%">
        <Navbar height={NAVBAR_HEIGHT} />
        <Box id="app_main__wrapper" width="100%" flex="1" sx={{ position: 'relative', overflowY: 'auto' }}>
          {children}
          <FavoriteNoteTooltip />
          <ToastContainer theme="dark" limit={3} autoClose={5000} />
        </Box>
        <Footer height={FOOTER_HEIGHT} />
      </Flex>
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
            {!!dialog.description && <Type.Caption color="neutral4">{dialog.description}</Type.Caption>}
            <Box>{dialog.body}</Box>
          </Box>
        </Flex>
      )}
    </>
  )
}

export default AppWrapper
