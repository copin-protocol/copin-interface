import { Trans } from '@lingui/macro'
import { Funnel, XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useState } from 'react'

import SelectedCopyTradeActions from 'components/@copyTrade/ListCopyTrade/SelectedCopyTradeActions'
import Divider from 'components/@ui/Divider'
import RcDrawer from 'theme/RcDrawer'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { TAB_HEIGHT } from 'utils/config/constants'
import { formatNumber } from 'utils/helpers/format'

import FilterBySource, { FilterBySourceDropdown } from '../FilterBySource'
import FilterByStatus from '../FilterByStatus'
import SelectTradersCopied from '../SelectTradersCopied'
import useCEXManagementContext from './useCEXManagementContext'

export default function FilterSection() {
  const {
    isToggleAllProtocol,
    toggleAllProtocol,
    checkIsProtocolChecked,
    handleToggleProtocol,
    selectedProtocol,
    selectedTraders,
    checkIsStatusChecked,
    handleToggleStatus,
    listTraderAddresses,
    allCopyTrades,
    copyTrades,
    handleToggleTrader,
    handleSelectAllTraders,
    selectedStatus,
    activeWallet,
  } = useCEXManagementContext()
  const [openMobileFilterModal, setOpenModal] = useState(false)

  const { sm } = useResponsive()
  return sm ? (
    <Box sx={{ flexShrink: 0 }}>
      <Flex
        flex={1}
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          '@media all and (max-width: 1400px)': {
            flexDirection: 'column',
            alignItems: 'start',
          },
        }}
      >
        <Flex
          height={TAB_HEIGHT}
          px={2}
          sx={{
            alignItems: 'center',
            '@media all and (max-width: 1400px)': {
              borderBottom: 'small',
              borderColor: 'neutral4',
              width: '100%',
            },
            gap: 3,
          }}
        >
          <SelectTradersCopied
            selectedTraders={selectedTraders}
            allTraders={listTraderAddresses}
            allCopyTrades={allCopyTrades}
            handleToggleTrader={handleToggleTrader}
            handleSelectAllTraders={handleSelectAllTraders}
            buttonSx={{ p: 2, py: 0 }}
          />
          <SelectedCopyTradeActions />
        </Flex>
        <Flex
          height={TAB_HEIGHT}
          alignItems="center"
          sx={{
            gap: [2, 2, 2, 2, 3],
            flexWrap: 'wrap',
            px: [2, 2, 2, 2, 3],
          }}
        >
          <Box
            sx={{
              width: '1px',
              height: '100%',
              bg: 'neutral4',
              '@media all and (max-width: 1400px)': {
                display: 'none',
              },
            }}
          />
          <FilterBySourceDropdown
            selectedProtocols={selectedProtocol}
            isToggleAllProtocol={isToggleAllProtocol}
            toggleAllProtocol={toggleAllProtocol}
            checkIsProtocolChecked={checkIsProtocolChecked}
            handleToggleProtocol={handleToggleProtocol}
          />
          <Box sx={{ width: '1px', height: '100%', bg: 'neutral4' }} display={{ _: 'none', sm: 'block' }} />
          <FilterByStatus checkIsStatusChecked={checkIsStatusChecked} handleToggleStatus={handleToggleStatus} />
        </Flex>
      </Flex>
    </Box>
  ) : (
    <>
      <Flex sx={{ alignItems: 'center', width: '100%', borderBottom: 'small', borderColor: 'neutral5', py: 1 }}>
        <Flex sx={{ flex: '1', alignItems: 'center', height: '100%', position: 'relative' }}>
          <Box sx={{ px: 2 }}>
            <SelectTradersCopied
              selectedTraders={selectedTraders}
              allTraders={listTraderAddresses}
              allCopyTrades={allCopyTrades}
              handleToggleTrader={handleToggleTrader}
              handleSelectAllTraders={handleSelectAllTraders}
              buttonSx={{ '& > *:first-child': { display: 'flex', flexDirection: 'column' } }}
            />
          </Box>
          <Box sx={{ width: '1px', height: '100%', bg: 'neutral4' }} />
          <Flex sx={{ flexDirection: 'column', px: 2, gap: 0, flex: 1 }}>
            <AvailableMargin value={activeWallet?.availableBalance} />
          </Flex>
          <SelectedCopyTradeActions isAbsolutePosition hiddenSelectedText />
        </Flex>
        <Box sx={{ width: '1px', height: '100%', bg: 'neutral4' }} />
        <Flex sx={{ px: 10, alignItems: 'center', gap: 1 }} role="button" onClick={() => setOpenModal(true)}>
          <IconBox icon={<Funnel size={20} />} color="neutral3" />
          <Box
            sx={{
              fontSize: '11px',
              fontWeight: 'normal',
              lineHeight: '14px',
              width: 14,
              height: 14,
              borderRadius: '50%',
              bg: 'primary1',
              color: 'neutral8',
              textAlign: 'center',
            }}
          >
            {selectedStatus.length + selectedProtocol.length}
          </Box>
        </Flex>
        <RcDrawer
          open={openMobileFilterModal}
          onClose={() => setOpenModal(false)}
          width="300px"
          maskColor="rgba(19, 19, 19, 0.83)"
        >
          <Box p={3} sx={{ position: 'relative' }}>
            <Box sx={{ position: 'fixed', p: 2, top: 0, right: 0, bg: 'neutral7' }}>
              <IconBox
                icon={<XCircle size={20} />}
                color="neutral3"
                role="button"
                onClick={() => setOpenModal(false)}
              />
            </Box>
            <FilterByStatus checkIsStatusChecked={checkIsStatusChecked} handleToggleStatus={handleToggleStatus} />
            <Divider my={3} />
            <FilterBySource
              selectedProtocols={selectedProtocol}
              isToggleAllProtocol={isToggleAllProtocol}
              toggleAllProtocol={toggleAllProtocol}
              checkIsProtocolChecked={checkIsProtocolChecked}
              handleToggleProtocol={handleToggleProtocol}
            />
          </Box>
        </RcDrawer>
        {/* </Dropdown> */}
      </Flex>
    </>
  )
}
function AvailableMargin({ value, sx }: { value: number | undefined; sx?: any }) {
  return (
    <Flex sx={{ gap: 2, ...(sx || {}) }}>
      <Type.Caption color="neutral3">
        <Trans>Available Fund</Trans>:
      </Type.Caption>
      <Type.CaptionBold color="neutral1">${formatNumber(value)}</Type.CaptionBold>
    </Flex>
  )
}
