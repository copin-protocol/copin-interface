import { Trans } from '@lingui/macro'
import { Funnel } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useCallback } from 'react'

import Checkbox from 'theme/Checkbox'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { COPY_TRADE_STATUS_TRANS } from 'utils/config/translations'
import { formatNumber } from 'utils/helpers/format'
import { parseProtocolImage } from 'utils/helpers/transform'

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
}: MyCopiesProps) {
  const FilterByStatus = useCallback(() => {
    return (
      <Flex alignItems="center" sx={{ gap: 3 }}>
        <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
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
  const FilterBySource = useCallback(() => {
    return (
      <Flex alignItems="start" sx={{ gap: 3 }}>
        <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
          <Trans>Source</Trans>
        </Type.Caption>
        <Flex sx={{ pt: 1, alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          {protocolFilters.map((protocol) => {
            return (
              <Checkbox
                key={protocol}
                checked={checkIsProtocolChecked(protocol)}
                onChange={() => handleToggleProtocol(protocol)}
              >
                <Flex sx={{ alignItems: 'center', gap: 2 }}>
                  <Image src={parseProtocolImage(protocol)} width={20} height={20} />
                  <Type.Caption lineHeight="16px">{PROTOCOL_OPTIONS_MAPPING[protocol]?.text}</Type.Caption>
                </Flex>
              </Checkbox>
            )
          })}
        </Flex>
      </Flex>
    )
  }, [checkIsProtocolChecked, handleToggleProtocol])
  const { sm } = useResponsive()
  return sm ? (
    <Flex p={2} pr={3} sx={{ gap: 3, borderBottom: 'small', borderColor: 'neutral5' }}>
      <Flex flex={1} sx={{ gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <SelectedTraders
            selectedTraders={selectedTraders}
            allTraders={traders}
            allCopyTrades={allCopyTrades}
            handleToggleTrader={handleToggleTrader}
            handleSelectAllTraders={handleSelectAllTraders}
          />
          <AvailableMargin value={copyWallet?.availableBalance} />
        </Flex>
        <Flex alignItems="center" sx={{ gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ width: '1px', height: '20px', bg: 'neutral4' }} display={{ _: 'none', sm: 'block' }} />
          <FilterBySource />
          <Box sx={{ width: '1px', height: '20px', bg: 'neutral4' }} display={{ _: 'none', sm: 'block' }} />
          <FilterByStatus />
        </Flex>
      </Flex>
    </Flex>
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
        <Dropdown
          hasArrow={false}
          dismissible={false}
          menuDismissible
          menu={
            <Box sx={{ p: 3 }}>
              <FilterByStatus />
              <Box mb={3} />
              <FilterBySource />
            </Box>
          }
          buttonSx={{ border: 'none', px: 10, py: 0 }}
        >
          <Flex sx={{ alignItems: 'center', gap: 1 }}>
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
        </Dropdown>
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
const protocolFilters = Object.values(ProtocolEnum)

const statusFilters = [CopyTradeStatusEnum.RUNNING, CopyTradeStatusEnum.STOPPED]
