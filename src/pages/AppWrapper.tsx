import React, { ReactNode } from 'react'
// import { useQuery } from 'react-query'
import { ToastContainer } from 'react-toastify'

import FavoriteNoteTooltip from 'components/FavoriteButton/FavoriteNoteTooltip'
import useGlobalLoading from 'hooks/store/useGlobalLoading'
import { useInitTraderCopying } from 'hooks/store/useTraderCopying'
import { useInitTraderFavorites } from 'hooks/store/useTraderFavorites'
import { usePollingUsdPrice } from 'hooks/store/useUsdPrices'
// import useSystemConfig from 'hooks/store/useSystemConfig'
import useEagerConnect from 'hooks/web3/useEagerConnect'
import Footer from 'pages/@layouts/Footer'
// import { getSystemConfigsApi } from 'apis/systemApis'
import Navbar from 'pages/@layouts/Navbar'
// import { useIsDarkMode } from 'hooks/store/state/useDarkMode'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { FOOTER_HEIGHT, NAVBAR_HEIGHT } from 'utils/config/constants'

// import { QUERY_KEYS } from 'utils/queries'

const AppWrapper = ({ children }: { children: ReactNode }) => {
  useInitTraderFavorites()
  useInitTraderCopying()
  useEagerConnect()
  usePollingUsdPrice()
  const loading = useGlobalLoading((state) => state.loading)

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
      {loading && (
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
            <Loading />
            <Type.BodyBold display="block">{loading.title}</Type.BodyBold>
            {!!loading.description && <Type.Caption color="neutral4">{loading.description}</Type.Caption>}
            <Box>{loading.body}</Box>
          </Box>
        </Flex>
      )}
    </>
  )
}

export default AppWrapper
