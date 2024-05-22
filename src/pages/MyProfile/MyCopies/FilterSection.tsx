import { Trans } from '@lingui/macro'
import { Funnel, XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useCallback, useMemo, useState } from 'react'

import Divider from 'components/@ui/Divider'
import ProtocolGroup from 'components/@ui/ProtocolGroup'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import { ALLOWED_PROTOCOLS } from 'pages/Home/configs'
import Checkbox from 'theme/Checkbox'
import Dropdown from 'theme/Dropdown'
import Drawer from 'theme/Modal/Drawer'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { CopyTradeStatusEnum } from 'utils/config/enums'
import { COPY_TRADE_STATUS_TRANS } from 'utils/config/translations'
import { formatNumber } from 'utils/helpers/format'

import { MyCopiesProps } from '.'
import SelectedTraders from './SelectedTraders'

export default function FilterSection({
  selectedTraders,
  traders,
  allCopyTrades,
  handleToggleTrader,
  handleSelectAllTraders,
  copyWallet,
  checkIsProtocolChecked,
  checkIsStatusChecked,
  handleToggleProtocol,
  handleToggleStatus,
  copyStatus,
  selectedProtocol,
  toggleAllProtocol,
  isToggleAllProtocol,
}: MyCopiesProps) {
  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  const filterByStatus = useMemo(() => {
    return (
      <Flex sx={{ gap: 3, flexDirection: ['column', 'row'], alignItems: ['start', 'center'] }}>
        <Type.Caption
          sx={{ flexShrink: 0, color: [`${themeColors.neutral1} !important`, `${themeColors.neutral3} !important`] }}
        >
          <Trans>Status</Trans>
        </Type.Caption>
        {statusFilters.map((status) => {
          return (
            <Checkbox key={status} checked={checkIsStatusChecked(status)} onChange={() => handleToggleStatus(status)}>
              <Type.Caption lineHeight="16px">{COPY_TRADE_STATUS_TRANS[status]}</Type.Caption>
            </Checkbox>
          )
        })}
      </Flex>
    )
  }, [checkIsStatusChecked, handleToggleStatus])
  const filterBySource = useMemo(() => {
    return (
      <Flex alignItems="start" sx={{ gap: 3, flexDirection: ['column', 'row'] }}>
        <Flex width="100%" sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
          <Type.Caption
            sx={{ flexShrink: 0, color: [`${themeColors.neutral1} !important`, `${themeColors.neutral3} !important`] }}
          >
            <Trans>Source:</Trans>
          </Type.Caption>
          <Flex sx={{ gap: 1, alignItems: 'center' }}>
            <SwitchInput
              checked={isToggleAllProtocol}
              onChange={(event) => {
                const isSelectedAll = event.target.checked
                toggleAllProtocol(isSelectedAll)
              }}
            />
            <Type.Caption color="neutral3">
              <Trans>Select all</Trans>
            </Type.Caption>
          </Flex>
        </Flex>
        <Grid sx={{ pt: 1, gridTemplateColumns: '1fr', gap: 3, flexDirection: 'column' }}>
          {protocolFilters.map((protocol) => {
            return (
              <Checkbox
                wrapperSx={{ height: 'auto' }}
                key={protocol}
                checked={checkIsProtocolChecked(protocol)}
                onChange={() => handleToggleProtocol(protocol)}
              >
                <Flex sx={{ alignItems: 'center', gap: 2 }}>
                  <ProtocolLogo protocol={protocol} hasText={false} size={21} />
                  <Type.Caption lineHeight="16px">{protocolOptionsMapping[protocol]?.text}</Type.Caption>
                </Flex>
              </Checkbox>
            )
          })}
        </Grid>
      </Flex>
    )
  }, [checkIsProtocolChecked, handleToggleProtocol, isToggleAllProtocol, protocolOptionsMapping, toggleAllProtocol])

  const filterBySourceDropdown = useMemo(() => {
    return (
      <Flex alignItems="start" sx={{ gap: 1 }}>
        <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
          <Trans>Source:</Trans>
        </Type.Caption>
        <Dropdown
          buttonSx={{ p: 0, border: 'none', '.icon_dropdown': { ml: 2 } }}
          dismissible={false}
          menuDismissible
          menuSx={{ width: 'max-content', maxHeight: 390 }}
          placement="bottomRight"
          menu={
            <Box px={3} py={3}>
              <Flex sx={{ gap: 1, alignItems: 'center' }}>
                <SwitchInput
                  checked={isToggleAllProtocol}
                  onChange={(event) => {
                    const isSelectedAll = event.target.checked
                    toggleAllProtocol(isSelectedAll)
                  }}
                />
                <Type.Caption color="neutral3">
                  <Trans>Select all</Trans>
                </Type.Caption>
              </Flex>
              <Divider my={2} />
              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                {protocolFilters.map((protocol) => {
                  return (
                    <Checkbox
                      key={protocol}
                      checked={checkIsProtocolChecked(protocol)}
                      onChange={() => handleToggleProtocol(protocol)}
                      wrapperSx={{ height: 'auto' }}
                    >
                      <ProtocolLogo protocol={protocol} size={21} />
                    </Checkbox>
                  )
                })}
              </Flex>
            </Box>
          }
        >
          {selectedProtocol?.length ? (
            <ProtocolGroup protocols={selectedProtocol} size={21} sx={{ gap: 1 }} />
          ) : (
            'Not selected'
          )}
        </Dropdown>
      </Flex>
    )
  }, [checkIsProtocolChecked, handleToggleProtocol, isToggleAllProtocol, selectedProtocol, toggleAllProtocol])

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
          height={48}
          sx={{
            alignItems: 'center',
            '@media all and (max-width: 1400px)': {
              borderBottom: 'small',
              borderColor: 'neutral4',
              width: '100%',
            },
          }}
        >
          <SelectedTraders
            selectedTraders={selectedTraders}
            allTraders={traders}
            allCopyTrades={allCopyTrades}
            handleToggleTrader={handleToggleTrader}
            handleSelectAllTraders={handleSelectAllTraders}
          />
          <AvailableMargin value={copyWallet?.availableBalance} />
        </Flex>
        <Flex
          height={48}
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
          {filterBySourceDropdown}
          <Box sx={{ width: '1px', height: '100%', bg: 'neutral4' }} display={{ _: 'none', sm: 'block' }} />
          {filterByStatus}
        </Flex>
      </Flex>
    </Box>
  ) : (
    <>
      <Flex sx={{ alignItems: 'center', borderBottom: 'small', borderColor: 'neutral5', py: 1 }}>
        <SelectedTraders
          selectedTraders={selectedTraders}
          allTraders={traders}
          allCopyTrades={allCopyTrades}
          handleToggleTrader={handleToggleTrader}
          handleSelectAllTraders={handleSelectAllTraders}
          buttonSx={{ py: 0, '& > *:first-child': { display: 'flex', flexDirection: 'column' } }}
        />
        <Box sx={{ width: '1px', height: '100%', bg: 'neutral4' }} />

        <AvailableMargin
          value={copyWallet?.availableBalance}
          sx={{ flexDirection: 'column', px: 2, gap: 0, flex: 1 }}
        />

        <Box sx={{ width: '1px', height: '100%', bg: 'neutral4' }} />
        {/* <Dropdown
          hasArrow={false}
          dismissible={false}
          menuDismissible
          menu={
            <Box sx={{ p: 3 }}>
              {filterByStatus}
              <Box mb={3} />
              {filterBySource}
            </Box>
          }
          buttonSx={{ border: 'none', px: 10, py: 0 }}
        > */}
        <Flex sx={{ px: 10, alignItems: 'center', gap: 1 }} role="button" onClick={() => setOpenModal(true)}>
          <IconBox icon={<Funnel size={16} />} color="neutral3" />
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
            {copyStatus.length + selectedProtocol.length}
          </Box>
        </Flex>
        <Drawer
          background="neutral7"
          isOpen={openMobileFilterModal}
          mode="right"
          onDismiss={() => setOpenModal(false)}
          contentWidth="300px"
          contentHeight="100%"
          overlayBG="rgba(19, 19, 19, 0.83)"
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
            {filterByStatus}
            <Divider my={3} />
            {filterBySource}
          </Box>
        </Drawer>
        {/* </Dropdown> */}
      </Flex>
    </>
  )
}
function AvailableMargin({ value, sx }: { value: number | undefined; sx?: any }) {
  return (
    <Flex sx={{ gap: 2, ...(sx || {}) }}>
      <Type.Caption color="neutral3">
        <Trans>Available Margin</Trans>:
      </Type.Caption>
      <Type.CaptionBold color="neutral1">${formatNumber(value)}</Type.CaptionBold>
    </Flex>
  )
}

// TODO: Check when add new protocol
const protocolFilters = ALLOWED_PROTOCOLS

const statusFilters = [CopyTradeStatusEnum.RUNNING, CopyTradeStatusEnum.STOPPED]
