import { Trans } from '@lingui/macro'
import React from 'react'
import { useQuery } from 'react-query'

import { getTraderStatisticApi } from 'apis/traderApis'
import Text from 'components/@trader/TraderExplorerTableView/Text'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import TimeFilter, { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
import useVaultDetailsContext from 'hooks/features/useVaultDetailsProvider'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

import RowItem from './RowItem'

export default function VaultPerformance() {
  const { vaultCopyWallet } = useVaultDetailsContext()

  const { checkIsPremium } = useIsPremiumAndAction()
  const timeFilterOptions = TIME_FILTER_OPTIONS.filter((e) => e.id !== TimeFilterByEnum.ALL_TIME)
  const { currentOption: timeOption, changeCurrentOption } = useOptionChange({
    optionName: URL_PARAM_KEYS.EXPLORER_TIME_FILTER,
    options: timeFilterOptions,
    defaultOption: timeFilterOptions[1].id as unknown as string,
  })

  const setTimeOption = (option: TimeFilterProps) => {
    if (option.id === TimeFilterByEnum.ALL_TIME && !checkIsPremium()) return
    changeCurrentOption(option)
  }

  const { data } = useQuery(
    [QUERY_KEYS.GET_TRADER_DETAIL, vaultCopyWallet, timeOption.id],
    () => getTraderStatisticApi({ protocol: ProtocolEnum.GNS, account: vaultCopyWallet }),
    {
      enabled: !!vaultCopyWallet,
      retry: 0,
      select: (data) =>
        timeFilterOptions
          .map((option) => {
            return data[option.id]
          })
          .reverse(),
    }
  )

  const currentStatistic = data?.find((item) => (item?.type as string) === (timeOption.id as unknown as string))

  return (
    <Box>
      <TimeFilter currentFilter={timeOption} handleFilterChange={setTimeOption} />
      <Flex flexDirection="column" mt={12} sx={{ maxWidth: 400, gap: 12 }}>
        <Type.CaptionBold>
          <Trans>Performance</Trans>
        </Type.CaptionBold>
        <RowItem
          label={'PNL'}
          content={<SignedText value={currentStatistic?.pnl} maxDigit={2} minDigit={2} prefix="$" />}
        />
        <RowItem
          label={'Max Drawdown'}
          content={
            <Text
              text={currentStatistic?.maxDrawdown ? `${formatNumber(currentStatistic.maxDrawdown, 2, 2)}%` : undefined}
            />
          }
        />
        <RowItem
          label={'Volume'}
          content={
            <Text
              text={currentStatistic?.totalVolume ? `$${formatNumber(currentStatistic.totalVolume, 0, 0)}` : undefined}
            />
          }
        />
      </Flex>
    </Box>
  )
}
