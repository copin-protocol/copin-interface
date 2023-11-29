import { Trans } from '@lingui/macro'
import { CrownSimple } from '@phosphor-icons/react'

import { Flex, IconBox } from 'theme/base'
import { TimeFilterByEnum } from 'utils/config/enums'

import { TimeFilterProps, TimeWithRangeFilterProps } from './type'

export const TIME_FILTER_OPTIONS: TimeFilterProps[] = [
  {
    id: TimeFilterByEnum.S7_DAY,
    text: <Trans>7 days</Trans>,
    sort_by: TimeFilterByEnum.S7_DAY,
    value: 7,
  },
  {
    id: TimeFilterByEnum.S14_DAY,
    text: <Trans>14 days</Trans>,
    sort_by: TimeFilterByEnum.S14_DAY,
    value: 14,
  },
  {
    id: TimeFilterByEnum.S30_DAY,
    text: <Trans>30 days</Trans>,
    sort_by: TimeFilterByEnum.S30_DAY,
    value: 30,
  },
  {
    id: TimeFilterByEnum.S60_DAY,
    text: <Trans>60 days</Trans>,
    sort_by: TimeFilterByEnum.S60_DAY,
    value: 60,
  },
  {
    id: TimeFilterByEnum.ALL_TIME,
    text: (
      <Flex alignItems="center" sx={{ gap: 1 }}>
        <Trans>All</Trans>
        <IconBox icon={<CrownSimple size={16} weight="fill" />} color="orange1" />
      </Flex>
    ),
    sort_by: TimeFilterByEnum.ALL_TIME,
    value: 365,
  },
]

export const TIME_WITH_RANGE_FILTER_OPTIONS: TimeWithRangeFilterProps[] = [
  {
    id: TimeFilterByEnum.S7_DAY,
    text: <Trans>7 days</Trans>,
    sort_by: TimeFilterByEnum.S7_DAY,
  },
  {
    id: TimeFilterByEnum.S14_DAY,
    text: <Trans>14 days</Trans>,
    sort_by: TimeFilterByEnum.S14_DAY,
  },
  {
    id: TimeFilterByEnum.S30_DAY,
    text: <Trans>30 days</Trans>,
    sort_by: TimeFilterByEnum.S30_DAY,
  },
  {
    id: TimeFilterByEnum.S60_DAY,
    text: <Trans>60 days</Trans>,
    sort_by: TimeFilterByEnum.S60_DAY,
  },
  {
    id: 'custom',
    text: <Trans>Custom</Trans>,
    sort_by: undefined,
  },
]
