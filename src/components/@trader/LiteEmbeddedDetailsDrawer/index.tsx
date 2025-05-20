import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Suspense } from 'react'
import { createGlobalStyle } from 'styled-components/macro'

import HLTraderOpeningPositionsTableView, {
  HLTraderOpeningPositionsListView,
} from 'components/@position/HLTraderOpeningPositions'
import AddressAvatar from 'components/@ui/AddressAvatar'
import Container from 'components/@ui/Container'
import { BalanceText } from 'components/@ui/DecoratedText/ValueText'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import ChartTrader from 'pages/TraderDetails/ChartTrader'
import PositionMobileView from 'pages/TraderDetails/Layouts/PositionMobileView'
import CopyButton from 'theme/Buttons/CopyButton'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { PROTOCOL_PROVIDER } from 'utils/config/protocolProviderConfig'
import { Z_INDEX } from 'utils/config/zIndex'
import { addressShorten } from 'utils/helpers/format'

const GlobalStyle = createGlobalStyle`
  .rc-dropdown {
    z-index: ${Z_INDEX.TOASTIFY};
  }
`
const MobileGlobalStyle = createGlobalStyle`
  .chart-positions__wrapper .currency_option .select__menu {
    max-height: 150px;
  }
`

export default function LiteEmbeddedDetailsDrawer({
  zIndex = Z_INDEX.TOASTIFY, // above all
  address,
  protocol,
  isOpen,
  onDismiss,
}: {
  zIndex?: number
  address: string
  protocol: ProtocolEnum
  isOpen: boolean
  onDismiss: () => void
}) {
  const { lg, sm } = useResponsive()
  const explorerUrl = PROTOCOL_PROVIDER[protocol]?.explorerUrl

  const timeFilterOptions = TIME_FILTER_OPTIONS
  const { currentOption: timeOption, changeCurrentOption: setTimeOption } = useOptionChange({
    optionName: URL_PARAM_KEYS.EXPLORER_TIME_FILTER,
    options: timeFilterOptions,
    defaultOption: TimeFilterByEnum.ALL_TIME,
  })

  return (
    <RcDrawer
      open={isOpen}
      onClose={(e) => {
        e.stopPropagation()
        onDismiss()
      }}
      width={lg ? '968px' : '100%'}
      zIndex={zIndex}
    >
      <Container sx={{ position: 'relative', width: '100%', height: '100%' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: '12px', zIndex: 11 }}
          onClick={onDismiss}
        />
        <Suspense fallback={null}>
          <Flex
            flex={1}
            sx={{
              height: '100%',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            {!sm && <MobileGlobalStyle />}
            <Box width="100%">
              {/*<ProtocolBetaWarning protocol={protocol} />*/}
              <Flex
                sx={{
                  width: '100%',
                  // backgroundColor: 'neutral7',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Box px={3} py={2}>
                  <Flex sx={{ gap: 2, alignItems: 'center' }}>
                    <AddressAvatar address={address} size={40} />
                    <Box>
                      <Flex mb={1} alignItems="center" flexWrap="wrap" sx={{ gap: ['6px', 2] }}>
                        <Type.LargeBold color="neutral1" lineHeight="20px" textAlign="left" fontSize={['16px', '18px']}>
                          {addressShorten(address, 3, 5)}
                        </Type.LargeBold>
                        <FavoriteButton address={address} protocol={protocol} size={16} sx={{ mb: 0 }} />
                      </Flex>
                      <Flex sx={{ alignItems: 'center', gap: 2 }}>
                        <CopyButton
                          type="button"
                          variant="ghost"
                          value={address}
                          size="sm"
                          iconSize={16}
                          sx={{ p: 0 }}
                        />
                        <ExplorerLogo protocol={protocol} explorerUrl={`${explorerUrl}/address/${address}`} size={16} />
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Box>
            <Flex flexDirection="column" flex={1} sx={{ overflow: 'auto' }}>
              <Flex
                height={250}
                alignItems="center"
                sx={{
                  m: [0, 2],
                  gap: 2,
                  backgroundColor: 'neutral5',
                  borderRadius: '1px',
                  border: 'small',
                  borderColor: 'neutral4',
                }}
              >
                <Box flex={1}>
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ borderBottom: 'small', borderBottomColor: 'neutral4', px: 3 }}
                  >
                    <Flex
                      sx={{
                        flexShrink: 0,
                        alignItems: 'center',
                        height: [60, 60, 60, 40],
                      }}
                    >
                      <TimeDropdown
                        timeOption={timeOption}
                        onChangeTime={setTimeOption}
                        menuSx={{ transform: 'translateX(12px)' }}
                      />
                    </Flex>
                    <Box textAlign="center" color="neutral3" flex={['1', 'none']}>
                      <LabelWithTooltip
                        id="tt_balance"
                        sx={{
                          display: ['block', 'inline-block'],
                          mr: [0, 2],
                        }}
                        tooltip="Total value of collateral"
                      >
                        Balance:
                      </LabelWithTooltip>
                      <Type.Caption color="neutral1">
                        <BalanceText protocol={protocol} account={address} />
                      </Type.Caption>
                    </Box>
                  </Flex>
                  <Box height={190}>
                    <ChartTrader
                      protocol={protocol}
                      account={address}
                      timeOption={timeOption}
                      // onChangeTime={setTimeOption}
                    />
                  </Box>
                </Box>
              </Flex>

              <Flex flex={1} flexDirection="column" sx={{ position: 'relative' }}>
                {lg ? (
                  <Flex flex={1} flexDirection="column">
                    <HLTraderOpeningPositionsTableView
                      address={address}
                      protocol={protocol}
                      isShowIcon={false}
                      isDrawer={false}
                      isExpanded
                    />
                  </Flex>
                ) : (
                  <Flex sx={{ flex: 1 }}>
                    <PositionMobileView
                      openingPositions={
                        <HLTraderOpeningPositionsListView address={address} protocol={protocol} isDrawer />
                      }
                      historyPositions={<></>}
                      protocol={protocol}
                      address={address}
                      isLite
                    />
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Suspense>
      </Container>
    </RcDrawer>
  )
}
