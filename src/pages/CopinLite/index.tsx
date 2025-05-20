import { Trans } from '@lingui/macro'
import { ArrowsInSimple, ArrowsOutSimple, BookOpenText, Notebook, Wallet } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components/macro'

import { OnboardingContent } from 'components/@copinLite/OnboardingModal'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import useSearchParams from 'hooks/router/useSearchParams'
import useTabHandler from 'hooks/router/useTabHandler'
import { useAuthContext } from 'hooks/web3/useAuth'
import { BottomWrapperMobile } from 'pages/@layouts/Components'
import LiteWalletNotice from 'pages/@layouts/LiteWalletNotice'
import IconButton from 'theme/Buttons/IconButton'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { LITE_TABLE_HEIGHT } from 'utils/config/constants'

import CopyManagement from './CopyManagement'
import Trades from './Trades'
import LiteWallet from './Wallet'
import { LiteContextProvider } from './useCopinLiteContext'

const GlobalStyle = createGlobalStyle`
[data-animation-shake] {
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
`

enum LitePageTab {
  Wallet = 'wallet',
  Copy = 'copy',
  Trade = 'trade',
}

const tabs: TabConfig[] = [
  {
    key: LitePageTab.Wallet as unknown as string,
    name: <Trans>Wallet</Trans>,
    icon: <Wallet size={20} />,
  },
  {
    key: LitePageTab.Copy as unknown as string,
    name: <Trans>Copy</Trans>,
    icon: <BookOpenText size={20} />,
  },
  {
    key: LitePageTab.Trade as unknown as string,
    name: <Trans>Trade</Trans>,
    icon: <Notebook size={20} />,
  },
]

const CopitLitePageMobile = () => {
  const { searchParams } = useSearchParams()
  const { tab, handleTab: setTab } = useTabHandler({ defaultTab: LitePageTab.Copy })

  return (
    <Flex height="calc(100% - 1px)" flexDirection="column">
      <LiteWalletNotice />
      <Box flex="1" overflow="hidden">
        {tab === LitePageTab.Wallet && <LiteWallet />}
        {tab === LitePageTab.Copy && <CopyManagement />}
        {tab === LitePageTab.Trade && <Trades />}
      </Box>
      <BottomWrapperMobile sx={{ display: ['flex', 'flex', 'flex', 'none'] }}>
        <TabHeader configs={tabs} isActiveFn={({ key }) => key === tab} onClickItem={(key) => setTab({ tab: key })} />
      </BottomWrapperMobile>
    </Flex>
  )
}

const CopinLitePage = () => {
  const [tableExpanded, setTableExpanded] = useState(false)
  const { lg } = useResponsive()
  const [showOnboarding, setShowOnboarding] = useState<boolean | undefined>()
  const [userInteracted, setUserInteracted] = useState(false)
  const { isAuthenticated, loading, setIsNewUser } = useAuthContext()
  useEffect(() => {
    if (!loading && isAuthenticated && !userInteracted) {
      setShowOnboarding(false)
    }
    // logout
    if (!loading && !isAuthenticated) {
      setShowOnboarding(true)
      // setUserInteracted(false)
    }
  }, [isAuthenticated, loading, userInteracted])

  const onUserInteract = () => {
    setUserInteracted(true)
    setIsNewUser(false)
  }
  const onDismissOnboarding = () => {
    setShowOnboarding(false)
  }

  if (showOnboarding == null) return <></>

  return (
    <SafeComponentWrapper>
      <GlobalStyle />
      <LiteContextProvider>
        <Box display={showOnboarding ? 'block' : 'none'} width="100%" height="100%">
          <OnboardingContent
            onDismiss={isAuthenticated ? onDismissOnboarding : undefined}
            onStartInteraction={onUserInteract}
          />
        </Box>
        <Box display={showOnboarding ? 'none' : 'block'} width="100%" height="100%">
          {lg ? (
            <Flex height="100%" flexDirection="column">
              <LiteWalletNotice />

              <Box display={tableExpanded ? 'none' : 'flex'} height={`calc(100% - max(${LITE_TABLE_HEIGHT}px, 35%))`}>
                <LiteWallet />
                <CopyManagement />
              </Box>
              <Box
                height={tableExpanded ? '100%' : `calc(max(${LITE_TABLE_HEIGHT}px, 35%))`}
                sx={{ borderTop: 'small', borderColor: 'neutral4', position: 'relative' }}
                width="100%"
              >
                <Trades />
                <IconButton
                  onClick={() => setTableExpanded(!tableExpanded)}
                  variant="ghost"
                  icon={tableExpanded ? <ArrowsInSimple size={20} /> : <ArrowsOutSimple size={20} />}
                  sx={{ position: 'absolute', top: '2px', right: 0, p: 0 }}
                />
              </Box>
            </Flex>
          ) : (
            <CopitLitePageMobile />
          )}
        </Box>
      </LiteContextProvider>
    </SafeComponentWrapper>
  )
}

export default CopinLitePage
