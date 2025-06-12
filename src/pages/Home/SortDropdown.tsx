import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import { PnlTitle } from 'components/@widgets/SwitchPnlButton'
import { TraderData } from 'entities/trader'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'

import { getDropdownProps } from './configs'

export default function SortDropdown({
  sortBy,
  onChangeSort,
}: {
  sortBy: keyof TraderData
  onChangeSort: (option: keyof TraderData) => void
}) {
  const sortOption = SORT_OPTIONS.find((option) => option.id === sortBy) ?? SORT_OPTIONS[0]
  return (
    <Dropdown
      buttonVariant="ghostPrimary"
      inline
      {...getDropdownProps({})}
      menu={
        <>
          {SORT_OPTIONS.map((option) => (
            <CheckableDropdownItem
              key={option.id}
              selected={option.id === sortOption.id}
              text={option.text}
              onClick={() => onChangeSort(option.id)}
            />
          ))}
        </>
      }
    >
      {sortOption.text}
    </Dropdown>
  )
}

export type SortOption = { text: ReactNode; id: keyof TraderData }

const SORT_OPTIONS: SortOption[] = [
  {
    id: 'pnl',
    text: <PnlTitle />,
  },
  {
    id: 'avgRoi',
    text: <Trans>Avg ROI</Trans>,
  },
  {
    id: 'winRate',
    text: <Trans>Win Rate</Trans>,
  },
]
