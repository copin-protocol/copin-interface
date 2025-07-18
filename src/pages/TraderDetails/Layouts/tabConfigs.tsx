import { Trans } from '@lingui/macro'
import { BookOpenText, ChartLine, Notebook } from '@phosphor-icons/react'

export enum TabEnum {
  STATS = 'stats',
  CHARTS = 'charts',
  POSITIONS = 'positions',
}

export const tabConfigs = [
  {
    key: TabEnum.STATS,
    name: <Trans>Stats</Trans>,
    icon: <BookOpenText size={20} />,
    activeIcon: <BookOpenText size={20} weight="fill" />,
  },
  {
    key: TabEnum.CHARTS,
    name: <Trans>Charts</Trans>,
    icon: <ChartLine size={20} />,
    activeIcon: <ChartLine size={20} weight="fill" />,
  },
  {
    key: TabEnum.POSITIONS,
    name: <Trans>Positions</Trans>,
    icon: <Notebook size={20} />,
    activeIcon: <Notebook size={20} weight="fill" />,
  },
]

export const noChartsTabConfigs = tabConfigs.filter((v) => v.key !== TabEnum.CHARTS)
export const noPositionsTabConfigs = tabConfigs.filter((v) => v.key !== TabEnum.POSITIONS)
